"use client";

import React, { useMemo, useState } from "react";

/*************************
 * Types
 *************************/
export type Part = {
  id: string;
  name: string;
  brand: string;
  price: number;
  color: string;
  weightOz?: number;
};

export type SelectedParts = {
  lower: Part | null;
  upper: Part | null;
  grip: Part | null;
  foregrip: Part | null;
  barrel: Part | null;
  handguard: Part | null;
  stock: Part | null;
  muzzle: Part | null;
  optic: Part | null;
  trigger: Part | null;
  bcg: Part | null;
};

export type CategoryKey = keyof SelectedParts;

/*************************
 * Minimal demo data
 *************************/
const PARTS_DATABASE: Record<CategoryKey, Part[]> = {
  lower: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "lower-aero", name: "M4E1 Lower", brand: "Aero", price: 129.99, color: "#1f2937" },
  ],
  upper: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "upper-aero", name: "M4E1 Upper", brand: "Aero", price: 119.99, color: "#1f2937" },
  ],
  grip: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "magpul-moe", name: "MOE Grip", brand: "Magpul", price: 19.99, color: "#374151" },
  ],
  foregrip: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "magpul-afg", name: "AFG", brand: "Magpul", price: 24.99, color: "#374151" },
  ],
  barrel: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "faxon-16", name: "16\" Gov't", brand: "Faxon", price: 169.0, color: "#6b7280" },
  ],
  handguard: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "smr-mk16", name: "Geissele MK16", brand: "Geissele", price: 299.0, color: "#374151" },
  ],
  stock: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "b5-sopmod", name: "SOPMOD", brand: "B5 Systems", price: 79.99, color: "#374151" },
  ],
  muzzle: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "a2-birdcage", name: "A2", brand: "Mil-Spec", price: 12.99, color: "#1f2937" },
  ],
  optic: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "holosun-510c", name: "510C", brand: "Holosun", price: 299.99, color: "#374151" },
  ],
  trigger: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "larue-mbt", name: "MBT-2S", brand: "LaRue", price: 99.0, color: "#1f2937" },
  ],
  bcg: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "toolcraft-nitride", name: "5.56 BCG", brand: "Toolcraft", price: 109.0, color: "#1f2937" },
  ],
};

/*************************
 * Small helpers
 *************************/
function money(n: number) {
  return `$${n.toFixed(2)}`;
}

function sumSelected(selected: SelectedParts) {
  return (
    (selected.lower?.price || 0) +
    (selected.upper?.price || 0) +
    (selected.grip?.price || 0) +
    (selected.foregrip?.price || 0) +
    (selected.barrel?.price || 0) +
    (selected.handguard?.price || 0) +
    (selected.stock?.price || 0) +
    (selected.muzzle?.price || 0) +
    (selected.optic?.price || 0) +
    (selected.trigger?.price || 0) +
    (selected.bcg?.price || 0)
  );
}

/*************************
 * Little inline chevrons (no external deps)
 *************************/
const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden="true">
    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);
const ChevronUp: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden="true">
    <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </svg>
);

/*************************
 * Visualization
 *************************/
