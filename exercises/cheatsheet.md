# Signal Forms Cheat Sheet

Angular 22, `@angular/forms/signals`. In the order of the slides.

## Model and form

```ts
readonly talk = signal<TalkSubmission>(emptySubmission());
readonly talkForm = form(this.talk, talkSchema, { submission: { action } });
```

- The model signal is the source of truth: the form reads and writes it, it keeps no copy
- `talkForm.title` is a field tree, `talkForm.title()` its state
- Initialize every field: `''` instead of `undefined`, `[]` for lists
- A single value works too: `form(signal(''))` is one field, bound with `[formField]="queryForm"`

## Template

```html
<form [formRoot]="talkForm">
  <input [formField]="talkForm.title" />
  @for (speaker of talkForm.speakers; track speaker) {
  <input [formField]="speaker.email" />
  }
</form>
```

## Field state

| Signal                                        | Meaning                                             |
| --------------------------------------------- | --------------------------------------------------- |
| `value()`                                     | Current value, writable: `value.set(...)`           |
| `valid()`, `invalid()`, `pending()`           | Validation status; `valid()` is false while pending |
| `errors()`, `errorSummary()`                  | Own errors, own plus all descendants' errors        |
| `touched()`, `dirty()`                        | Left by the user, changed by the user               |
| `disabled()`, `hidden()`, `readonly()`        | Set by rules                                        |
| `required()`, `min()`, `max()`, `minLength()` | Metadata from the rules                             |
| `submitting()`                                | A submit action is running                          |

Methods: `reset(value?)`, `markAsTouched()`, `markAsDirty()`, `focusBoundControl()`.

## Rules

```ts
export const talkSchema = schema<TalkSubmission>((talk) => {
  required(talk.title, { message: 'Enter a title.' });
  maxLength(talk.title, 80);
  minLength(talk.abstract, 100);
  min(talk.duration, 5);
  max(talk.duration, 480);
  pattern(talk.title, /^[A-Z]/);
  applyEach(talk.speakers, (speaker) => {
    required(speaker.email);
    email(speaker.email);
  });

  hidden(talk.travel.from, { when: ({ valueOf }) => !valueOf(talk.travel.needed) });
  disabled(talk.level, { when: ({ valueOf }) => valueOf(talk.format) === 'lightning' });
  readonly(talk.codeOfConduct, { when: ({ value }) => value() });

  applyWhen(talk, ({ value }) => value().format === 'workshop', workshopSchema);
  apply(talk.travel, travelSchema);
});
```

## Custom, cross-field and async validation

```ts
validate(talk.duration, ({ value, valueOf }) =>
  value() > durationLimits[valueOf(talk.format)].max ? { kind: 'duration', message: '...' } : null,
);

validateTree(talk.speakers, ({ value, fieldTree }) => [
  { kind: 'duplicate', message: '...', fieldTree: fieldTree[1].email },
]);

debounce(talk.title, 400); // or 'blur'
validateHttp(talk.title, {
  request: ({ value }) => ({ url: '/api/talks/title-check', params: { title: value() } }),
  onSuccess: (result) => (result.available ? null : { kind: 'titleTaken', message: '...' }),
  onError: () => ({ kind: 'titleCheck', message: '...' }),
});
```

- Async rules run only when the sync rules pass; `pending()` is true meanwhile
- `validateAsync` takes any resource: `{ params, factory, onSuccess, onError }`

## Custom controls

```ts
export class TagInput implements FormValueControl<string[]> {
  readonly value = model<string[]>([]);
  readonly disabled = input(false);
  readonly touched = input(false);
  readonly errors = input<readonly ValidationError[]>([]);
  readonly touch = output<void>(); // emit on blur
}
```

- `FormCheckboxControl` uses `checked = model<boolean>()` instead of `value`
- `transformedValue(this.value, { parse, format })` for a raw UI value with parse errors

## Submit

```ts
form(this.talk, talkSchema, {
  submission: {
    action: async (talkForm) => {
      await this.store.submit(talkForm().value());
      return null; // or errors: { kind, message, fieldTree: talkForm.format }
    },
  },
});
```

- `[formRoot]` marks all fields as touched and runs the action only when the form is valid
- `submit(talkForm, action)` does the same from code and returns `Promise<boolean>`

## Dynamic forms

```ts
readonly answers = linkedSignal<SurveyAnswers>(() =>
  Object.fromEntries(this.questions.value().map((q) => [q.id, ''])),
);
readonly surveyForm = form(this.answers, (answers) => {
  applyEach(answers, (answer) => {
    required(answer, { when: ({ key }) => this.byId()[key()]?.required ?? false });
  });
});
```

- A record as model, one key per field definition; `applyEach` on the record gives each rule `key()`
- In the template: `[formField]="surveyForm[question.id]"`
- The compiler no longer knows the fields: use it where the data really is dynamic

## Migration from reactive and template-driven forms

| Reactive forms                      | Signal Forms                                   |
| ----------------------------------- | ---------------------------------------------- |
| `FormGroup`, `FormArray`            | A signal model, the form mirrors its shape     |
| `formControlName`, `[formControl]`  | `[formField]`                                  |
| `Validators.required`               | `required(path)` in a schema                   |
| `enable()`, `disable()`             | `disabled(path, { when })`                     |
| `valueChanges`                      | The model signal, `computed`                   |
| `ControlValueAccessor`              | `FormValueControl`, `FormCheckboxControl`      |
| A reactive control in a signal form | `compatForm` (`@angular/forms/signals/compat`) |
| A signal control in a `FormGroup`   | `SignalFormControl`                            |
| `[(ngModel)]` per property          | One signal model, `[formField]` per field      |
| `required`, `minlength` attributes  | `required`, `minLength` rules in the schema    |

## Forms and state

```ts
readonly draft = linkedSignal(() => this.store.profile());
readonly profileForm = form(this.draft, profileSchema, {
  submission: { action: async (f) => { await this.store.save(f().value()); return null; } },
});
```

The form edits a local draft; the store receives the submitted value.
