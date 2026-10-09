import React, { useState } from 'react';
import { X, Settings, Tv, Volume2, Shield, Monitor, Check } from 'lucide-react';

export function SettingsModal({
  isOpen,
  onClose,
  onShowToast,
}) {
  const [quality, setQuality] = useState('4K');
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [autoplayTrailers, setAutoplayTrailers] = useState(true);
  const [parentalPin, setParentalPin] = useState(false);
  const [subtitleSize, setSubtitleSize] = useState('Medium');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-black border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 sticky top-0 bg-black/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">ADC Streaming Settings</h2>
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

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          {/* Section: Video Streaming Quality */}
          <div>
            <div className="flex items-center gap-2 font-bold text-white mb-3">
              <Tv className="w-4 h-4 text-white" />
              <span>Streaming Video Quality</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: '4K', label: 'Best (4K UHD)', sub: '~6.8 GB/hr' },
                { id: '1080p', label: 'Better (HD)', sub: '~1.4 GB/hr' },
                { id: '720p', label: 'Good (SD)', sub: '~0.6 GB/hr' },
                { id: 'data-saver', label: 'Data Saver', sub: '~0.3 GB/hr' },
              ].map((opt) => {
                const isSelected = quality === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setQuality(opt.id);
                      if (onShowToast) onShowToast(`Streaming quality set to ${opt.label}`);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-800 bg-[#111111] text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Playback Behavior */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <div className="font-bold text-white mb-2">Playback Preferences</div>

            <label className="flex items-center justify-between p-3 bg-[#111111] rounded-xl border border-neutral-800 cursor-pointer">
              <div>
                <div className="text-white font-medium">Autoplay next episode</div>
                <div className="text-xs text-neutral-400">Automatically play next episode when current ends</div>
              </div>
              <input
                type="checkbox"
                checked={autoplayNext}
                onChange={(e) => {
                  setAutoplayNext(e.target.checked);
                  if (onShowToast) onShowToast(`Autoplay next episode: ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                }}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#111111] rounded-xl border border-neutral-800 cursor-pointer">
              <div>
                <div className="text-white font-medium">Autoplay video previews</div>
                <div className="text-xs text-neutral-400">Play animated trailers when hovering over movie tiles</div>
              </div>
              <input
                type="checkbox"
                checked={autoplayTrailers}
                onChange={(e) => {
                  setAutoplayTrailers(e.target.checked);
                  if (onShowToast) onShowToast(`Trailer preview hover: ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                }}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Section: Subtitles Appearance */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2 font-bold text-white mb-3">
              <Volume2 className="w-4 h-4 text-white" />
              <span>Subtitles &amp; Closed Captions</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Text Size:</span>
              {['Small', 'Medium', 'Large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSubtitleSize(size);
                    if (onShowToast) onShowToast(`Subtitle size set to ${size}`);
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                    subtitleSize === size
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-neutral-800 bg-[#111111] text-neutral-300 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Parental Controls */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between p-3 bg-[#111111] rounded-xl border border-neutral-800">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-white" />
                <div>
                  <div className="text-white font-medium">Parental Controls (5-digit PIN)</div>
                  <div className="text-xs text-neutral-400">Require PIN for 18+ maturity rated content and purchases</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={parentalPin}
                onChange={(e) => {
                  setParentalPin(e.target.checked);
                  if (onShowToast) onShowToast(`Parental PIN Protection: ${e.target.checked ? 'Active (PIN: 8842)' : 'Disabled'}`);
                }}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Section: Registered Devices */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2 font-bold text-white mb-3">
              <Monitor className="w-4 h-4 text-white" />
              <span>Your Registered Devices</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#111111] rounded-lg border border-neutral-800">
                <div>
                  <div className="font-semibold text-white">Living Room Apple TV 4K</div>
                  <div className="text-neutral-400">Registered Sept 2024 · Active Now</div>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">This Device</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#111111] rounded-lg border border-neutral-800">
                <div>
                  <div className="font-semibold text-white">iPhone 16 Pro</div>
                  <div className="text-neutral-400">Last used 2 hours ago</div>
                </div>
                <button
                  type="button"
                  onClick={() => onShowToast && onShowToast('Deregistered device: iPhone 16 Pro')}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  Deregister
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0a0a0a] border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (onShowToast) onShowToast('Settings saved successfully');
              onClose();
            }}
            className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
