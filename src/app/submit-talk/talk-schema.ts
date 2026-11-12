import { required, schema } from '@angular/forms/signals';
import { TalkSubmission } from '../models/talk';

// TODO (lab 1): a speakerSchema for name and email, applied to every speaker with applyEach

export const talkSchema = schema<TalkSubmission>((talk) => {
  required(talk.title, { message: 'Enter a title.' });

  // TODO (lab 1): title at most 80 characters, abstract required with at least 100 characters
  // TODO (lab 1): hide travel.from unless travel.needed is set, and require it
  // TODO (lab 1): require the code of conduct
});
