'use client';

import React from 'react';
import { Smartphone } from 'lucide-react';

export const MobileNotSupported: React.FC = () => {
  return (
    <div className="max-[350px]:flex hidden fixed inset-0 z-[99999] flex-col items-center justify-center bg-[#080d1a] text-[#f8fafc] px-6 text-center select-none overflow-hidden">
      {/* Background gradients */}
      <div className="absolute -right-20 -top-20 -z-10 h-60 w-60 rounded-full bg-danger/10 blur-3xl animate-pulse" />
      <div className="absolute -left-20 -bottom-20 -z-10 h-60 w-60 rounded-full bg-brand-primary/10 blur-3xl animate-pulse" />
      
      {/* Cover Background pattern if any */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-10"
        style={{ backgroundImage: "url('/images/mainbg.png')" }}
      />

      <div className="flex flex-col items-center space-y-6 max-w-[280px]">
        {/* Animated Icon Container */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-brand-primary/10 blur-xl animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-danger/20 border-t-danger animate-spin" style={{ animationDuration: '3s' }} />
          
          <div className="z-10 rounded-full bg-[#1e293b] border border-white/5 p-4 text-danger shadow-glow-primary">
            <Smartphone size={32} className="animate-[pulse_2s_infinite]" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Unsupported Device
          </h2>
          <p className="text-sm font-medium text-[#f43f5e] bg-danger/5 border border-danger/10 rounded-lg p-3 leading-relaxed shadow-glow-primary">
            this website is not supported in your Mobile.
          </p>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Secure Vault requires a device with a screen width larger than 350px for proper display and secure credential management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileNotSupported;
