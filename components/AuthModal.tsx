import React, { useState } from 'react';
import { User, X, Mail, Lock, User as UserIcon, Briefcase, Car, Upload, Check, Landmark } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

type AuthStep = 'login' | 'register_info' | 'register_kyc' | 'register_bank';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [step, setStep] = useState<AuthStep>('login');
  const [role, setRole] = useState<'rider' | 'business' | 'driver'>('rider');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [kycFile, setKycFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name || 'Demo User',
      email: email || 'user@example.com',
      role: role,
      kycStatus: 'verified',
      currency: 'USD',
      avatar: 'https://i.pravatar.cc/150?img=68'
    });
    onClose();
  };

  const handleRegisterNext = () => {
    if (step === 'register_info') {
      setStep('register_kyc');
    } else if (step === 'register_kyc') {
      if (role === 'driver' || role === 'business') {
        setStep('register_bank');
      } else {
        // Riders don't strictly need bank info to start
        completeRegistration();
      }
    } else if (step === 'register_bank') {
      completeRegistration();
    }
  };

  const completeRegistration = () => {
     onLogin({
      name: name || 'New User',
      email: email || 'user@example.com',
      role: role,
      kycStatus: 'verified', // Simulating instant verification
      currency: 'USD',
      avatar: 'https://i.pravatar.cc/150?img=12'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {step === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {step === 'register_kyc' ? 'Identity Verification' : step === 'register_bank' ? 'Payment Details' : 'Sign in to continue'}
            </p>
          </div>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              {/* Role Selector for Login Demo */}
              <div className="flex gap-2 pt-2">
                 <button type="button" onClick={() => setRole('rider')} className={`flex-1 py-2 text-xs rounded border ${role === 'rider' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50'}`}>Rider</button>
                 <button type="button" onClick={() => setRole('driver')} className={`flex-1 py-2 text-xs rounded border ${role === 'driver' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50'}`}>Driver</button>
                 <button type="button" onClick={() => setRole('business')} className={`flex-1 py-2 text-xs rounded border ${role === 'business' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50'}`}>Business</button>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                Log In
              </button>
              <div className="text-center text-sm text-gray-600">
                Don't have an account? <button type="button" onClick={() => setStep('register_info')} className="text-blue-600 font-semibold hover:underline">Sign up</button>
              </div>
            </form>
          )}

          {step === 'register_info' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                   <button onClick={() => setRole('rider')} className={`p-2 rounded-lg border text-sm font-medium flex flex-col items-center gap-1 ${role === 'rider' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                     <UserIcon size={16} /> Rider
                   </button>
                   <button onClick={() => setRole('driver')} className={`p-2 rounded-lg border text-sm font-medium flex flex-col items-center gap-1 ${role === 'driver' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                     <Car size={16} /> Driver
                   </button>
                   <button onClick={() => setRole('business')} className={`p-2 rounded-lg border text-sm font-medium flex flex-col items-center gap-1 ${role === 'business' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                     <Briefcase size={16} /> Biz
                   </button>
                </div>
              </div>

              <button onClick={handleRegisterNext} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Next: Verification</button>
            </div>
          )}

          {step === 'register_kyc' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                   <Upload size={24} />
                </div>
                <h3 className="font-semibold text-gray-900">Upload Government ID</h3>
                <p className="text-sm text-gray-500">We need to verify your identity to comply with regulations.</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setKycFile('simulated_file.jpg')}>
                 {kycFile ? (
                   <div className="flex items-center gap-2 text-green-600 font-medium">
                     <Check size={20} /> ID Uploaded
                   </div>
                 ) : (
                   <>
                     <Upload size={24} className="text-gray-400 mb-2" />
                     <span className="text-sm text-gray-500">Click to upload Passport or License</span>
                   </>
                 )}
              </div>

              <button 
                onClick={handleRegisterNext} 
                disabled={!kycFile}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {role === 'rider' ? 'Complete Registration' : 'Next: Bank Details'}
              </button>
            </div>
          )}

          {step === 'register_bank' && (
             <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
                   <Landmark size={16} className="mt-0.5 shrink-0" />
                   Add a bank account to receive payouts (Drivers) or make large transfers (Business).
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bank Name</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="e.g. Chase" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Number</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="0000 0000 0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Routing Number</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="000000000" />
                </div>
                <button onClick={completeRegistration} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4">
                  Finish Setup
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
