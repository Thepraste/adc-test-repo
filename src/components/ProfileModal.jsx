import React, { useState } from 'react';
import { X, User, Check, Plus, Sparkles, LogOut, ChevronRight } from 'lucide-react';

export function ProfileModal({
  isOpen,
  onClose,
  onShowToast,
  onSelectTab,
}) {
  const [activeProfile, setActiveProfile] = useState('Praise Oti');

  const profiles = [
    { id: '1', name: 'Praise Oti', isPrimary: true, isKids: false, color: 'bg-red-600' },
    { id: '2', name: 'Kids Zone', isPrimary: false, isKids: true, color: 'bg-emerald-600' },
    { id: '3', name: 'Family', isPrimary: false, isKids: false, color: 'bg-amber-600' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-black border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">ADC Account</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Active ADC Membership banner */}
          <div className="bg-[#111111] border border-neutral-750 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ADC VIP MEMBER</span>
              </div>
              <div className="text-sm font-semibold text-white">praiseoti3@gmail.com</div>
              <div className="text-[11px] text-neutral-400">4K Ultra HD & HDR Streaming Active</div>
            </div>
            <span className="text-xs bg-red-600 text-white px-2.5 py-1 rounded-full font-bold">
              Active
            </span>
          </div>

          {/* Profile Switcher */}
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3">
              Who is watching?
            </label>
            <div className="grid grid-cols-4 gap-3 text-center">
              {profiles.map((p) => {
                const isCurrent = activeProfile === p.name;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActiveProfile(p.name);
                      if (onShowToast) onShowToast(`Switched profile to ${p.name}`);
                    }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-lg transition-all relative ${p.color} ${
                        isCurrent
                          ? 'ring-4 ring-white shadow-lg scale-105'
                          : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                      }`}
                    >
                      {p.name.charAt(0)}
                      {isCurrent && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white text-black rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 truncate w-full ${
                        isCurrent ? 'font-bold text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                      }`}
                    >
                      {p.name}
                    </span>
                  </button>
                );
              })}

              {/* Add Profile */}
              <button
                type="button"
                onClick={() => onShowToast && onShowToast('Add profile: ADC allows up to 6 profiles')}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 flex items-center justify-center text-neutral-400 group-hover:text-white transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs mt-2 text-neutral-400 group-hover:text-white">New</span>
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2 pt-2 border-t border-neutral-800 text-sm">
            <button
              type="button"
              onClick={() => {
                if (onShowToast) onShowToast('Account & Settings: Streaming preferences updated');
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-neutral-850 text-neutral-300 hover:text-white transition-colors cursor-pointer text-left"
            >
              <span>Manage ADC Subscription</span>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#0a0a0a] border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>African Diaspora Channels (ADC)</span>
          <button
            type="button"
            onClick={() => {
              if (onShowToast) onShowToast('Signed out of ADC session');
              onClose();
            }}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
