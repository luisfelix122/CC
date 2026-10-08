interface Props {
  ml: number;
  goal: number;
  onTap?: () => void;
  size?: 'sm' | 'lg';
}

/** Vaso con nivel de líquido (CU-04 / CU-06). Tocarlo suma un vaso. */
export function WaterGlass({ ml, goal, onTap, size = 'sm' }: Props) {
  const pct = goal > 0 ? Math.min(ml / goal, 1) : 0;
  const top = 14;
  const bottom = 150;
  const level = bottom - (bottom - top) * pct;

  return (
    <button
      type="button"
      className={`glass-btn ${size}`}
      onClick={onTap}
      aria-label={`Agua: ${ml} de ${goal} ml. Toca para sumar 250 ml`}
    >
      <svg viewBox="0 0 110 160">
        <defs>
          <clipPath id={`glass-${size}`}>
            <path d="M12 12 H98 L88 146 Q87 152 80 152 H30 Q23 152 22 146 Z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#glass-${size})`}>
          <rect width="110" height="160" fill="var(--sky-soft)" />
          <g className="water-level" style={{ transform: `translateY(${level}px)` }}>
            <path
              className="wave"
              d="M-110 0 Q-82 -7 -55 0 T0 0 T55 0 T110 0 T165 0 T220 0 V170 H-110 Z"
              fill="var(--sky-strong)"
            />
          </g>
        </g>
        <path
          d="M12 12 H98 L88 146 Q87 152 80 152 H30 Q23 152 22 146 Z"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
