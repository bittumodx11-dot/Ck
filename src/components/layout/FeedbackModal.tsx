import React, { useState } from 'react';
import { Mail, MessageCircle, X, Send, Check } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sssk46981@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      feedbackText ? `Hello Bittu, Feedback for SnapDoc Tools: ${feedbackText}` : 'Hello Bittu, I am using SnapDoc Tools!'
    );
    window.open(`https://wa.me/917719254662?text=${text}`, '_blank');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent('SnapDoc Tools Feedback');
    const body = encodeURIComponent(feedbackText || 'Hi Bittu Khan,\n\n');
    window.location.href = `mailto:sssk46981@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Developer Feedback & Support</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Built with ❤️ by <strong className="text-indigo-600 dark:text-indigo-400">Bittu Khan</strong>
          </p>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Feedback or Feature Request
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what you like or any new tool you'd like added..."
              rows={3}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp (7719254662)
            </button>

            <button
              onClick={handleSendEmail}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono">sssk46981@gmail.com</span>
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" /> Copy Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
