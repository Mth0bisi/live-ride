'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  viewerPackage?: string | null;
  subscriptionStatus?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();

  // User details state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Load profile details
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.status === 401) {
          router.push('/login?return=/profile');
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to load profile.');
          setLoading(false);
          return;
        }

        setProfile(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile', err);
        setError('Network error. Failed to load profile.');
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  // Handle Edit Profile submission
  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setFormError('Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setProfileSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? 'Failed to update profile.');
        setProfileSaving(false);
        return;
      }

      setProfile(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setSuccessMsg('Profile details updated successfully.');
      setProfileSaving(false);

      // Also update localStorage name
      localStorage.setItem('lr_name', data.user.name);

      // Refresh page context/cookies
      router.refresh();
      // Hide success message after 5 seconds
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch {
      setFormError('Network error. Please try again.');
      setProfileSaving(false);
    }
  }

  // Handle Password Change submission
  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPwdError('');
    setPwdSuccessMsg('');

    if (!currentPassword) {
      setPwdError('Current password is required.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPwdError(data.error ?? 'Failed to change password.');
        setPasswordSaving(false);
        return;
      }

      setPwdSuccessMsg('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSaving(false);
      
      // Hide success message after 5 seconds
      setTimeout(() => setPwdSuccessMsg(''), 5000);
    } catch {
      setPwdError('Network error. Please try again.');
      setPasswordSaving(false);
    }
  }

  const getRoleLabel = (roleStr: string) => {
    switch (roleStr) {
      case 'ADMIN': return 'Administrator';
      case 'ORGANISER': return 'Organiser';
      case 'GATE_MARSHAL': return 'Gate Marshal';
      case 'TIMER': return 'Timer';
      case 'JUDGE': return 'Judge / Official';
      case 'VIEWER': return 'Viewer';
      default: return roleStr;
    }
  };

  const getPackageLabel = (pkgStr: string) => {
    switch (pkgStr) {
      case 'ONE_DAY': return 'One Day Pass';
      case 'STANDARD': return 'Standard Monthly';
      case 'PREMIUM': return 'Premium Monthly (2 screens)';
      case 'FAMILY': return 'Family Monthly (4 screens)';
      default: return pkgStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading your profile details...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-red-50/50 border border-red-200/50 rounded-2xl max-w-md mx-auto text-center mt-12">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-lg font-bold text-slate-900">Unable to load profile</h2>
        <p className="text-sm text-slate-600 mt-2">{error || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
          User Account Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Manage your personal details, subscription details, and login credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Summary Card */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-600/10 pointer-events-none" />
            <div className="absolute right-12 top-6 w-12 h-12 rounded-full bg-indigo-500/10 pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-md uppercase">
                  {profile.name ? profile.name.substring(0, 2) : 'LR'}
                </div>
                <div>
                  <h2 className="font-extrabold text-lg truncate max-w-[170px]">{profile.name}</h2>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-[170px]">{profile.email}</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">User Role</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                    {getRoleLabel(profile.role)}
                  </span>
                </div>

                {profile.role === 'VIEWER' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Package</span>
                      <span className="text-slate-200 font-bold">
                        {profile.viewerPackage ? getPackageLabel(profile.viewerPackage) : 'None'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Status</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                        profile.subscriptionStatus === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {profile.subscriptionStatus || 'INACTIVE'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Personal Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-950">Personal Details</h2>
              <p className="text-xs text-slate-500 font-medium">Update your account name and email address.</p>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium">
                  {formError}
                </div>
              )}
              {successMsg && (
                <div className="px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-medium">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="profile-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="profile-email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-colors duration-150"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Password Management */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-950">Security & Password</h2>
              <p className="text-xs text-slate-500 font-medium">Change your current password to keep your account secure.</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              {pwdError && (
                <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium">
                  {pwdError}
                </div>
              )}
              {pwdSuccessMsg && (
                <div className="px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-medium">
                  {pwdSuccessMsg}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="current-password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="new-password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                      placeholder="At least 8 characters"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirm-password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-colors duration-150"
                >
                  {passwordSaving ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
