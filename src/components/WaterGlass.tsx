interface Props {
  ml: number;
  goal: number;
  onTap?: () => void;
}

/** Vaso de vidrio con nivel de líquido realista (CU-04 / CU-06). Tocarlo suma un vaso. */
export function WaterGlass({ ml, goal, onTap }: Props) {
  const pct = goal > 0 ? Math.min(ml / goal, 1) : 0;
  const top = 20;
  const bottom = 180;
  const level = bottom - (bottom - top) * pct;

  return (
    <button
      type="button"
      className="glass-btn"
      onClick={onTap}
      aria-label={`Agua: ${ml} de ${goal} ml. Toca para sumar un vaso`}
    >
      <svg viewBox="0 0 140 200">
        <defs>
          <clipPath id="glass-shape">
            <path d="M20 20 L120 20 L108 180 Q70 190 32 180 Z" />
          </clipPath>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7fc4ef" />
            <stop offset="100%" stopColor="#1f6fb2" />
          </linearGradient>
          <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
          </linearGradient>
        </defs>
        <g clipPath="url(#glass-shape)">
          <rect x="0" y="0" width="140" height="200" fill="rgba(220,235,245,0.35)" />
          <g className="water-level" style={{ transform: `translateY(${level}px)` }}>
            <path
              className="wave"
              d="M-140 0 Q-105 -8 -70 0 T0 0 T70 0 T140 0 T210 0 T280 0 V200 H-140 Z"
              fill="url(#water)"
            />
          </g>
        </g>
        <path
          d="M20 20 L120 20 L108 180 Q70 190 32 180 Z"
          fill="url(#shine)"
          stroke="rgba(60,90,110,0.7)"
          strokeWidth="2.5"
        />
        <ellipse cx="70" cy="20" rx="50" ry="5" fill="none" stroke="rgba(60,90,110,0.6)" />
      </svg>
      <span className="glass-pct">{Math.round(pct * 100)}%</span>
    </button>
  );
}
