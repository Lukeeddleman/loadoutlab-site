"use client";

import React, { useState } from "react";
import { Target, ChevronRight, Search, Check } from "lucide-react";
import { FirearmType, RifleType, PistolType, ShotgunType, FirearmConfiguration } from "./ForgeContext";
import ForgeSignInPage from "./ForgeSignInPage";

type Part = {
  id: string;
  name: string;
  brand: string;
  price: number;
  color: string;
  compatibility: any;
  description?: string;
};

interface QuestionnaireProps {
  onComplete: (configuration: FirearmConfiguration, selectedLower?: Part) => void;
}

// AR-15 Lower Receivers Database
const AR15_LOWERS: Part[] = [
  { id: "lower-aero", name: "M4E1 Lower", brand: "Aero Precision", price: 129.99, color: "#1f2937", compatibility: { firearmTypes: ["rifle"], subTypes: ["ar15"] }, description: "Stripped lower receiver with enhanced features" },
  { id: "lower-anderson", name: "AM-15 Lower", brand: "Anderson Manufacturing", price: 89.99, color: "#1f2937", compatibility: { firearmTypes: ["rifle"], subTypes: ["ar15"] }, description: "Mil-spec stripped lower receiver" },
  { id: "lower-psa", name: "PA-15 Lower", brand: "Palmetto State Armory", price: 99.99, color: "#1f2937", compatibility: { firearmTypes: ["rifle"], subTypes: ["ar15"] }, description: "Forged 7075-T6 aluminum lower" },
  { id: "lower-bcm", name: "BCM Lower", brand: "Bravo Company", price: 189.99, color: "#1f2937", compatibility: { firearmTypes: ["rifle"], subTypes: ["ar15"] }, description: "Premium mil-spec lower receiver" },
  { id: "lower-daniel-defense", name: "DDM4 Lower", brand: "Daniel Defense", price: 249.99, color: "#1f2937", compatibility: { firearmTypes: ["rifle"], subTypes: ["ar15"] }, description: "Cold hammer forged lower with DD markings" },
  { id: "lower-spikes", name: "Spider Lower", brand: "Spikes Tactical", price: 159.99, color: "#1f2937", compatibility: { firearmTypes: ["rifle"], subTypes: ["ar15"] }, description: "Spider logo engraved lower receiver" },
  { id: "lower-noveske", name: "Gen 4 Lower", brand: "Noveske", price: 299.99, color: "#1f2937", compatibility: { firearmTypes: ["rifle"], subTypes: ["ar15"] }, description: "Billet aluminum lower with Noveske styling" },
  { id: "lower-lmt", name: "MARS-L Lower", brand: "Lewis Machine & Tool", price: 349.99, color: "#1f2937", compatibility: { firearmTypes: ["rifle"], subTypes: ["ar15"] }, description: "Monolithic Ambidextrous Receiver System" },
];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function ForgeQuestionnaire({ onComplete }: QuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [firearmType, setFirearmType] = useState<FirearmType | null>(null);
  const [rifleType, setRifleType] = useState<RifleType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400]);

  const handleContinueAsGuest = () => {
    setStep(1);
  };

  const handleFirearmSelection = (type: FirearmType) => {
    setFirearmType(type);
    if (type === "rifle") {
      setStep(2);
    } else {
      // For pistol/shotgun, complete immediately since they're not available
      // This would need to be updated when pistol/shotgun support is added
    }
  };

  const handleRifleTypeSelection = (type: RifleType) => {
    setRifleType(type);
    if (type === "ar15") {
      setStep(3); // Move to lower receiver selection
    }
    // For ar10/bolt-action, we could show a coming soon message or complete
  };

  const handleLowerSelection = (lower: Part) => {
    onComplete({ firearmType: "rifle", subType: "ar15" }, lower);
  };

  const handleSkipLower = () => {
    onComplete({ firearmType: "rifle", subType: "ar15" }, undefined);
  };

  // Filter lowers based on search and filters
  const filteredLowers = AR15_LOWERS.filter(lower => {
    const matchesSearch = lower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lower.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(lower.brand);
    const matchesPrice = lower.price >= priceRange[0] && lower.price <= priceRange[1];
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const availableBrands = [...new Set(AR15_LOWERS.map(lower => lower.brand))].sort();

  // If on step 0 (sign-in), render the sign-in page directly
  if (step === 0) {
    return <ForgeSignInPage onContinueAsGuest={handleContinueAsGuest} />;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-gray-950 to-black z-50 flex items-center justify-center animate-fadeIn">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      {/* Spotlight effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 blur-3xl rounded-full w-[120vw] h-[80vh] min-w-[800px] min-h-[600px] max-w-[2000px] max-h-[1400px]"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="w-12 h-12 text-cyan-400" />
            <div>
              <span className="text-3xl font-bold text-white tracking-wide">LOADOUT</span>
              <span className="text-cyan-400 font-light text-3xl">LAB</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">FORGE</h1>
          <p className="text-gray-400 text-lg font-mono">PRECISION FIREARM CONFIGURATOR</p>
        </div>

        {/* Step 1: Firearm Type Selection */}
        {step === 1 && (
          <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">What type of firearm would you like to design?</h2>
            <p className="text-gray-400 text-center mb-8 font-mono">SELECT YOUR PLATFORM</p>
            
            <div className="space-y-4">
              {/* Rifle Option */}
              <button
                onClick={() => handleFirearmSelection("rifle")}
                className="w-full p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/50 rounded-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xl font-bold text-white group-hover:text-cyan-50">RIFLE</div>
                    <div className="text-sm text-gray-400 font-mono">PRECISION LONG-RANGE PLATFORMS</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Pistol Option - Disabled */}
              <button
                disabled
                className="w-full p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xl font-bold text-gray-500">PISTOL</div>
                    <div className="text-sm text-gray-600 font-mono">COMPACT SIDEARM PLATFORMS</div>
                  </div>
                  <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400 font-mono">
                    COMING SOON
                  </div>
                </div>
              </button>

              {/* Shotgun Option - Disabled */}
              <button
                disabled
                className="w-full p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xl font-bold text-gray-500">SHOTGUN</div>
                    <div className="text-sm text-gray-600 font-mono">TACTICAL SCATTER-GUN PLATFORMS</div>
                  </div>
                  <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400 font-mono">
                    COMING SOON
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Rifle Type Selection */}
        {step === 2 && firearmType === "rifle" && (
          <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">What type of rifle would you like to build?</h2>
            <p className="text-gray-400 text-center mb-8 font-mono">SELECT YOUR RIFLE PLATFORM</p>
            
            <div className="space-y-4">
              {/* AR-15 Option */}
              <button
                onClick={() => handleRifleTypeSelection("ar15")}
                className="w-full p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/50 rounded-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xl font-bold text-white group-hover:text-cyan-50">AR-15</div>
                    <div className="text-sm text-gray-400 font-mono">5.56/.223 MODULAR RIFLE PLATFORM</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* AR-10 Option - Disabled */}
              <button
                disabled
                className="w-full p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xl font-bold text-gray-500">AR-10</div>
                    <div className="text-sm text-gray-600 font-mono">.308/7.62 PRECISION RIFLE PLATFORM</div>
                  </div>
                  <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400 font-mono">
                    COMING SOON
                  </div>
                </div>
              </button>

              {/* Bolt Action Option - Disabled */}
              <button
                disabled
                className="w-full p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xl font-bold text-gray-500">BOLT ACTION</div>
                    <div className="text-sm text-gray-600 font-mono">PRECISION LONG-RANGE PLATFORM</div>
                  </div>
                  <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400 font-mono">
                    COMING SOON
                  </div>
                </div>
              </button>
            </div>

            {/* Back button */}
            <button
              onClick={() => setStep(1)}
              className="mt-6 px-6 py-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors"
            >
              ← BACK TO FIREARM TYPE
            </button>
          </div>
        )}

        {/* Step 3: Lower Receiver Selection */}
        {step === 3 && firearmType === "rifle" && rifleType === "ar15" && (
          <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Select your AR-15 lower receiver</h2>
            <p className="text-gray-400 text-center mb-6 font-mono">CHOOSE YOUR SERIALIZED COMPONENT</p>
            
            {/* Skip Option */}
            <div className="mb-6 text-center">
              <button
                onClick={handleSkipLower}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] border border-gray-600 hover:border-gray-500"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  I ALREADY HAVE A LOWER RECEIVER
                </div>
              </button>
              <p className="text-xs text-gray-500 mt-2 font-mono">Skip this step if you already own a lower receiver</p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search lower receivers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="min-w-48">
                  <label className="block text-xs text-gray-400 font-mono mb-1">PRICE RANGE</label>
                  <input
                    type="range"
                    min="0"
                    max="400"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-mono mt-1">
                    <span>$0</span>
                    <span>{money(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-xs text-gray-400 font-mono mb-2">FILTER BY BRAND</label>
                <div className="flex flex-wrap gap-2">
                  {availableBrands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => {
                        if (selectedBrands.includes(brand)) {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        } else {
                          setSelectedBrands([...selectedBrands, brand]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                        selectedBrands.includes(brand)
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lower Receivers List */}
              <div className="flex-1 overflow-y-auto max-h-96">
                <div className="grid gap-3">
                  {filteredLowers.map((lower) => (
                    <button
                      key={lower.id}
                      onClick={() => handleLowerSelection(lower)}
                      className="w-full p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-cyan-600/20 hover:to-blue-600/20 border border-gray-700 hover:border-cyan-500/50 rounded-xl transition-all duration-300 hover:scale-[1.01] text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{lower.name}</h3>
                            <span className="text-cyan-400 font-mono text-sm">{lower.brand}</span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{lower.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-white">{money(lower.price)}</span>
                            <span className="text-xs text-red-400 font-mono">⚠ FFL REQUIRED</span>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Back button */}
              <button
                onClick={() => setStep(2)}
                className="mt-6 px-6 py-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors"
              >
                ← BACK TO RIFLE TYPE
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}