import React from 'react';

/**
 * SunriseChart — parabolic arc with sun dot at peak
 */
export const SunriseChart = () => {
  const W = 200, H = 90;
  const cx = W / 2, base = H - 8, rx = 80, ry = 72;
  // Parabolic arc: start at left edge, peak at center, end at right
  const left = cx - rx, right = cx + rx;
  const arcPath = `M ${left} ${base} Q ${cx} ${base - ry} ${right} ${base}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <path d={arcPath} fill="none" stroke="#f1c40f" strokeWidth="4" strokeLinecap="round" />
      {/* Sun dot at top */}
      <circle cx={cx} cy={base - ry} r="7" fill="#f39c12" />
      <circle cx={cx} cy={base - ry} r="11" fill="none" stroke="rgba(243,156,18,0.4)" strokeWidth="3" />
    </svg>
  );
};

/**
 * TrendChart — multi-line chart for Temp / Humidity / Wind
 */
export const TrendChart = () => {
  const W = 200, H = 100;
  const pts = 7;
  const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];

  const tempData   = [12, 15, 18, 22, 20, 16, 13];
  const humData    = [85, 80, 75, 60, 65, 70, 78];
  const windData   = [5,  10, 15, 12, 8,  7,  6 ];

  const toPoints = (data, maxVal) =>
    data.map((v, i) => {
      const x = (i / (pts - 1)) * W;
      const y = H - (v / maxVal) * (H - 10) - 4;
      return `${x},${y}`;
    }).join(' ');

  const smooth = (data, maxVal) => {
    const raw = data.map((v, i) => ({
      x: (i / (pts - 1)) * W,
      y: H - (v / maxVal) * (H - 10) - 4,
    }));
    let d = `M ${raw[0].x} ${raw[0].y}`;
    for (let i = 1; i < raw.length; i++) {
      const prev = raw[i - 1], curr = raw[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpx2 = curr.x - (curr.x - prev.x) / 3;
      d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((r, i) => (
        <line key={i} x1={0} y1={H * r} x2={W} y2={H * r}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      <path d={smooth(tempData, 40)}  fill="none" stroke="#ff4757" strokeWidth="2" />
      <path d={smooth(humData, 100)}  fill="none" stroke="#1e90ff" strokeWidth="2" />
      <path d={smooth(windData, 20)}  fill="none" stroke="#f1c40f" strokeWidth="2" />
      {/* X-axis labels */}
      {labels.map((l, i) => (
        <text key={i}
          x={(i / (pts - 1)) * W}
          y={H - 1}
          textAnchor="middle"
          fontSize="8"
          fill="rgba(255,255,255,0.45)">{l}</text>
      ))}
    </svg>
  );
};

/**
 * FeelsLikeChart — subtle wavy line with a highlighted dot
 */
export const FeelsLikeChart = ({ value = 30.32 }) => {
  const W = 200, H = 50;
  const pts = [value - 2, value - 1, value, value + 1.5, value - 0.5];
  const min = Math.min(...pts) - 1, max = Math.max(...pts) + 1;
  const toY = v => H - ((v - min) / (max - min)) * (H - 10) - 4;

  const raw = pts.map((v, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: toY(v),
  }));
  let d = `M ${raw[0].x} ${raw[0].y}`;
  for (let i = 1; i < raw.length; i++) {
    const p = raw[i - 1], c = raw[i];
    const cpx = p.x + (c.x - p.x) / 2;
    d += ` C ${cpx},${p.y} ${cpx},${c.y} ${c.x},${c.y}`;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '45px' }}>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
      {/* Highlight current dot */}
      <circle cx={raw[2].x} cy={raw[2].y} r="5" fill="#fff" />
    </svg>
  );
};

/**
 * HumidityBars — mini bar chart
 */
export const HumidityBars = ({ value = 45 }) => {
  const bars = [value, 60, 55, 50, 70];
  const max = Math.max(...bars);
  return (
    <div className="weather-hum__chart">
      {bars.map((b, i) => (
        <div
          key={i}
          className="weather-hum__bar"
          style={{ height: `${(b / max) * 100}%` }}
        />
      ))}
    </div>
  );
};

/**
 * TempSparkline — orange line
 */
export const TempSparkline = ({ temp = 33 }) => {
  const data = [temp - 5, temp - 3, temp + 2, temp + 4, temp + 2, temp - 1, temp - 2];
  const W = 200, H = 60;
  const min = Math.min(...data) - 2, max = Math.max(...data) + 2;
  const toY = v => H - ((v - min) / (max - min)) * (H - 8) - 4;
  const raw = data.map((v, i) => ({ x: (i / (data.length - 1)) * W, y: toY(v) }));
  let d = `M ${raw[0].x} ${raw[0].y}`;
  for (let i = 1; i < raw.length; i++) {
    const p = raw[i - 1], c = raw[i];
    const cpx = p.x + (c.x - p.x) / 2;
    d += ` C ${cpx},${p.y} ${cpx},${c.y} ${c.x},${c.y}`;
  }
  return (
    <div className="weather-temp__spark">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,152,0,0.3)" />
            <stop offset="100%" stopColor="rgba(255,152,0,0)" />
          </linearGradient>
        </defs>
        <path d={d + ` L ${W} ${H} L 0 ${H} Z`} fill="url(#tempGrad)" />
        <path d={d} fill="none" stroke="#ff9800" strokeWidth="2.5" />
      </svg>
    </div>
  );
};

/**
 * PressureGauge — semicircle arc gauge
 */
export const PressureGauge = ({ value = 1011 }) => {
  const min = 960, max = 1060;
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const total = 230; // arc length approx for R=60, 230deg sweep
  // radius=60, center at 80,85, from 220deg to 320deg sweep 230deg → actually semicircle
  // Using a half-circle: cx=90, cy=80, r=60, from angle 180 to 360
  const R = 60, CX = 90, CY = 78;
  const startAngle = Math.PI; // left
  const endAngle = 2 * Math.PI; // right
  const arcLen = Math.PI * R; // half circumference

  const polarToXY = (angle) => ({
    x: CX + R * Math.cos(angle),
    y: CY + R * Math.sin(angle),
  });

  const start = polarToXY(startAngle);
  const end = polarToXY(endAngle);
  const trackPath = `M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`;

  // Filled arc to pct
  const fillAngle = startAngle + pct * Math.PI;
  const fillEnd = polarToXY(fillAngle);
  const largeArc = pct > 0.5 ? 1 : 0;
  const fillPath = `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`;

  // Needle
  const needleAngle = startAngle + pct * Math.PI;
  const needleEnd = {
    x: CX + (R - 12) * Math.cos(needleAngle),
    y: CY + (R - 12) * Math.sin(needleAngle),
  };

  return (
    <div className="weather-pressure__gauge">
      <svg viewBox="0 0 180 90" style={{ width: '100%', maxHeight: '75px' }}>
        {/* Track */}
        <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12" strokeLinecap="round" />
        {/* Fill - gradient orange */}
        {pct > 0 && (
          <path d={fillPath} fill="none" stroke="#e07a5f" strokeWidth="12" strokeLinecap="round" />
        )}
        {/* Needle */}
        <line
          x1={CX} y1={CY}
          x2={needleEnd.x} y2={needleEnd.y}
          stroke="white" strokeWidth="3" strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r="5" fill="rgba(255,255,255,0.8)" />
        {/* Low / High labels */}
        <text x="16" y="82" fontSize="9" fill="rgba(255,255,255,0.5)">Low</text>
        <text x="152" y="82" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="end">High</text>
      </svg>
      <div className="weather-pressure__val">{value.toLocaleString()}</div>
    </div>
  );
};

/**
 * AQI Gauge — reliable dashoffset semicircle with color zones + needle
 */
export const AQIGauge = ({ value = 252, label = 'Poor' }) => {
  // AQI 0-500: Good(0-50)=green, Moderate(51-100)=yellow, USG(101-150)=orange,
  // Unhealthy(151-200)=red, VeryUnhealthy(201-300)=purple, Hazardous(301+)=maroon
  const clampedVal = Math.max(0, Math.min(500, value));
  const pct = clampedVal / 500;

  // SVG semicircle: cx=60,cy=62, r=46, swept from 180deg→360deg
  const CX = 60, CY = 62, R = 46;
  // Circumference of full circle; half = semicircle perimeter
  const fullCirc = 2 * Math.PI * R;   // ~289
  const semiCirc = Math.PI * R;        // ~144.5

  // Track: entire half circle via strokeDasharray trick
  // rotate -180deg so arc starts from left (9 o'clock)
  const trackD = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

  // Filled portion uses dashoffset
  const dashArray = semiCirc;
  const dashOffset = semiCirc * (1 - pct);

  // Needle
  const needleAngle = Math.PI + pct * Math.PI; // 180deg to 360deg
  const needleLen = R - 10;
  const nx = CX + needleLen * Math.cos(needleAngle);
  const ny = CY + needleLen * Math.sin(needleAngle);

  // Color based on AQI
  let fillColor = '#2ecc71';
  if (clampedVal > 300) fillColor = '#922b21';
  else if (clampedVal > 200) fillColor = '#884ea0';
  else if (clampedVal > 150) fillColor = '#e74c3c';
  else if (clampedVal > 100) fillColor = '#e67e22';
  else if (clampedVal > 50)  fillColor = '#f1c40f';

  return (
    <div className="weather-aqi__gauge">
      <svg viewBox="0 0 120 70" style={{ width: '100%', maxHeight: '80px', overflow: 'visible' }}>
        {/* Track (background arc) */}
        <path
          d={trackD}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Filled arc via dashoffset */}
        <path
          d={trackD}
          fill="none"
          stroke={fillColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
        {/* Needle */}
        <line
          x1={CX} y1={CY}
          x2={nx} y2={ny}
          stroke="white" strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r="4" fill="rgba(255,255,255,0.8)" />
      </svg>
      <div className="weather-aqi__val">{value}</div>
      <div className="weather-aqi__label">
        <span className="weather-aqi__dot" style={{ background: fillColor }} />
        {label}
      </div>
    </div>
  );
};

/**
 * WindCompass — circular compass rose with direction needle
 */
export const WindCompass = ({ degree = 300 }) => {
  const R = 40, CX = 50, CY = 50;
  const rad = (degree - 90) * (Math.PI / 180);
  const tipX = CX + (R - 8) * Math.cos(rad);
  const tipY = CY + (R - 8) * Math.sin(rad);
  const oppX = CX + (R - 24) * Math.cos(rad + Math.PI);
  const oppY = CY + (R - 24) * Math.sin(rad + Math.PI);

  const dirs = ['N', 'E', 'S', 'W'];
  return (
    <svg viewBox="0 0 100 100" className="weather-compass">
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Cardinal letters */}
      {dirs.map((d, i) => {
        const a = (i * 90 - 90) * (Math.PI / 180);
        const lx = CX + (R - 8) * Math.cos(a);
        const ly = CY + (R - 8) * Math.sin(a) + 4;
        return <text key={d} x={lx} y={ly} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)" fontWeight="700">{d}</text>;
      })}
      {/* Tick marks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 - 90) * (Math.PI / 180);
        const x1 = CX + (R - 2) * Math.cos(a), y1 = CY + (R - 2) * Math.sin(a);
        const x2 = CX + (R - 7) * Math.cos(a), y2 = CY + (R - 7) * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />;
      })}
      {/* Needle: red tip (direction), white back */}
      <polygon
        points={`${tipX},${tipY} ${CX + 7 * Math.cos(rad + Math.PI / 2)},${CY + 7 * Math.sin(rad + Math.PI / 2)} ${oppX},${oppY} ${CX + 7 * Math.cos(rad - Math.PI / 2)},${CY + 7 * Math.sin(rad - Math.PI / 2)}`}
        fill="#e74c3c"
      />
      <polygon
        points={`${CX - (R - 8) * Math.cos(rad) + CX},${CY - (R - 8) * Math.sin(rad) + CY - CY} ${CX + 5 * Math.cos(rad + Math.PI / 2)},${CY + 5 * Math.sin(rad + Math.PI / 2)} ${oppX},${oppY} ${CX + 5 * Math.cos(rad - Math.PI / 2)},${CY + 5 * Math.sin(rad - Math.PI / 2)}`}
        fill="rgba(255,255,255,0.8)"
      />
      <circle cx={CX} cy={CY} r="5" fill="white" />
    </svg>
  );
};

/**
 * MoonSVG — Realistic waning gibbous using SVG clip-path overlay
 */
export const MoonSVG = ({ size = 80 }) => {
  const R = size / 2;
  const id = 'moonClip';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: '50%' }}>
      <defs>
        <radialGradient id="moonGrad" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#e8e8d0" />
          <stop offset="40%" stopColor="#c0c0a8" />
          <stop offset="80%" stopColor="#808070" />
          <stop offset="100%" stopColor="#404030" />
        </radialGradient>
        <clipPath id={id}>
          <circle cx={R} cy={R} r={R - 1} />
        </clipPath>
      </defs>
      {/* Moon body */}
      <circle cx={R} cy={R} r={R - 1} fill="url(#moonGrad)" />
      {/* Crater details */}
      <circle cx={R * 0.55} cy={R * 0.7} r={R * 0.08} fill="rgba(0,0,0,0.12)" clipPath={`url(#${id})`} />
      <circle cx={R * 0.75} cy={R * 0.45} r={R * 0.06} fill="rgba(0,0,0,0.10)" clipPath={`url(#${id})`} />
      <circle cx={R * 0.38} cy={R * 0.38} r={R * 0.05} fill="rgba(0,0,0,0.09)" clipPath={`url(#${id})`} />
      <circle cx={R * 0.65} cy={R * 0.82} r={R * 0.04} fill="rgba(0,0,0,0.08)" clipPath={`url(#${id})`} />
      {/* Shadow overlay — waning gibbous: shadow on the RIGHT side using an offset eclipse circle */}
      <circle
        cx={R * 1.22}
        cy={R}
        r={R * 0.92}
        fill="rgba(18, 50, 100, 0.82)"
        clipPath={`url(#${id})`}
      />
      {/* Subtle rim glow */}
      <circle
        cx={R} cy={R} r={R - 1}
        fill="none"
        stroke="rgba(255,255,220,0.15)"
        strokeWidth="2"
      />
    </svg>
  );
};

export default {
  SunriseChart,
  TrendChart,
  FeelsLikeChart,
  HumidityBars,
  TempSparkline,
  PressureGauge,
  AQIGauge,
  WindCompass,
  MoonSVG,
};
