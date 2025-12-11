import React, { useState } from 'react';
import { X, MessageSquare, AlertTriangle, FileText, Send, CheckCircle } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<'complaint' | 'claim' | 'inquiry' | 'refund'>('inquiry');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} />
            <h3 className="font-bold text-lg">Help & Support</h3>
          </div>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Request Submitted</h3>
            <p className="text-gray-500">Our support team will review your case (Ticket #9942) and respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => setType('inquiry')} 
                className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-2 transition-all ${type === 'inquiry' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              >
                <FileText size={20} /> General Inquiry
              </button>
              <button 
                type="button" 
                onClick={() => setType('complaint')} 
                className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-2 transition-all ${type === 'complaint' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              >
                <AlertTriangle size={20} /> Complaint
              </button>
              <button 
                type="button" 
                onClick={() => setType('claim')} 
                className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-2 transition-all ${type === 'claim' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              >
                <FileText size={20} /> Insurance Claim
              </button>
              <button 
                type="button" 
                onClick={() => setType('refund')} 
                className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-2 transition-all ${type === 'refund' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              >
                <FileText size={20} /> Refund Request
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Briefly describe the issue..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide specific details about your trip, order, or issue..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none resize-none"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
              <Send size={18} /> Submit Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