const RifleVisualization: React.FC<{ selected: SelectedParts }> = ({ selected }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      <svg viewBox="0 0 640 260" className="w-full h-[300px]">
        {/* Upper rail */}
        <rect x={60} y={110} width={380} height={20} rx={3} fill="#1f2937" />

        {/* Barrel */}
        {selected.barrel && selected.barrel.id !== "none" && (
          <rect x={430} y={118} width={120} height={4} fill="#6b7280" />
        )}

        {/* Muzzle */}
        {selected.muzzle && selected.muzzle.id !== "none" && (
          <rect x={550} y={116} width={24} height={8} fill="#374151" />
        )}

        {/* Receiver */}
        <rect x={160} y={105} width={140} height={30} rx={4} fill="#111827" />

        {/* Stock tube */}
        <rect x={60} y={112} width={70} height={6} rx={3} fill="#374151" />

        {/* Stock */}
        {selected.stock && selected.stock.id !== "none" && (
          <rect x={18} y={100} width={60} height={24} rx={4} fill="#374151" />
        )}

        {/* Grip */}
        {selected.grip && selected.grip.id !== "none" && (
          <rect x={220} y={136} width={18} height={32} rx={4} fill="#374151" />
        )}

        {/* Foregrip */}
        {selected.foregrip && selected.foregrip.id !== "none" && (
          <rect x={300} y={140} width={12} height={24} rx={4} fill="#374151" />
        )}

        {/* Handguard tint */}
        {selected.handguard && selected.handguard.id !== "none" && (
          <rect x={220} y={110} width={200} height={20} rx={3} fill="#111827" opacity={0.55} />
        )}

        {/* Optic (minimal, TSX-safe) */}
        {selected.optic && selected.optic.id !== "none" && (
          <g>
            {/* optic body */}
            <rect x={250} y={88} width={80} height={18} rx={3} fill="#374151" />
            {/* brand */}
            <text x={255} y={82} fill="#22d3ee" fontSize={10}>
              {selected.optic.brand}
            </text>
            {/* model + price */}
            <text x={255} y={112} fill="#e5e7eb" fontSize={10}>
              {selected.optic.name} · ${selected.optic.price.toFixed(2)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

/*************************
 * Component selector (left panel)
 *************************/
export type CategoryMeta = {
  id: CategoryKey;
  name: string;
  required?: boolean;
};

function ComponentSelector({
  category,
  parts,
  selectedPart,
  onSelect,
  isExpanded,
  onToggle,
}: {
  category: CategoryMeta;
  parts: Part[];
  selectedPart: Part | null;
  onSelect: (p: Part) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-3 rounded-xl border border-neutral-800 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-neutral-900 hover:bg-neutral-800"
        onClick={onToggle}
      >
        <span className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-neutral-100">{category.name}</span>
          {category.required && (
            <span className="text-xs text-neutral-400">(required)</span>
          )}
        </span>
        {isExpanded ? (
          <ChevronUp className="text-neutral-400" />
        ) : (
          <ChevronDown className="text-neutral-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-2 bg-neutral-950">
          {parts.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className={`w-full text-left px-3 py-2 rounded-lg border mb-2 ${
                selectedPart?.id === p.id
                  ? "border-cyan-500 bg-neutral-900"
                  : "border-neutral-800 bg-neutral-950 hover:bg-neutral-900"
              }`}
            >
              <div className="text-sm font-medium text-neutral-100">{p.name}</div>
              <div className="text-xs text-neutral-400 flex justify-between">
                <span>{p.brand}</span>
                <span>{money(p.price)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/*************************
 * Main builder component
 *************************/
export default function AR15ForgeBuilder() {
  const [selected, setSelected] = useState<SelectedParts>({
    lower: PARTS_DATABASE.lower[0],
    upper: PARTS_DATABASE.upper[0],
    grip: PARTS_DATABASE.grip[0],
    foregrip: PARTS_DATABASE.foregrip[0],
    barrel: PARTS_DATABASE.barrel[0],
    handguard: PARTS_DATABASE.handguard[0],
    stock: PARTS_DATABASE.stock[0],
    muzzle: PARTS_DATABASE.muzzle[0],
    optic: PARTS_DATABASE.optic[0],
    trigger: PARTS_DATABASE.trigger[0],
    bcg: PARTS_DATABASE.bcg[0],
  });

  const [expanded, setExpanded] = useState<CategoryKey | null>("lower");
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(true);

  const categories: CategoryMeta[] = useMemo(
    () => [
      { id: "lower", name: "Lower Receiver", required: true },
      { id: "upper", name: "Upper Receiver", required: true },
      { id: "barrel", name: "Barrel", required: true },
      { id: "handguard", name: "Handguard" },
      { id: "muzzle", name: "Muzzle Device" },
      { id: "bcg", name: "Bolt Carrier Group" },
      { id: "trigger", name: "Trigger" },
      { id: "stock", name: "Stock" },
      { id: "grip", name: "Pistol Grip" },
      { id: "foregrip", name: "Foregrip" },
      { id: "optic", name: "Optic" },
    ],
    []
  );

  const total = useMemo(() => sumSelected(selected), [selected]);

  const selectPart = (key: CategoryKey, part: Part) => {
    setSelected((prev) => ({ ...prev, [key]: part }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="font-semibold">LoadoutLab – AR15 Forge</div>
          <div className="text-sm text-neutral-400">Total: <span className="text-white font-semibold">{money(total)}</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left panel */}
        <aside className={`lg:col-span-4 ${leftPanelOpen ? "block" : "hidden lg:block"}`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Components</h2>
            <button
              className="text-sm rounded-lg border border-neutral-800 px-3 py-1.5 hover:bg-neutral-900"
              onClick={() => setLeftPanelOpen((v) => !v)}
            >
              {leftPanelOpen ? "Hide" : "Show"}
            </button>
          </div>

          {categories.map((cat) => (
            <ComponentSelector
              key={cat.id}
              category={cat}
              parts={PARTS_DATABASE[cat.id]}
              selectedPart={selected[cat.id]}
              onSelect={(p) => selectPart(cat.id, p)}
              isExpanded={expanded === cat.id}
              onToggle={() => setExpanded(expanded === cat.id ? null : cat.id)}
            />
          ))}
        </aside>

        {/* Center visualization */}
        <section className="lg:col-span-8">
          <RifleVisualization selected={selected} />

          {/* Simple summary table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900 text-neutral-300">
                <tr>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-left px-3 py-2">Selection</th>
                  <th className="text-right px-3 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => {
                  const part = selected[c.id];
                  return (
                    <tr key={c.id} className="border-t border-neutral-800">
                      <td className="px-3 py-2 text-neutral-300">{c.name}</td>
                      <td className="px-3 py-2">{part ? `${part.brand} – ${part.name}` : "—"}</td>
                      <td className="px-3 py-2 text-right">{part ? money(part.price) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-neutral-800 bg-neutral-900 font-semibold">
                  <td className="px-3 py-2" colSpan={2}>Total</td>
                  <td className="px-3 py-2 text-right">{money(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}