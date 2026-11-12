import { HttpErrorResponse } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FieldErrors } from '../controls/field-errors/field-errors';
import { TagInput } from '../controls/tag-input/tag-input';
import { emptySpeaker, emptySubmission, TalkSubmission } from '../models/talk';
import { TalksStore } from '../stores/talks-store';
import { talkSchema } from './talk-schema';

interface ServerError {
  field: keyof TalkSubmission;
  message: string;
}

@Component({
  selector: 'app-submit-talk',
  imports: [
    FormField,
    FormRoot,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FieldErrors,
    TagInput,
    JsonPipe,
  ],
  templateUrl: './submit-talk.html',
  styleUrl: './submit-talk.scss',
})
export class SubmitTalk {
  private readonly store = inject(TalksStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected readonly talk = signal<TalkSubmission>(emptySubmission());

  protected readonly talkForm = form(this.talk, talkSchema, {
    submission: {
      action: async (talkForm) => {
        try {
          const talk = await this.store.submit(talkForm().value());
          this.snackBar.open(`"${talk.title}" is submitted.`, 'OK', { duration: 3000 });
          await this.router.navigate(['/talks']);
          return null;
        } catch (error) {
          if (!(error instanceof HttpErrorResponse) || error.status !== 422) {
            throw error;
          }
          const errors: ServerError[] = error.error.errors;
          return errors.map(({ field, message }) => ({
            kind: 'server',
            message,
            fieldTree: talkForm[field],
          }));
        }
      },
    },
  });

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
