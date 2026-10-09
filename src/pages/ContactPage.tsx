import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Check, Sparkles, User, MapPin } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sssk46981@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      feedback ? `Hi Bittu Khan, Feedback on SnapDoc Tools: ${feedback}` : 'Hi Bittu Khan, I am using SnapDoc Tools!'
    );
    window.open(`https://wa.me/917719254662?text=${text}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('SnapDoc Tools Feedback');
    const body = encodeURIComponent(feedback || 'Hi Bittu Khan,\n\n');
    window.location.href = `mailto:sssk46981@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-150">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Developer Contact & Support
        </h1>
        <p className="text-sm text-slate-500">
          Have a suggestion, feedback, or need a custom feature? Reach out directly!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
              BK
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bittu Khan</h2>
              <p className="text-xs text-slate-500">Lead Engineer & Creator</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-600" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Email</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    sssk46981@gmail.com
                  </div>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">WhatsApp</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    +91 7719254662
                  </div>
                </div>
              </div>
              <button
                onClick={handleWhatsApp}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Chat
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            I actively maintain SnapDoc Tools and welcome all user bug reports, photo studio requests, and custom tool additions.
          </p>
        </div>

        {/* Quick Message Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Direct Message</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Message / Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Hi Bittu, I would like to request..."
              rows={5}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Via WhatsApp
            </button>

            <button
              onClick={handleEmail}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Via Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
