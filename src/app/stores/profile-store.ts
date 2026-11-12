import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { TalkApi } from '../api/talk-api';
import { SpeakerProfile } from '../models/speaker-profile';

interface ProfileState {
  profile: SpeakerProfile;
  loaded: boolean;
}

const emptyProfile: SpeakerProfile = {
  name: '',
  email: '',
  bio: '',
  website: '',
  links: [],
  newsletter: false,
};

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState<ProfileState>({ profile: emptyProfile, loaded: false }),
  withMethods((store, api = inject(TalkApi)) => ({
    async load(): Promise<void> {
      const profile = await api.loadProfile();
      patchState(store, { profile, loaded: true });
    },
    async save(profile: SpeakerProfile): Promise<void> {
      const saved = await api.saveProfile(profile);
      patchState(store, { profile: saved });
    },
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
