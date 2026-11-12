import { Component, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

/** Edits a list of tags: Enter adds the typed tag, the chip's remove button deletes it. */
// TODO (lab 2): implement FormValueControl<string[]> so that [formField] can bind the control
//   - replace the tags signal with a value model
//   - emit touch on blur, and accept disabled, invalid, touched and errors as inputs
@Component({
  selector: 'app-tag-input',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './tag-input.html',
  styleUrl: './tag-input.scss',
})
export class TagInput {
  protected readonly tags = signal<string[]>([]);

  protected add(input: HTMLInputElement): void {
    const tag = input.value.trim().toLowerCase();
    input.value = '';
    if (!tag || this.tags().includes(tag)) {
      return;
    }
    this.tags.update((tags) => [...tags, tag]);
  }

  protected remove(tag: string): void {
    this.tags.update((tags) => tags.filter((t) => t !== tag));
  }
}
