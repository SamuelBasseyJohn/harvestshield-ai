import { IconName } from '../../icons/Icon';

export type ComingSoonKey =
  | 'treatment'
  | 'agronomist'
  | 'alerts'
  | 'farm'
  | 'community'
  | 'analytics';

export type ComingSoonFeature = {
  key: ComingSoonKey;
  icon: IconName;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  /** Roughly where it sits on the roadmap; shown as a quiet caption. */
  phase: string;
};

export const COMING_SOON: Record<ComingSoonKey, ComingSoonFeature> = {
  treatment: {
    key: 'treatment',
    icon: 'droplet',
    title: 'Treatment guidance',
    tagline: 'From diagnosis to a plan of action',
    description:
      'Every diagnosis will carry a treatment pathway written for Nigerian smallholder conditions — what to apply, at what rate, and what to do first when inputs are scarce.',
    bullets: [
      'Step-by-step control measures per disease',
      'Cultural, biological and chemical options side by side',
      'Locally available input names and approximate cost',
      'Guidance on what to do when treatment is not viable',
    ],
    phase: 'Next release',
  },
  agronomist: {
    key: 'agronomist',
    icon: 'message',
    title: 'Ask an agronomist',
    tagline: 'A human check on the model',
    description:
      'Send a scan straight to a qualified extension officer for confirmation. AI narrows the field in seconds; an expert closes it with certainty.',
    bullets: [
      'Attach any scan from your history',
      'Reviewed by certified extension officers',
      'Replies threaded against the original diagnosis',
      'Escalation path for outbreak-level findings',
    ],
    phase: 'In design',
  },
  alerts: {
    key: 'alerts',
    icon: 'bell',
    title: 'Disease alerts',
    tagline: 'Warning before it reaches your farm',
    description:
      'Aggregated, anonymised scan data becomes an early-warning signal. When a disease starts moving through your local government area, you hear about it first.',
    bullets: [
      'Alerts scoped to your state and LGA',
      'Seasonal risk windows per crop',
      'Whitefly and vector pressure advisories',
      'Fully opt-in, always anonymised',
    ],
    phase: 'Planned',
  },
  farm: {
    key: 'farm',
    icon: 'grid',
    title: 'Farm management',
    tagline: 'Your plots, tracked over a season',
    description:
      'Group scans by plot so plant health becomes a record rather than a moment — which field, which planting, and how it has moved week to week.',
    bullets: [
      'Named plots with crop and planting date',
      'Scan history grouped per plot',
      'Season timeline of health changes',
      'Works offline in the field',
    ],
    phase: 'Planned',
  },
  community: {
    key: 'community',
    icon: 'users',
    title: 'Community',
    tagline: 'Farmers comparing notes',
    description:
      'A moderated space to share findings, confirm unusual symptoms and learn what is working on neighbouring farms this season.',
    bullets: [
      'Local groups by crop and region',
      'Share a scan for a second opinion',
      'Moderated by extension officers',
      'Available in English, Hausa, Yoruba and Igbo',
    ],
    phase: 'Exploring',
  },
  analytics: {
    key: 'analytics',
    icon: 'activity',
    title: 'Advanced analytics',
    tagline: 'Patterns across every scan you take',
    description:
      'Turn a season of scans into a picture: which diseases recur, when pressure peaks, and how your plots compare against the regional baseline.',
    bullets: [
      'Disease frequency and trend charts',
      'Healthy-versus-flagged ratio over time',
      'Regional benchmark comparison',
      'Exportable season summary',
    ],
    phase: 'Planned',
  },
};
