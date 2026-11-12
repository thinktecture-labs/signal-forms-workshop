export interface SurveyQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  maxLength?: number;
  options?: string[];
  /** Shown only when the question with this id has the given answer. */
  showIf?: { id: string; answer: string };
}

export type SurveyAnswers = Record<string, string>;
