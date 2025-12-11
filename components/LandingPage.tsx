import React from 'react';
import { Zap, Globe, Layers, ArrowRight, User, Briefcase, Car, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onGuestAccess: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick, onGuestAccess }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tight text-blue-600 dark:text-blue-500">
          <div className="bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-lg transform -rotate-12">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-slate-900 dark:text-white">Teleport</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onLoginClick}
            className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2"
          >
            Log In
          </button>
          <button 
            onClick={onRegisterClick}
            className="bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Sign Up Free
          </button>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <main className="flex-grow p-4 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          
          {/* Column 1: Service Description */}
          <div className="bg-gray-50 dark:bg-slate-900 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-slate-800">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <Globe size={28} />
              </div>
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                Move anything,<br/>
                <span className="text-blue-600 dark:text-blue-400">anywhere.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Teleport isn't just an app; it's a unified logistics protocol. Whether you need a ride across town, 
                a package delivered instantly, or heavy freight moved across the country, we connect you to the fastest route.
              </p>
              <div className="flex gap-4">
                 <button onClick={onRegisterClick} className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white hover:text-blue-600 hover:border-blue-600 transition-colors">
                    Get Started <ArrowRight size={16} />
                 </button>
                 <button onClick={onGuestAccess} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
                    Try as Guest
                 </button>
              </div>
            </div>
            <div className="mt-8 rounded-2xl overflow-hidden shadow-inner h-64 relative">
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop" 
                alt="City map navigation" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <p className="text-white font-bold">Smart City Navigation</p>
              </div>
            </div>
          </div>

          {/* Column 2: Integration Service */}
          <div className="bg-slate-900 dark:bg-blue-950 text-white rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur text-blue-300 rounded-2xl flex items-center justify-center mb-6">
                <Layers size={28} />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                The Power of<br/>Integration
              </h2>
              <p className="text-slate-300 mb-6">
                Why check five apps when you can check one? Teleport aggregates Uber, Lyft, Lime, and local fleets into a single dashboard.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">✓</div>
                  <span className="font-medium">Compare prices instantly</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">✓</div>
                  <span className="font-medium">Unified Business Billing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">✓</div>
                  <span className="font-medium">AI-Driven Route Optimization</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-auto relative z-10">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-slate-300">Average Savings</span>
                     <span className="text-xl font-bold text-green-400">24%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                     <div className="bg-green-400 h-full w-3/4"></div>
                  </div>
               </div>
            </div>

            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          </div>

          {/* Column 3: Ecosystem CTA Stack */}
          <div className="flex flex-col gap-6 h-full">
            
            {/* CTA 1: User */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group flex items-center gap-4">
               <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Rider" />
               </div>
               <div>
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><User size={16} className="text-blue-500"/> Riders</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Get $10 off your first multimodal trip.</p>
                  <button onClick={onRegisterClick} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Sign Up Now &rarr;</button>
               </div>
            </div>

            {/* CTA 2: Partner */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors group flex items-center gap-4">
               <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Business" />
               </div>
               <div>
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Briefcase size={16} className="text-purple-500"/> Partners</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Integrate your fleet or e-commerce store.</p>
                  <button onClick={onRegisterClick} className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline">Become a Partner &rarr;</button>
               </div>
            </div>

            {/* CTA 3: Driver */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-400 transition-colors group flex items-center gap-4">
               <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Driver" />
               </div>
               <div>
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Car size={16} className="text-green-500"/> Drivers</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Keep 100% of your tips. Flexible hours.</p>
                  <button onClick={onRegisterClick} className="text-sm font-bold text-green-600 dark:text-green-400 hover:underline">Join the Fleet &rarr;</button>
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-2 font-black text-xl tracking-tight text-white">
                <div className="bg-blue-600 text-white p-1 rounded transform -rotate-12">
                   <Zap size={16} fill="currentColor" />
                </div>
                <span>Teleport</span>
             </div>
             <p className="text-sm text-slate-400">The world's first multimodal logistics aggregator. We move people and products faster, cheaper, and greener.</p>
             <div className="flex gap-4 pt-2">
                <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
             </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400">Press</a></li>
              <li><a href="#" className="hover:text-blue-400">Sustainability</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Ride Hailing</a></li>
              <li><a href="#" className="hover:text-blue-400">Business Delivery</a></li>
              <li><a href="#" className="hover:text-blue-400">Freight Logistics</a></li>
              <li><a href="#" className="hover:text-blue-400">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={16} /> support@teleport.app</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> 101 Logistics Way, SF, CA</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-xs text-center text-slate-500">
           &copy; {new Date().getFullYear()} Teleport Logistics Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
