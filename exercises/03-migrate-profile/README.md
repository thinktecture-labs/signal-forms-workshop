# Lab 3 (Take-home): Migrate the Speaker Profile

The speaker profile on `/profile` is a reactive form that copies the profile from a Signal Store into a `FormGroup` and back. Migrate it to Signal Forms, with a local draft for the form and the store as the place for the saved state.

## Objective

Learn how to:

- Replace `FormGroup`, `FormArray` and `Validators` with a signal model and a schema
- Edit a local draft created with `linkedSignal` from store state
- Save through the store in the submission action

## Instructions

1. **Explore** `src/app/profile-editor/`: the component builds a `FormGroup` with `NonNullableFormBuilder`, copies `ProfileStore.profile()` into it in an `effect`, rebuilds the `FormArray` of links, and derives the bio length with `toSignal(valueChanges)`.

2. **Create the draft**: `protected readonly draft = linkedSignal(() => this.store.profile());`. The form edits the draft; the store only changes when you save. When the store loads or saves a profile, the draft follows.

3. **Create the form**: `form(this.draft, profileSchema, { submission: { action } })`.
   - The schema replaces the validators: `required`, `email`, `maxLength(profile.bio, 280)`, `pattern(profile.website, /^https:\/\//)` and `applyEach(profile.links, ...)` for the links
   - The action calls `this.store.save(profileForm().value())`, then `profileForm().reset()` to clear the dirty state, then opens the snackbar

4. **Migrate the template**: `[formRoot]` instead of `[formGroup]` and `(ngSubmit)`, `[formField]` instead of `formControlName`, `@for (link of profileForm.links; ...)` instead of `formArrayName`, the messages from the schema with `<app-field-errors>`, and the bio length from `profileForm.bio().value().length`.

5. **Links**: `addLink()` and `removeLink()` update the draft signal instead of the `FormArray`.

6. **Clean up**: remove the `effect`, `toSignal`, the `FormArray` getter, `saving` and `ReactiveFormsModule`.

7. **Compare with the solution** in `exercises/03-migrate-profile/solution/`.

## Bonus

- Migrate step by step instead: keep the `FormGroup` and replace only the email control with a `SignalFormControl` from `@angular/forms/signals/compat`
- Show a "You have unsaved changes" hint while `profileForm().dirty()`

## Resources

- [Migrating from reactive forms](https://angular.dev/guide/forms/signals/migration)
- [linkedSignal](https://angular.dev/guide/signals/linked-signal)
