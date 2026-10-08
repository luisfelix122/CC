interface Props {
  value: number;
  max: number;
  unit: string;
}

/** Medidor de arco (CU-06). 270° de recorrido; el tramo final se vuelve rojo si se pasa la meta. */
export function Gauge({ value, max, unit }: Props) {
  const ratio = max > 0 ? value / max : 0;
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const track = circumference * 0.75;
  const filled = track * Math.min(ratio, 1);
  const over = ratio > 1;

  return (
    <div className="gauge" role="img" aria-label={`${Math.round(value)} de ${max} ${unit}`}>
      <svg viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${track} ${circumference}`}
          transform="rotate(135 64 64)"
        />
        {filled > 0 && (
          <circle
            className="gauge-arc"
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={over ? 'var(--alert)' : 'var(--sky-strong)'}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            transform="rotate(135 64 64)"
          />
        )}
      </svg>
      <div className="gauge-center">
        <strong>{Math.round(value)}</strong>
        <span>
          de {max} {unit}
        </span>
      </div>
    </div>
  );
}
