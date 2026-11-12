import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { FieldErrors } from '../controls/field-errors/field-errors';
import { SurveyAnswers, SurveyQuestion } from '../models/survey';
import { surveySchema } from './survey-schema';

/** A form built from question definitions that the server sends. */
@Component({
  selector: 'app-speaker-survey',
  imports: [FormField, FormRoot, MatButtonModule, MatInputModule, FieldErrors],
  templateUrl: './speaker-survey.html',
  styleUrl: './speaker-survey.scss',
})
export class SpeakerSurvey {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly questions = httpResource<SurveyQuestion[]>(() => '/api/survey', {
    defaultValue: [],
  });
  private readonly byId = computed(() =>
    Object.fromEntries(this.questions.value().map((q) => [q.id, q])),
  );

  // One empty answer per question: the model gets its keys from the definitions
  protected readonly answers = linkedSignal<SurveyAnswers>(() =>
    Object.fromEntries(this.questions.value().map((q) => [q.id, ''])),
  );

  protected readonly surveyForm = form(this.answers, surveySchema(this.byId), {
    submission: {
      action: async (surveyForm) => {
        await firstValueFrom(this.http.put('/api/survey', surveyForm().value()));
        this.snackBar.open('Thanks for your answers.', 'OK', { duration: 3000 });
        return null;
      },
    },
  });
}
