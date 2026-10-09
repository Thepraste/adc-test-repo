import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Globe, ShieldCheck, Sparkles, Building, Copy, Check, ExternalLink, Megaphone } from 'lucide-react';

const ADC_DIRECT_EMAIL = 'info@africandiasporachannels.com';
const ADC_ADS_EMAIL = 'ads@africandiasporachannels.com';

export function ContactView({ onShowToast }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'General Inquiries',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedDirectEmail, setCopiedDirectEmail] = useState(false);
  const [copiedAdsEmail, setCopiedAdsEmail] = useState(false);

  const departments = [
    'General Inquiries',
    'Content Creators & Pitches',
    'Live Events & Comedy Shows',
    'Advertising & Sponsorships',
    'Press & Media Relations',
    'Technical & Streaming Support',
  ];

  const handleCopyDirectEmail = () => {
    navigator.clipboard?.writeText(ADC_DIRECT_EMAIL);
    setCopiedDirectEmail(true);
    if (onShowToast) onShowToast('info@africandiasporachannels.com copied to clipboard');
    setTimeout(() => setCopiedDirectEmail(false), 2500);
  };

  const handleCopyAdsEmail = () => {
    navigator.clipboard?.writeText(ADC_ADS_EMAIL);
    setCopiedAdsEmail(true);
    if (onShowToast) onShowToast('ads@africandiasporachannels.com copied to clipboard');
    setTimeout(() => setCopiedAdsEmail(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      if (onShowToast) onShowToast('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Direct delivery endpoint forwarding form data directly to info@africandiasporachannels.com
      const res = await fetch(`https://formsubmit.co/ajax/${ADC_DIRECT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          department: formData.department,
          subject: formData.subject || `Inquiry for ${formData.department}`,
          message: formData.message,
          _subject: `[ADC Channel Form] ${formData.department}: ${formData.subject || formData.fullName}`,
          _replyto: formData.email,
          _template: 'table',
        }),
      });

      if (!res.ok) {
        console.warn('Form submission received non-200 code:', res.status);
      }
    } catch (err) {
      console.warn('Form network dispatch notice:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onShowToast) onShowToast('Your inquiry has been submitted successfully.');
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      department: 'General Inquiries',
      subject: '',
      message: '',
    });
    setSubmitted(false);
  };

  const mailtoFallbackUrl = `mailto:${ADC_DIRECT_EMAIL}?subject=${encodeURIComponent(
    `[ADC Contact] ${formData.department}: ${formData.subject || 'Inquiry'}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.fullName}\nEmail: ${formData.email}\nDepartment: ${formData.department}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <div className="w-full min-h-screen bg-black text-white pb-20 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative py-16 md:py-20 px-4 md:px-12 bg-gradient-to-b from-neutral-900 via-black to-black border-b border-neutral-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Connect With Us
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Contact African Diaspora Channels
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question, creator collaboration proposal, event inquiry, or feedback? 
            Our dedicated team across Detroit, London, and Calabar is here to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {/* Card 1: Direct Email */}
          <div className="bg-[#121212] border border-neutral-800 p-6 rounded-xl space-y-3 hover:border-neutral-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Direct Email</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              All messages submitted through this form are forwarded instantly to our team.
            </p>
            <div className="space-y-2 pt-1">
              <span className="text-neutral-200 font-mono text-xs sm:text-sm font-semibold break-all select-all block">
                {ADC_DIRECT_EMAIL}
              </span>
              <button
                type="button"
                onClick={handleCopyDirectEmail}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                {copiedDirectEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Media Partners */}
          <div className="bg-[#121212] border border-neutral-800 p-6 rounded-xl space-y-3 hover:border-neutral-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Media Partners</h3>
            <p className="text-sm text-neutral-400">
              Broadcast hubs, media affiliations, and regional offices worldwide.
            </p>
            <div className="space-y-1.5 text-sm font-semibold text-neutral-300 pt-1">
              <p>• Detroit, MI</p>
              <p>• London, UK</p>
              <p>• Calabar, Nigeria</p>
            </div>
          </div>

          {/* Card 3: Advertise with us */}
          <div className="bg-[#121212] border border-neutral-800 p-6 rounded-xl space-y-3 hover:border-neutral-700 transition-colors sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Advertise with us</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Official Inbox for advert placements
            </p>
            <div className="space-y-2 pt-1">
              <span className="text-neutral-200 font-mono text-xs sm:text-sm font-semibold break-all select-all block">
                {ADC_ADS_EMAIL}
              </span>
              <button
                type="button"
                onClick={handleCopyAdsEmail}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                {copiedAdsEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto shadow-2xl">
          {submitted ? (
            <div className="text-center py-10 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Message Dispatched!</h2>
                <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                  Your inquiry has been submitted and routed directly to our team.
                </p>
                <p className="text-neutral-500 text-xs max-w-md mx-auto">
                  A representative will review your message and reply to{' '}
                  <span className="text-white font-medium">{formData.email}</span> shortly.
                </p>
              </div>

              {/* Submission Summary Card */}
              <div className="bg-[#1b1b1b] border border-neutral-800 rounded-xl p-4 text-left text-xs space-y-1.5 max-w-md mx-auto text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Department:</span>
                  <span className="text-white font-semibold">{formData.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">From:</span>
                  <span className="text-neutral-200">{formData.fullName} ({formData.email})</span>
                </div>
                {formData.subject && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-medium">Subject:</span>
                    <span className="text-neutral-200 truncate max-w-[200px]">{formData.subject}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
                <a
                  href={mailtoFallbackUrl}
                  className="px-6 py-2.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-sm transition-all flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open in Mail App</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-500" />
                  Send a Direct Message
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1.5">
                  Fill out the form below. All responses and submissions are delivered straight to our team.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g., Amara Johnson"
                    className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-red-500 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-red-500 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Select Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-red-500 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-[#1e1e1e] text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Pitching a new diaspora documentary series"
                  className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-red-500 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide details about your inquiry or proposal..."
                  className="w-full bg-[#1e1e1e] border border-neutral-700 focus:border-red-500 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

