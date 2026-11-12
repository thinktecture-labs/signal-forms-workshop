import { Component, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

/** Edits a list of tags: Enter adds the typed tag, the chip's remove button deletes it. */
@Component({
  selector: 'app-tag-input',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './tag-input.html',
  styleUrl: './tag-input.scss',
})
export class TagInput implements FormValueControl<string[]> {
  readonly value = model<string[]>([]);
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly touched = input(false);
  readonly errors = input<readonly ValidationError[]>([]);
  readonly touch = output<void>();

  protected add(input: HTMLInputElement): void {
    const tag = input.value.trim().toLowerCase();
    input.value = '';
    if (!tag || this.value().includes(tag)) {
      return;
    }
    this.value.update((tags) => [...tags, tag]);
  }

  protected remove(tag: string): void {
    this.value.update((tags) => tags.filter((t) => t !== tag));
  }
}
