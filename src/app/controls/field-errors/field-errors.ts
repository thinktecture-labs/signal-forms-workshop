import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

/** Renders the messages of a field's errors as one line of text, e.g. inside mat-error. */
@Component({
  selector: 'app-field-errors',
  template: `
    @for (error of errors(); track $index) {
      <span>{{ error.message ?? error.kind }}</span>
    }
  `,
  styles: `
    :host {
      display: contents;
    }

    span + span::before {
      content: ' ';
    }
  `,
})
export class FieldErrors {
  readonly errors = input.required<readonly ValidationError[]>();
}
