import React, { useEffect } from 'react';
import { X, ShieldCheck, Globe, Calendar, Mail } from 'lucide-react';

export function PrivacyPolicyModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-3xl max-h-[88vh] bg-[#121212] text-neutral-200 rounded-2xl shadow-2xl border border-neutral-800 z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Privacy Policy</h2>
              <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3 text-neutral-500" />
                <span>Last Updated: September 22, 2026</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-neutral-700 min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="Close Privacy Policy"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-300 no-scrollbar">
          <div className="space-y-3 bg-neutral-900/50 p-4 sm:p-5 rounded-xl border border-neutral-800">
            <p>
              Welcome to <strong>African Diaspora Channels (ADC)</strong> (“ADC”, “we”, “our”, or “us”). We respect your privacy and are committed to protecting the personal information of visitors and users of our website.
            </p>
            <p>
              This Privacy Policy explains how we may collect, use, store, and protect information when you visit or interact with our website:
            </p>
            <p className="font-semibold text-red-400">
              <a
                href="https://africandiasporachannels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 inline-flex"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>https://africandiasporachannels.com</span>
              </a>
            </p>
            <p className="text-neutral-400 text-xs">
              By using our website, you acknowledge the practices described in this Privacy Policy.
            </p>
          </div>

          {/* 1. Information We May Collect */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">1</span>
              <span>Information We May Collect</span>
            </h3>
            <p className="text-neutral-300">
              Depending on how you interact with our website, we may collect information such as:
            </p>
            
            <div className="pl-4 space-y-2 border-l-2 border-neutral-800">
              <h4 className="font-semibold text-neutral-200">Information You Provide</h4>
              <p>If you voluntarily submit information through a form, contact feature, subscription feature, or other communication channel, we may collect:</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-2">
                <li>Your name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Message or other information you choose to provide</li>
                <li>Any other information you voluntarily submit</li>
              </ul>
              <p className="text-xs text-neutral-400 italic">
                You are not required to provide personal information simply to browse publicly available portions of the website.
              </p>
            </div>

            <div className="pl-4 space-y-2 border-l-2 border-neutral-800 pt-2">
              <h4 className="font-semibold text-neutral-200">Automatically Collected Information</h4>
              <p>When you visit the website, certain technical information may be automatically collected by our hosting provider, analytics services, or other technologies used by the website. This may include:</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device type</li>
                <li>Operating system</li>
                <li>Pages visited</li>
                <li>Date and time of visits</li>
                <li>Referring website</li>
                <li>General usage and technical information</li>
              </ul>
            </div>
          </section>

          {/* 2. How We Use Information */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">2</span>
              <span>How We Use Information</span>
            </h3>
            <p>We may use information collected through the website to:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-4">
              <li>Provide and maintain our website and services</li>
              <li>Respond to enquiries and messages</li>
              <li>Communicate with users when necessary</li>
              <li>Improve website functionality and user experience</li>
              <li>Understand how visitors use the website</li>
              <li>Detect, prevent, and address security issues or abuse</li>
              <li>Comply with applicable legal and regulatory requirements</li>
            </ul>
          </section>

          {/* 3. Cookies and Similar Technologies */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">3</span>
              <span>Cookies and Similar Technologies</span>
            </h3>
            <p>
              Our website may use cookies or similar technologies to improve functionality, remember preferences, understand website usage, or support security.
            </p>
            <p className="text-neutral-400">
              You may be able to control or disable cookies through your browser settings. Disabling certain cookies may affect some website functionality.
            </p>
          </section>

          {/* 4. Third-Party Services */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">4</span>
              <span>Third-Party Services</span>
            </h3>
            <p>Our website may use third-party services for purposes such as:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-4">
              <li>Website hosting</li>
              <li>Analytics</li>
              <li>Video or media delivery</li>
              <li>Forms and communications</li>
              <li>Security</li>
              <li>Embedded content</li>
              <li>Other website functionality</li>
            </ul>
            <p className="text-neutral-400 text-xs">
              These third parties may process information in accordance with their own privacy policies.
            </p>
          </section>

          {/* 5. Embedded and External Content */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">5</span>
              <span>Embedded and External Content</span>
            </h3>
            <p>
              The website may contain links to or embedded content from third-party websites and platforms.
            </p>
            <p className="text-neutral-400">
              When you follow an external link or interact with embedded content, you may be subject to the privacy practices of that third party. ADC is not responsible for the privacy practices, security, or content of third-party websites.
            </p>
          </section>

          {/* 6. How We Protect Your Information */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">6</span>
              <span>How We Protect Your Information</span>
            </h3>
            <p>We take reasonable technical and organisational measures to protect personal information against:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-4">
              <li>Unauthorised access</li>
              <li>Unauthorised disclosure</li>
              <li>Loss</li>
              <li>Misuse</li>
              <li>Alteration</li>
              <li>Destruction</li>
            </ul>
            <p className="text-neutral-400 text-xs italic">
              However, no internet transmission or electronic storage system can be guaranteed to be completely secure.
            </p>
          </section>

          {/* 7. How Long We Keep Information */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">7</span>
              <span>How Long We Keep Information</span>
            </h3>
            <p>
              We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, to provide our services, resolve disputes, maintain records, comply with legal obligations, or protect our legitimate interests.
            </p>
            <p className="text-neutral-400">
              When information is no longer required, we may securely delete or anonymise it.
            </p>
          </section>

          {/* 8. Sharing of Personal Information */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">8</span>
              <span>Sharing of Personal Information</span>
            </h3>
            <p className="font-semibold text-white">We do not sell or rent your personal information.</p>
            <p className="text-neutral-400">
              We may share information with trusted service providers where reasonably necessary to operate, maintain, secure, or improve the website. We may also disclose information where required by law, legal process, regulatory authorities, or where necessary to protect the rights, safety, and security of ADC, our users, or others.
            </p>
          </section>

          {/* 9. Your Privacy Rights */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">9</span>
              <span>Your Privacy Rights</span>
            </h3>
            <p>Depending on applicable law, you may have rights regarding your personal information, including the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-4">
              <li>Request access to personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of personal information where applicable</li>
              <li>Object to or request restriction of certain processing</li>
              <li>Withdraw consent where processing is based on consent</li>
              <li>Request information about how your personal information is processed</li>
              <li>Lodge a complaint concerning the processing of your personal information</li>
            </ul>
          </section>

          {/* 10. Children’s Privacy */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">10</span>
              <span>Children’s Privacy</span>
            </h3>
            <p>
              Our website is not intended to knowingly collect personal information from children without appropriate authorisation or a lawful basis.
            </p>
            <p className="text-neutral-400">
              If you believe that a child has provided personal information to us inappropriately, please contact us so that we can review and take appropriate action.
            </p>
          </section>

          {/* 11. International Data Transfers */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">11</span>
              <span>International Data Transfers</span>
            </h3>
            <p>
              Some of our service providers may process or store information outside Nigeria or outside the country where you are located.
            </p>
            <p className="text-neutral-400">
              Where personal information is transferred internationally, we will take reasonable steps to ensure that the transfer and processing are carried out in accordance with applicable data-protection requirements.
            </p>
          </section>

          {/* 12. Changes to This Privacy Policy */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">12</span>
              <span>Changes to This Privacy Policy</span>
            </h3>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our website, services, technology, legal requirements, or privacy practices.
            </p>
            <p className="text-neutral-400">
              When we make changes, we will update the “Last Updated” date at the top of this page. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          {/* 13. Contact Us */}
          <section className="space-y-2 bg-neutral-900/60 p-4 sm:p-5 rounded-xl border border-neutral-800">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600/50 text-red-400 text-xs flex items-center justify-center font-bold">13</span>
              <span>Contact Us</span>
            </h3>
            <p>
              If you have questions, concerns, requests, or complaints regarding this Privacy Policy or the handling of your personal information, please contact African Diaspora Channels through the contact information provided on our website.
            </p>
            <p className="text-neutral-300 font-medium pt-1">
              Website:{' '}
              <a
                href="https://africandiasporachannels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline inline-flex items-center gap-1"
              >
                https://africandiasporachannels.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/90 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
