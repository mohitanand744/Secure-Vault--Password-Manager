import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingScreenProps {
  title?: string;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = "Securing Session",
  message = "Initializing secure cryptographic environment"
}) => {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center relative overflow-hidden selection:bg-brand-primary/20 selection:text-brand-primary">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-15"
        style={{ backgroundImage: "url('/images/mainbg.png')" }}
      />
      <div className="absolute -right-20 -top-20 -z-10 h-60 w-60 rounded-full bg-brand-primary/5 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 -z-10 h-60 w-60 rounded-full bg-brand-secondary/5 blur-3xl" />

      <div className="flex flex-col items-center space-y-6 max-w-sm px-4">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-brand-primary/10 blur-xl animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-brand-primary/10 border-t-brand-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border border-brand-secondary/10 border-b-brand-secondary animate-[spin_1.5s_linear_infinite_reverse]" />
          
          <div className="z-10 rounded-full bg-surface-light border border-white/5 p-4 text-brand-primary shadow-glow-primary select-none">
            <Shield size={28} className="animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-1.5 z-10 select-none">
          <h3 className="text-base font-bold tracking-tight text-text-primary">
            {title}
          </h3>
          <p className="text-sm text-text-secondary flex items-center justify-center gap-0.5">
            {message}
            <span className="inline-flex gap-0.5 ml-1">
              <span className="h-1 w-1 bg-brand-primary rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="h-1 w-1 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="h-1 w-1 bg-brand-primary rounded-full animate-bounce [animation-delay:0.3s]" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
