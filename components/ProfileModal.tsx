import React, { useState, useEffect } from 'react';
import { X, User, Gift, Moon, Sun, Camera, Edit2, Check, ShieldCheck, Copy, Settings } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onUpdateUser: (updatedUser: UserType) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onUpdateUser,
  isDarkMode,
  onToggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'referrals' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [copied, setCopied] = useState(false);

  // Generate a random referral code if one doesn't exist
  useEffect(() => {
    if (!user.referralCode) {
      const code = `TELE-${user.name.split(' ')[0].toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      onUpdateUser({ ...user, referralCode: code, credits: user.credits || 0 });
    }
  }, [user, onUpdateUser]);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    onUpdateUser({ ...user, name: editName, email: editEmail });
    setIsEditing(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarChange = () => {
    // Simulate upload
    const randomAvatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
    onUpdateUser({ ...user, avatar: randomAvatar });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-900 dark:bg-slate-950 text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <User size={20} /> User Profile
          </h3>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-slate-800">
           <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'profile' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400'}`}>Profile</button>
           <button onClick={() => setActiveTab('referrals')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'referrals' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400'}`}>Referrals</button>
           <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'settings' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400'}`}>Settings</button>
        </div>

        <div className="p-6 overflow-y-auto dark:text-slate-200">
          {activeTab === 'profile' && (
            <div className="space-y-6">
               <div className="flex flex-col items-center">
                  <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
                     <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-slate-800 shadow-lg">
                        <img src={user.avatar || "https://i.pravatar.cc/150"} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                     <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" />
                     </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Click to update photo</p>
               </div>

               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                       <label className="text-sm font-bold text-gray-500 dark:text-slate-400">Full Name</label>
                       {!isEditing && <button onClick={() => setIsEditing(true)} className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1"><Edit2 size={12}/> Edit</button>}
                    </div>
                    {isEditing ? (
                       <input 
                         type="text" 
                         value={editName} 
                         onChange={(e) => setEditName(e.target.value)} 
                         className="w-full p-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                       />
                    ) : (
                       <p className="text-lg font-semibold">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-500 dark:text-slate-400">Email Address</label>
                    {isEditing ? (
                       <input 
                         type="email" 
                         value={editEmail} 
                         onChange={(e) => setEditEmail(e.target.value)} 
                         className="w-full p-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-1" 
                       />
                    ) : (
                       <p className="text-lg font-semibold">{user.email}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                     <div className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Role</label>
                        <p className="font-medium capitalize">{user.role}</p>
                     </div>
                     <div className="flex-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">KYC Status</label>
                        <div className="flex items-center gap-1 font-medium capitalize text-green-600 dark:text-green-400">
                           <ShieldCheck size={16} /> {user.kycStatus}
                        </div>
                     </div>
                  </div>

                  {isEditing && (
                     <div className="flex gap-2 mt-4">
                        <button onClick={handleSaveProfile} className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-2 rounded-lg font-bold">Save Changes</button>
                        <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 py-2 rounded-lg font-bold">Cancel</button>
                     </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'referrals' && (
             <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
                   <Gift size={40} />
                </div>
                <div>
                   <h4 className="text-xl font-bold">Give $10, Get $10</h4>
                   <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
                      Invite friends to Teleport. They get $10 off their first ride, and you get $10 in credits when they complete it.
                   </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-600">
                   <p className="text-xs font-bold text-gray-400 uppercase mb-2">Your Unique Code</p>
                   <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl font-mono font-bold tracking-wider">{user.referralCode}</span>
                      <button 
                        onClick={handleCopyCode}
                        className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                        title="Copy Code"
                      >
                         {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                      </button>
                   </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex justify-between items-center">
                   <span className="font-bold text-blue-800 dark:text-blue-300">Total Credits Earned</span>
                   <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">${user.credits?.toFixed(2)}</span>
                </div>

                <button className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl font-bold">Invite Friends</button>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                         {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                      </div>
                      <div>
                         <p className="font-bold">App Theme</p>
                         <p className="text-xs text-gray-500 dark:text-slate-400">{isDarkMode ? 'Dark Mode' : 'Light Mode'} Active</p>
                      </div>
                   </div>
                   <button 
                     onClick={onToggleTheme}
                     className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                   >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </button>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
                   <h5 className="font-bold mb-3 flex items-center gap-2"><Settings size={16}/> Account</h5>
                   <button className="w-full text-left py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-blue-600">Notifications</button>
                   <button className="w-full text-left py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-blue-600">Privacy & Data</button>
                   <button className="w-full text-left py-2 text-sm text-red-500 hover:text-red-700">Delete Account</button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
