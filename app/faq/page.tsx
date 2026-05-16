import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ — Loadout Lab Firearms Instruction | Austin, TX',
  description: 'Answers to common questions about Loadout Lab firearms classes in Austin, Kyle, Buda, and San Marcos, TX. Do you need your own gun? What should you bring? Who are classes for?',
};

export default function FAQPage() {
  return <FAQClient />;
}
