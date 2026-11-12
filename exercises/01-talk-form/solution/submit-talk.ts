import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldErrors } from '../controls/field-errors/field-errors';
import { emptySpeaker, emptySubmission, TalkSubmission } from '../models/talk';
import { talkSchema } from './talk-schema';

@Component({
  selector: 'app-submit-talk',
  imports: [
    FormField,
    FormRoot,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    FieldErrors,
    JsonPipe,
  ],
  templateUrl: './submit-talk.html',
  styleUrl: './submit-talk.scss',
})
export class SubmitTalk {
  protected readonly talk = signal<TalkSubmission>(emptySubmission());

  protected readonly talkForm = form(this.talk, talkSchema);

  protected addSpeaker(): void {
    this.talk.update((talk) => ({ ...talk, speakers: [...talk.speakers, emptySpeaker()] }));
  }

  protected removeSpeaker(index: number): void {
    this.talk.update((talk) => ({
      ...talk,
      speakers: talk.speakers.filter((_, i) => i !== index),
    }));
  }
}
