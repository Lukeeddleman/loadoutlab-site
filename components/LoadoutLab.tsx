"use client"
import React, { useState, useEffect } from 'react';
import { Wrench, Target, Shield, ChevronRight, Crosshair, Settings, DollarSign, Zap, Activity, Cpu } from 'lucide-react';
import AR15ForgeBuilder from "./ar15_forge_builder";


const LoadoutLab = () => {
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);
  const [showAgePrompt, setShowAgePrompt] = useState<boolean>(false);
  const [isRejected, setIsRejected] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already been verified in this session
    const verified = sessionStorage.getItem('ageVerified');
    if (verified === 'true') {
      setAgeVerified(true);
    } else if (verified === 'false') {
      setIsRejected(true);
    } else {
      // Show age prompt after a brief delay
      const timer = setTimeout(() => {
        setShowAgePrompt(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAgeVerification = (isOfAge: boolean) => {

    if (isOfAge) {
      setAgeVerified(true);
      setShowAgePrompt(false);
      sessionStorage.setItem('ageVerified', 'true');
    } else {
      setIsRejected(true);
      setShowAgePrompt(false);
      sessionStorage.setItem('ageVerified', 'false');
    }
  };

  // Age rejection screen
  if (isRejected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
        
        <div className="text-center max-w-md relative z-10">
          <div className="mb-8">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">ACCESS DENIED</h1>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-4" />
            <p className="text-gray-300 leading-relaxed">
              LOADOUTLAB systems are restricted to authorized personnel aged 18 and older. 
              This facility contains classified weapons development content.
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm font-mono">
              SECURITY PROTOCOL ACTIVATED<br />
              CLEARANCE LEVEL: INSUFFICIENT
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main site content
  if (ageVerified) {
    return <MainSite />;
  }

  // Initial loading screen with age prompt
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Advanced grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '20px 20px, 20px 20px, 40px 40px'
        }} />
      </div>

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-500/50" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-500/50" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyan-500/50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-500/50" />

      {/* Logo */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Target className="w-8 h-8 text-cyan-400" />
            <div className="absolute inset-0 animate-pulse">
              <Target className="w-8 h-8 text-cyan-400/50" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-wide">LOADOUT</span>
            <span className="text-cyan-400 font-light">LAB</span>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute top-8 right-8 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm font-mono">SYSTEMS ONLINE</span>
        </div>
      </div>

      {/* Age Verification Modal */}
      <div className={`transition-all duration-1000 ${showAgePrompt ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 max-w-md shadow-2xl relative">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm" />
          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="relative mb-4">
                <Shield className="w-12 h-12 text-cyan-400 mx-auto" />
                <div className="absolute inset-0 animate-pulse">
                  <Shield className="w-12 h-12 text-cyan-400/30 mx-auto" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1 tracking-wide">SECURITY CLEARANCE</h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                The LOADOUT LAB contains classified weapons systems and tactical equipment specifications. 
                minimum age of 18+ required for facility access.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAgeVerification(true)}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-cyan-500/30"
              >
                <span className="tracking-wide">I AM 18+</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleAgeVerification(false)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 border border-gray-600"
              >
                I AM UNDER 18
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300 text-center font-mono">
                By proceeding, you confirm authorization to access restricted military-grade content
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main website content after age verification
const MainSite = () => {
  const [currentSection, setCurrentSection] = useState('home');

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }} />

      {/* Navigation Header */}
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-4 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Target className="w-8 h-8 text-cyan-400" />
              <div className="absolute inset-0 animate-pulse">
                <Target className="w-8 h-8 text-cyan-400/30" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-wide">LOADOUT</span>
              <span className="text-cyan-400 font-light">LAB</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentSection('home')}
              className={`font-medium transition-colors tracking-wide ${currentSection === 'home' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              HOME
            </button>
            <button 
              onClick={() => setCurrentSection('builder')}
              className={`font-medium transition-colors tracking-wide ${currentSection === 'builder' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              WEAPON FORGE
            </button>
            <button 
              onClick={() => setCurrentSection('deals')}
              className={`font-medium transition-colors tracking-wide ${currentSection === 'deals' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              SUPPLY CHAIN
            </button>
            <button 
              onClick={() => setCurrentSection('about')}
              className={`font-medium transition-colors tracking-wide ${currentSection === 'about' ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              INTEL
            </button>
          </div>
          
          <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-2 rounded-lg font-medium transition-all duration-200 border border-cyan-500/30 tracking-wide">
            INITIALIZE BUILD
          </button>
        </div>
      </nav>

      {/* Main Content */}
      {currentSection === 'home' && <HomePage setCurrentSection={setCurrentSection} />}
      {currentSection === 'builder' && <BuilderPage />}
      {currentSection === 'deals' && <DealsPage />}
      {currentSection === 'about' && <AboutPage />}
    </div>
  );
};

// Home Page Component
const HomePage = ({ setCurrentSection }: { setCurrentSection: (s: string) => void }) => {

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black px-6 py-20 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 text-cyan-400 text-sm font-mono mb-4">
                <Activity className="w-4 h-4" />
                <span>WEAPONS DEVELOPMENT FACILITY</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">ENGINEER YOUR</span><br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">PERFECT WEAPON</span>
            </h1>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-6" />
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              Welcome to the Loadout Lab. Design, visualize, and configure the next perfectly tailored addition to your collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setCurrentSection('builder')}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-cyan-500/30"
              >
                <Zap className="w-5 h-5" />
                <span className="tracking-wide">ENTER THE FORGE</span>
              </button>
              <button 
                onClick={() => setCurrentSection('deals')}
                className="bg-gray-800/80 hover:bg-gray-700/80 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-600"
              >
                <DollarSign className="w-5 h-5" />
                <span className="tracking-wide">PRICE COMPONENTS</span>
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center relative group hover:border-cyan-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <Cpu className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 tracking-wide">QUANTUM FORGE</h3>
                <p className="text-gray-400 font-light">
                  Real-time molecular visualization and component compatibility analysis using advanced quantum computing protocols.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center relative group hover:border-cyan-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <Activity className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 tracking-wide">LIVE INTEL</h3>
                <p className="text-gray-400 font-light">
                  Real-time market intelligence from trusted industry experts. Automated price tracking and procurement optimization.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center relative group hover:border-cyan-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 tracking-wide">TACTICAL ANALYSIS</h3>
                <p className="text-gray-400 font-light">
                  Advanced ballistics simulation and performance optimization algorithms ensure maximum operational effectiveness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900/80 backdrop-blur-sm px-6 py-16 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2 tracking-wide">READY FOR YOUR NEXT BUILD?</h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-6" />
          <p className="text-gray-300 text-lg mb-8 font-light">
            Join thousands of other gun-owners in designing the perfect tool for the job.
          </p>
          <button 
            onClick={() => setCurrentSection('builder')}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 border border-cyan-500/30 tracking-wide"
          >
            ENTER THE FORGE
          </button>
        </div>
      </div>
    </div>
  );
};

// Builder Page
const BuilderPage = () => {
  return (
    <div className="px-6 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <AR15ForgeBuilder />
      </div>
    </div>
  );
};



// Deals Page
const DealsPage = () => {
  return (
    <div className="px-6 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-wide">SUPPLY CHAIN INTEL</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-4" />
          <p className="text-gray-400 font-mono">GLOBAL PROCUREMENT NETWORK</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-16 text-center">
          <div className="relative mb-6">
            <DollarSign className="w-16 h-16 text-cyan-400 mx-auto" />
            <div className="absolute inset-0 animate-pulse">
              <DollarSign className="w-16 h-16 text-cyan-400/30 mx-auto" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-300 mb-4 tracking-wide">INTEL NETWORK DEPLOYING</h3>
          <p className="text-gray-500 font-light max-w-md mx-auto">
            Real-time market intelligence from trusted indsutry experts. 
            Automated procurement optimization and supply chain analysis protocols deploying.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2 text-cyan-400 text-sm font-mono">
            <Activity className="w-4 h-4" />
            <span>NETWORK STATUS: ESTABLISHING CONNECTIONS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Page
const AboutPage = () => {
  return (
    <div className="px-6 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-wide">FACILITY INTEL</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-4" />
          <p className="text-gray-400 font-mono">CLASSIFICATION: RESTRICTED</p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8">
          <div className="space-y-6 text-gray-300 font-light leading-relaxed">
            <p>
              <span className="text-cyan-400 font-mono">LOADOUTLAB</span> represents the next evolution 
              in tactical weapons engineering. Our advanced computing systems enable 
              tailored design and optimization of AR-15 platform configurations.
            </p>
            <p>
              Utilizing classified defense protocols and real-time supply chain intelligence, 
              we provide military-grade engineering tools for the modern tactical operator. 
              Every component is analyzed through advanced ballistics simulation and 
              performance optimization algorithms.
            </p>
            <div className="border-l-2 border-cyan-500/50 pl-4 bg-cyan-500/5 py-3">
              <p className="text-cyan-300 font-mono text-sm">
                CLEARANCE LEVEL: AUTHORIZED PERSONNEL ONLY<br />
                FACILITY STATUS: FULLY OPERATIONAL<br />
                SECURITY PROTOCOL: ACTIVE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadoutLab;