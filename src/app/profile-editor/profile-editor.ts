import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { ProfileStore } from '../stores/profile-store';

@Component({
  selector: 'app-profile-editor',
  imports: [ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule],
  templateUrl: './profile-editor.html',
  styleUrl: './profile-editor.scss',
})
export class ProfileEditor {
  private readonly store = inject(ProfileStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    bio: ['', Validators.maxLength(280)],
    website: ['', Validators.pattern(/^https:\/\//)],
    links: this.fb.array<FormControl<string>>([]),
    newsletter: false,
  });

  protected readonly bioLength = toSignal(
    this.profileForm.controls.bio.valueChanges.pipe(map((bio) => bio.length)),
    { initialValue: 0 },
  );

  protected saving = false;

  constructor() {
    // Copy the stored profile into the form whenever the store changes
    effect(() => {
      const profile = this.store.profile();
      this.links.clear();
      for (const link of profile.links) {
        this.links.push(this.linkControl(link));
      }
      this.profileForm.reset(profile);
    });
  }

  protected get links(): FormArray<FormControl<string>> {
    return this.profileForm.controls.links;
  }

  protected addLink(): void {
    this.links.push(this.linkControl(''));
  }

  protected removeLink(index: number): void {
    this.links.removeAt(index);
  }

  protected async save(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    await this.store.save(this.profileForm.getRawValue());
    this.saving = false;
    this.snackBar.open('Profile saved.', 'OK', { duration: 3000 });
  }

  private linkControl(link: string): FormControl<string> {
    return this.fb.control(link, [Validators.required, Validators.pattern(/^https:\/\//)]);
  }
}
