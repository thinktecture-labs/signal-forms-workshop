import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SpeakerProfile } from '../models/speaker-profile';
import { Talk, TalkSubmission } from '../models/talk';

@Injectable({ providedIn: 'root' })
export class TalkApi {
  private readonly http = inject(HttpClient);

  loadTalks(): Promise<Talk[]> {
    return firstValueFrom(this.http.get<Talk[]>('/api/talks'));
  }

  submitTalk(submission: TalkSubmission): Promise<Talk> {
    return firstValueFrom(this.http.post<Talk>('/api/talks', submission));
  }

  loadProfile(): Promise<SpeakerProfile> {
    return firstValueFrom(this.http.get<SpeakerProfile>('/api/profile'));
  }

  saveProfile(profile: SpeakerProfile): Promise<SpeakerProfile> {
    return firstValueFrom(this.http.put<SpeakerProfile>('/api/profile', profile));
  }
}
