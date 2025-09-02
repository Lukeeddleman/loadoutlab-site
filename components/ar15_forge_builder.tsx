"use client";

import React, { useMemo, useState } from "react";
import { Filter, Search, DollarSign, Target, ChevronLeft, ChevronRight, RotateCcw, Save } from "lucide-react";

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
    { id: "lower-anderson", name: "AM-15 Lower", brand: "Anderson", price: 89.99, color: "#1f2937" },
    { id: "lower-psa", name: "PA-15 Lower", brand: "PSA", price: 99.99, color: "#1f2937" },
  ],
  upper: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "upper-aero", name: "M4E1 Upper", brand: "Aero", price: 119.99, color: "#1f2937" },
    { id: "upper-bcm", name: "BCM Upper", brand: "BCM", price: 189.99, color: "#1f2937" },
    { id: "upper-psa", name: "PA-15 Upper", brand: "PSA", price: 99.99, color: "#1f2937" },
  ],
  grip: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "magpul-moe", name: "MOE Grip", brand: "Magpul", price: 19.99, color: "#374151" },
    { id: "magpul-k2", name: "K2 Grip", brand: "Magpul", price: 24.99, color: "#374151" },
    { id: "bcm-mod3", name: "Mod 3 Grip", brand: "BCM", price: 29.99, color: "#374151" },
  ],
  foregrip: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "magpul-afg", name: "AFG", brand: "Magpul", price: 24.99, color: "#374151" },
    { id: "magpul-rvg", name: "RVG", brand: "Magpul", price: 19.99, color: "#374151" },
    { id: "bcm-vert", name: "Vertical Grip", brand: "BCM", price: 34.99, color: "#374151" },
  ],
  barrel: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "faxon-16", name: "16\" Gov't", brand: "Faxon", price: 169.0, color: "#6b7280" },
    { id: "ballistic-advantage-18", name: "18\" SPR", brand: "BA", price: 199.99, color: "#6b7280" },
    { id: "criterion-14.5", name: "14.5\" Core", brand: "Criterion", price: 289.99, color: "#6b7280" },
  ],
  handguard: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "smr-mk16", name: "Geissele MK16", brand: "Geissele", price: 299.0, color: "#374151" },
    { id: "magpul-moe", name: "MOE SL", brand: "Magpul", price: 89.99, color: "#374151" },
    { id: "bcm-mcmr", name: "MCMR-15", brand: "BCM", price: 199.99, color: "#374151" },
  ],
  stock: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "b5-sopmod", name: "SOPMOD", brand: "B5 Systems", price: 79.99, color: "#374151" },
    { id: "magpul-ctr", name: "CTR", brand: "Magpul", price: 59.99, color: "#374151" },
    { id: "bcm-gunfighter", name: "Gunfighter", brand: "BCM", price: 69.99, color: "#374151" },
  ],
  muzzle: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "a2-birdcage", name: "A2", brand: "Mil-Spec", price: 12.99, color: "#1f2937" },
    { id: "surefire-warcomp", name: "WarComp", brand: "SureFire", price: 149.99, color: "#1f2937" },
    { id: "dead-air-flash", name: "Flash Hider", brand: "Dead Air", price: 89.99, color: "#1f2937" },
  ],
  optic: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "holosun-510c", name: "510C", brand: "Holosun", price: 299.99, color: "#374151" },
    { id: "aimpoint-t2", name: "Micro T-2", brand: "Aimpoint", price: 899.99, color: "#374151" },
    { id: "eotech-xps2", name: "XPS2-0", brand: "EOTech", price: 559.99, color: "#374151" },
  ],
  trigger: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "larue-mbt", name: "MBT-2S", brand: "LaRue", price: 99.0, color: "#1f2937" },
    { id: "geissele-ssa", name: "SSA", brand: "Geissele", price: 249.99, color: "#1f2937" },
    { id: "cmc-single", name: "Single Stage", brand: "CMC", price: 159.99, color: "#1f2937" },
  ],
  bcg: [
    { id: "none", name: "(None)", brand: "—", price: 0, color: "#111" },
    { id: "toolcraft-nitride", name: "5.56 BCG", brand: "Toolcraft", price: 109.0, color: "#1f2937" },
    { id: "bcm-auto", name: "Auto BCG", brand: "BCM", price: 189.99, color: "#1f2937" },
    { id: "lmt-enhanced", name: "Enhanced BCG", brand: "LMT", price: 349.99, color: "#1f2937" },
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
 * Enhanced Rifle Visualization
 *************************/
const RifleVisualization: React.FC<{ selected: SelectedParts }> = ({ selected }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-gray-950 to-black relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Spotlight effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] opacity-60 blur-3xl rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)'
          }}
        />
        {/* Inner spotlight */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] opacity-80 blur-2xl rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.12) 0%, rgba(34, 211, 238, 0.18) 35%, transparent 65%)'
          }}
        />
        {/* Core light */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] opacity-50 blur-xl rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.2) 0%, rgba(34, 211, 238, 0.25) 50%, transparent 80%)'
          }}
        />
      </div>

      {/* Main rifle SVG - much larger */}
      <svg viewBox="0 0 800 300" className="w-full h-full max-w-5xl relative z-10">
        {/* Drop shadow */}
        <defs>
          <filter id="drop-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)" />
          </filter>
        </defs>

        {/* Upper rail - main body */}
        <rect x={80} y={140} width={500} height={25} rx={4} fill="#1f2937" filter="url(#drop-shadow)" />

        {/* Barrel */}
        {selected.barrel && selected.barrel.id !== "none" && (
          <rect x={570} y={148} width={150} height={6} fill={selected.barrel.color} filter="url(#drop-shadow)" />
        )}

        {/* Muzzle */}
        {selected.muzzle && selected.muzzle.id !== "none" && (
          <rect x={720} y={146} width={30} height={10} fill={selected.muzzle.color} filter="url(#drop-shadow)" />
        )}

        {/* Receiver (more detailed) */}
        <rect x={200} y={135} width={180} height={35} rx={6} fill="#111827" filter="url(#drop-shadow)" />
        
        {/* Charging handle */}
        <rect x={190} y={138} width={15} height={8} rx={2} fill="#374151" />

        {/* Buffer tube */}
        <rect x={80} y={144} width={90} height={8} rx={4} fill="#374151" filter="url(#drop-shadow)" />

        {/* Stock */}
        {selected.stock && selected.stock.id !== "none" && (
          <rect x={20} y={130} width={75} height={28} rx={6} fill={selected.stock.color} filter="url(#drop-shadow)" />
        )}

        {/* Pistol grip */}
        {selected.grip && selected.grip.id !== "none" && (
          <rect x={280} y={172} width={22} height={40} rx={6} fill={selected.grip.color} filter="url(#drop-shadow)" />
        )}

        {/* Foregrip */}
        {selected.foregrip && selected.foregrip.id !== "none" && (
          <rect x={380} y={180} width={15} height={30} rx={6} fill={selected.foregrip.color} filter="url(#drop-shadow)" />
        )}

        {/* Handguard overlay */}
        {selected.handguard && selected.handguard.id !== "none" && (
          <rect x={280} y={140} width={280} height={25} rx={4} fill={selected.handguard.color} opacity={0.8} filter="url(#drop-shadow)" />
        )}

        {/* Optic */}
        {selected.optic && selected.optic.id !== "none" && (
          <g filter="url(#drop-shadow)">
            <rect x={320} y={115} width={100} height={22} rx={4} fill={selected.optic.color} />
            <text x={325} y={108} fill="#22d3ee" fontSize={12} fontWeight="bold">
              {selected.optic.brand}
            </text>
            <text x={325} y={150} fill="#e5e7eb" fontSize={11}>
              {selected.optic.name} • {money(selected.optic.price)}
            </text>
          </g>
        )}

        {/* Magazine well */}
        <rect x={270} y={170} width={25} height={35} rx={3} fill="#1f2937" filter="url(#drop-shadow)" />

        {/* Trigger guard */}
        <ellipse cx={290} cy={185} rx={12} ry={8} fill="none" stroke="#374151" strokeWidth={2} />
      </svg>

      {/* Build info overlay */}
      <div className="absolute bottom-8 right-8 bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
        <div className="text-cyan-400 text-sm font-mono mb-1">BUILD TOTAL</div>
        <div className="text-white text-2xl font-bold">{money(sumSelected(selected))}</div>
      </div>
    </div>
  );
};

