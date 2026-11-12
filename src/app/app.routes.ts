import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'submit' },
  { path: 'talks', loadComponent: () => import('./talks/talks').then((m) => m.Talks) },
  {
    path: 'submit',
    loadComponent: () => import('./submit-talk/submit-talk').then((m) => m.SubmitTalk),
  },
  {
    path: 'survey',
    loadComponent: () => import('./survey/speaker-survey').then((m) => m.SpeakerSurvey),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile-editor/profile-editor').then((m) => m.ProfileEditor),
  },
];
