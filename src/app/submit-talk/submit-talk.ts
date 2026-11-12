import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { emptySpeaker, emptySubmission, TalkSubmission } from '../models/talk';

@Component({
  selector: 'app-submit-talk',
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, JsonPipe],
  templateUrl: './submit-talk.html',
  styleUrl: './submit-talk.scss',
})
export class SubmitTalk {
  protected readonly talk = signal<TalkSubmission>(emptySubmission());

  // TODO (lab 1): create the form over the talk model with form() and the talkSchema

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
