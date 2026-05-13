import ClassDetailPage from '@/components/ClassDetailPage';
import { notFound } from 'next/navigation';

const CLASSES: Record<string, {
  slug: string;
  level: string;
  title: string;
  duration: string;
  desc: string;
  details: string[];
  calUrl: string;
  comingSoon?: boolean;
}> = {
  'fundamentals': {
    slug: 'fundamentals',
    comingSoon: true,
    level: 'BEGINNER',
    title: 'FUNDAMENTALS',
    duration: '2–3 Hours',
    desc: 'Safe handling, range etiquette, stance, grip, sight alignment, and trigger control. The foundation everything else is built on.',
    details: [
      'Firearm safety rules and range etiquette',
      'Proper stance, grip, and body mechanics',
      'Sight alignment and sight picture',
      'Trigger control and follow-through',
      'Live fire drills with instructor feedback',
      'Suitable for first-time shooters and those looking to reinforce the basics',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/fundamentals',
  },
  'defensive-pistol': {
    slug: 'defensive-pistol',
    comingSoon: true,
    level: 'INTERMEDIATE',
    title: 'DEFENSIVE PISTOL',
    duration: '3–4 Hours',
    desc: 'Drawing from holster, close-quarters drills, malfunction clearing, and real-world defensive scenarios.',
    details: [
      'Safe and efficient draw from holster',
      'Close-quarters engagement techniques',
      'Malfunction recognition and clearing',
      'Situational awareness and threat assessment',
      'Defensive shooting drills under realistic conditions',
      'Prerequisite: basic firearm familiarity recommended',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/defensive-pistol',
  },
  'carbine-ar-platform': {
    slug: 'carbine-ar-platform',
    comingSoon: true,
    level: 'INTERMEDIATE',
    title: 'CARBINE / AR PLATFORM',
    duration: '3–4 Hours',
    desc: 'AR familiarization, zeroing, precision fundamentals, positional shooting, and practical drills.',
    details: [
      'AR-15 platform overview and safe handling',
      'Zeroing your optic or iron sights',
      'Fundamentals of precision at distance',
      'Positional shooting — standing, kneeling, prone',
      'Reloads, malfunctions, and transitions',
      'Practical drills for home defense and range use',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/carbine-ar-platform',
  },
  'squad-training': {
    slug: 'squad-training',
    level: 'ALL LEVELS',
    title: 'SQUAD TRAINING',
    duration: '3–4 Hours',
    desc: 'Train with your people. Group sessions designed for friends, couples, families, or teams who want to build skills and confidence together.',
    details: [
      'Designed for 3–8 participants',
      'Tailored curriculum based on group experience level',
      'Fundamentals, safety, and live fire drills',
      'Great for couples, friends, or workplace teams',
      'Build shared language and habits around safe firearm handling',
      'One instructor, full attention on your group',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/squad-training',
    comingSoon: true,
  },
  'precision-fundamentals': {
    slug: 'precision-fundamentals',
    level: 'INTERMEDIATE / ADVANCED',
    title: 'PRECISION FUNDAMENTALS',
    duration: '3–4 Hours',
    desc: 'Dial in your accuracy. This course covers the science and mechanics behind consistent, repeatable precision shooting at distance.',
    details: [
      'Ballistics basics — MOA, wind, drop',
      'Proper breathing, trigger control, and follow-through for precision',
      'Positional shooting — prone, supported, and barricade',
      'Zeroing and confirming zero at distance',
      'Live fire drills with measurable accuracy benchmarks',
      'Prerequisite: basic firearm proficiency required',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/precision-fundamentals',
    comingSoon: true,
  },
  'private-instruction': {
    slug: 'private-instruction',
    level: 'ALL LEVELS',
    title: 'PRIVATE INSTRUCTION',
    duration: 'Flexible',
    desc: 'One-on-one sessions tailored to your goals, experience level, and schedule. Maximum results, minimum wasted time.',
    details: [
      'Fully customized curriculum for your skill level',
      'Work on exactly what you want to improve',
      'Flexible scheduling — days, evenings, weekends',
      'Ideal for new shooters, experienced shooters, or anywhere in between',
      'Direct one-on-one attention from Luke the entire session',
      'Great for gift purchases or accelerated skill development',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/private-instruction',
  },
};

export function generateStaticParams() {
  return Object.keys(CLASSES).map(slug => ({ slug }));
}

export default async function ClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cls = CLASSES[slug];
  if (!cls) notFound();
  return <ClassDetailPage {...cls} />;
}
