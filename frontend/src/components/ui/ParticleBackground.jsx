import React from 'react';

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Main Gradient Background */}
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* Subtle Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-blue-500/5 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>
    </div>
  );
}
