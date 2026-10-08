interface Props {
  value: number;
  max: number;
  label: string;
  unit: string;
}

/** Medidor analógico con aguja (CU-06). Arco de 240°, la zona roja marca el exceso. */
export function Gauge({ value, max, label, unit }: Props) {
  const ratio = max > 0 ? Math.min(value / max, 1.25) : 0;
  const start = -210;
  const sweep = 240;
  const angle = start + (sweep * ratio) / 1.25;
  const polar = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)];
  };
  const arc = (from: number, to: number, r: number) => {
    const [x1, y1] = polar(from, r);
    const [x2, y2] = polar(to, r);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const goalAngle = start + sweep / 1.25;
  const ticks = Array.from({ length: 11 }, (_, i) => start + (sweep * i) / 10);
  const [nx, ny] = polar(angle, 68);

  return (
    <div className="gauge" role="img" aria-label={`${label}: ${value} de ${max} ${unit}`}>
      <svg viewBox="0 0 200 170">
        <defs>
          <radialGradient id="dial" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fffdf6" />
            <stop offset="100%" stopColor="#e6dcc4" />
          </radialGradient>
          <linearGradient id="bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9d9d9" />
            <stop offset="50%" stopColor="#8a8a8a" />
            <stop offset="100%" stopColor="#4a4a4a" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="96" fill="url(#bezel)" />
        <circle cx="100" cy="100" r="88" fill="url(#dial)" stroke="#6b5a3e" strokeWidth="1" />
        <path d={arc(start, goalAngle, 78)} stroke="#5f8f4e" strokeWidth="7" fill="none" />
        <path d={arc(goalAngle, start + sweep, 78)} stroke="#b8442e" strokeWidth="7" fill="none" />
        {ticks.map((t) => {
          const [x1, y1] = polar(t, 70);
          const [x2, y2] = polar(t, 82);
          return (
            <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b2f22" strokeWidth="1.5" />
          );
        })}
        <text x="100" y="128" textAnchor="middle" className="gauge-value">
          {Math.round(value)}
        </text>
        <text x="100" y="143" textAnchor="middle" className="gauge-unit">
          de {max} {unit}
        </text>
        <line
          x1="100"
          y1="100"
          x2={nx}
          y2={ny}
          stroke="#8c1d12"
          strokeWidth="3"
          strokeLinecap="round"
          className="needle"
        />
        <circle cx="100" cy="100" r="8" fill="url(#bezel)" stroke="#2b2b2b" />
      </svg>
      <div className="gauge-label">{label}</div>
    </div>
  );
}
