import { useState, useEffect } from 'react'

interface GameIntroProps {
  onStart: () => void;
  highScore: number;
}

export default function GameIntro({ onStart, highScore }: GameIntroProps) {
  const [showContent, setShowContent] = useState(false);
  const [step, setStep] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 600);
    const t2 = setTimeout(() => setStep(1), 2200);
    const t3 = setTimeout(() => setStep(2), 3800);
    // Periodic glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[5000] flex items-center justify-center bg-[#0a0a1a] overflow-hidden">
      {/* ─── Background Ambient Effects ─── */}
      <div className="absolute inset-0">
        {/* Red glow top left */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] animate-float-slow" />
        {/* Cyan glow bottom right */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[100px] animate-float-slow" style={{animationDelay: '-3s'}} />
        {/* Center ambient pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px] animate-pulse" style={{animationDuration: '4s'}} />
      </div>

      {/* ─── Scanline overlay ─── */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)',
        pointerEvents: 'none',
      }} />

      {/* ─── Glitch overlay ─── */}
      {glitchEffect && (
        <div className="absolute inset-0 z-50 pointer-events-none" style={{
          background: 'linear-gradient(0deg, transparent 40%, rgba(255,51,85,0.08) 45%, rgba(0,240,255,0.05) 55%, transparent 60%)',
          animation: 'glitch 0.15s ease-in-out',
        }} />
      )}

      {/* ─── Corner decorations ─── */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-red-500/30 rounded-tl-sm" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-red-500/30 rounded-tr-sm" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-red-500/30 rounded-bl-sm" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-red-500/30 rounded-br-sm" />

      {/* ─── Main Content ─── */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Subtitle */}
        <div className="mb-6">
          <div className="text-[9px] text-red-400/70 uppercase tracking-[0.4em] mb-3 font-bold">
            <span className="inline-block animate-fade-in">U</span>
            <span className="inline-block animate-fade-in animate-delay-100">n</span>
            <span className="inline-block animate-fade-in animate-delay-200"> </span>
            <span className="inline-block animate-fade-in animate-delay-300">J</span>
            <span className="inline-block animate-fade-in animate-delay-400">u</span>
            <span className="inline-block animate-fade-in animate-delay-500">e</span>
            <span className="inline-block animate-fade-in animate-delay-500">g</span>
            <span className="inline-block animate-fade-in animate-delay-500">o</span>
            <span className="inline-block animate-fade-in animate-delay-500"> </span>
            <span className="inline-block animate-fade-in animate-delay-700">d</span>
            <span className="inline-block animate-fade-in animate-delay-1000">e</span>
          </div>
        </div>

        {/* Logo Area */}
        <div className="mb-8 relative">
          {/* Glow under title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-20 bg-red-500/20 rounded-full blur-[60px]" />

          <div className="relative">
            {/* Hazard stripes decoration */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-1 bg-gradient-to-r from-red-500/50 to-transparent rounded-full animate-fade-in"
                  style={{ animationDelay: `${i * 100 + 800}ms`, transform: `rotate(${(i - 2) * 8}deg)` }}
                />
              ))}
            </div>

            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              <span className="text-gradient-red">SEVEN</span>
              <br />
              <span className="text-2xl font-light text-white/40 tracking-[0.2em]">DAYS FOR</span>
              <br />
              <span className="text-5xl text-gradient-red">DISASTER</span>
            </h1>

            {/* Decorative line under title */}
            <div className="flex justify-center items-center gap-3 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              <div className="w-1.5 h-1.5 bg-red-500/80 rounded-full animate-pulse" />
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            </div>
          </div>
        </div>

        {/* ─── Animated Steps ─── */}
        <div className="space-y-2.5 mb-8 min-h-[140px] max-w-xs mx-auto">
          {step >= 0 && (
            <div className="animate-slide-up glass-card rounded-xl px-4 py-3 flex items-center gap-3 hover:border-red-500/20 transition-all duration-500">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center text-lg shrink-0 border border-red-500/20">
                🗺️
              </div>
              <span className="text-gray-300 text-xs font-medium leading-relaxed">
                Explora ubicaciones <span className="text-gradient-cyan font-bold">reales</span> en tu ciudad
              </span>
            </div>
          )}
          {step >= 1 && (
            <div className="animate-slide-up glass-card rounded-xl px-4 py-3 flex items-center gap-3 hover:border-red-500/20 transition-all duration-500">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-lg shrink-0 border border-amber-500/20">
                🎒
              </div>
              <span className="text-gray-300 text-xs font-medium leading-relaxed">
                Recolecta <span className="text-gradient-amber font-bold">recursos</span> para sobrevivir
              </span>
            </div>
          )}
          {step >= 2 && (
            <div className="animate-slide-up glass-card rounded-xl px-4 py-3 flex items-center gap-3 hover:border-red-500/20 transition-all duration-500">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center text-lg shrink-0 border border-red-500/20">
                ⚠️
              </div>
              <span className="text-gray-300 text-xs font-medium leading-relaxed">
                Sobrevive al <span className="text-gradient-red font-bold">desastre</span> cada 7 días
              </span>
            </div>
          )}
        </div>

        {/* ─── High Score ─── */}
        {highScore > 0 && (
          <div className="mb-6 animate-fade-in animate-delay-500">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2">
              <span className="text-lg">🏆</span>
              <span className="text-[11px] text-gray-500">Mejor récord:</span>
              <span className="text-gradient-amber font-black text-sm">
                {highScore} semanas
              </span>
            </div>
          </div>
        )}

        {/* ─── Start Button ─── */}
        <button
          onClick={onStart}
          className="relative group px-12 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-lg rounded-2xl shadow-2xl shadow-red-500/25 transition-all duration-300 hover:shadow-red-500/40 hover:scale-105 active:scale-95 uppercase tracking-[0.15em]"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
          <span className="relative z-10">Comenzar</span>
        </button>

        <p className="text-[11px] text-white/20 mt-5 tracking-wider">
          Se requiere GPS para la experiencia completa
        </p>
      </div>
    </div>
  );
}
