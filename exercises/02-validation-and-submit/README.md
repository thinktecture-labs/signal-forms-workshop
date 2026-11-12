# Lab 2: Validation, a Custom Control and Submit

Add the rules that need more than one field or a server, turn the tag input into a form control and submit the talk.

## Objective

Learn how to:

- Write cross-field rules with `validate` and `valueOf`, and errors for other fields with `validateTree`
- Check a value on the server with `validateHttp`, and delay it with `debounce`
- Build a custom control with `FormValueControl`
- Submit with the `submission` option and `[formRoot]`, and map server errors to fields

## Start

Continue with your result from lab 1. If you did not finish it, copy `exercises/01-talk-form/solution/*` to `src/app/submit-talk/`.

## Instructions

1. **Duration by format** in `talk-schema.ts`: `validate(talk.duration, ({ value, valueOf }) => ...)` reads the format with `valueOf(talk.format)` and checks the duration against `durationLimits` from the model. Return `null` when it is valid, otherwise `{ kind: 'duration', message: ... }`.

2. **No speaker twice**: `validateTree(talk.speakers, ({ value, fieldTree }) => ...)` returns an error for every repeated email, targeted at that speaker's email field with `fieldTree: fieldTree[i].email`.

3. **Unique title**: the fake API answers `GET /api/talks/title-check?title=...` with `{ available: boolean }`.
   - `validateHttp<string, { available: boolean }>(talk.title, { request, onSuccess, onError })`; `request` returns `{ url: '/api/talks/title-check', params: { title: value() } }`
   - `debounce(talk.title, 400)` so that not every keystroke reaches the model and the server
   - In the template, show `<mat-spinner matSuffix diameter="20" />` while `talkForm.title().pending()`
   - Try a taken title, e.g. "Signals Under the Hood"

4. **Tag input** in `src/app/controls/tag-input/`: implement `FormValueControl<string[]>`.
   - Replace the `tags` signal with `readonly value = model<string[]>([])`
   - Add `disabled`, `invalid`, `touched` and `errors` as inputs and a `touch` output emitted on blur
   - Show the errors when touched and invalid
   - Use it in the talk form with `<app-tag-input [formField]="talkForm.tags" />`, and add `minLength(talk.tags, 1)` and `maxLength(talk.tags, 5)`

5. **Submit**: pass the third argument to `form()`:
   - `{ submission: { action: async (talkForm) => ... } }`, calling `TalksStore.submit(talkForm().value())`
   - On success, open a snackbar in the component and navigate to `/talks`; return `null`
   - When the store throws an `HttpErrorResponse` with status 422, map `error.error.errors` (`{ field, message }[]`) to `{ kind: 'server', message, fieldTree: talkForm[field] }`
   - Make the button `type="submit"`, disable it while `talkForm().submitting()`; `[formRoot]` calls the action on submit, marks all fields as touched and only runs the action when the form is valid
   - All workshop slots are taken: submit a workshop to see the server error on the format field

6. **Compare with the solution** in `exercises/02-validation-and-submit/solution/`: `talk-schema.ts`, `submit-talk.ts`, `submit-talk.html`, `tag-input.ts` and `tag-input.html`.

<details>
<summary>Hint: a custom control</summary>

```ts
export class TagInput implements FormValueControl<string[]> {
  readonly value = model<string[]>([]);
  readonly touched = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError[]>([]);
  readonly touch = output<void>();
}
```

</details>

<details>
<summary>Hint: server errors</summary>

```ts
return errors.map(({ field, message }) => ({
  kind: 'server',
  message,
  fieldTree: talkForm[field],
}));
```

</details>

## Bonus

- `debounce(talk.title, 'blur')` instead of a fixed delay: what changes for the async check?
- A `LevelPicker` control with three buttons instead of the select
- Move the duration rule into a reusable `schema<TalkSubmission>` and `apply` it

## Resources

- [Validation](https://angular.dev/guide/forms/signals/validation)
- [Async operations](https://angular.dev/guide/forms/signals/async-operations)
- [Custom controls](https://angular.dev/guide/forms/signals/custom-controls)
- [Form submission](https://angular.dev/guide/forms/signals/form-submission)
