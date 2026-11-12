import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { TalksStore } from '../stores/talks-store';

@Component({
  selector: 'app-talks',
  imports: [DatePipe, MatButtonModule, MatCardModule, MatChipsModule, RouterLink],
  templateUrl: './talks.html',
  styleUrl: './talks.scss',
})
export class Talks {
  protected readonly store = inject(TalksStore);
}
