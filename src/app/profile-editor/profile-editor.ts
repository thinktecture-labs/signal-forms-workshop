import { Component, inject, linkedSignal } from '@angular/core';
import {
  applyEach,
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  pattern,
  required,
  schema,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FieldErrors } from '../controls/field-errors/field-errors';
import { SpeakerProfile } from '../models/speaker-profile';
import { ProfileStore } from '../stores/profile-store';

const https = /^https:\/\//;

const profileSchema = schema<SpeakerProfile>((profile) => {
  required(profile.name, { message: 'Enter your name.' });
  required(profile.email, { message: 'Enter an email address.' });
  email(profile.email, { message: 'Enter a valid email address.' });
  maxLength(profile.bio, 280, { message: 'Keep the bio under 280 characters.' });
  pattern(profile.website, https, { message: 'Use an https:// address.' });
  applyEach(profile.links, (link) => {
    required(link, { message: 'Enter a link or remove it.' });
    pattern(link, https, { message: 'Use an https:// address.' });
  });
});

@Component({
  selector: 'app-profile-editor',
  imports: [
    FormField,
    FormRoot,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    FieldErrors,
  ],
  templateUrl: './profile-editor.html',
  styleUrl: './profile-editor.scss',
})
export class ProfileEditor {
  private readonly store = inject(ProfileStore);
  private readonly snackBar = inject(MatSnackBar);

  // A local draft: starts from the stored profile and follows it when the store changes
  protected readonly draft = linkedSignal(() => this.store.profile());

  protected readonly profileForm = form(this.draft, profileSchema, {
    submission: {
      action: async (profileForm) => {
        await this.store.save(profileForm().value());
        profileForm().reset();
        this.snackBar.open('Profile saved.', 'OK', { duration: 3000 });
        return null;
      },
    },
  });

  protected addLink(): void {
    this.draft.update((profile) => ({ ...profile, links: [...profile.links, ''] }));
  }

  protected removeLink(index: number): void {
    this.draft.update((profile) => ({
      ...profile,
      links: profile.links.filter((_, i) => i !== index),
    }));
  }
}
