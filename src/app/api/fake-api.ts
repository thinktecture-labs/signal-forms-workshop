import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { SpeakerProfile } from '../models/speaker-profile';
import { SurveyAnswers, SurveyQuestion } from '../models/survey';
import { Talk, TalkSubmission } from '../models/talk';

/** All workshop slots are taken: every new workshop submission fails on the server. */
const workshopSlots = 2;

const talks: Talk[] = [
  {
    id: 't1',
    submittedAt: '2027-01-12T09:00:00Z',
    title: 'Signals Under the Hood',
    abstract:
      'How the reactive graph behind signal, computed and effect works, and why it makes zoneless change detection possible.',
    format: 'talk',
    level: 'advanced',
    duration: 45,
    tags: ['signals', 'internals'],
    speakers: [{ name: 'Ada Lovelace', email: 'ada@example.org', company: 'Analytical Engines' }],
    travel: { needed: false, from: '' },
    codeOfConduct: true,
  },
  {
    id: 't2',
    submittedAt: '2027-01-15T14:30:00Z',
    title: 'Angular Testing Bootcamp',
    abstract:
      'A full day of unit, component and end-to-end tests with Vitest and Playwright, from the first spec to a stable pipeline.',
    format: 'workshop',
    level: 'beginner',
    duration: 240,
    tags: ['testing'],
    speakers: [{ name: 'Grace Hopper', email: 'grace@example.org', company: 'Compiler Co' }],
    travel: { needed: true, from: 'Arlington' },
    codeOfConduct: true,
  },
  {
    id: 't3',
    submittedAt: '2027-01-20T11:15:00Z',
    title: 'Accessible Forms Workshop',
    abstract:
      'Labels, error messages, focus management and screen reader tests: building forms that everyone can fill in.',
    format: 'workshop',
    level: 'intermediate',
    duration: 180,
    tags: ['a11y', 'forms'],
    speakers: [{ name: 'Alan Turing', email: 'alan@example.org', company: 'Bletchley Labs' }],
    travel: { needed: false, from: '' },
    codeOfConduct: true,
  },
];

let profile: SpeakerProfile = {
  name: 'Ada Lovelace',
  email: 'ada@example.org',
  bio: 'Writes programs for machines that do not exist yet.',
  website: 'https://example.org/ada',
  links: ['https://example.org/ada/talks'],
  newsletter: true,
};

const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'experience',
    label: 'How often have you spoken at conferences?',
    type: 'select',
    required: true,
    options: ['Never', '1 to 5 times', 'More than 5 times'],
  },
  {
    id: 'mentoring',
    label: 'Would you like a mentor for your first talk?',
    type: 'select',
    required: true,
    options: ['Yes', 'No'],
    showIf: { id: 'experience', answer: 'Never' },
  },
  {
    id: 'topics',
    label: 'Which topics could you talk about next?',
    type: 'textarea',
    required: false,
    maxLength: 200,
  },
  {
    id: 'accessibility',
    label: 'Do you need anything to present comfortably?',
    type: 'text',
    required: false,
    maxLength: 100,
  },
];

let surveyAnswers: SurveyAnswers = {};

function ok<T>(body: T, ms = 400): Observable<HttpResponse<T>> {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(ms));
}

function fail(status: number, error: unknown, ms = 400): Observable<never> {
  return throwError(() => new HttpErrorResponse({ status, error })).pipe(delay(ms));
}

function isTitleTaken(title: string): boolean {
  const normalized = title.trim().toLowerCase();
  return talks.some((talk) => talk.title.toLowerCase() === normalized);
}

/**
 * In-memory backend for the workshop: no server to start, and the latency is real enough to
 * show pending states.
 */
export const fakeApi: HttpInterceptorFn = (req, next) => {
  const url = new URL(req.urlWithParams, 'http://localhost');
  if (!url.pathname.startsWith('/api/')) {
    return next(req);
  }

  if (req.method === 'GET' && url.pathname === '/api/talks') {
    return ok(structuredClone(talks));
  }

  if (req.method === 'GET' && url.pathname === '/api/talks/title-check') {
    const title = url.searchParams.get('title') ?? '';
    return ok({ available: !isTitleTaken(title) }, 600);
  }

  if (req.method === 'POST' && url.pathname === '/api/talks') {
    const submission = req.body as TalkSubmission;
    if (isTitleTaken(submission.title)) {
      return fail(422, { errors: [{ field: 'title', message: 'This title was just taken.' }] });
    }
    const workshops = talks.filter((talk) => talk.format === 'workshop').length;
    if (submission.format === 'workshop' && workshops >= workshopSlots) {
      return fail(422, {
        errors: [
          { field: 'format', message: 'All workshop slots are taken. Submit a talk instead.' },
        ],
      });
    }
    const talk: Talk = {
      ...structuredClone(submission),
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    talks.push(talk);
    return ok(talk, 800);
  }

  if (req.method === 'GET' && url.pathname === '/api/survey') {
    return ok(structuredClone(surveyQuestions));
  }

  if (req.method === 'PUT' && url.pathname === '/api/survey') {
    surveyAnswers = structuredClone(req.body as SurveyAnswers);
    return ok(structuredClone(surveyAnswers), 600);
  }

  if (req.method === 'GET' && url.pathname === '/api/profile') {
    return ok(structuredClone(profile));
  }

  if (req.method === 'PUT' && url.pathname === '/api/profile') {
    profile = structuredClone(req.body as SpeakerProfile);
    return ok(structuredClone(profile), 600);
  }

  return fail(404, { message: `No fake endpoint for ${req.method} ${url.pathname}` });
};
