"use client";

import { useState } from 'react';
import { ChevronRight, Clock } from 'lucide-react';

const HOURS = [
  {
    value: 1,
    label: '1 Hour',
    price: '$100',
    desc: 'Great for a focused skill or refresher',
    url: 'https://calendly.com/eddleman-luke/private-instruction',
  },
  {
    value: 2,
    label: '2 Hours',
    price: '$200',
    desc: 'Most popular — plenty of time to drill and debrief',
    url: 'https://calendly.com/eddleman-luke/private-instruction-1-hr-clone',
  },
  {
    value: 3,
    label: '3 Hours',
    price: '$300',
    desc: 'Deep dive — ideal for new shooters or major skill building',
    url: 'https://calendly.com/eddleman-luke/private-instruction-2-hr-clone',
  },
];

export default function PrivateBookingWidget() {
  const [selected, setSelected] = useState<number>(2);

  const selectedHour = HOURS.find(h => h.value === selected)!;

  return (
    <div className="space-y-3 mb-6">
      <p className="text-zinc-600 text-xs font-mono tracking-widest mb-4">SELECT DURATION</p>
      {HOURS.map(({ value, label, price, desc }) => (
        <button
          key={value}
          onClick={() => setSelected(value)}
          className={`w-full text-left rounded-lg border px-4 py-3.5 transition-all ${
            selected === value
              ? 'border-red-600/60 bg-red-600/10'
              : 'border-zinc-800 bg-black hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-2">
              <Clock className={`w-3.5 h-3.5 ${selected === value ? 'text-red-500' : 'text-zinc-600'}`} />
              <span className={`text-sm font-black tracking-wide ${selected === value ? 'text-white' : 'text-zinc-400'}`}>
                {label}
              </span>
            </div>
            <span className={`text-sm font-black ${selected === value ? 'text-red-500' : 'text-zinc-600'}`}>
              {price}
            </span>
          </div>
          <p className="text-zinc-600 text-xs pl-5">{desc}</p>
        </button>
      ))}

      <div className="pt-2">
        <a
          href={selectedHour.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-lg font-black text-sm tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          BOOK {selected} HOUR{selected > 1 ? 'S' : ''} — ${selected * 100} <ChevronRight className="w-4 h-4" />
        </a>
        <p className="text-zinc-700 text-xs text-center font-mono mt-3">
          Pick your date &amp; time · Payment collected at checkout
        </p>
      </div>
    </div>
  );
}
