export type TalkFormat = 'lightning' | 'talk' | 'workshop';
export type TalkLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Speaker {
  name: string;
  email: string;
  company: string;
}

export interface TalkSubmission {
  title: string;
  abstract: string;
  format: TalkFormat;
  level: TalkLevel;
  duration: number;
  tags: string[];
  speakers: Speaker[];
  travel: {
    needed: boolean;
    from: string;
  };
  codeOfConduct: boolean;
}

export interface Talk extends TalkSubmission {
  id: string;
  submittedAt: string;
}

export const durationLimits: Record<TalkFormat, { min: number; max: number }> = {
  lightning: { min: 5, max: 10 },
  talk: { min: 30, max: 60 },
  workshop: { min: 180, max: 480 },
};

export function emptySpeaker(): Speaker {
  return { name: '', email: '', company: '' };
}

export function emptySubmission(): TalkSubmission {
  return {
    title: '',
    abstract: '',
    format: 'talk',
    level: 'intermediate',
    duration: 45,
    tags: [],
    speakers: [emptySpeaker()],
    travel: { needed: false, from: '' },
    codeOfConduct: false,
  };
}
