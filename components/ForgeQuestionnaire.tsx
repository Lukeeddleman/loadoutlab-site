"use client";

import React, { useState } from "react";
import { Target, ChevronRight } from "lucide-react";
import { FirearmType, RifleType, PistolType, ShotgunType, FirearmConfiguration } from "./ForgeContext";

interface QuestionnaireProps {
  onComplete: (configuration: FirearmConfiguration) => void;
}

export default function ForgeQuestionnaire({ onComplete }: QuestionnaireProps) {
  const [step, setStep] = useState(1);
  const [firearmType, setFirearmType] = useState<FirearmType | null>(null);
  const [rifleType, setRifleType] = useState<RifleType | null>(null);

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
      onComplete({ firearmType: "rifle", subType: type });
    }
    // For ar10/bolt-action, we could show a coming soon message or complete
  };

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