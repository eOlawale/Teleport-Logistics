import React, { useState } from 'react';
import { Quote, X, CreditCard, CheckCircle, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ quote, isOpen, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');

  if (!isOpen || !quote) return null;

  const handlePay = () => {
    setStep('processing');
    setProcessing(true);
    // Simulate payment API call
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
      setTimeout(() => {
        onSuccess();
        setStep('method'); // Reset for next time
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">
        {step === 'method' && (
          <>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Confirm Payment</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                <p className="text-4xl font-bold text-slate-900">${quote.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-2">{quote.provider} • {quote.vehicleType}</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handlePay}
                  className="w-full border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-700">
                    <CreditCard size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">Visa •••• 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/26</p>
                  </div>
                </button>

                <button 
                  onClick={handlePay}
                  className="w-full border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-black hover:bg-gray-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-black group-hover:text-white transition-colors">
                    <Smartphone size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">Apple Pay</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="font-semibold text-lg animate-pulse">Processing Payment...</h3>
            <p className="text-sm text-gray-500">Securely connecting to {quote.provider}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 bg-green-50 h-full">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-bold text-xl text-green-900">Payment Successful!</h3>
            <p className="text-sm text-green-700">Your ride is on the way.</p>
          </div>
        )}
      </div>
    </div>
  );
};
