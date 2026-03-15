'use client';

import { useState, useMemo, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// Scoped styles for the goal calculator
const Styles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --hdfc-blue: #224c87;
      --hdfc-red: #da3832;
      --hdfc-grey: #919090;

      --ink:     var(--hdfc-blue);
      --paper:   #ffffff;
      --cream:   #f8f9fa;
      --bone:    #e2e8f0;
      --stone:   #64748b;
      --mist:    #94a3b8;
      --shadow:  #1e293b;
      --gold:    var(--hdfc-blue);
      --goldlt:  #4a90d9;
      --text-secondary: #3d3d3d;
      --r-md: 8px;
      
      --f-ui: var(--font-montserrat), 'Montserrat', Arial, Verdana, sans-serif;
      --f-mono: var(--font-montserrat), 'Montserrat', Arial, Verdana, sans-serif;
      --f-display: var(--font-montserrat), 'Montserrat', Arial, Verdana, sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--paper);
      color: var(--ink);
      font-family: var(--f-ui);
      cursor: default;
      overflow-x: hidden;
    }

    /* film grain texture */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9999;
      opacity: 0.6;
      mix-blend-mode: multiply;
    }

    .header {
      border-bottom: 1px solid var(--bone);
      padding: 0 48px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--paper);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0; right: 0;
      height: 1px;
      background: var(--cream);
    }
    .logo-group { display: flex; align-items: baseline; gap: 10px; }
    .logo-mark {
      font-family: var(--f-display);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--hdfc-blue);
      line-height: 1;
    }
    .logo-mark em {
      font-style: normal;
      color: var(--hdfc-red);
      font-weight: 700;
    }
    .logo-sub {
      font-family: var(--f-mono);
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--stone);
      padding-bottom: 2px;
    }

    .page {
      max-width: 1280px;
      margin: 0 auto;
      padding: 48px 48px 80px;
      animation: fadeUp 0.4s ease;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .calc-hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      border: 1px solid var(--bone);
      margin-bottom: 2px;
    }
    .calc-hero-left {
      padding: 40px 44px;
      border-right: 1px solid var(--bone);
    }
    .calc-hero-right {
      padding: 40px 44px;
      background: var(--ink);
      color: var(--paper);
      position: relative;
      overflow: hidden;
    }
    .calc-hero-right::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(244,242,237,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244,242,237,0.03) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
    }
    .corner-mark {
      position: absolute;
      width: 12px;
      height: 12px;
      opacity: 0.25;
    }
    .corner-mark.tl { top: 12px; left: 12px; border-top: 1px solid var(--paper); border-left: 1px solid var(--paper); }
    .corner-mark.tr { top: 12px; right: 12px; border-top: 1px solid var(--paper); border-right: 1px solid var(--paper); }
    .corner-mark.bl { bottom: 12px; left: 12px; border-bottom: 1px solid var(--paper); border-left: 1px solid var(--paper); }
    .corner-mark.br { bottom: 12px; right: 12px; border-bottom: 1px solid var(--paper); border-right: 1px solid var(--paper); }

    .micro {
      font-family: var(--f-mono);
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--stone);
      margin-bottom: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .micro::before {
      content: '';
      width: 16px;
      height: 1.5px;
      background: var(--hdfc-red);
      flex-shrink: 0;
    }
    .micro-light {
      font-family: var(--f-mono);
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--mist);
      margin-bottom: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .micro-light::before {
      content: '';
      width: 16px;
      height: 1px;
      background: var(--mist);
      flex-shrink: 0;
    }

    .display-title {
      font-family: var(--f-display);
      font-size: 40px;
      font-weight: 400;
      letter-spacing: -1px;
      line-height: 1.1;
      color: var(--ink);
      margin-bottom: 8px;
    }
    .display-title em {
      font-style: normal;
      font-weight: 700;
      color: var(--hdfc-blue);
    }
    .display-desc {
      font-size: 13px;
      color: var(--stone);
      line-height: 1.6;
      font-weight: 500;
      max-width: 360px;
      margin-top: 14px;
    }

    .result-display { position: relative; z-index: 1; }
    .result-mega {
      font-family: var(--f-display);
      font-size: 56px;
      font-weight: 700;
      letter-spacing: -2px;
      line-height: 1;
      color: var(--paper);
      transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
    }
    .result-unit {
      font-family: var(--f-mono);
      font-size: 10px;
      letter-spacing: 1px;
      color: var(--mist);
      margin-top: 8px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .cmp-table { width: 100%; border-collapse: collapse; }
    .cmp-table th {
      font-family: var(--f-mono);
      font-size: 9px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--mist);
      padding: 0 0 10px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      text-align: left;
    }
    .cmp-table th:not(:first-child) { text-align: right; }
    .cmp-table td {
      font-family: var(--f-mono);
      font-size: 12px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      color: var(--stone);
      font-weight: 500;
    }
    .cmp-table td:not(:first-child) { text-align: right; }
    .cmp-table tr.highlight td { color: var(--paper); font-weight: 700; }
    .cmp-table tr.highlight td:last-child { color: var(--goldlt); }

    .sliders-panel {
      border: 1px solid var(--bone);
      border-top: none;
      padding: 36px 44px;
      background: var(--cream);
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 28px 60px;
    }

    .sl-wrap { }
    .sl-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 10px;
    }
    .sl-label {
      font-family: var(--f-mono);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--stone);
    }
    .sl-value {
      font-family: var(--f-mono);
      font-size: 13px;
      font-weight: 700;
      color: var(--ink);
      background: var(--paper);
      border: 1px solid var(--bone);
      border-radius: 4px;
      padding: 4px 10px;
      min-width: 84px;
      text-align: right;
    }
    .sl-value:focus-visible { outline: 2px solid var(--hdfc-blue); border-color: transparent; }
    .sl-track {
      position: relative;
      height: 4px;
      background: var(--bone);
      border-radius: 2px;
    }
    .sl-fill {
      position: absolute;
      left: 0; top: 0; height: 100%;
      background: var(--hdfc-blue);
      border-radius: 2px;
      transition: width 0.1s ease;
    }
    .sl-thumb-pos {
      position: absolute;
      top: 50%;
      width: 14px; height: 14px;
      border-radius: 50%;
      background: var(--hdfc-blue);
      border: 2px solid #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transform: translate(-50%, -50%);
      transition: left 0.1s ease;
    }
    input[type=range].sl-input {
      position: absolute;
      width: 100%; height: 24px;
      opacity: 0;
      cursor: pointer;
      top: -10px; left: 0;
      margin: 0;
    }
    input[type=range].sl-input:focus-visible + .sl-thumb-pos { outline: 2px solid var(--hdfc-blue); outline-offset: 2px; }

    .chart-panel {
      border: 1px solid var(--bone);
      border-top: none;
      padding: 28px 44px;
      background: var(--paper);
    }
    .chart-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .chart-title-text {
      font-family: var(--f-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--ink);
    }
    .chart-legend { display: flex; gap: 20px; }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--f-mono);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--stone);
    }
    .legend-dot { width: 12px; height: 4px; border-radius: 2px; }

    .insight-card {
      background: var(--paper);
      border: 1px solid var(--bone);
      border-left: 3px solid var(--hdfc-red);
      padding: 16px 20px;
      margin-top: 2px;
    }
    .insight-meta {
      font-family: var(--f-mono);
      font-size: 9px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--hdfc-red);
      margin-bottom: 6px;
    }
    .insight-body {
      font-size: 13px;
      color: var(--stone);
      line-height: 1.6;
      font-family: var(--f-ui);
      font-weight: 500;
    }
    .insight-body strong { color: var(--ink); font-weight: 700; }

    .prog-track {
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      margin-top: 16px;
      position: relative;
    }
    .prog-fill {
      height: 100%;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--hdfc-blue), var(--goldlt));
      transition: width 0.6s cubic-bezier(0.23,1,0.32,1);
    }

    .ct {
      background: var(--paper);
      border: 1px solid var(--bone);
      border-radius: 4px;
      padding: 10px 14px;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .ct-label { font-family: var(--f-mono); font-size: 10px; font-weight: 600; color: var(--stone); margin-bottom: 5px; }
    .ct-row { display: flex; justify-content: space-between; gap: 20px; font-family: var(--f-mono); font-size: 11px; }
    .ct-name { color: var(--stone); font-weight: 600; }
    .ct-val { color: var(--ink); font-weight: 700; }

    .sr-only {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    .disclaimer {
      background: #fdf0ef;
      border: 1px solid rgba(218,56,50,0.25);
      border-radius: var(--r-md);
      padding: 24px;
      margin-top: 24px;
    }
    .disclaimer__heading {
      font-size: 12px;
      font-weight: 700;
      color: var(--hdfc-red);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .disclaimer__text {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.75;
    }

    @media (max-width: 800px) {
      .calc-hero { grid-template-columns: 1fr; }
      .calc-hero-left { border-right: none; border-bottom: 1px solid var(--bone); }
      .sliders-panel { grid-template-columns: 1fr; padding: 24px; gap: 20px; }
      .page { padding: 24px 24px 60px; }
      .header { padding: 0 24px; }
      .display-title { font-size: 32px; }
      .result-mega { font-size: 40px; }
      .chart-panel { padding: 20px 24px; }
    }
  `}</style>
);

// format currency (Indian style)
const fmt = (n) => {
  if (!isFinite(n) || isNaN(n)) return '—';
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

// animated counting effect for the big number
function useCounter(target, duration = 600) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current;
    const diff = target - from;
    if (diff === 0) return;
    const steps = Math.ceil(duration / 16);
    let i = 0;
    const t = setInterval(() => {
      i++;
      const ease = 1 - Math.pow(1 - i / steps, 3);
      setVal(Math.round(from + diff * ease));
      if (i >= steps) { setVal(target); prev.current = target; clearInterval(t); }
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

// custom slider component
const Sl = ({ id, label, value, min, max, step, onChange, fmt: fmtFn }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="sl-wrap">
      <div className="sl-row">
        <label htmlFor={id} className="sl-label">{label}</label>
        <input className="sl-value" type="text"
          value={fmtFn(value)}
          onChange={e => {
            const n = parseFloat(e.target.value.replace(/[^0-9.-]/g, ""));
            if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
        />
      </div>
      <div className="sl-track">
        <div className="sl-fill" style={{ width: `${pct}%` }} />
        <div className="sl-thumb-pos" style={{ left: `${pct}%` }}>
          <input type="range" id={id} className="sl-input" min={min} max={max} step={step} value={value}
            aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={fmtFn(value)}
            onChange={e => onChange(Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
};

// custom chart tooltip
const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ct">
      <div className="ct-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="ct-row">
          <span className="ct-name">{p.name}</span>
          <span className="ct-val">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// FV = PresentCost × (1 + inflation)^years
// SIP = FV × r / [((1+r)^n - 1) × (1+r)]
function calculateGoal({ currentCost, yearsToGoal, inflationRate, annualReturn }) {
  const inflatedGoal = currentCost * Math.pow(1 + inflationRate / 100, yearsToGoal);
  const n = yearsToGoal * 12;
  const r = annualReturn / 100 / 12;
  
  let requiredSIP = 0;
  if (r === 0) {
    requiredSIP = inflatedGoal / n;
  } else {
    requiredSIP = (inflatedGoal * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
  }
  return { inflatedGoal, requiredSIP, n, r };
}

// main calculator UI
const GoalPlanner = () => {
  const [currentCost, setCurrentCost] = useState(2000000);
  const [yearsToGoal, setYearsToGoal] = useState(15);
  const [inflationRate, setInflationRate] = useState(8);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [existingSavings, setExistingSavings] = useState(0);

  const { inflatedGoal, requiredSIP, n, r } = useMemo(
    () => calculateGoal({ currentCost, yearsToGoal, inflationRate, annualReturn }),
    [currentCost, yearsToGoal, inflationRate, annualReturn]
  );

  // lump sum also compounds monthly to stay consistent with SIP math
  const existingGrowth = existingSavings * Math.pow(1 + r, n);
  const remainingGoal = Math.max(0, inflatedGoal - existingGrowth);
  const sipWithSavings = remainingGoal > 0 ? (remainingGoal * r) / ((Math.pow(1 + r, n) - 1) * (1 + r)) : 0;
  
  const progress = Math.min(100, (existingGrowth / inflatedGoal) * 100);
  const animSIP = useCounter(Math.round(sipWithSavings));

  // build year-by-year data for the chart
  const chartData = useMemo(() => {
    const data = [];
    let savedCorpus = existingSavings;
    let newInvested = 0;
    
    for (let y = 1; y <= yearsToGoal; y++) {
      savedCorpus = savedCorpus * Math.pow(1 + r, 12);
      
      let sipCorpus = 0;
      for (let m = 0; m < 12; m++) {
        sipCorpus = sipCorpus * (1 + r) + sipWithSavings;
        newInvested += sipWithSavings;
      }
      
      data.push({
        yr: `Y${y}`,
        TotalCorpus: Math.round(savedCorpus + sipCorpus),
        InvestedValue: Math.round(existingSavings + newInvested)
      });
      savedCorpus += sipCorpus;
    }
    return data;
  }, [existingSavings, yearsToGoal, annualReturn, r, sipWithSavings]);

  const milestones = [25, 50, 75, 100].map(p => {
    const t = inflatedGoal * p / 100;
    const rg = Math.max(0, t - existingGrowth);
    return { p, t, sip: rg > 0 ? (rg * r) / ((Math.pow(1 + r, n) - 1) * (1 + r)) : 0 };
  });

  return (
    <>
      <div className="calc-hero">
        <div className="calc-hero-left">
          <div className="micro">Category: Investment Calculators</div>
          <h1 className="display-title">Goal-Based<br /><em>Investment</em><br />Calculator</h1>
          <div className="display-desc">
            Define your financial ambition. We reverse-engineer the exact monthly systematic investment needed to reach it — fully adjusting for inflation.
          </div>
        </div>
        <div className="calc-hero-right">
          <div className="corner-mark tl" /><div className="corner-mark tr" />
          <div className="corner-mark bl" /><div className="corner-mark br" />
          <div className="micro-light">Required Monthly SIP</div>
          <div className="result-display" aria-live="polite" aria-atomic="true">
            <div className="result-mega">{sipWithSavings <= 0 ? "Goal Met" : fmt(animSIP)}</div>
            <div className="result-unit">to reach {fmt(inflatedGoal)} (Inflated) in {yearsToGoal}yr</div>
          </div>
          
          <div style={{ marginTop: 20 }}>
            <div className="micro-light" style={{ marginBottom: 6 }}>Inflation-Adjusted Goal Coverage</div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--mist)", fontWeight: 600 }}>₹0</span>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--goldlt)", fontWeight: 700 }}>{progress.toFixed(1)}% funded by existing</span>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--mist)", fontWeight: 600 }}>{fmt(inflatedGoal)}</span>
            </div>
          </div>
          
          <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
             <table className="cmp-table">
              <thead><tr>
                <th>Milestone</th><th>Target Set</th><th>Req. SIP / mo</th>
              </tr></thead>
              <tbody>
                {milestones.map(m => (
                  <tr key={m.p} className={m.p === 100 ? "highlight" : ""}>
                    <td>{m.p}% of goal</td>
                    <td>{fmt(m.t)}</td>
                    <td>{m.sip <= 0 ? "✓ Covered" : fmt(m.sip)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="sliders-panel">
        <Sl id="sl-cost" label="Current Cost of Goal" value={currentCost} min={100000} max={20000000} step={50000}
          onChange={setCurrentCost} fmt={v => fmt(v)} />
        <Sl id="sl-years" label="Time Horizon" value={yearsToGoal} min={1} max={30} step={1}
          onChange={setYearsToGoal} fmt={v => `${v} yr`} />
        <Sl id="sl-inf" label="Assumed Inflation Rate" value={inflationRate} min={2} max={15} step={0.5}
          onChange={setInflationRate} fmt={v => `${v}% p.a.`} />
        <Sl id="sl-ret" label="Expected Return" value={annualReturn} min={4} max={20} step={0.5}
          onChange={setAnnualReturn} fmt={v => `${v}% p.a.`} />
        <div style={{ gridColumn: '1 / -1' }}>
           <Sl id="sl-exist" label="Existing Savings Allocated" value={existingSavings} min={0} max={10000000} step={10000}
            onChange={setExistingSavings} fmt={v => fmt(v)} />
        </div>
      </div>

      <div className="insight-card" aria-live="polite" aria-atomic="true">
        <div className="insight-meta">Impact Analysis</div>
        <div className="insight-body">
          Your current {fmt(currentCost)} goal will cost <strong>{fmt(inflatedGoal)}</strong> in {yearsToGoal} years at {inflationRate}% inflation.
          {existingSavings > 0 && <><br/>Allocating {fmt(existingSavings)} today drastically reduces your required monthly SIP to <strong>{fmt(sipWithSavings)}</strong>.</>}
        </div>
      </div>

      <figure className="chart-panel" style={{ position: "relative" }} aria-label="Projected corpus growth vs amount invested over time">
        <div className="sr-only">
          At your current settings, you will invest {fmt(existingSavings + (sipWithSavings * 12 * yearsToGoal))} over {yearsToGoal} years. Your projected corpus will be {fmt(inflatedGoal)} at {annualReturn}% expected return.
        </div>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "max(3vw, 24px)", fontWeight: "900", color: "var(--hdfc-blue)", opacity: 0.05, pointerEvents: "none", zIndex: 0, textTransform: "uppercase", letterSpacing: "8px", whiteSpace: "nowrap" }} aria-hidden="true">
          Illustrative Only
        </div>
        <div className="chart-header" style={{ position: "relative", zIndex: 1 }}>
          <span className="chart-title-text">Projected Trajectory</span>
          <div className="chart-legend" style={{ position: "relative", zIndex: 1 }}>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--hdfc-blue)" }} />Total Corpus</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--mist)" }} />Amount Invested</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="g-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--hdfc-blue)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--hdfc-blue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="yr" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CT />} />
            <Area type="monotone" dataKey="InvestedValue" stroke="var(--mist)" strokeWidth={2} fill="none" name="Amount Invested" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="TotalCorpus" stroke="var(--hdfc-blue)" strokeWidth={3} fill="url(#g-fill)" name="Estimated Corpus" />
          </AreaChart>
        </ResponsiveContainer>
      </figure>
    </>
  );
};

export default function App() {
  return (
    <>
      <Styles />

      <header className="header" role="banner">
        <div className="logo-group">
          <div className="logo-mark">HDFC <em>MUTUAL FUND</em></div>
        </div>
        <div className="header-right">
          <div className="header-stat">
            <div className="header-stat-label">FinCal Innovation</div>
            <div className="header-stat-value">Hackathon</div>
          </div>
        </div>
      </header>

      <main className="page" id="main-content">
        <GoalPlanner />
        
        <aside className="disclaimer" role="note" aria-labelledby="disclaimer-h">
          <h2 id="disclaimer-h" className="disclaimer__heading">
            Important Disclaimer
          </h2>
          <p className="disclaimer__text">
            This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
          </p>
        </aside>
      </main>
    </>
  );
}
