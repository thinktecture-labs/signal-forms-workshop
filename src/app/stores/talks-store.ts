import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { TalkApi } from '../api/talk-api';
import { Talk, TalkSubmission } from '../models/talk';

interface TalksState {
  talks: Talk[];
  loading: boolean;
}

export const TalksStore = signalStore(
  { providedIn: 'root' },
  withState<TalksState>({ talks: [], loading: false }),
  withMethods((store, api = inject(TalkApi)) => ({
    async load(): Promise<void> {
      patchState(store, { loading: true });
      const talks = await api.loadTalks();
      patchState(store, { talks, loading: false });
    },
    /** Throws the HttpErrorResponse when the server rejects the submission. */
    async submit(submission: TalkSubmission): Promise<Talk> {
      const talk = await api.submitTalk(submission);
      patchState(store, { talks: [...store.talks(), talk] });
      return talk;
    },
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
