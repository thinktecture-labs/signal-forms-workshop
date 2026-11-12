# Lab 1: The Talk Form

Turn the talk submission page into a Signal Form: a model, a schema with the built-in rules, bound controls and error messages.

## Objective

Learn how to:

- Create a form with `form()` over a writable signal
- Bind native inputs, selects and Material checkboxes with `[formField]`
- Describe validation in a schema with `required`, `minLength`, `maxLength` and `email`
- Apply a schema to every item of an array with `applyEach`
- Hide a field with `hidden` and read field state such as `errors()`, `invalid()` and `errorSummary()`

## Instructions

1. **Explore** `src/app/submit-talk/`: `submit-talk.ts` keeps the talk in a `signal<TalkSubmission>`, `submit-talk.html` renders the controls without any binding, `talk-schema.ts` has one rule as an example. The model is in `src/app/models/talk.ts`.

2. **Create the form** in `submit-talk.ts`: `protected readonly talkForm = form(this.talk, talkSchema);`. Import `FormField` and `FormRoot` from `@angular/forms/signals` and `FieldErrors` from `../controls/field-errors/field-errors` into the component.

3. **Bind the template**:
   - `<form [formRoot]="talkForm">` on the form element
   - `[formField]="talkForm.title"` on every control: title, abstract, format, duration, level, `travel.needed`, `travel.from`, `codeOfConduct`
   - Iterate over the speakers field tree: `@for (speaker of talkForm.speakers; track speaker; let i = $index)` and bind `speaker.name`, `speaker.email`, `speaker.company`
   - `<mat-error><app-field-errors [errors]="talkForm.title().errors()" /></mat-error>` inside each `mat-form-field`; Material shows it once the field is touched and invalid
   - For the code of conduct checkbox, which has no `mat-form-field`, show the errors yourself when `touched()` and `invalid()`

4. **Complete the schema** in `talk-schema.ts`, following the TODOs:
   - Title at most 80 characters, abstract required with at least 100 characters
   - A `speakerSchema = schema<Speaker>(...)` with a required name and a required, valid email, applied with `applyEach(talk.speakers, speakerSchema)`
   - `hidden(talk.travel.from, { when: ... })` unless `travel.needed` is set, plus `required(talk.travel.from)`: hidden fields are not validated
   - `required(talk.codeOfConduct)`: for a boolean, required means `true`
   - Pass a `message` to every rule; the template shows it

5. **Show the form state**: disable the submit button while `talkForm().invalid()`, and show `talkForm().errorSummary().length` problems next to it. Wrap the travel field in `@if (!talkForm.travel.from().hidden())`.

6. **Try it** on <http://localhost:4200/submit>: the required markers appear on the labels, errors appear after you leave a field, adding a speaker adds its rules, and the model below the form follows every keystroke.

7. **Compare with the solution** in `exercises/01-talk-form/solution/`.

<details>
<summary>Hint: a field with its errors</summary>

```html
<mat-form-field>
  <mat-label>Title</mat-label>
  <input matInput [formField]="talkForm.title" />
  <mat-error><app-field-errors [errors]="talkForm.title().errors()" /></mat-error>
</mat-form-field>
```

</details>

<details>
<summary>Hint: a rule that depends on another field</summary>

```ts
hidden(talk.travel.from, { when: ({ valueOf }) => !valueOf(talk.travel.needed) });
```

</details>

## Bonus

- Add a `pattern` rule for the company name, or a `maxLength` for the abstract
- Use `disabled(talk.level, { when: ... })` to fix the level to `beginner` for lightning talks
- Show the touched and dirty state of the title next to the field

## Resources

- [Signal Forms overview](https://angular.dev/guide/forms/signals/overview)
- [Form models](https://angular.dev/guide/forms/signals/models)
- [Validation](https://angular.dev/guide/forms/signals/validation)
- [Field state](https://angular.dev/guide/forms/signals/field-state-management)
