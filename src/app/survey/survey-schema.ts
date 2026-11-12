import { Signal } from '@angular/core';
import { applyEach, hidden, maxLength, required, schema } from '@angular/forms/signals';
import { SurveyAnswers, SurveyQuestion } from '../models/survey';

/** Rules come from the question definitions: one rule set for every answer, looked up by key. */
export const surveySchema = (questions: Signal<Record<string, SurveyQuestion>>) =>
  schema<SurveyAnswers>((answers) => {
    applyEach(answers, (answer) => {
      required(answer, {
        message: 'Please answer this question.',
        when: ({ key }) => questions()[key()]?.required ?? false,
      });
      maxLength(answer, ({ key }) => questions()[key()]?.maxLength, {
        message: 'This answer is too long.',
      });
      hidden(answer, {
        when: ({ key, valueOf }) => {
          const showIf = questions()[key()]?.showIf;
          return !!showIf && valueOf(answers[showIf.id]) !== showIf.answer;
        },
      });
    });
  });
