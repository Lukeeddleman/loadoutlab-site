import ClassDetailPage from '@/components/ClassDetailPage';
import { notFound } from 'next/navigation';

const CLASSES: Record<string, {
  slug: string;
  level: string;
  title: string;
  duration: string;
  price: string;
  desc: string;
  details: string[];
  included: string[];
  toBring: string[];
  calUrl: string;
  comingSoon?: boolean;
}> = {
  'fundamentals': {
    slug: 'fundamentals',
    comingSoon: true,
    level: 'BEGINNER',
    title: 'FUNDAMENTALS',
    duration: '2–3 Hours',
    price: '$85 / person',
    desc: 'Safe handling, range etiquette, stance, grip, sight alignment, and trigger control. The foundation everything else is built on.',
    details: [
      'Firearm safety rules and range etiquette',
      'Proper stance, grip, and body mechanics',
      'Sight alignment and sight picture',
      'Trigger control and follow-through',
      'Live fire drills with instructor feedback',
      'Suitable for first-time shooters and those looking to reinforce the basics',
    ],
    included: [
      'Range fees covered — no extra costs at the door',
      'Targets and all range supplies',
      'Rental firearm available upon request',
      'Loaner eye and ear protection if needed',
      'Post-session debrief and open Q&A',
    ],
    toBring: [
      'Handgun (any caliber) — or request a rental when booking',
      '50 rounds of ammunition (limited supply available for purchase on-site if needed)',
      'Eye and ear protection (loaners available)',
      'Comfortable clothing and closed-toe shoes',
      'Water and a snack',
      'Valid ID',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/fundamentals',
  },
  'defensive-pistol': {
    slug: 'defensive-pistol',
    comingSoon: true,
    level: 'INTERMEDIATE',
    title: 'DEFENSIVE PISTOL',
    duration: '3–4 Hours',
    price: '$100 / person',
    desc: 'Drawing from holster, close-quarters drills, malfunction clearing, and real-world defensive scenarios.',
    details: [
      'Safe and efficient draw from holster',
      'Close-quarters engagement techniques',
      'Malfunction recognition and clearing',
      'Situational awareness and threat assessment',
      'Defensive shooting drills under realistic conditions',
      'Prerequisite: basic firearm familiarity recommended',
    ],
    included: [
      'Range fees covered — no extra costs at the door',
      'Targets and all range supplies',
      'Rental firearm available upon request',
      'Loaner eye and ear protection if needed',
      'Post-session debrief and open Q&A',
    ],
    toBring: [
      'Handgun — 9mm, .40, or .45 recommended (or request a rental when booking)',
      '100+ rounds of ammunition (limited supply available for purchase on-site if needed)',
      'Holster — OWB or IWB (no pocket holsters)',
      'Eye and ear protection (loaners available)',
      'Comfortable clothing and closed-toe shoes',
      'Water and snacks',
      'Valid ID',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/defensive-pistol',
  },
  'carbine-ar-platform': {
    slug: 'carbine-ar-platform',
    comingSoon: true,
    level: 'INTERMEDIATE',
    title: 'CARBINE / AR PLATFORM',
    duration: '3–4 Hours',
    price: '$100 / person',
    desc: 'AR familiarization, zeroing, precision fundamentals, positional shooting, and practical drills.',
    details: [
      'AR-15 platform overview and safe handling',
      'Zeroing your optic or iron sights',
      'Fundamentals of precision at distance',
      'Positional shooting — standing, kneeling, prone',
      'Reloads, malfunctions, and transitions',
      'Practical drills for home defense and range use',
    ],
    included: [
      'Range fees covered — no extra costs at the door',
      'Targets and all range supplies',
      'Rental firearm available upon request',
      'Loaner eye and ear protection if needed',
      'Post-session debrief and open Q&A',
    ],
    toBring: [
      'AR-15 or similar carbine platform (or request a rental when booking)',
      '100+ rounds (.223/5.56 or applicable caliber — limited supply available for purchase on-site if needed)',
      '2–3 magazines',
      'Sling (recommended)',
      'Eye and ear protection (loaners available)',
      'Comfortable clothing and closed-toe shoes',
      'Water and snacks',
      'Valid ID',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/carbine-ar-platform',
  },
  'squad-training': {
    slug: 'squad-training',
    level: 'ALL LEVELS',
    title: 'SQUAD TRAINING',
    duration: '3–4 Hours',
    price: '$100 / person',
    desc: 'Train with your people. Group sessions designed for friends, couples, families, or teams who want to build skills and confidence together.',
    details: [
      'Designed for 3–8 participants',
      'Tailored curriculum based on group experience level',
      'Fundamentals, safety, and live fire drills',
      'Great for couples, friends, or workplace teams',
      'Build shared language and habits around safe firearm handling',
      'One instructor, full attention on your group',
    ],
    included: [
      'Range fees covered for the entire group — one price, no surprises',
      'Targets and all range supplies',
      'Curriculum tailored to your group\'s experience level',
      'Rental firearms available upon request',
      'Loaner eye and ear protection if needed',
      'Post-session debrief and open Q&A',
    ],
    toBring: [
      'Each participant: handgun or rifle (specify when booking)',
      'Each participant: 50–100 rounds of ammunition (limited supply available for purchase on-site if needed)',
      'Eye and ear protection per person (loaners available)',
      'Holster if running pistol drills',
      'Comfortable clothing and closed-toe shoes',
      'Water and snacks',
      'Valid ID per participant',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/squad-training',
    comingSoon: true,
  },
  'precision-fundamentals': {
    slug: 'precision-fundamentals',
    level: 'INTERMEDIATE / ADVANCED',
    title: 'PRECISION FUNDAMENTALS',
    duration: '3–4 Hours',
    price: '$100 / person',
    desc: 'Dial in your accuracy. This course covers the science and mechanics behind consistent, repeatable precision shooting at distance.',
    details: [
      'Ballistics basics — MOA, wind, drop',
      'Proper breathing, trigger control, and follow-through for precision',
      'Positional shooting — prone, supported, and barricade',
      'Zeroing and confirming zero at distance',
      'Live fire drills with measurable accuracy benchmarks',
      'Prerequisite: basic firearm proficiency required',
    ],
    included: [
      'Range fees covered — no extra costs at the door',
      'Targets at distance',
      'Rental firearm available upon request',
      'Loaner eye and ear protection if needed',
      'Post-session debrief and open Q&A',
    ],
    toBring: [
      'Rifle — optic strongly recommended, iron sights acceptable',
      '50–100 rounds (.308, .223/5.56, or applicable caliber — limited supply available for purchase on-site if needed)',
      'Bipod or shooting bag (recommended)',
      'Notebook — you\'ll want to take data',
      'Eye and ear protection (loaners available)',
      'Comfortable clothing and closed-toe shoes',
      'Water and snacks',
      'Valid ID',
    ],
    calUrl: 'https://calendly.com/eddleman-luke/precision-fundamentals',
    comingSoon: true,
  },
  'private-instruction': {
    slug: 'private-instruction',
    level: 'ALL LEVELS',
    title: 'PRIVATE INSTRUCTION',
    duration: 'Flexible',
    price: '$100 / hour',
    desc: 'One-on-one sessions tailored to your goals, experience level, and schedule. Maximum results, minimum wasted time.',
    details: [
      'Fully customized curriculum for your skill level',
      'Work on exactly what you want to improve',
      'Flexible scheduling — days, evenings, weekends',
      'Ideal for new shooters, experienced shooters, or anywhere in between',
      'Direct one-on-one attention from Luke the entire session',
      'Great for gift purchases or accelerated skill development',
    ],
    included: [
      'Range fees covered — no extra costs at the door',
      'Targets and all range supplies',
      'Fully customized session plan built around your goals',
      'Rental firearm available upon request',
      'Loaner eye and ear protection if needed',
      'Post-session debrief and open Q&A',
    ],
    toBring: [
      'Your firearm(s) — discuss with Luke beforehand if unsure',
      'Ammunition (round count depends on session plan — Luke will advise when you book)',
      'Any relevant gear for your goals — holster, sling, optic, etc.',
      'Eye and ear protection (loaners available)',
      'Comfortable clothing and closed-toe shoes',
      'Water and snacks',
      'Valid ID',
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
