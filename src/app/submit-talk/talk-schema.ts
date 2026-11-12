import {
  applyEach,
  debounce,
  email,
  hidden,
  maxLength,
  minLength,
  required,
  schema,
  validate,
  validateHttp,
  validateTree,
} from '@angular/forms/signals';
import { durationLimits, Speaker, TalkSubmission } from '../models/talk';

export const speakerSchema = schema<Speaker>((speaker) => {
  required(speaker.name, { message: 'Enter the speaker name.' });
  required(speaker.email, { message: 'Enter an email address.' });
  email(speaker.email, { message: 'Enter a valid email address.' });
});

export const talkSchema = schema<TalkSubmission>((talk) => {
  required(talk.title, { message: 'Enter a title.' });
  maxLength(talk.title, 80, { message: 'Keep the title under 80 characters.' });
  required(talk.abstract, { message: 'Enter an abstract.' });
  minLength(talk.abstract, 100, { message: 'Write at least 100 characters.' });

  applyEach(talk.speakers, speakerSchema);

  hidden(talk.travel.from, { when: ({ valueOf }) => !valueOf(talk.travel.needed) });
  required(talk.travel.from, { message: 'Where do you travel from?' });

  required(talk.codeOfConduct, { message: 'Please accept the code of conduct.' });

  // Lab 2: cross-field, async and custom control rules
  validate(talk.duration, ({ value, valueOf }) => {
    const format = valueOf(talk.format);
    const { min, max } = durationLimits[format];
    if (value() < min || value() > max) {
      return { kind: 'duration', message: `A ${format} takes ${min} to ${max} minutes.` };
    }
    return null;
  });

  validateTree(talk.speakers, ({ value, fieldTree }) => {
    const seen = new Set<string>();
    return value().flatMap((speaker, i) => {
      const address = speaker.email.trim().toLowerCase();
      if (!address) {
        return [];
      }
      if (seen.has(address)) {
        return [
          {
            kind: 'duplicate',
            message: 'This speaker is already listed.',
            fieldTree: fieldTree[i].email,
          },
        ];
      }
      seen.add(address);
      return [];
    });
  });

  debounce(talk.title, 400);
  validateHttp<string, { available: boolean }>(talk.title, {
    request: ({ value }) => ({ url: '/api/talks/title-check', params: { title: value() } }),
    onSuccess: (result) =>
      result.available ? null : { kind: 'titleTaken', message: 'A talk with this title exists.' },
    onError: () => ({ kind: 'titleCheck', message: 'Could not check the title.' }),
  });

  minLength(talk.tags, 1, { message: 'Add at least one tag.' });
  maxLength(talk.tags, 5, { message: 'Use at most five tags.' });
});