/*************************
 * Component Categories
 *************************/
export type CategoryMeta = {
  id: CategoryKey;
  name: string;
  required?: boolean;
  icon?: string;
};

const CATEGORIES: CategoryMeta[] = [
  { id: "lower", name: "Lower Receiver", required: true, icon: "🔧" },
  { id: "upper", name: "Upper Receiver", required: true, icon: "⚙️" },
  { id: "barrel", name: "Barrel", required: true, icon: "🎯" },
  { id: "handguard", name: "Handguard", icon: "🛡️" },
  { id: "muzzle", name: "Muzzle Device", icon: "💥" },
  { id: "bcg", name: "Bolt Carrier Group", icon: "⚡" },
  { id: "trigger", name: "Trigger", icon: "🎛️" },
  { id: "stock", name: "Stock", icon: "📐" },
  { id: "grip", name: "Pistol Grip", icon: "✋" },
  { id: "foregrip", name: "Foregrip", icon: "👊" },
  { id: "optic", name: "Optic", icon: "🔍" },
];

/*************************
 * Left Components Panel
 *************************/
const ComponentsPanel: React.FC<{
  selected: SelectedParts;
  onSelect: (key: CategoryKey, part: Part) => void;
  expanded: CategoryKey | null;
  setExpanded: (key: CategoryKey | null) => void;
}> = ({ selected, onSelect, expanded, setExpanded }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Hover trigger area - wider and more reliable */}
      <div 
        className="fixed left-0 top-0 w-16 h-full z-40"
        onMouseEnter={() => setIsHovered(true)}
      />
      
      {/* Panel */}
      <div 
        className={`fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-r border-cyan-500/30 transform transition-all duration-300 ease-out z-50 ${
          isHovered ? 'translate-x-0' : '-translate-x-72'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tab indicator when hidden */}
        <div className={`absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-16 bg-cyan-500/20 rounded-r-lg flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            COMPONENTS
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">SELECT PARTS TO BUILD</p>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="border-b border-gray-800/50">
              <button
                onClick={() => setExpanded(expanded === category.id ? null : category.id)}
                className="w-full p-3 text-left hover:bg-gray-800/50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{category.name}</div>
                    {category.required && (
                      <div className="text-xs text-red-400 font-mono">REQUIRED</div>
                    )}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded === category.id ? 'rotate-90' : ''}`} />
              </button>
              
              {expanded === category.id && (
                <div className="bg-gray-950/50 p-2">
                  {PARTS_DATABASE[category.id].map((part) => (
                    <button
                      key={part.id}
                      onClick={() => onSelect(category.id, part)}
                      className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${
                        selected[category.id]?.id === part.id
                          ? "bg-cyan-600/20 border border-cyan-500/50"
                          : "hover:bg-gray-800/50 border border-transparent"
                      }`}
                    >
                      <div className="text-sm font-medium text-white">{part.name}</div>
                      <div className="text-xs text-gray-400 flex justify-between">
                        <span>{part.brand}</span>
                        <span className="text-cyan-400 font-mono">{money(part.price)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/*************************
 * Right Filter Panel
 *************************/
const FilterPanel: React.FC<{
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}> = ({ priceRange, setPriceRange, selectedBrands, setSelectedBrands }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    Object.values(PARTS_DATABASE).forEach(parts => 
      parts.forEach(part => part.brand !== "—" && brands.add(part.brand))
    );
    return Array.from(brands).sort();
  }, []);

  return (
    <>
      {/* Hover trigger area */}
      <div 
        className="fixed right-0 top-0 w-16 h-full z-40"
        onMouseEnter={() => setIsHovered(true)}
      />
      
      {/* Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-l border-cyan-500/30 transform transition-all duration-300 ease-out z-50 ${
          isHovered ? 'translate-x-0' : 'translate-x-72'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tab indicator when hidden */}
        <div className={`absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-16 bg-cyan-500/20 rounded-l-lg flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}>
          <ChevronLeft className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-400" />
            FILTERS
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">REFINE YOUR SEARCH</p>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Price Range</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>{money(priceRange[0])}</span>
                <span>{money(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Brands</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allBrands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(selectedBrands.filter(b => b !== brand));
                      }
                    }}
                    className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Save Build
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/*************************
 * Main Forge Component
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

  const [expanded, setExpanded] = useState<CategoryKey | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const selectPart = (key: CategoryKey, part: Part) => {
    setSelected(prev => ({ ...prev, [key]: part }));
  };

  return (
    <div className="h-screen w-screen bg-slate-950 relative overflow-hidden">
      {/* Top header bar */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* LoadoutLab Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Target className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <div className="absolute inset-0 animate-pulse">
                  <Target className="w-8 h-8 text-cyan-400/30" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-wide group-hover:text-cyan-50 transition-colors">LOADOUT</span>
                <span className="text-cyan-400 font-light group-hover:text-cyan-300 transition-colors">LAB</span>
              </div>
            </a>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-600"></div>
            
            {/* Page Title */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">AR15 FORGE</h1>
              <div className="text-xs text-gray-400 font-mono">WEAPON CONFIGURATION SYSTEM</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400 font-mono">BUILD TOTAL</div>
              <div className="text-lg font-bold text-white">{money(sumSelected(selected))}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main visualization area */}
      <div className="absolute inset-0 pt-16">
        <RifleVisualization selected={selected} />
      </div>

      {/* Left components panel */}
      <ComponentsPanel
        selected={selected}
        onSelect={selectPart}
        expanded={expanded}
        setExpanded={setExpanded}
      />

      {/* Right filter panel */}
      <FilterPanel
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
      />
    </div>
  );
}