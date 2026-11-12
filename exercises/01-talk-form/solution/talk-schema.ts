import {
  applyEach,
  email,
  hidden,
  maxLength,
  minLength,
  required,
  schema,
} from '@angular/forms/signals';
import { Speaker, TalkSubmission } from '../models/talk';

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
});
