"use client";

import React from "react";
import { User, Lock, ChevronRight, Save, Share, Eye } from "lucide-react";

interface SignInPageProps {
  onContinueAsGuest: () => void;
}

export default function ForgeSignInPage({ onContinueAsGuest }: SignInPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="text-4xl font-bold text-white mb-2">LOADOUT LAB</div>
            <div className="text-cyan-400 font-mono text-sm">FORGE • SIGN IN</div>
          </div>
          <p className="text-gray-400 text-sm">
            Sign in to save your builds and access premium features
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs text-gray-400 font-mono mb-2">USERNAME</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter username"
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-500 placeholder-gray-600 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-mono rounded border border-orange-500/30">
                    COMING SOON
                  </span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs text-gray-400 font-mono mb-2">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="Enter password"
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-500 placeholder-gray-600 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-mono rounded border border-orange-500/30">
                    COMING SOON
                  </span>
                </div>
              </div>
            </div>

            {/* Disabled Sign In Button */}
            <button
              disabled
              className="w-full py-3 bg-gray-700/50 border border-gray-600 text-gray-500 font-mono text-sm rounded-lg cursor-not-allowed"
            >
              SIGN IN
            </button>
          </div>
        </div>

        {/* Account Benefits */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4 text-center">Account Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Save className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Save Builds</div>
                <div className="text-gray-400 text-xs">Keep your configurations for future reference</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">View Presets & Templates</div>
                <div className="text-gray-400 text-xs">Access curated builds from experts</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Share className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Share to Social Media</div>
                <div className="text-gray-400 text-xs">Show off your builds on social platforms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue as Guest Button */}
        <button
          onClick={onContinueAsGuest}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group"
        >
          CONTINUE AS GUEST
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Footer Text */}
        <div className="text-center mt-4">
          <p className="text-gray-500 text-xs">
            No account required • Start building immediately
          </p>
        </div>
      </div>
    </div>
  );
}