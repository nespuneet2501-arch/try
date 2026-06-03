import React from 'react';

export default function PVAstroLogo({ className = "w-12 h-12", animate = true }) {
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={`${className} select-none overflow-visible filter drop-shadow-[0_4px_10px_rgba(147,106,24,0.15)]`}
    >
      <defs>
        {/* Glow & Gradient Effects */}
        <radialGradient id="logoBg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#2e0509" />
          <stop offset="60%" stopColor="#220306" />
          <stop offset="100%" stopColor="#0b0102" />
        </radialGradient>
        
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="35%" stopColor="#ffd54f" />
          <stop offset="70%" stopColor="#ff8f00" />
          <stop offset="100%" stopColor="#d84315" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe082" />
          <stop offset="50%" stopColor="#cca43b" />
          <stop offset="100%" stopColor="#8d6e15" />
        </linearGradient>

        {/* Curved text paths */}
        <path 
          id="taglinePath" 
          d="M 60,250 A 190,190 0 0,0 440,250" 
          fill="none" 
        />
        
        <path 
          id="bannerPath" 
          d="M 140,250 A 110,110 0 0,1 360,250" 
          fill="none" 
        />
        
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Main Outer Crimson Circle Shield */}
      <circle cx="250" cy="250" r="230" fill="url(#logoBg)" stroke="url(#goldGradient)" strokeWidth="6" />
      <circle cx="250" cy="250" r="222" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeDasharray="3,3" />

      {/* Glowing Outer Cosmic Aura */}
      <circle cx="250" cy="250" r="240" fill="none" stroke="#ffa726" strokeWidth="1" strokeOpacity="0.25" className={animate ? "animate-pulse" : ""} />

      {/* Outer Zodiac / Astronomical Ring boundaries */}
      <circle cx="250" cy="250" r="195" fill="none" stroke="url(#goldGradient)" strokeWidth="2.5" />
      <circle cx="250" cy="250" r="165" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />

      {/* Intricate Geometric Celestial Chart Rays */}
      <g stroke="url(#goldGradient)" strokeWidth="0.5" strokeOpacity="0.3">
        <line x1="250" y1="20" x2="250" y2="480" />
        <line x1="20" y1="250" x2="480" y2="250" />
        <line x1="87" y1="87" x2="413" y2="413" />
        <line x1="87" y1="413" x2="413" y2="87" />
        {/* Star Shines */}
        <circle cx="160" cy="160" r="1.5" fill="#fff" />
        <circle cx="340" cy="160" r="1.5" fill="#fff" />
        <circle cx="130" cy="300" r="1.5" fill="#fff" />
        <circle cx="370" cy="300" r="1.5" fill="#fff" />
      </g>

      {/* Concentric Orbital Paths */}
      <circle cx="250" cy="250" r="135" fill="none" stroke="url(#goldGradient)" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="4,6" />
      <circle cx="250" cy="250" r="105" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="250" cy="250" r="75" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeOpacity="0.4" />

      {/* Planetary Spheres placed gracefully along paths */}
      {/* Saturn */}
      <g transform="translate(145, 185)">
        <ellipse cx="0" cy="0" rx="10" ry="3" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" transform="rotate(-15)" />
        <circle cx="0" cy="0" r="5" fill="#ffd54f" stroke="#cca43b" strokeWidth="0.8" />
      </g>
      {/* Moon */}
      <path d="M 370 175 A 6 6 0 0 0 361 185 A 8 8 0 0 1 370 175" fill="#e0e0e0" transform="rotate(20 365 180)" />
      {/* Mars */}
      <circle cx="210" cy="115" r="4.5" fill="#ff5722" stroke="#d84315" strokeWidth="0.8" />
      {/* Jupiter */}
      <circle cx="320" cy="315" r="7.5" fill="#ffb74d" stroke="#f57c00" strokeWidth="1" />
      {/* Venus */}
      <circle cx="150" cy="290" r="4" fill="#fff59d" stroke="#fbc02d" strokeWidth="0.8" />

      {/* Center Sun with Radiant Rays (Rotating class if animate) */}
      <g className={animate ? "origin-[250px_250px] animate-[spin_50s_linear_infinite]" : "origin-[250px_250px]"}>
        {/* Flare Glow */}
        <circle cx="250" cy="250" r="45" fill="url(#sunGlow)" />
        
        {/* Golden Sun Body */}
        <circle cx="250" cy="250" r="22" fill="#ffe082" stroke="url(#goldGradient)" strokeWidth="1.5" />
        
        {/* Sun Flame Rays */}
        {[...Array(12)].map((_, i) => (
          <path 
            key={i}
            d="M 250,218 Q 242,228 250,228 Q 258,228 250,218" 
            fill="url(#goldGradient)"
            transform={`rotate(${i * 30} 250 250)`}
          />
        ))}
        {/* Secondary Small Flame Rays */}
        {[...Array(12)].map((_, i) => (
          <path 
            key={i}
            d="M 250,221 Q 246,228 250,228 Q 254,228 250,221" 
            fill="#ffb300"
            transform={`rotate(${i * 30 + 15} 250 250)`}
          />
        ))}
      </g>

      {/* Top Banner (* LIVE *) Arc */}
      <path 
        d="M 155,215 A 105,105 0 0,1 345,215" 
        fill="none" 
        stroke="url(#goldGradient)" 
        strokeWidth="16" 
        strokeLinecap="round" 
        opacity="0.9"
      />
      <path 
        d="M 155,215 A 105,105 0 0,1 345,215" 
        fill="none" 
        stroke="#4a0006" 
        strokeWidth="12" 
        strokeLinecap="round" 
      />
      
      {/* *"LIVE "* Header text to go along banner */}
      <text className="font-bold tracking-[0.25em] text-[10px]" fill="#fff7e6" filter="url(#shadow)">
        <textPath href="#bannerPath" startOffset="50%" textAnchor="middle">
          ★ LIVE ★
        </textPath>
      </text>

      {/* Main Bold Heading: "PVASTRO" (Middle Centered) */}
      <g filter="url(#shadow)">
        {/* Subtle black shadow layer under text for readability */}
        <text 
          x="250" 
          y="395" 
          textAnchor="middle" 
          className="font-cinzel text-[54px] font-black tracking-[0.1em]" 
          fill="#110103"
        >
          PVASTRO
        </text>
        {/* Main Gold-Text */}
        <text 
          x="250" 
          y="390" 
          textAnchor="middle" 
          className="font-cinzel text-[54px] font-black tracking-[0.1em]" 
          fill="url(#goldGradient)"
        >
          PVASTRO
        </text>
      </g>

      {/* Curved Tagline Boundary Arc Line */}
      <path d="M 75,250 A 175,175 0 0,0 425,250" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="2,4" />

      {/* Curved Bottom Tagline: "ASTRO IS DIVINE WORK, BLESSINGS ARE FREE FOR ALL" */}
      <text className="font-bold text-[10.5px] tracking-[0.115em]" fill="#ffca28" filter="url(#shadow)">
        <textPath href="#taglinePath" startOffset="50%" textAnchor="middle">
          ASTRO IS DIVINE WORK, BLESSINGS ARE FREE FOR ALL
        </textPath>
      </text>

      {/* Little Star sparkles on side edge banner */}
      <path d="M 70,240 L 73,243 L 70,246 L 67,243 Z" fill="#ffe082" className={animate ? "animate-pulse" : ""} />
      <path d="M 430,240 L 433,243 L 430,246 L 427,243 Z" fill="#ffe082" className={animate ? "animate-pulse" : ""} />
    </svg>
  );
}
