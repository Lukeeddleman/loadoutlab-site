"use client";

import React, { useState } from "react";
import { User, Lock, ChevronRight, Save, Share, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SignInPageProps {
  onContinueAsGuest: () => void;
}

export default function ForgeSignInPage({ onContinueAsGuest }: SignInPageProps) {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, { full_name: fullName });
        if (error) {
          setError(error.message);
        } else {
          // Success - user will be automatically signed in
          onContinueAsGuest(); // This will now continue as authenticated user
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          // Success - continue to forge
          onContinueAsGuest(); // This will now continue as authenticated user
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
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
        <form onSubmit={handleSubmit} className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 mb-6">
          {/* Toggle Sign In / Sign Up */}
          <div className="flex mb-6 bg-gray-800/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-sm font-mono rounded-md transition-colors ${
                !isSignUp 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-sm font-mono rounded-md transition-colors ${
                isSignUp 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              SIGN UP
            </button>
          </div>

          <div className="space-y-4">
            {/* Full Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs text-gray-400 font-mono mb-2">FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs text-gray-400 font-mono mb-2">EMAIL</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs text-gray-400 font-mono mb-2">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-mono text-sm rounded-lg transition-all duration-300"
            >
              {loading ? "PROCESSING..." : isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
            </button>
          </div>
        </form>

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