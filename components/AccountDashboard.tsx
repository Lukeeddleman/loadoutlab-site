"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Package, 
  Target, 
  BarChart3, 
  Calendar, 
  Edit3, 
  Trash2, 
  Eye, 
  Share2, 
  Plus,
  Crown,
  TrendingUp,
  Clock,
  ShoppingCart,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBuilds, deleteBuild } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Build {
  id: string;
  name: string;
  description: string | null;
  configuration: any;
  is_public: boolean;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export default function AccountDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [builds, setBuilds] = useState<Build[]>([]);
  const [buildsLoading, setBuildsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBuilds: 0,
    publicBuilds: 0,
    totalValue: 0,
    recentActivity: 0
  });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadUserBuilds();
    }
  }, [user]);

  const loadUserBuilds = async () => {
    setBuildsLoading(true);
    try {
      const { data, error } = await getUserBuilds();
      if (!error && data) {
        setBuilds(data);
        calculateStats(data);
      }
    } catch (err) {
      console.error("Error loading builds:", err);
    } finally {
      setBuildsLoading(false);
    }
  };

  const calculateStats = (buildData: Build[]) => {
    const totalBuilds = buildData.length;
    const publicBuilds = buildData.filter(build => build.is_public).length;
    const totalValue = buildData.reduce((sum, build) => {
      return sum + (build.configuration?.total || 0);
    }, 0);
    const recentActivity = buildData.filter(build => {
      const buildDate = new Date(build.updated_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return buildDate > weekAgo;
    }).length;

    setStats({ totalBuilds, publicBuilds, totalValue, recentActivity });
  };

  const handleDeleteBuild = async (buildId: string) => {
    if (window.confirm("Are you sure you want to delete this build?")) {
      try {
        const { error } = await deleteBuild(buildId);
        if (!error) {
          setBuilds(prev => prev.filter(build => build.id !== buildId));
          calculateStats(builds.filter(build => build.id !== buildId));
        }
      } catch (err) {
        console.error("Error deleting build:", err);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-cyan-400 font-mono">Loading account...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
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
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-cyan-400" />
                <h1 className="text-2xl font-bold text-white">Account Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Welcome back</div>
                <div className="text-lg font-bold text-white">{user.user_metadata?.full_name || user.email}</div>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-800/50 rounded-lg p-1">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "builds", label: "My Builds", icon: Target },
            { id: "orders", label: "My Orders", icon: Package },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-colors ${
                activeTab === tab.id 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalBuilds}</div>
                    <div className="text-sm text-gray-400">Total Builds</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.publicBuilds}</div>
                    <div className="text-sm text-gray-400">Public Builds</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalValue)}</div>
                    <div className="text-sm text-gray-400">Total Build Value</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.recentActivity}</div>
                    <div className="text-sm text-gray-400">Recent Activity</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Builds */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Builds</h3>
                <a 
                  href="/forge"
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Build
                </a>
              </div>
              
              {buildsLoading ? (
                <div className="text-center py-8 text-gray-400">Loading builds...</div>
              ) : builds.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <div className="text-gray-400 mb-2">No builds yet</div>
                  <div className="text-sm text-gray-500 mb-4">Create your first AR15 build to get started!</div>
                  <a 
                    href="/forge"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Build
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {builds.slice(0, 5).map(build => (
                    <div key={build.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="text-white font-medium">{build.name}</div>
                          {build.is_public && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-mono">PUBLIC</span>
                          )}
                        </div>
                        {build.description && (
                          <div className="text-sm text-gray-400 mt-1">{build.description}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          Created {formatDate(build.created_at)} • Value: {formatCurrency(build.configuration?.total || 0)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Builds Tab */}
        {activeTab === "builds" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My Builds</h2>
              <a 
                href="/forge"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Build
              </a>
            </div>

            {buildsLoading ? (
              <div className="text-center py-12 text-gray-400">Loading your builds...</div>
            ) : builds.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-24 h-24 text-gray-600 mx-auto mb-6" />
                <div className="text-xl text-gray-400 mb-2">No builds found</div>
                <div className="text-gray-500 mb-6">Start building your perfect AR15 configuration!</div>
                <a 
                  href="/forge"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Build
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {builds.map(build => (
                  <div key={build.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">{build.name}</h3>
                          {build.is_public && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-mono">PUBLIC</span>
                          )}
                        </div>
                        {build.description && (
                          <p className="text-gray-400 text-sm mb-3">{build.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBuild(build.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Build Value</span>
                        <span className="text-green-400 font-mono">{formatCurrency(build.configuration?.total || 0)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Created</span>
                        <span className="text-gray-300">{formatDate(build.created_at)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-gray-300">{formatDate(build.updated_at)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm">
                        Load Build
                      </button>
                      <button className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors text-sm">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My Orders</h2>
              <button 
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 cursor-not-allowed text-gray-400 rounded-lg font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                Coming Soon
              </button>
            </div>

            <div className="text-center py-12">
              <Package className="w-24 h-24 text-gray-600 mx-auto mb-6" />
              <div className="text-xl text-gray-400 mb-2">Order Tracking Coming Soon</div>
              <div className="text-gray-500 mb-6">We're working on integrating with top retailers to bring you seamless order tracking and parts purchasing directly from your builds.</div>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Partner Integration</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Price Tracking</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Order Management</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user.user_metadata?.full_name || ""}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                    <div className="text-xs text-gray-500 mt-1">Email cannot be changed</div>
                  </div>

                  <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Public Profile</div>
                      <div className="text-sm text-gray-400">Allow others to see your profile and public builds</div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-600 text-cyan-500" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Build Analytics</div>
                      <div className="text-sm text-gray-400">Allow us to analyze your builds to improve recommendations</div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-600 text-cyan-500" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-400">Receive updates about new features and builds</div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-600 text-cyan-500" defaultChecked />
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Delete Account</div>
                    <div className="text-sm text-gray-400">Permanently delete your account and all associated data</div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}