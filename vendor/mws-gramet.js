const Eo = ":host{display:flex;flex-direction:column;height:100%;position:relative;font:13px/1.4 system-ui,sans-serif;color:#0b0b0b;--gramet-accent: #2f6cb6;--gramet-panel-bg: #fcfcfb}.head{display:flex;align-items:baseline;gap:10px;padding:8px 12px;font-weight:600;border-bottom:1px solid #eceae4;flex:none}.title{flex:none}.subtitle{font-weight:400;color:#52514e;font-size:12px}.subtitle:empty{display:none}.layers{display:inline-flex;gap:12px;font-size:11px;font-weight:400;color:#52514e}.layers label{display:inline-flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap}.layers input[type=checkbox]{margin:0;cursor:pointer}.layers label.terrain{display:none}:host([path]) .layers label.terrain{display:inline-flex}.range-toggle{display:inline-flex;margin-left:auto;border:1px solid #c9c8c2;border-radius:6px;overflow:hidden}.range-toggle button{border:none;background:none;font:inherit;font-size:11px;font-weight:400;color:#52514e;padding:3px 9px;cursor:pointer}.range-toggle button+button{border-left:1px solid #c9c8c2}.range-toggle button.active{background:var(--gramet-accent);color:#fff;font-weight:600}.export-btn,.close-btn{margin-left:0;border:none;background:none;font-size:13px;color:#52514e;cursor:pointer;padding:0 4px}.close-btn{font-size:20px;margin-left:4px}.range-toggle+.export-btn{margin-left:8px}.export-btn:hover,.close-btn:hover{color:#0b0b0b}.plot{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}.body{flex:1;min-height:0;overflow:auto;padding:4px 0 8px;position:relative}.body-message{padding:12px;color:#52514e}.busy{position:absolute;top:8px;left:50%;transform:translate(-50%);z-index:6;pointer-events:none;background:#0b0b0bd1;color:#fff;font-size:11px;padding:4px 10px;border-radius:999px;box-shadow:0 1px 4px #00000040}.busy[hidden]{display:none}.notice{flex:none;background:#fdf1d6;color:#6b4a00;border-bottom:1px solid #e0be6d;font-size:11px;font-weight:600;text-align:center;padding:5px 10px}.notice[hidden]{display:none}.gm-plot{display:flex;align-items:flex-start;width:max-content;position:relative}.gm-canvas{display:block;cursor:crosshair;flex:none;position:relative;z-index:1}.gm-axis{display:block;flex:none;position:sticky;left:0;z-index:2}.gm-cursor{position:absolute;width:0;border-left:1px solid #0b0b0b;pointer-events:none;z-index:1}.gm-cursor[hidden]{display:none}.gm-cursor-dot{position:absolute;left:0;width:9px;height:9px;margin:-5px 0 0 -5px;border:1.5px solid #fff;border-radius:50%;box-shadow:0 0 0 1px #00000059}.gm-cursor-dot[hidden]{display:none}.gm-cursor-label{position:sticky;top:2px;width:max-content;transform:translate(-50%);background:#fcfcfbf2;border:1px solid #c9c8c2;border-radius:4px;padding:1px 5px;font-size:10px;font-variant-numeric:tabular-nums;white-space:nowrap;color:#0b0b0b}.gm-tip{position:absolute;pointer-events:none;background:#fcfcfbf7;border:1px solid #c9c8c2;border-radius:5px;padding:6px 8px;font-size:11px;line-height:1.5;color:#0b0b0b;box-shadow:0 1px 4px #00000026;white-space:nowrap;z-index:5}@media(max-width:700px),(max-height:500px){.head{flex-wrap:wrap;row-gap:6px;position:relative;padding-right:40px}.close-btn{position:absolute;top:8px;right:12px;margin-left:0}.layers{flex-wrap:wrap;row-gap:4px}}";
const ko = { icon_d2: 300, icon_eu: 1200 }, Ro = 950, Co = 96.5, Po = -35, zo = 0.1, Io = 8, Q = 0.1, _e = 0.5, jt = 150, De = 90, He = 1e-5, Ct = 1e3, ge = 5e3, Lo = 80, $o = 1609.344, Oo = 2e-5, Do = 5e-6;
function Ho(t, e) {
  const o = t > 0 ? t / Oo : 0, n = e > 0 ? e / Do : 0;
  return Pt(1 - Math.exp(-(o + n)), 0, 1);
}
const Pt = (t, e, o) => Math.max(e, Math.min(o, t)), Ge = 0.622;
function Go(t) {
  return 6.112 * Math.exp(17.62 * t / (243.12 + t));
}
function Bo(t) {
  return 6.112 * Math.exp(22.46 * t / (272.62 + t));
}
function Wo(t, e) {
  return !Number.isFinite(t) || !Number.isFinite(e) || t <= 0 ? NaN : t * e / (Ge + t * (1 - Ge));
}
function Ln(t) {
  return !Number.isFinite(t) || t >= 0 ? 0 : Pt((0 - t) / (0 - Po), 0, 1);
}
function Zo(t, e) {
  const o = Wo(t?.q, t?.p);
  if (!Number.isFinite(o) || !Number.isFinite(e))
    return Number.isFinite(t?.rh) ? t.rh : NaN;
  const n = Ln(e), i = (1 - n) * Go(e) + n * Bo(e);
  return i > 0 ? 100 * o / i : NaN;
}
function Be(t, e) {
  const o = Number.isFinite(t) ? Math.max(0, t) : 0, n = ko[e] ?? Ro;
  return 96 + -13 * Math.min(1, o / n);
}
function Uo(t, e, o, n) {
  const i = Ln(e);
  let s = (1 - i) * Be(t, n) + i * Co;
  const r = Number.isFinite(t) ? Math.max(0, t) : 0;
  if (r < jt) {
    const a = De + (Be(jt, n) - De) * (r / jt);
    s = Math.max(s, a);
  }
  return Number.isFinite(o) && (s -= Io * Math.tanh(o / zo)), s;
}
function Yo(t, e, o) {
  if (Number.isFinite(t?.clc)) return Pt(t.clc / 100, 0, 1);
  if (Number.isFinite(t?.qw) || Number.isFinite(t?.qi))
    return Ho(t?.qw || 0, t?.qi || 0);
  const n = t?.t, i = Zo(t, n);
  if (!Number.isFinite(i)) return 0;
  const s = Uo(e, n, o, t?.model);
  if (i <= s || s >= 100) return 0;
  const r = 1 - Math.sqrt(Math.max(0, (100 - i) / (100 - s)));
  return Pt(r, 0, 1);
}
function xo(t, e) {
  if (!Number.isFinite(t) || !Number.isFinite(e) || e <= 0) return NaN;
  const o = Math.min(e, 100), n = Math.log(o / 100) + 17.62 * t / (243.12 + t), i = 243.12 * n / (17.62 - n), s = 6e3 * Math.max(0, t - i) / Math.pow(o, 1.75);
  return Math.max(Ct, s * $o);
}
const Et = "https://open-meteo.wetterheidi.de", Me = "https://open-meteo.mah.priv.at", qo = "https://open-meteo-temp.mah.priv.at";
let J = "https://api.open-meteo.com";
function Xo() {
  return [Et, Me, J];
}
const tt = {
  icon_d2: {
    apiModel: "icon_d2",
    dataset: "dwd_icon_d2",
    label: "ICON-D2 (~2,2 km, Mitteleuropa)",
    apiBase: Et,
    apiFallbacks: [Me],
    grid: 0.02,
    gridMeters: 2200,
    nLevels: 65,
    bbox: { latMin: 43.18, latMax: 58.08, lonMin: -3.94, lonMax: 20.34 }
  },
  icon_eu: {
    apiModel: "icon_eu",
    dataset: "dwd_icon_eu",
    label: "ICON-EU (~6,5 km, Europa)",
    apiBase: Et,
    apiFallbacks: [Me],
    grid: 0.0625,
    gridMeters: 6500,
    nLevels: 74,
    bbox: { latMin: 29.5, latMax: 70.5, lonMin: -23.5, lonMax: 62.5 }
  },
  // Grid per Stichprobe ermittelt (nearest-neighbor-Sprünge alle 0,125° in
  // lat/lon, ausgerichtet auf Vielfache von 0,125 ab 0) — Open-Meteo regridded
  // das native icosahedrische ICON-Global-Gitter (~13 km) auf dieses reguläre
  // 0,125°-Raster. bbox global, da kein Ausschnitt wie bei D2/EU.
  icon_global: {
    apiModel: "icon_global",
    dataset: "dwd_icon",
    label: "ICON (~13 km, global)",
    apiBase: Et,
    apiFallbacks: [qo],
    grid: 0.125,
    gridMeters: 13915,
    nLevels: 120,
    bbox: { latMin: -90, latMax: 90, lonMin: -180, lonMax: 180 }
  }
};
let Jt = [
  "temperature_2m",
  "relative_humidity_2m",
  "dew_point_2m",
  "precipitation",
  "weather_code",
  "cloud_cover",
  "cloud_cover_low",
  "cloud_cover_mid",
  "cloud_cover_high",
  "wind_speed_10m",
  "wind_gusts_10m",
  "wind_direction_10m"
], Vo = [
  "precipitation_probability",
  "visibility",
  "cape",
  "freezing_level_height",
  "snowfall"
  // Niederschlagsphase im GRAMET-Meteogramm (meteokit/gramet)
];
function $n(t) {
  const e = tt[t];
  if (!e) throw new Error(`Unbekanntes Modell: ${t}`);
  return e;
}
const Ko = 300 * 1e3, Fe = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), jo = /* @__PURE__ */ new Set(), On = (t, e) => e?.aborted || t?.name === "AbortError", ve = (t, e, o) => `${t}|${e}|${o ?? ""}`;
function Dn(t) {
  return [...new Set([t.apiBase, ...t.apiFallbacks || []].filter(Boolean))];
}
function Hn(t, e, o) {
  const n = Date.now(), i = [], s = [];
  for (const r of new Set(t.filter(Boolean))) {
    const a = Fe.get(ve(r, e, o));
    (a != null && n - a < Ko ? s : i).push(r);
  }
  return [...i, ...s];
}
function Gn(t, e, o) {
  Fe.set(ve(t, e, o), Date.now());
}
function Bn(t, e, o, n) {
  if (Fe.delete(ve(e, n, t)), t == null) return;
  const i = o[0], s = ye.get(t), r = { key: t, base: e, preferred: i, fallback: e !== i, at: Date.now() };
  if (ye.set(t, r), s?.base !== e) for (const a of jo) a(r, Qo());
}
async function Jo(t, e, { fetchImpl: o, signal: n, sourceKey: i } = {}) {
  const s = o || fetch.bind(globalThis), r = e.split("?")[0];
  let a = null, l = null;
  for (const c of Hn(t, r, i)) {
    try {
      const u = await s(`${c}${e}`, n ? { signal: n } : void 0);
      if (u.ok)
        return Bn(i, c, t, r), u;
      a = u;
    } catch (u) {
      if (On(u, n)) throw u;
      l = u;
    }
    Gn(c, r, i);
  }
  if (a) return a;
  throw l || new Error("Kein API-Host konfiguriert");
}
async function Wn(t, e, { fetchImpl: o, signal: n, sourceKey: i, validate: s, withBase: r } = {}) {
  const a = o || fetch.bind(globalThis), l = e.split("?")[0];
  let c = null;
  for (const u of Hn(t, l, i)) {
    try {
      const f = await a(`${u}${e}`, n ? { signal: n } : void 0), h = await f.text();
      let p;
      try {
        p = JSON.parse(h);
      } catch {
        throw new Error(`Serverfehler: ${h.slice(0, 180)}`);
      }
      if (!f.ok || p.error) {
        const d = new Error(p.reason ? `API-Fehler: ${String(p.reason).slice(0, 180)}` : `API-Fehler ${f.status}`);
        throw d.status = f.status, d;
      }
      if (s && !s(p)) throw new Error("Unbrauchbare Antwort");
      return Bn(i, u, t, l), r ? { data: p, base: u } : p;
    } catch (f) {
      if (On(f, n)) throw f;
      c = f;
    }
    Gn(u, l, i);
  }
  throw c || new Error("Kein API-Host konfiguriert");
}
function Qo() {
  return [...ye.values()];
}
function Zn(t) {
  return t && typeof t == "object" ? { start_date: t.startDate, end_date: t.endDate } : { forecast_days: String(t) };
}
async function ti(t, e, o, n, i = fetch.bind(globalThis)) {
  const s = $n(o), r = await ni(t, e, i), a = (T) => {
    const w = new URLSearchParams({
      latitude: st(t),
      longitude: st(e),
      hourly: T.join(","),
      daily: "sunrise,sunset",
      models: s.apiModel,
      timeformat: "unixtime",
      ...Zn(n),
      cell_selection: "nearest"
    });
    return r != null && w.set("elevation", String(r)), `/v1/forecast?${w}`;
  }, l = (T) => (T.hourly?.temperature_2m || []).some(Number.isFinite), c = [...Jt, ...Vo], u = Dn(s);
  let f = null, h = null;
  for (const T of [c, Jt])
    try {
      ({ data: f, base: h } = await Wn(u, a(T), {
        fetchImpl: i,
        sourceKey: "surface",
        validate: l,
        withBase: !0
      }));
      break;
    } catch {
    }
  if (f || (f = await te(`${J}${a(c)}`, i) || await te(`${J}${a(Jt)}`, i), h = J), !f) throw new Error("Oberflächendaten konnten nicht geladen werden");
  const p = {};
  for (const T of Object.keys(f.hourly || {})) T !== "time" && (p[T] = h);
  if (h !== J) {
    const T = c.filter((w) => !(f.hourly?.[w] || []).some(Number.isFinite));
    if (T.length) {
      const w = await te(`${J}${a(T)}`, i);
      w && ei(f, w, T, p, J);
    }
  }
  const d = f.hourly || {}, m = d.time || [], b = {};
  for (const T of Object.keys(d))
    T !== "time" && (b[T] = d[T]);
  const _ = f.daily || {}, M = [], g = _.sunrise || [], y = _.sunset || [];
  for (let T = 0; T < Math.min(g.length, y.length); T++)
    M.push({ sunrise: g[T], sunset: y[T] });
  const N = b.temperature_2m ? Un(b.temperature_2m) + 1 : m.length, F = (T) => N < T.length ? T.slice(0, N) : T, S = {};
  for (const T of Object.keys(b)) S[T] = F(b[T]);
  return {
    time: F(m),
    units: f.hourly_units || {},
    vars: S,
    elevation: r ?? f.elevation,
    elevationIsDem: r != null,
    nights: M,
    varSources: p
  };
}
function ei(t, e, o, n, i) {
  const s = t.hourly?.time || [], r = e.hourly?.time || [], a = new Map(r.map((l, c) => [l, c]));
  for (const l of o) {
    const c = e.hourly?.[l];
    !c || !c.some(Number.isFinite) || (t.hourly[l] = s.map((u) => a.has(u) ? c[a.get(u)] ?? null : null), e.hourly_units?.[l] && ((t.hourly_units ||= {})[l] = e.hourly_units[l]), n[l] = i);
  }
}
const Qt = /* @__PURE__ */ new Map();
async function ni(t, e, o) {
  const n = `${st(t)},${st(e)}`;
  if (Qt.has(n)) return Qt.get(n);
  const i = (s) => Array.isArray(s.elevation) ? s.elevation[0] : s.elevation;
  try {
    const s = new URLSearchParams({ latitude: st(t), longitude: st(e) }), r = await Wn(Xo(), `/v1/elevation?${s}`, {
      fetchImpl: o,
      sourceKey: "elevation",
      validate: (a) => Number.isFinite(i(a))
    });
    return Qt.set(n, i(r)), i(r);
  } catch {
    return null;
  }
}
async function te(t, e) {
  try {
    const o = await e(t), n = await o.text();
    let i;
    try {
      i = JSON.parse(n);
    } catch {
      return null;
    }
    return !o.ok || i.error ? null : i;
  } catch {
    return null;
  }
}
function oi(t, e) {
  if (!t.length) return -1;
  const o = e / 1e3;
  let n = 0, i = 1 / 0;
  for (let s = 0; s < t.length; s++) {
    const r = Math.abs(t[s] - o);
    if (r < i)
      i = r, n = s;
    else if (t[s] > o) break;
  }
  return n;
}
function st(t) {
  return Math.round(t * 1e5) / 1e5;
}
function Un(...t) {
  let e = -1;
  for (const o of t)
    if (o) {
      for (let n = o.length - 1; n > e; n--)
        if (Number.isFinite(o[n])) {
          e = n;
          break;
        }
    }
  return e;
}
const We = 1 / 3.6;
function Ze(t, e) {
  const o = ["pressure_msl"];
  for (let n = 1; n <= t; n++)
    o.push(
      `wind_u_component_level${n}`,
      `wind_v_component_level${n}`,
      `temperature_level${n}`,
      `height_agl_level${n}`,
      `relative_humidity_level${n}`,
      `pressure_level${n}`,
      `wind_w_level${n}`,
      `specific_humidity_level${n}`
    ), e && o.push(`cloud_water_level${n}`, `cloud_ice_level${n}`, `cloud_cover_level${n}`);
  return o;
}
const ii = /* @__PURE__ */ new Set([429, 500, 502, 503, 504]), Ue = 3, Ye = 900, si = (t) => new Promise((e) => setTimeout(e, t));
async function ri(t, e, o, n, i, s) {
  const r = new URLSearchParams({
    latitude: qe(t),
    longitude: qe(e),
    hourly: i.join(","),
    models: o.apiModel,
    timeformat: "unixtime",
    ...Zn(n),
    cell_selection: "nearest"
  });
  let a;
  try {
    a = await Jo(Dn(o), `/v1/forecast?${r}`, {
      fetchImpl: s,
      sourceKey: o.apiModel
    });
  } catch (h) {
    return { error: `Netzwerkfehler: ${h.message}`, retryable: !0 };
  }
  const l = ii.has(a.status), c = Number(a.headers?.get?.("retry-after")) * 1e3 || 0, u = await a.text();
  let f;
  try {
    f = JSON.parse(u);
  } catch {
    return { error: `Serverfehler: ${u.slice(0, 150)}`, retryable: l, retryAfterMs: c };
  }
  return !a.ok || f.error ? { error: li(a.status, f.reason), retryable: l, retryAfterMs: c } : { data: f };
}
function li(t, e) {
  return t === 429 ? "Server überlastet (zu viele Anfragen) — bitte kurz warten" : t >= 500 ? `Server vorübergehend nicht erreichbar (${t})` : e ? `API: ${e.slice(0, 150)}` : `API-Fehler ${t}`;
}
async function xe(t, e, o, n, i, s) {
  let r;
  for (let a = 0; a <= Ue; a++) {
    if (r = await ri(t, e, o, n, i, s), !r.error || !r.retryable || a === Ue) return r;
    const l = Ye * 2 ** a + Math.random() * Ye;
    await si(Math.max(r.retryAfterMs || 0, l));
  }
  return r;
}
async function ai(t, e, o, n, i = fetch.bind(globalThis)) {
  const s = $n(o);
  let r = await xe(t, e, s, n, Ze(s.nLevels, !0), i);
  if (r.error && !r.retryable && (r = await xe(t, e, s, n, Ze(s.nLevels, !1), i)), r.error) throw new Error(r.error);
  const a = r.data, l = a.hourly, c = l.time, u = c.length, f = [], h = [], p = [], d = [], m = [], b = [], _ = [], M = [], g = [], y = [], N = [];
  for (let v = s.nLevels; v >= 1; v--)
    f.push(q(l[`height_agl_level${v}`], u, 1)), h.push(q(l[`wind_u_component_level${v}`], u, We)), p.push(q(l[`wind_v_component_level${v}`], u, We)), d.push(q(l[`temperature_level${v}`], u, 1)), m.push(q(l[`relative_humidity_level${v}`], u, 1)), b.push(q(l[`pressure_level${v}`], u, 1)), _.push(q(l[`wind_w_level${v}`], u, 1)), M.push(q(l[`specific_humidity_level${v}`], u, 1e-3)), g.push(q(l[`cloud_water_level${v}`], u, 1e-3)), y.push(q(l[`cloud_ice_level${v}`], u, 1e-3)), N.push(q(l[`cloud_cover_level${v}`], u, 1));
  const F = q(l.pressure_msl, u, 1), S = Un(d[0]) + 1, T = (v) => S < v.length ? v.slice(0, S) : v, w = (v) => S < u ? v.map(T) : v;
  return {
    time: T(c),
    h: w(f),
    u: w(h),
    v: w(p),
    t: w(d),
    rh: w(m),
    p: w(b),
    w: w(_),
    q: w(M),
    qw: w(g),
    qi: w(y),
    clc: w(N),
    pmsl: T(F),
    nLevels: f.length,
    elevation: a.elevation,
    model: o
  };
}
function ci(t, e, o) {
  const n = (e - t + 540) % 360 - 180;
  return (t + n * o + 360) % 360;
}
function q(t, e, o) {
  const n = new Float64Array(e);
  for (let i = 0; i < e; i++) n[i] = t?.[i] == null ? NaN : t[i] * o;
  return n;
}
function qe(t) {
  return Math.round(t * 1e5) / 1e5;
}
function ui(t, e, o) {
  const n = t.time.findIndex((r) => r >= e);
  if (n < 0) return { ...t, time: [], ...Xe(t, () => []), pmsl: [] };
  let i = t.time.length;
  for (; i > n && t.time[i - 1] > o; ) i--;
  const s = (r) => r.slice(n, i);
  return { ...t, time: s(t.time), ...Xe(t, s), pmsl: t.pmsl ? s(t.pmsl) : t.pmsl };
}
function Xe(t, e) {
  const o = {};
  for (const n of ["h", "u", "v", "t", "rh", "p", "w", "q", "qw", "qi", "clc"])
    t[n] && (o[n] = t[n].map(e));
  return o;
}
const Yn = 273.15, fi = 1e5, hi = 0.2857, pi = 9.80665;
function di(t, e, o, n) {
  const i = t.nLevels, s = t.time, r = s.length, a = new Float32Array(r * i), l = new Float32Array(r * i), c = new Float32Array(r * i), u = new Float32Array(r * i), f = new Float32Array(r * i), h = new Float32Array(r * i), p = new Float32Array(r * i), d = new Float32Array(r * i), m = new Float32Array(r * i), b = new Float32Array(r * i), _ = new Float32Array(r * i);
  for (let M = 0; M < r; M++)
    for (let g = 0; g < i; g++) {
      const y = M * i + g;
      a[y] = t.h[g][M], l[y] = t.t[g][M] + Yn, c[y] = t.u[g][M], u[y] = t.v[g][M], f[y] = t.w ? t.w[g][M] : NaN, h[y] = t.q ? t.q[g][M] : NaN, p[y] = t.qw ? t.qw[g][M] : NaN, d[y] = t.qi ? t.qi[g][M] : NaN, m[y] = t.clc ? t.clc[g][M] : NaN, b[y] = t.rh ? t.rh[g][M] : NaN, _[y] = t.p ? t.p[g][M] * 100 : NaN;
    }
  return {
    meta: { lat: o, lon: n, elevation: t.elevation, model: t.model, dt: r > 1 ? s[1] - s[0] : 3600, mode: "point" },
    times: s,
    nk: i,
    // X-Achsen-Positionswert getrennt von `times` (Kalenderzeit) gehalten:
    // im Point-Modus identisch zu `times`, im Path-Modus (s. `gridFromWaypoints`)
    // verstrichene Sekunden seit Pfadbeginn -- nur der Renderer liest `pos` für
    // die X-Position, alles Kalenderbezogene (Tageslicht, Achsenbeschriftung,
    // Tooltips) bleibt auf `times`.
    pos: Float64Array.from(s),
    lat: new Float64Array(r).fill(o),
    lon: new Float64Array(r).fill(n),
    elevation: new Float32Array(r).fill(t.elevation),
    z: a,
    T: l,
    u: c,
    v: u,
    w: f,
    qv: h,
    qw: p,
    qi: d,
    clc: m,
    rh: b,
    p: _,
    surface: mi(e, s, t),
    derived: null
  };
}
function mi(t, e, o) {
  const n = e.length, i = new Float32Array(n).fill(NaN), s = new Float32Array(n).fill(NaN), r = new Float32Array(n).fill(NaN), a = new Float32Array(n).fill(NaN), l = new Float32Array(n).fill(NaN), c = new Float32Array(n).fill(NaN), u = new Float32Array(n).fill(NaN), f = new Float32Array(n).fill(NaN), h = new Float32Array(n).fill(NaN), p = new Float32Array(n).fill(NaN), d = o?.pmsl ? Float32Array.from(o.pmsl) : new Float32Array(n).fill(NaN);
  if (!t?.time?.length)
    return { t2m: i, td2m: s, ws10: r, wd10: a, gust: l, precip: c, snow: u, cape: f, wcode: h, visibility: p, pmsl: d };
  const m = t.vars || {}, b = (_, M, g = 1) => {
    const y = m[_];
    if (y)
      for (let N = 0; N < n; N++) {
        const F = oi(t.time, e[N] * 1e3), S = F >= 0 && Math.abs(t.time[F] - e[N]) <= 1800 ? y[F] : null;
        M[N] = S == null ? NaN : S * g;
      }
  };
  return b("temperature_2m", i), b("dew_point_2m", s), b("wind_speed_10m", r, 1 / 3.6), b("wind_direction_10m", a), b("wind_gusts_10m", l, 1 / 3.6), b("precipitation", c), b("snowfall", u), b("cape", f), b("weather_code", h), b("visibility", p), { t2m: i, td2m: s, ws10: r, wd10: a, gust: l, precip: c, snow: u, cape: f, wcode: h, visibility: p, pmsl: d };
}
function xn(t, e, o) {
  const { nk: n } = t, i = e * n;
  let s = 1;
  for (; s < n && t.z[i + s] < o; ) s++;
  s >= n && (s = n - 1);
  const r = i + s - 1, a = i + s, l = t.z[r], c = t.z[a], u = c > l ? _i((o - l) / (c - l)) : 0, f = (b) => b[r] + u * (b[a] - b[r]), h = (Math.atan2(-t.u[r], -t.v[r]) * 180 / Math.PI + 360) % 360, p = (Math.atan2(-t.u[a], -t.v[a]) * 180 / Math.PI + 360) % 360, d = Math.hypot(t.u[r], t.v[r]), m = Math.hypot(t.u[a], t.v[a]);
  return {
    z: o,
    T: f(t.T),
    dir: ci(h, p, u),
    spd: d + u * (m - d),
    w: f(t.w),
    rh: f(t.rh),
    p: f(t.p),
    cloudFrac: f(Se(t).cloudFrac)
  };
}
function bi(t, e) {
  return Yo({
    q: t.qv[e],
    p: t.p[e] / 100,
    t: t.T[e] - Yn,
    rh: t.rh[e],
    qw: t.qw[e],
    qi: t.qi[e],
    clc: t.clc[e],
    model: t.meta.model
  }, t.z[e], t.w[e]);
}
function Se(t) {
  if (t.derived) return t.derived;
  const { nk: e, times: o } = t, n = o.length, i = n * e, s = new Float32Array(i), r = new Float32Array(i), a = new Float32Array(i);
  for (let d = 0; d < i; d++)
    s[d] = t.T[d] * Math.pow(fi / t.p[d], hi), r[d] = Math.hypot(t.u[d], t.v[d]), a[d] = bi(t, d);
  const l = Math.max(0, e - 1), c = new Float32Array(n * l), u = new Float32Array(n * l), f = new Float32Array(n * l), h = new Float32Array(n * l), p = new Float32Array(n * l);
  for (let d = 0; d < n; d++) {
    const m = d * e, b = t.z[m], _ = t.u[m], M = t.v[m];
    for (let g = 0; g < l; g++) {
      const y = d * e + g, N = d * e + g + 1, F = d * l + g, S = t.z[N] - t.z[y];
      if (!(S > 0)) {
        c[F] = NaN, u[F] = NaN, f[F] = NaN, h[F] = NaN, p[F] = NaN;
        continue;
      }
      const T = t.u[N] - t.u[y], w = t.v[N] - t.v[y], v = (T / S) ** 2 + (w / S) ** 2, R = (s[y] + s[N]) / 2, k = s[N] - s[y], $ = pi / R * (k / S);
      c[F] = v, u[F] = $, f[F] = v > 1e-8 ? $ / v : NaN;
      const O = Ve(t.z[N], b) - Ve(t.z[y], b), W = Number.isFinite(O) ? O : 0, I = T - _ * W, D = w - M * W, C = (I / S) ** 2 + (D / S) ** 2;
      h[F] = C, p[F] = C > 1e-8 ? $ / C : NaN;
    }
  }
  return t.derived = { theta: s, wspd: r, cloudFrac: a, shear2: c, n2: u, ri: f, shear2Ex: h, riEx: p, nm: l }, t.derived;
}
const Nt = 0.1;
function Ve(t, e) {
  return !(t > Nt) || !(e > Nt) ? NaN : Math.log(t / Nt) / Math.log(e / Nt);
}
function _i(t) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}
const qn = Math.PI / 180, Ae = 180 / Math.PI, rt = (t) => Math.sin(t * qn), et = (t) => Math.cos(t * qn), gi = (t) => Math.asin(Math.max(-1, Math.min(1, t))) * Ae, ee = (t, e) => Math.atan2(t, e) * Ae, lt = (t) => t - Math.floor(t / 360) * 360;
function Mi(t) {
  return t / 864e5 + 24405875e-1 - 24515435e-1;
}
function Xn(t) {
  const e = 282.9404 + 470935e-10 * t, o = lt(356.047 + 0.9856002585 * t), n = 0.016709 - 1151e-12 * t, i = o + n * Ae * rt(o) * (1 + n * et(o)), s = et(i) - n, r = Math.sqrt(1 - n * n) * rt(i), a = ee(r, s), l = Math.sqrt(s * s + r * r), c = lt(a + e), u = 23.4393 - 3563e-10 * t, f = l * et(c), h = l * rt(c), p = f, d = h * et(u), m = h * rt(u);
  return { RA: lt(ee(d, p)), Dec: ee(m, Math.sqrt(p * p + d * d)), Ls: lt(e + o), lon: c, M: o };
}
function yi(t, e, o, n) {
  const i = Mi(t), s = n(i), r = Xn(i).Ls, a = (t / 36e5 % 24 + 24) % 24, c = lt(r + 180) / 15 + a + o / 15, u = lt(c * 15 - s.RA);
  return gi(rt(e) * rt(s.Dec) + et(e) * et(s.Dec) * et(u));
}
function Ni(t, e, o) {
  return yi(t, e, o, Xn);
}
const Ke = 273.15;
function je(t, e) {
  return (t.qw[e] || 0) + (t.qi[e] || 0);
}
function Je(t, e, o, n) {
  const { nk: i } = t;
  let s = null;
  for (let r = 0; r < i; r++) {
    const a = e * i + r, l = n(a);
    if (!Number.isFinite(l)) break;
    if (l >= o) {
      s = t.z[a];
      continue;
    }
    if (s != null && r > 0) {
      const c = a - 1, u = n(c), f = t.z[c], h = t.z[a];
      s = u !== l ? f + (o - u) / (l - u) * (h - f) : f;
    }
    break;
  }
  return s;
}
function wi(t, e, o) {
  const { nk: n } = t, i = o * n, s = t.T[i] - Ke <= 0;
  if (je(t, i) > He)
    return { type: "FG", top: Je(t, o, He, (u) => je(t, u)), certain: !0, freezing: s };
  if (e[i] >= _e) {
    const u = Number.isFinite(t.clc[i]);
    return { type: "FG", top: Je(t, o, _e, (f) => e[f]), certain: u, freezing: s };
  }
  const r = t.surface?.visibility?.[o], a = t.rh[i];
  if (Number.isFinite(r))
    return r < Ct ? { type: "FG", top: null, certain: !0, freezing: s } : r <= ge ? { type: Number.isFinite(a) && a >= Lo ? "BR" : "HZ", top: null, certain: !0, freezing: !1 } : null;
  const l = t.surface?.wcode?.[o];
  if (l === 45 || l === 48)
    return { type: "FG", top: null, certain: !1, freezing: s };
  const c = xo(t.T[i] - Ke, a);
  return c <= ge ? { type: "BR", top: null, certain: !1, freezing: !1, visEst: c } : null;
}
function Ti(t, e) {
  const { times: o } = t, n = [];
  for (let i = 0; i < o.length; i++) n.push(wi(t, e, i));
  return n;
}
function Gt(t) {
  return {
    fog: t?.type === "FG",
    mist: t?.type === "BR",
    haze: t?.type === "HZ",
    freezing: t?.freezing ?? !1
  };
}
const Vn = 3.28084, Kn = 1.94384, x = { height: "m", wind: "kmh", temp: "c" };
function Ta({ height: t, wind: e, temp: o } = {}) {
  ["m", "ft"].includes(t) && (x.height = t), ["kmh", "ms", "kt"].includes(e) && (x.wind = e), ["c", "f"].includes(o) && (x.temp = o);
}
function wt(t) {
  return t == null || !Number.isFinite(t) ? "–" : x.height === "ft" ? `${Math.round(t * Vn)} ft` : `${Math.round(t)} m`;
}
function Fi() {
  return x.height === "ft" ? "ft" : "m";
}
function vi(t) {
  return x.height === "ft" ? t * Vn : t;
}
function Si(t) {
  if (t == null || !Number.isFinite(t)) return "–";
  switch (x.wind) {
    case "ms":
      return `${t.toFixed(1)} m/s`;
    case "kt":
      return `${Math.round(t * Kn)} kt`;
    default:
      return `${Math.round(t * 3.6)} km/h`;
  }
}
function Ai() {
  return x.wind === "ms" ? "m/s" : x.wind === "kt" ? "kt" : "km/h";
}
function Ei(t) {
  switch (x.wind) {
    case "ms":
      return t;
    case "kt":
      return t * Kn;
    default:
      return t * 3.6;
  }
}
function Qe(t) {
  return x.temp === "f" ? t * 9 / 5 + 32 : t;
}
function ki() {
  return x.temp === "f" ? "°F" : "°C";
}
function Ri(t) {
  return t == null || !Number.isFinite(t) ? "–" : x.temp === "f" ? `${Math.round(t * 9 / 5 + 32)} °F` : `${Math.round(t)} °C`;
}
const Ci = [
  "N",
  "NNO",
  "NO",
  "ONO",
  "O",
  "OSO",
  "SO",
  "SSO",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW"
];
function Pi(t) {
  const e = Math.round(t / 10) * 10 % 360;
  return e === 0 ? 360 : e;
}
function zi(t) {
  if (t == null || !Number.isFinite(t)) return "–";
  const e = (t % 360 + 360) % 360, o = Math.round(e / 22.5) % 16;
  return `${Ci[o]} ${Pi(e)}°`;
}
const Ii = {
  0: "NSW",
  1: "NSW",
  2: "NSW",
  3: "NSW",
  45: "FG",
  48: "FZFG",
  51: "-DZ",
  53: "DZ",
  55: "+DZ",
  56: "-FZDZ",
  57: "FZDZ",
  61: "-RA",
  63: "RA",
  65: "+RA",
  66: "-FZRA",
  67: "FZRA",
  71: "-SN",
  73: "SN",
  75: "+SN",
  77: "SG",
  80: "-SHRA",
  81: "SHRA",
  82: "+SHRA",
  83: "-SHRASN",
  85: "-SHSN",
  86: "SHSN",
  95: "TSRA",
  96: "TSGR",
  99: "+TSGR"
};
function Bt(t, e = null) {
  const o = parseInt(t, 10), n = Number.isNaN(o) ? "N/A" : Ii[o] || "N/A", i = n === "FG" || n === "FZFG";
  return n !== "NSW" && n !== "N/A" && !(i && e) ? n : e?.fog ? e.freezing ? "FZFG" : "FG" : e?.mist ? "BR" : e?.haze ? "HZ" : i ? "NSW" : n;
}
const Li = 273.15, ne = 0, tn = -2, en = -15, oe = -20, $i = 0.15, Oi = 0.3, Di = 0.45;
function Hi(t) {
  return !Number.isFinite(t) || t >= ne ? 0 : t >= tn ? (ne - t) / (ne - tn) : t >= en ? 1 : t >= oe ? (t - oe) / (en - oe) : 0;
}
function Gi(t, e) {
  const o = Number.isFinite(e) ? e : 0;
  return Hi(t) * o;
}
function Bi(t) {
  return !Number.isFinite(t) || t < $i ? "none" : t < Oi ? "light" : t < Di ? "moderate" : "severe";
}
function Wi(t, e) {
  const o = t.times.length * t.nk, n = new Array(o);
  for (let i = 0; i < o; i++) {
    const s = t.T[i] - Li;
    n[i] = Bi(Gi(s, e[i]));
  }
  return n;
}
const nn = 0.25, ie = 1, se = 0.02, on = 0.05, re = 5, sn = 10, Zi = 0.15, kt = 0.3, Ui = 0.6;
function Yi(t) {
  if (!Number.isFinite(t)) return 0;
  const e = Math.sqrt(t);
  return e <= se ? 0 : e >= on ? 1 : (e - se) / (on - se);
}
function xi(t) {
  return Number.isFinite(t) ? t <= nn ? 1 : t >= ie ? 0 : (ie - t) / (ie - nn) : 0;
}
function qi(t) {
  return !Number.isFinite(t) || t <= re ? 0 : t >= sn ? 1 : (t - re) / (sn - re);
}
function rn(t, e, o) {
  const n = Yi(e);
  if (n === 0) return 0;
  const i = xi(t) * n;
  return i <= kt ? i : kt + (i - kt) * qi(o);
}
function Xi(t) {
  return !Number.isFinite(t) || t < Zi ? "none" : t < kt ? "light" : t < Ui ? "moderate" : "severe";
}
function ln(t, e, o) {
  const n = e * t.nk + o, i = n + 1;
  return Math.hypot((t.u[n] + t.u[i]) / 2, (t.v[n] + t.v[i]) / 2);
}
function Vi(t, e, o, n) {
  const { nk: i, times: s } = t, r = s.length, a = new Array(r * i);
  for (let l = 0; l < r; l++)
    for (let c = 0; c < i; c++) {
      let u = -1;
      c > 0 && (u = Math.max(u, rn(e[l * n + c - 1], o[l * n + c - 1], ln(t, l, c - 1)))), c < n && (u = Math.max(u, rn(e[l * n + c], o[l * n + c], ln(t, l, c)))), a[l * i + c] = Xi(u < 0 ? NaN : u);
    }
  return a;
}
const X = 273.15, Ne = 287.05, at = 1004, pt = 9.80665, zt = 0.622, Ki = Ne / at, It = 5, jn = 120, Lt = 2500800, Jn = 0.6, Ee = 0.15, an = Jn * Ee, ji = (1 - Jn) * (2 * Ee), cn = 1e4, le = 0, un = 4e-3, Ji = 1e-6, Qi = 0.01;
function we(t) {
  return 611.2 * Math.exp(17.67 * t / (t + 243.5));
}
function fn(t) {
  return 611.2 * Math.exp(21.87 * t / (t + 265.5));
}
function ts(t) {
  if (t >= 0) return we(t);
  if (t <= -40) return fn(t);
  const e = -t / 40;
  return (1 - e) * we(t) + e * fn(t);
}
function ct(t, e) {
  const o = we(t);
  return zt * o / Math.max(e * 100 - o, 1);
}
function es(t, e) {
  const o = t * e * 100 / (t + zt), n = Math.log(Math.max(o / 611.2, 1e-10));
  return 243.5 * n / (17.67 - n);
}
function ns(t, e, o) {
  return t * Math.pow(o / e, Ki);
}
function Tt(t, e) {
  const o = t - X, n = ts(Math.max(o, -80)) / 100, i = zt * n / Math.max(e - n, 0.01), s = 2500800 - 2360 * o, r = 2834e3 - 340 * o, a = o >= 0 ? s : o <= -40 ? r : (1 + o / 40) * s + -o / 40 * r, l = e * 100, c = Ne * t + a * i, u = l * at + l * a * a * i * zt / (Ne * t * t);
  return c / u;
}
function os(t, e, o) {
  const n = o * 100, i = Tt(t, e) * n, s = Tt(t + i / 2, e + o / 2) * n, r = Tt(t + s / 2, e + o / 2) * n, a = Tt(t + r, e + o) * n;
  return t + (i + 2 * s + 2 * r + a) / 6;
}
function ke(t) {
  return Number.isFinite(t) && t > 0 ? t / Math.max(1 - t, 1e-6) : 0;
}
function is(t, e) {
  const { nk: o, surface: n } = t, i = e * o, s = t.p[i] / 100;
  if (!Number.isFinite(s)) return null;
  const r = n?.t2m?.[e], a = n?.td2m?.[e];
  if (Number.isFinite(r) && Number.isFinite(a)) {
    const u = ct(Math.min(a, r), s);
    return { w: hn(t, e, s, u), pSfc: s, tSfcC: r };
  }
  const l = t.T[i] - X, c = ke(t.qv[i]);
  return !Number.isFinite(l) || c <= 0 ? null : { w: hn(t, e, s, c), pSfc: s, tSfcC: l };
}
function hn(t, e, o, n) {
  const { nk: i } = t, s = o - 100;
  let r = o, a = n, l = 0, c = 0;
  for (let u = 1; u < i; u++) {
    const f = e * i + u, h = t.p[f] / 100;
    if (!Number.isFinite(h) || h >= r) continue;
    const p = ke(t.qv[f]), d = Math.max(h, s), m = r - d;
    if (m > 0 && (l += (a + p) / 2 * m, c += m), r = h, a = p, h <= s) break;
  }
  return c > 0 ? l / c : n;
}
function ss(t, e) {
  const { nk: o } = t, n = [], i = [], s = [], r = [];
  for (let l = 0; l < o; l++) {
    const c = e * o + l, u = t.p[c] / 100;
    !Number.isFinite(u) || !Number.isFinite(t.T[c]) || !Number.isFinite(t.z[c]) || (n.push(u), i.push(t.T[c]), s.push(t.z[c]), r.push(ke(t.qv[c])));
  }
  if (n.length < 2) return null;
  const a = n.length - 1;
  return (l) => {
    if (l >= n[0]) return { tK: i[0], z: s[0], w: r[0] };
    if (l <= n[a]) return null;
    for (let c = 1; c <= a; c++)
      if (n[c] <= l) {
        const u = (l - n[c - 1]) / (n[c] - n[c - 1]);
        return {
          tK: i[c - 1] + u * (i[c] - i[c - 1]),
          z: s[c - 1] + u * (s[c] - s[c - 1]),
          w: r[c - 1] + u * (r[c] - r[c - 1])
        };
      }
    return null;
  };
}
function rs(t, e, o, n) {
  const { nk: i } = t;
  let s = null;
  for (let r = 0; r < i; r++) {
    const a = e * i + r, l = t.p[a] / 100, c = t.T[a] - X, u = t.z[a];
    if (!Number.isFinite(l) || !Number.isFinite(c) || !Number.isFinite(u) || l > n + 1) continue;
    const f = es(o, l) - c;
    if (f >= 0) {
      if (!s) return { z: u, pHpa: l, tC: c };
      const h = s.d / (s.d - f);
      return {
        z: s.z + h * (u - s.z),
        pHpa: s.p + h * (l - s.p),
        tC: s.t + h * (c - s.t)
      };
    }
    s = { d: f, z: u, p: l, t: c };
  }
  return null;
}
function ls(t, e) {
  let o = e.tC + X, n = e.pHpa, i = e.z, s = 0, r = NaN, a = NaN, l = NaN, c = NaN, u = 0;
  for (let f = n - It; f >= jn; f -= It) {
    const h = t(f);
    if (!h) break;
    const p = os(o, n, f - n), d = p * (1 + 0.608 * ct(p - X, f)), m = h.tK * (1 + 0.608 * h.w), b = pt * (d - m) / m, _ = h.z - i, M = b * _;
    if (M > 0)
      s += M, r = h.z, a = p - X;
    else if (u > 0) {
      const g = u / (u - b);
      r = i + g * _, a = o + g * (p - o) - X, Number.isFinite(l) || (l = r, c = a);
    }
    o = p, n = f, i = h.z, u = b;
  }
  return { elZ: r, elTC: a, cape: s, elZFirst: l, elTFirst: c };
}
function pn(t, e, o) {
  return Math.min(Math.max(t, e), o);
}
function as(t, e, o, n) {
  let i = n;
  for (let s = 0; s < 6; s++) {
    const r = ct(i, e), a = at * (i + X) + Lt * r + pt * o, l = 0.5, c = (ct(i + l, e) - r) / l, u = at + Lt * c, f = i + (t - a) / u;
    if (Math.abs(f - i) < 0.01) return f;
    i = f;
  }
  return i;
}
function dn(t, e, o, n, i, s) {
  const r = at * n.tK + Lt * n.w + pt * n.z, a = t + e * (r - t) * o, l = as(a, i, n.z, s), c = (l + X) * (1 + 0.608 * ct(l, i)), u = n.tK * (1 + 0.608 * n.w), f = pt * (c - u) / u;
  return { tC: l, buoy: f, h: a };
}
function cs(t, e) {
  let o = e.tC, n = e.pHpa, i = e.z, s = at * (e.tC + X) + Lt * ct(e.tC, e.pHpa) + pt * e.z, r = 0, a = Qi, l = 0, c = NaN, u = NaN, f = NaN, h = NaN;
  for (let p = n - It; p >= jn && !(a <= Ji); p -= It) {
    const d = t(p);
    if (!d) break;
    const m = d.z - i, b = pn(an * r / a, le, un), _ = dn(s, b, m, d, p, o), M = (r + _.buoy) / 2;
    let g = M > 0 ? (a + ji * m * M) / (1 + m / cn) : (a + Ee * 2 * m * M) / (1 + m / cn + 2 * m * le);
    g = Math.max(g, 0);
    const y = g > 0 ? pn(an * _.buoy / g, le, un) : 0, N = (b + y) / 2, F = dn(s, N, m, d, p, _.tC), T = (r + F.buoy) / 2 * m;
    if (T > 0)
      l += T, c = d.z, u = F.tC;
    else if (r > 0) {
      const w = r / (r - F.buoy);
      c = i + w * m, u = o + w * (F.tC - o), Number.isFinite(f) || (f = c, h = u);
    }
    s = F.h, r = F.buoy, a = g, o = F.tC, n = p, i = d.z;
  }
  return { elZ: c, elTC: u, ecape: l, elZFirst: f, elTFirst: h };
}
function us(t) {
  const { times: e } = t, o = new Array(e.length).fill(null);
  for (let n = 0; n < e.length; n++) {
    const i = is(t, n);
    if (!i) continue;
    const s = rs(t, n, i.w, i.pSfc);
    if (!s) continue;
    const r = ss(t, n), a = r ? ls(r, s) : { elZ: NaN, elTC: NaN, cape: 0, elZFirst: NaN, elTFirst: NaN }, l = r ? cs(r, s) : { elZ: NaN, elTC: NaN, ecape: 0, elZFirst: NaN, elTFirst: NaN }, c = ns(s.tC + X, s.pHpa, i.pSfc) - X;
    o[n] = {
      cclZ: s.z,
      cclT: s.tC,
      taC: c,
      tSfcC: i.tSfcC,
      elZ: a.elZ,
      elT: a.elTC,
      cape: a.cape,
      elZFirstCross: a.elZFirst,
      elTFirstCross: a.elTFirst,
      elZDiluted: l.elZ,
      elTDiluted: l.elTC,
      ecape: l.ecape,
      elZDilutedFirstCross: l.elZFirst,
      elTDilutedFirstCross: l.elTFirst
    };
  }
  return o;
}
const K = 273.15, fs = 1.94384, mn = 30, hs = 1500, ps = [0, -20, -40], ds = [50, 75, 100], ae = 1, ms = 2e4, bs = 300, _s = 3, gs = 6e3, bn = -20, Ms = 1200, ys = 1500, Ns = 1524, ws = 1, Ts = 2e3, Fs = 0.2;
function _n(t) {
  const e = Se(t), o = ps.map((f) => ({ tempC: f, polylines: vs(t, f) })), n = ds.map((f) => ({ kt: f, polylines: dt(t, e.wspd, f / fs) })), i = As(t, e.theta).map((f) => ({
    thetaK: f,
    polylines: dt(t, e.theta, f, { pad: !1 })
  })), s = Rs(t), r = Ps(t), a = t.times.length, l = new Float32Array(a);
  for (let f = 0; f < a; f++) l[f] = zs(t, e.cloudFrac, f);
  const c = Ti(t, e.cloudFrac), u = Os(t, e.cloudFrac, l, s, c);
  return {
    isotherms: o,
    isotachs: n,
    isentropes: i,
    tropopause: s,
    daylight: r,
    cloudFrac: e.cloudFrac,
    cloudBase: l,
    precip: $s(t, l, c, u),
    cb: u,
    fog: c,
    hazards: {
      icing: Wi(t, e.cloudFrac),
      turbulence: Vi(t, e.riEx, e.shear2Ex, e.nm)
    }
  };
}
function vs(t, e) {
  const o = e + K, { nk: n, pos: i } = t, s = i.length, r = [], a = [];
  for (let l = 0; l < s; l++) {
    const c = Ss(t, l, o), u = c.length ? [c[0]] : [], f = new Array(u.length).fill(!1);
    for (const h of r) {
      if (h.lastI !== l - 1) continue;
      let p = -1, d = 1 / 0;
      for (let m = 0; m < u.length; m++) {
        if (f[m]) continue;
        const b = Math.abs(u[m] - h.lastZ);
        b < d && (d = b, p = m);
      }
      p >= 0 && d < hs && (f[p] = !0, h.line.push({ t: i[l], z: u[p] }), h.lastZ = u[p], h.lastI = l);
    }
    for (const h of r) h.lastI < l && h.line.length > 1 && a.push(h.line);
    for (let h = r.length - 1; h >= 0; h--) r[h].lastI < l && r.splice(h, 1);
    for (let h = 0; h < u.length; h++)
      f[h] || r.push({ line: [{ t: i[l], z: u[h] }], lastZ: u[h], lastI: l });
  }
  for (const l of r) l.line.length > 1 && a.push(l.line);
  return a;
}
function Ss(t, e, o) {
  const { nk: n } = t, i = [];
  for (let s = 0; s < n - 1; s++) {
    const r = e * n + s, a = e * n + s + 1, l = t.T[r], c = t.T[a];
    if (!(!Number.isFinite(l) || !Number.isFinite(c)) && l >= o != c >= o) {
      const u = (o - l) / (c - l);
      i.push(t.z[r] + u * (t.z[a] - t.z[r]));
    }
  }
  return i;
}
function As(t, e) {
  let o = 1 / 0, n = -1 / 0;
  for (let s = 0; s < e.length; s++) {
    const r = e[s];
    !Number.isFinite(r) || !(t.z[s] <= ms) || (r < o && (o = r), r > n && (n = r));
  }
  if (!(n > o)) return [];
  const i = [];
  for (let s = Math.ceil(o / ae) * ae; s <= n; s += ae) i.push(s);
  return i;
}
const Es = -1e6;
function dt(t, e, o, { pad: n = !0 } = {}) {
  const { nk: i, pos: s } = t, r = s.length, a = [], l = n ? -1 : 0, c = n ? r : r - 1, u = n ? i : i - 1, f = (p, d) => p < 0 || p >= r || d < 0 || d >= i ? Es : e[p * i + d], h = (p, d) => {
    const m = gn(p, r), b = gn(d, i);
    return { t: s[m], z: t.z[m * i + b] };
  };
  for (let p = l; p < c; p++)
    for (let d = l; d < u; d++) {
      const m = f(p, d), b = f(p + 1, d), _ = f(p + 1, d + 1), M = f(p, d + 1);
      if (![m, b, _, M].every(Number.isFinite)) continue;
      const g = h(p, d), y = h(p + 1, d), N = h(p + 1, d + 1), F = h(p, d + 1), S = Ft(m, b, o) ? vt(o, m, b, g, y) : null, T = Ft(b, _, o) ? vt(o, b, _, y, N) : null, w = Ft(M, _, o) ? vt(o, M, _, F, N) : null, v = Ft(m, M, o) ? vt(o, m, M, g, F) : null, R = [S, T, w, v].filter(Boolean);
      if (R.length === 2) {
        a.push(R);
        continue;
      }
      if (R.length === 4) {
        const k = (m + b + _ + M) / 4, $ = m >= o, O = _ >= o;
        ($ && O) === k >= o ? (a.push([S, v]), a.push([w, T])) : (a.push([S, T]), a.push([w, v]));
      }
    }
  return ks(a);
}
function gn(t, e) {
  return t < 0 ? 0 : t >= e ? e - 1 : t;
}
function Ft(t, e, o) {
  return t >= o != e >= o;
}
function vt(t, e, o, n, i) {
  const s = (t - e) / (o - e);
  return { t: n.t + s * (i.t - n.t), z: n.z + s * (i.z - n.z) };
}
function ks(t) {
  const e = (r) => `${r.t}|${r.z}`, o = /* @__PURE__ */ new Map();
  t.forEach((r, a) => {
    for (const l of [0, 1]) {
      const c = e(r[l]);
      o.has(c) || o.set(c, []), o.get(c).push({ si: a, end: l });
    }
  });
  const n = new Array(t.length).fill(!1), i = [], s = (r, a) => {
    for (; ; ) {
      const l = a ? r[r.length - 1] : r[0], u = (o.get(e(l)) || []).find(({ si: h }) => !n[h]);
      if (!u) return;
      n[u.si] = !0;
      const f = t[u.si][u.end === 0 ? 1 : 0];
      a ? r.push(f) : r.unshift(f);
    }
  };
  for (let r = 0; r < t.length; r++) {
    if (n[r]) continue;
    n[r] = !0;
    const a = [t[r][0], t[r][1]];
    s(a, !0), s(a, !1), i.push(a);
  }
  return i;
}
function Rs(t) {
  const { nk: e, pos: o } = t, n = o.length, i = [];
  for (let s = 0; s < n; s++) {
    let r = NaN;
    for (let a = 0; a < e; a++) {
      const l = s * e + a, c = t.z[l];
      if (!Number.isFinite(c) || c < 5e3 || !Number.isFinite(t.T[l])) continue;
      const u = c + 2e3;
      let f = !0, h = !1;
      for (let p = a + 1; p < e; p++) {
        const d = s * e + p, m = t.z[d];
        if (!Number.isFinite(m) || !Number.isFinite(t.T[d])) break;
        if (m > u) {
          h = !0;
          break;
        }
        if (-(t.T[d] - t.T[l]) / (m - c) * 1e3 > 2) {
          f = !1;
          break;
        }
      }
      if (f && h) {
        r = c;
        break;
      }
    }
    Number.isFinite(r) && i.push({ t: o[s], z: r });
  }
  return Cs(i);
}
function Cs(t) {
  if (t.length < 3) return t;
  const e = [t[0]];
  for (let o = 1; o < t.length - 1; o++)
    e.push({ t: t[o].t, z: (t[o - 1].z + t[o].z + t[o + 1].z) / 3 });
  return e.push(t[t.length - 1]), e;
}
function Ps(t) {
  const { times: e, lat: o, lon: n } = t, i = new Float32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const r = Ni(e[s] * 1e3, o[s], n[s]);
    i[s] = r >= 0 ? 1 : r <= -12 ? 0 : (r + 12) / 12;
  }
  return i;
}
function zs(t, e, o) {
  const { nk: n } = t;
  let i = null, s = null;
  for (let r = 0; r < n; r++) {
    const a = o * n + r, l = t.z[a];
    if (!Number.isFinite(l)) continue;
    const c = e[a];
    if (c >= Q && s != null && s < Q && i != null) {
      const u = (Q - s) / (c - s), f = i + u * (l - i);
      if (f >= mn) return f;
    } else if (c >= Q && s == null && l >= mn)
      return l;
    i = l, s = c;
  }
  return NaN;
}
const Is = 1200;
function Qn(t, e, o, n) {
  if (!Number.isFinite(n)) return NaN;
  const { nk: i } = t;
  let s = n, r = n;
  for (let a = 0; a < i; a++) {
    const l = o * i + a, c = t.z[l];
    if (!Number.isFinite(c) || c < n) continue;
    if (e[l] >= Q)
      r = c, s = c;
    else if (c - r > Is) break;
  }
  return s;
}
function Ls(t, e, o) {
  const { nk: n } = t;
  let i = NaN;
  for (let s = 0; s < n; s++) {
    const r = o * n + s;
    e[r] >= Q && (i = t.z[r]);
  }
  return i;
}
function to(t, e) {
  const { nk: o } = t;
  for (let n = 0; n < o - 1; n++) {
    const i = e * o + n, s = e * o + n + 1, r = t.T[i] - K, a = t.T[s] - K;
    if (r >= 0 && a < 0) {
      const l = r / (r - a);
      return t.z[i] + l * (t.z[s] - t.z[i]);
    }
  }
  return NaN;
}
function $s(t, e, o, n) {
  const i = [], { times: s, pos: r, surface: a } = t;
  if (!a) return i;
  const l = Se(t).cloudFrac;
  for (let c = 0; c < s.length; c++) {
    const u = Number.isFinite(a.wcode?.[c]) ? Bt(a.wcode[c], Gt(o[c])) : "N/A", f = a.precip[c], h = Number.isFinite(f) && f > Fs, p = u !== "NSW" && u !== "N/A";
    if (!h && (!p || (u === "FG" || u === "FZFG" || u === "BR" || u === "HZ"))) continue;
    const m = to(t, c), b = Qn(t, l, c, e[c]), _ = Ls(t, l, c), M = Number.isFinite(b) ? b : Number.isFinite(_) ? _ : Ts, g = n ? n[c] : null, y = g && Number.isFinite(g.top) ? Math.max(M, g.top) : M, N = u.includes("SN") || u.includes("SG") || !p && Number.isFinite(a.snow[c]) && a.snow[c] > 0, F = h ? f : 0.3;
    i.push({ t: r[c], zTop: y, freezingZ: m, type: N ? "sn" : "ra", rate: F });
  }
  return i;
}
function Os(t, e, o, n, i) {
  const { nk: s, times: r, pos: a, surface: l } = t, c = us(t), u = [];
  for (let f = 0; f < r.length; f++) {
    const h = Gs(n, a[f]), p = c[f], d = [p?.cclZ, o[f]].find((I) => Number.isFinite(I)), m = Number.isFinite(d) ? Qn(t, e, f, d) : NaN;
    let b = 0, _ = NaN;
    for (let I = 0; I < s; I++) {
      const D = f * s + I, C = t.z[D], A = t.w[D], ot = !Number.isFinite(h) || C < h;
      Number.isFinite(A) && ot && Math.abs(A) > b && (b = Math.abs(A)), e[D] >= _e && t.T[D] - K <= bn && Number.isFinite(m) && C <= m && (!Number.isFinite(_) || C > _) && (_ = C);
    }
    const M = Number.isFinite(l?.wcode?.[f]) ? Bt(l.wcode[f], Gt(i[f])) : "N/A", g = M.includes("TS"), y = M.includes("SH"), N = l?.cape ? l.cape[f] : NaN, F = Number.isFinite(N) && N >= bs && Number.isFinite(_), S = b >= _s && (Number.isFinite(_) || Number.isFinite(m)), T = Number.isFinite(p?.taC) && p.tSfcC >= p.taC - ws, w = Number.isFinite(_) ? _ : m, v = !T && (y || g) && Number.isFinite(w) ? w : Number.isFinite(p?.elZDiluted) ? p.elZDiluted : Number.isFinite(_) ? _ : Number.isFinite(m) ? m : gs, R = [p?.cclZ, o[f], 0].find((I) => Number.isFinite(I) && I < v) ?? 0, k = T && v - R >= ys;
    if (!g && !y && !k && !F && !S) {
      u.push(null);
      continue;
    }
    const $ = Ds(t, f), O = Number.isFinite($) && v - $ >= Ns;
    if (!O && !g && !y) {
      u.push(null);
      continue;
    }
    let W = "none";
    if (O) {
      const I = Hs(t, f, v), D = Number.isFinite(I) && I <= bn, C = Number.isFinite(h) && h - v < Ms;
      W = D && C ? "cb" : "tcu";
    }
    u.push({ base: R, top: v, kind: W });
  }
  return u;
}
function Ds(t, e) {
  const o = to(t, e);
  if (Number.isFinite(o)) return o;
  const { nk: n } = t;
  for (let i = 0; i < n; i++) {
    const s = t.T[e * n + i];
    if (Number.isFinite(s)) return s - K < 0 ? 0 : NaN;
  }
  return NaN;
}
function Hs(t, e, o) {
  const { nk: n } = t;
  let i = NaN, s = NaN;
  for (let r = 0; r < n; r++) {
    const a = e * n + r, l = t.z[a], c = t.T[a];
    if (!(!Number.isFinite(l) || !Number.isFinite(c))) {
      if (l >= o) {
        if (!Number.isFinite(i)) return c - K;
        const u = (o - i) / (l - i);
        return s + u * (c - s) - K;
      }
      i = l, s = c;
    }
  }
  return Number.isFinite(s) ? s - K : NaN;
}
function Gs(t, e) {
  if (!t || t.length < 2) return NaN;
  if (e <= t[0].t) return t[0].t === e ? t[0].z : NaN;
  for (let o = 1; o < t.length; o++)
    if (t[o].t >= e) {
      const n = t[o - 1], i = t[o];
      if (e - n.t > 2 * (i.t - n.t || 1)) return NaN;
      const s = (e - n.t) / (i.t - n.t);
      return n.z + s * (i.z - n.z);
    }
  return NaN;
}
function mt(t) {
  let e = 2166136261;
  for (let o = 0; o < t.length; o++)
    e ^= t.charCodeAt(o), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function Wt(t) {
  let e = t >>> 0;
  return function() {
    e |= 0, e = e + 1831565813 | 0;
    let o = Math.imul(e ^ e >>> 15, 1 | e);
    return o = o + Math.imul(o ^ o >>> 7, 61 | o) ^ o, ((o ^ o >>> 14) >>> 0) / 4294967296;
  };
}
function V(t, e, o, n = 0) {
  let i = t >>> 0;
  return i = Math.imul(i ^ (e | 0), 668265261) >>> 0, i = Math.imul(i ^ (o | 0), 374761393) >>> 0, i = Math.imul(i ^ (n | 0), 2246822507) >>> 0, i ^= i >>> 15, i = Math.imul(i, 739982445) >>> 0, i ^= i >>> 13, i = Math.imul(i, 695872825) >>> 0, ((i ^ i >>> 16) >>> 0) / 4294967296;
}
function $t(t, e, o, n = 0) {
  const i = Math.floor(e), s = Math.floor(o), r = Mn(e - i), a = Mn(o - s), l = V(t, i, s, n), c = V(t, i + 1, s, n), u = V(t, i, s + 1, n), f = V(t, i + 1, s + 1, n);
  return (l + (c - l) * r) * (1 - a) + (u + (f - u) * r) * a;
}
function Mn(t) {
  return t * t * (3 - 2 * t);
}
const L = {
  // Ellipsenform: flach und breit, das Seitenverhältnis macht den
  // Wolkencharakter aus.
  wMin: 8,
  wMax: 24,
  // Breite in px
  hMin: 3,
  hMax: 6,
  // Höhe in px
  // Dichte in der Zählweise des Tuners (Versuche = density * 800 auf dessen
  // 960x560-Fläche); unten auf die tatsächliche Chartfläche umgerechnet, der
  // Reglerwert wirkt hier also genauso wie dort.
  density: 35,
  // Ab welcher Wolkenfraktion überhaupt gezeichnet wird. ACHTUNG, das ist
  // keine reine Optik: Vorgabe ist die meteorologische FEW-Schwelle aus
  // `clouds.js`. Zieht man sie auf den Tuner-Vorgabewert 0.30 hoch,
  // verschwinden SCT-Schichten (0.25) vollständig aus dem Chart.
  threshold: Q,
  // Steilheit der Annahmekennlinie: p = min(1, (frac - threshold) * gain).
  // 1/gain ist die Spanne über der Schwelle bis zur vollen Dichte --
  // 1.33 entspricht "voll ab Bedeckung 0.85".
  gain: 1 / 2.5,
  // Maskenstörung: zwei Oktaven Value-Noise auf die Schwelle. `noiseScale`
  // ist die Frequenz in 1/px (Kehrwert der Wellenlänge: 0.0385 ~ 26 px),
  // `noiseAmp` die Amplitude in cloudFrac-Einheiten.
  noiseScale: 1 / 26,
  noiseAmp: 0.15,
  // Kontur.
  gray: 150,
  grayAlpha: 0.6,
  strokeWidth: 2
}, Bs = "#fff", Ws = 3;
function eo(t, e, o) {
  const n = e - t, i = n > 1 ? (o - t) / n : 0;
  return Math.pow(j(i, 0, 1), Ws);
}
function no(t) {
  if (t.length === 4)
    return {
      r: parseInt(t[1] + t[1], 16),
      g: parseInt(t[2] + t[2], 16),
      b: parseInt(t[3] + t[3], 16)
    };
  const e = parseInt(t.slice(1), 16);
  return { r: e >> 16 & 255, g: e >> 8 & 255, b: e & 255 };
}
function oo(t, e) {
  const o = t.r * 0.55, n = t.g * 0.6, i = Math.min(255, t.b * 0.68 + 15), s = Math.round(t.r + (o - t.r) * e), r = Math.round(t.g + (n - t.g) * e), a = Math.round(t.b + (i - t.b) * e);
  return `rgb(${s},${r},${a})`;
}
const Ot = 2.1, io = 0.65, so = 0.35, ro = 960 * 560, Zs = () => L.density * 800 / ro * 1e3, ut = 4, yn = /* @__PURE__ */ new WeakMap();
function Us(t, e, o, n, i) {
  const s = Math.max(1, Math.round(n.right - n.left)), r = Math.max(1, Math.round(i.bot - i.top)), a = [
    s,
    r,
    e.times.length,
    i.inv(i.top).toFixed(2),
    i.inv((i.top + i.bot) / 2).toFixed(2),
    i.inv(i.bot).toFixed(2)
  ].join("|");
  let l = yn.get(e);
  (!l || l.key !== a) && (l = { key: a, canvas: Ys(e, o, n, i, s, r) }, yn.set(e, l)), t.drawImage(l.canvas, n.left, i.top, s, r);
}
function Ys(t, e, o, n, i, s) {
  const r = window.devicePixelRatio || 1, a = document.createElement("canvas");
  a.width = Math.round(i * r), a.height = Math.round(s * r);
  const l = a.getContext("2d");
  return l.scale(r, r), l.translate(-o.left, -n.top), xs(l, t, e, o, n), a;
}
function xs(t, e, o, n, i) {
  const { meta: s, times: r } = e, a = Wt(mt(`${s.lat},${s.lon},${s.elevation},${r[0]}`)), l = mt(`noise:${s.lat},${s.lon},${r[0]}`), c = dr(e, o, n, i), u = L.wMax / 2, f = L.hMax / 2, h = n.left - u, p = i.top - f, d = n.right - n.left + 2 * u, m = i.bot - i.top + 2 * f, b = Math.round(Zs() * d * m / 1e3), _ = no(Bs);
  t.save(), t.beginPath(), t.rect(n.left, i.top, n.right - n.left, i.bot - i.top), t.clip(), t.lineWidth = L.strokeWidth;
  for (let M = 0; M < b; M++) {
    const g = h + a() * d, y = p + a() * m, N = c.at(g, y), F = Math.min(1, N / L.threshold), S = N + L.noiseAmp * F * br(l, g, y);
    if (S <= L.threshold || a() >= Math.min(1, (S - L.threshold) * L.gain)) continue;
    const T = L.wMin + a() * (L.wMax - L.wMin), w = L.hMin + a() * (L.hMax - L.hMin), v = c.shadeAt(g, y);
    t.fillStyle = oo(_, v);
    const R = L.gray - Math.round(40 * v);
    t.strokeStyle = `rgba(${R},${R},${R},${L.grayAlpha})`, t.beginPath(), t.ellipse(g, y, T / 2, w / 2, 0, 0, Math.PI * 2), t.fill(), t.stroke();
  }
  t.restore();
}
const ht = {
  wMin: 6,
  wMax: 14,
  hMin: 3,
  hMax: 6,
  // ~5-fache Überdeckung im Inneren -> Restlöcher < 1 %.
  density: 90,
  // Die Schaft-"Maske" ist eine Abstandsrampe (s. `paintRegion`): 1 tief im
  // Inneren, 0.5 exakt auf der weichen Kante, 0 eine Fransenbreite draußen.
  // threshold 0.5 legt die sichtbare Kante also auf die Geometrie, das
  // Rauschen verschiebt sie lokal um bis zu +-noiseAmp Rampeneinheiten.
  // gain ist an noiseAmp GEKOPPELT: 1/(1 - threshold - noiseAmp) ist der
  // kleinste Wert, bei dem das Innere (ramp = 1) auch beim ungünstigsten
  // Rauschwert (-noiseAmp) gesättigt bleibt -- darunter stanzt das koharente
  // Rauschen Löcher in den Schaft (bei einer nur ~28 px schmalen Säule liegt
  // fast alles im Fransenband, das fiel sofort auf). Wer noiseAmp erhöht,
  // muss gain mitziehen.
  threshold: 0.5,
  gain: 1 / (1 - 0.5 - 0.3),
  noiseScale: 1 / 14,
  noiseAmp: 0.3,
  // Halbe Breite der Abstandsrampe in px (Kante +- fringePx).
  fringePx: 9,
  fill: "#e9d5b5",
  gray: 130,
  grayAlpha: 0.75,
  strokeWidth: 1
}, Nn = {
  wMin: 8,
  wMax: 20,
  hMin: 3,
  hMax: 5,
  density: 70,
  threshold: 0.5,
  gain: 1 / (1 - 0.5 - 0.25),
  noiseScale: 1 / 18,
  noiseAmp: 0.25,
  fringePx: 8,
  fill: "#f3ebdc",
  gray: 140,
  grayAlpha: 0.7,
  strokeWidth: 1
}, qs = 0.22, Xs = 16, Vs = 60, Ks = 0.9, js = 18, Js = 80, Qs = 0.15, tr = 2.5, er = ht.noiseAmp * 2 * ht.fringePx + ht.hMax / 2, nr = "rgba(108,92,72,0.85)", ce = [2.2, 3.4], ue = [0.5, 0.75], fe = [0.45, 0.85], or = 1.5, ir = 7, sr = 26;
function rr(t, e, o, n) {
  const i = Wt(t ^ 1542469173), s = o - e, r = () => Math.max(
    ir,
    n * (ue[0] + (ue[1] - ue[0]) * i())
  ), a = () => [{ cx: (e + o) / 2, hw: Math.min(s / 2, r()) }];
  if (s <= n * or) return a();
  const l = [];
  let c = e + n * (fe[0] + (fe[1] - fe[0]) * i());
  for (; c < o; )
    l.push({ cx: c, hw: r() }), c += Math.max(
      sr,
      n * (ce[0] + (ce[1] - ce[0]) * i())
    );
  return l.length ? l : a();
}
function lr(t, e, o, n) {
  if (!e) return [];
  const { meta: i, times: s, pos: r } = t, a = r.length > 1 ? r[1] - r[0] : 3600, l = [];
  for (const [c, u] of hr(e, (f) => !!f)) {
    const f = [];
    for (let b = c; b <= u; b++)
      f.push({ cx: o(r[b]), yT: n(e[b].top), yB: n(Math.max(0, e[b].base)) });
    const h = o(r[c] - a / 2), p = o(r[u] + a / 2), d = f.length > 1 ? f[1].cx - f[0].cx : p - h, m = mt(`cb:${i.lat},${i.lon},${s[c]}`);
    for (const { cx: b, hw: _ } of rr(m, h, p, d)) {
      const M = b - _, g = b + _, y = Math.min(he(f, "yT", M), he(f, "yT", b), he(f, "yT", g));
      let N = c;
      for (let w = c; w <= u; w++)
        Math.abs(f[w - c].cx - b) < Math.abs(f[N - c].cx - b) && (N = w);
      const F = f[N - c].yB, S = () => F, T = mt(`cbcell:${i.lat},${i.lon},${s[c]}:${Math.round(b)}`);
      l.push({
        hour: N,
        t: r[N],
        kind: e[N].kind,
        cx: b,
        hw: _,
        x0: M,
        x1: g,
        yTop: y,
        yBot: F,
        hourPx: d,
        seed: T,
        top: fr(T, y, b, _),
        bot: S
      });
    }
  }
  return l;
}
function ar(t, e, o, n) {
  t.save(), ao(t, o, n), co(t, ht);
  for (const i of e) cr(t, i);
  t.restore();
}
function cr(t, e) {
  const { x0: o, x1: n, yTop: i, yBot: s, seed: r, top: a, bot: l } = e;
  if (!(!(n > o) || !(s > i))) {
    lo(t, r, ht, { x0: o, x1: n, hardBot: !0, salt: [2, 3], top: a, bot: l }), t.save(), t.beginPath();
    for (let c = 0; c <= 4; c++) {
      const u = o + (n - o) * c / 4;
      c === 0 ? t.moveTo(u, l(u)) : t.lineTo(u, l(u));
    }
    t.strokeStyle = nr, t.lineWidth = 1.5, t.stroke(), t.restore();
  }
}
function ur(t, e, o, n) {
  t.save(), ao(t, o, n), co(t, Nn);
  for (const i of e) {
    if (i.kind !== "cb" || i.yTop <= n.top + 0.5) continue;
    const { x0: s, x1: r, hourPx: a, yBot: l } = i, c = i.yTop - er, u = i;
    if (!(r > s) || !(l > c)) continue;
    const f = j(qs * (l - c), Xs, Vs), h = j(
      Math.min(Ks * a, 0.75 * (r - s)),
      js,
      Js
    ), p = (d) => {
      const m = d < s ? (s - d) / h : d > r ? (d - r) / h : 0, b = c + f * (1 - (1 - Qs) * Math.pow(j(m, 0, 1), 0.65));
      return m > 0 ? b : Math.min(Math.max(b, u.top(d)), c + tr * f);
    };
    lo(t, i.seed ^ 521288629, Nn, {
      x0: s - h,
      x1: r + h,
      hardTop: !0,
      salt: [4, 5],
      top: () => c,
      bot: p
    });
  }
  t.restore();
}
function fr(t, e, o, n) {
  const i = Wt(t ^ 2654435769), s = 2 + Math.floor(i() * 2), r = [];
  for (let l = 0; l < s; l++) {
    const c = s === 1 ? 0 : -1 + 2 * l / (s - 1);
    r.push({
      cx: o + c * n * 0.55 + (i() - 0.5) * n * 0.2,
      // Halbe Kuppelbreite so, dass die äußerste Kuppel (Mitte bei 0.55*hw)
      // über die Zellflanke bei hw hinausreicht -- sonst bliebe dort ein
      // abgeschnittener Absatz statt einer Rundung.
      w: n * (0.65 + 0.4 * i()),
      a: n * (0.55 + 0.45 * i()),
      // Scheitel dürfen nur nach unten abweichen (s. Ambossdeckel oben).
      y: e + n * 0.3 * i()
    });
  }
  const a = e + n * 1.1;
  return (l) => {
    let c = a;
    for (const u of r) {
      const f = (l - u.cx) / u.w;
      if (f <= -1 || f >= 1) continue;
      const h = u.y + u.a * (1 - Math.sqrt(1 - f * f));
      h < c && (c = h);
    }
    return c;
  };
}
function lo(t, e, o, n) {
  const { x0: i, x1: s, top: r, bot: a, hardTop: l = !1, hardBot: c = !1, salt: u = [2, 3] } = n, f = Wt(e), h = o.fringePx + o.wMax / 2, p = i - h, d = s + h;
  if (!(d > p)) return;
  const m = 96, b = new Float64Array(m + 1), _ = new Float64Array(m + 1), M = new Float64Array(m + 1);
  let g = 1 / 0, y = -1 / 0;
  for (let w = 0; w <= m; w++) {
    const v = p + (d - p) * w / m;
    b[w] = v, _[w] = r(v), M[w] = a(v), _[w] < g && (g = _[w]), M[w] > y && (y = M[w]);
  }
  const N = g - (l ? o.hMax / 2 : h), F = y + (c ? o.hMax / 2 : h);
  if (!(F > N)) return;
  if (t.save(), t.beginPath(), l) {
    t.moveTo(b[0], _[0]);
    for (let w = 1; w <= m; w++) t.lineTo(b[w], _[w]);
  } else
    t.moveTo(p, N), t.lineTo(d, N);
  if (c) for (let w = m; w >= 0; w--) t.lineTo(b[w], M[w]);
  else
    t.lineTo(d, F), t.lineTo(p, F);
  t.closePath(), t.clip();
  const S = no(o.fill), T = Math.round(o.density * 800 / ro * (d - p) * (F - N));
  for (let w = 0; w < T; w++) {
    const v = p + f() * (d - p), R = N + f() * (F - N);
    let k = Math.min(v - i, s - v);
    l || (k = Math.min(k, R - r(v))), c || (k = Math.min(k, a(v) - R));
    const O = j(0.5 + k / (2 * o.fringePx), 0, 1) + o.noiseAmp * pr(e, v, R, o.noiseScale, u);
    if (O <= o.threshold || f() >= Math.min(1, (O - o.threshold) * o.gain)) continue;
    const W = o.wMin + f() * (o.wMax - o.wMin), I = o.hMin + f() * (o.hMax - o.hMin);
    t.fillStyle = oo(S, eo(r(v), a(v), R)), t.beginPath(), t.ellipse(v, R, W / 2, I / 2, 0, 0, Math.PI * 2), t.fill(), t.stroke();
  }
  t.restore();
}
function hr(t, e) {
  const o = [];
  for (let n = 0; n < t.length; n++) {
    if (!e(t[n])) continue;
    let i = n;
    for (; i + 1 < t.length && e(t[i + 1]); ) i++;
    o.push([n, i]), n = i;
  }
  return o;
}
function he(t, e, o) {
  if (o <= t[0].cx) return t[0][e];
  for (let n = 1; n < t.length; n++)
    if (t[n].cx >= o) {
      const i = t[n - 1], s = t[n];
      return i[e] + (o - i.cx) / (s.cx - i.cx) * (s[e] - i[e]);
    }
  return t[t.length - 1][e];
}
function ao(t, e, o) {
  t.beginPath(), t.rect(e.left, o.top, e.right - e.left, o.bot - o.top), t.clip();
}
function co(t, e) {
  t.fillStyle = e.fill, t.strokeStyle = `rgba(${e.gray},${e.gray},${e.gray},${e.grayAlpha})`, t.lineWidth = e.strokeWidth;
}
function pr(t, e, o, n, i) {
  const s = $t(t, e * n, o * n, i[0]), r = $t(t, e * n * Ot, o * n * Ot, i[1]);
  return (io * s + so * r - 0.5) * 2;
}
function dr(t, e, o, n) {
  const { nk: i, times: s } = t, r = s.length, a = Math.max(2, Math.ceil((n.bot - n.top) / ut) + 1), l = new Float32Array(r * a);
  for (let h = 0; h < a; h++) {
    const p = n.inv(n.top + h * ut);
    for (let d = 0; d < r; d++) l[d * a + h] = mr(t, e, d, p, i);
  }
  const c = new Float32Array(r), u = new Float32Array(r);
  for (let h = 0; h < r; h++) {
    let p = -1, d = -1;
    for (let m = 0; m < a; m++)
      l[h * a + m] > L.threshold && (p < 0 && (p = m), d = m);
    c[h] = n.top + (p < 0 ? 0 : p) * ut, u[h] = n.top + (d < 0 ? 0 : d) * ut;
  }
  const f = o.right - o.left;
  return {
    at(h, p) {
      const d = j((h - o.left) / f * (r - 1), 0, r - 1), m = j((p - n.top) / ut, 0, a - 1), b = Math.floor(d), _ = Math.floor(m), M = Math.min(b + 1, r - 1), g = Math.min(_ + 1, a - 1), y = d - b, N = m - _, F = l[b * a + _], S = l[M * a + _], T = l[b * a + g], w = l[M * a + g];
      return (F + (S - F) * y) * (1 - N) + (T + (w - T) * y) * N;
    },
    shadeAt(h, p) {
      const d = Math.round(j((h - o.left) / f * (r - 1), 0, r - 1));
      return eo(c[d], u[d], p);
    }
  };
}
function mr(t, e, o, n, i) {
  const s = o * i;
  if (n <= t.z[s]) return e[s];
  let r = 1;
  for (; r < i && t.z[s + r] < n; ) r++;
  if (r >= i) return 0;
  const a = t.z[s + r - 1], l = t.z[s + r], c = l > a ? (n - a) / (l - a) : 0;
  return e[s + r - 1] + c * (e[s + r] - e[s + r - 1]);
}
function br(t, e, o) {
  const n = L.noiseScale, i = $t(t, e * n, o * n, 0), s = $t(t, e * n * Ot, o * n * Ot, 1);
  return (io * i + so * s - 0.5) * 2;
}
function j(t, e, o) {
  return t < e ? e : t > o ? o : t;
}
const uo = 1.94384, _r = 34;
function gr(t, e, o, n, i, s = {}) {
  const { surface: r, pos: a } = e;
  if (!r) return;
  const l = s.size ?? 22, c = s.color ?? "#0b1220", u = s.minGapPx ?? l * 1.1, f = n + i / 2;
  let h = -1 / 0;
  for (let p = 0; p < a.length; p++) {
    const d = o(a[p]);
    if (d - h < u) continue;
    const m = r.ws10[p], b = r.wd10[p];
    !Number.isFinite(m) || !Number.isFinite(b) || (fo(t, d, f, m * uo, b, { size: l, color: c }), h = d);
  }
}
function Mr(t, e, o, n, i = {}) {
  const { pos: s } = e, r = i.nRows ?? 7, a = i.size ?? 20, l = i.color ?? "#0b1220";
  for (let c = 0; c < r; c++) {
    const u = n.top + (n.bot - n.top) * (c + 0.5) / r, f = n.inv(u);
    for (let h = 0; h < s.length; h++) {
      const p = xn(e, h, f);
      !Number.isFinite(p.spd) || !Number.isFinite(p.dir) || fo(t, o(s[h]), u, p.spd * uo, p.dir, { size: a, color: l });
    }
  }
}
function fo(t, e, o, n, i, { size: s = 22, color: r = "#0b1220" } = {}) {
  const a = s * 0.409, l = s * 0.227, c = s * 0.102, u = Math.max(1, s * 0.045);
  if (t.save(), t.translate(e, o), t.strokeStyle = r, t.fillStyle = r, t.lineWidth = u, t.lineCap = "round", n < 2.5) {
    t.lineWidth = Math.max(0.75, s * 0.032), t.globalAlpha = 0.55, t.beginPath(), t.arc(0, 0, s * 0.075, 0, Math.PI * 2), t.stroke(), t.beginPath(), t.arc(0, 0, s * 0.145, 0, Math.PI * 2), t.stroke(), t.restore();
    return;
  }
  t.rotate(i * Math.PI / 180), t.beginPath(), t.arc(0, 0, s * 0.045, 0, Math.PI * 2), t.fill(), t.beginPath(), t.moveTo(0, 0), t.lineTo(0, -a), t.stroke();
  let f = Math.round(n / 5) * 5;
  const h = Math.floor(f / 50);
  f -= h * 50;
  const p = Math.floor(f / 10);
  f -= p * 10;
  const d = f >= 5 ? 1 : 0;
  let m = -a;
  for (let b = 0; b < h; b++) {
    const _ = m, M = m + c * 2;
    t.beginPath(), t.moveTo(0, _), t.lineTo(0, M), t.lineTo(l, (_ + M) / 2), t.closePath(), t.fill(), m += c * 2 + 1;
  }
  for (let b = 0; b < p; b++)
    t.beginPath(), t.moveTo(0, m), t.lineTo(l, m), t.stroke(), m += c;
  d && (t.beginPath(), t.moveTo(0, m), t.lineTo(l * 0.5, m), t.stroke()), t.restore();
}
const ft = 34;
function St(t, e, o, n, i, s, r = {}) {
  const a = r.padPx ?? 4, l = i / (s.length + 1);
  t.font = r.font ?? "11px system-ui, sans-serif", t.textAlign = "center", t.textBaseline = "middle";
  let c = -1 / 0;
  for (let u = 0; u < e.length; u++) {
    const f = o(e[u]), h = s.map((d) => {
      const m = d.values[u];
      return Number.isFinite(m) ? d.fmt(m) : null;
    });
    if (h.every((d) => d == null)) continue;
    const p = Math.max(...h.filter((d) => d != null).map((d) => t.measureText(d).width));
    f - p / 2 < c + a || (s.forEach((d, m) => {
      const b = h[m];
      b != null && (t.fillStyle = d.color ?? "#0b1220", t.fillText(b, f, n + l * (m + 1)));
    }), c = f + p / 2);
  }
}
const yr = 25, Nr = Math.round(yr * 1.1);
new DOMParser();
function wr() {
  return "loc";
}
function ho() {
  return {};
}
function Tr(t) {
  return t.getHours();
}
function po(t) {
  return t.getMinutes();
}
function Fr(t) {
  return t.getDate();
}
function vr(t) {
  return t.getMonth();
}
function Sr(t) {
  return t.getFullYear();
}
function mo(t) {
  return `${Sr(t)}-${vr(t)}-${Fr(t)}`;
}
function Ar(t, e = {}) {
  return t.toLocaleString("de-DE", { ...e, ...ho() });
}
function Er(t, e = {}) {
  return t.toLocaleDateString("de-DE", { ...e, ...ho() });
}
function bo(t) {
  return `${Math.round(vi(t))} ${Fi()}`;
}
function kr(t, e) {
  return [30, 50, 100, 200, 300, 500, 1e3, 1500, 2e3, 3e3, 4e3, 6e3, 8e3, 1e4].filter((n) => n >= t && n <= e);
}
function Re(t, e, o) {
  const n = (e - t) / o, i = Math.pow(10, Math.floor(Math.log10(n))), s = [1, 2, 2.5, 5, 10].map((a) => a * i).find((a) => a >= n) || 10 * i, r = [];
  for (let a = Math.ceil(t / s) * s; a <= e + 1e-9; a += s) r.push(+a.toFixed(6));
  return r;
}
const wn = {
  label: "Gelände: Mapterhorn",
  url: "https://mapterhorn.com/attribution"
}, Dt = "#0b0b0b", nt = "#52514e", _o = "#d9d8d3", Rt = 22, go = 10, G = { l: 50, r: 52 }, Tn = { point: 18, path: 28 }, Rr = 240, Cr = "#0b0b0b", Fn = 48, Pr = 4;
function vn(t, { hours: e, rowsH: o, stripH: n, axisH: i, minMainH: s }) {
  const r = Math.max(t.clientWidth || 0, 360) - G.l - G.r;
  return {
    pw: Math.max(e * Nr, r),
    mainH: Math.max(s, (t.clientHeight || 560) - Rt - n - i - o - go)
  };
}
const zr = "#fcfcfb", Ir = "#050b1e", Lr = "#2b5c93", $r = 14, Or = 2500, Dr = 15e3, Hr = "#0a0603", Gr = "#afa488", Br = "#dfe6ea", Wr = { light: "#2e7d32", moderate: "#1b5e20", severe: "#0d3b10" }, Zr = { light: "#f9a825", moderate: "#ef6c00", severe: "#c62828" }, Ur = { light: 1, moderate: 2, severe: 3 }, Yr = "#12161c", xr = "rgba(255,255,255,0.9)", qr = "#c62828", Xr = "#c62828", Sn = "#7b2fbf", Vr = [7, 3, 1, 3], Kr = "#e8b730", jr = "rgba(0,0,0,0.45)", Jr = "#8a6500", Qr = [230, 73, 128], tl = [34, 211, 238], pe = 0.1, el = 0.5, nl = 0.6, ol = 2, il = 5;
function sl(t) {
  if (!Number.isFinite(t)) return "";
  if (t >= 1e4) return ">10";
  const e = t / 1e3;
  return e >= 5 ? String(Math.round(e)) : e.toFixed(1);
}
const de = {
  wind: {
    height: _r,
    label: ["Wind", "10 m"],
    draw: (t, e, o, n, i, s) => gr(t, e, n, i, s)
  },
  // Zellen zeigen nur noch die nackte Zahl (kein " °C"/" km/h" pro Wert) --
  // die Einheit steht wie bei SLP schon im Zeilenlabel; erst das macht die
  // Werte schmal genug, um jede Stunde statt nur jede zweite zu plotten
  // (s. Feedback). `label` als Funktion, weil die Einheit vom Nutzer
  // umschaltbar ist (Einstellungen) und `ROW_DEFS` nur einmal gebaut wird.
  tempdew: {
    height: ft,
    label: () => ["T / Td", ki()],
    draw: (t, e, o, n, i, s) => St(t, e.pos, n, i, s, [
      { values: e.surface.t2m, fmt: (r) => String(Math.round(Qe(r))), color: "#c0392b" },
      { values: e.surface.td2m, fmt: (r) => String(Math.round(Qe(r))), color: "#2980b9" }
    ])
  },
  gust: {
    height: ft * 0.7,
    label: () => ["Böen 10 m", Ai()],
    draw: (t, e, o, n, i, s) => St(t, e.pos, n, i, s, [
      { values: e.surface.gust, fmt: (r) => String(Math.round(Ei(r))), color: "#6a3d9a" }
    ])
  },
  visibility: {
    height: ft * 0.7,
    label: ["Sicht", "km"],
    draw: (t, e, o, n, i, s) => St(t, e.pos, n, i, s, [
      { values: e.surface.visibility, fmt: (r) => sl(r), color: "#546e7a" }
    ])
  },
  pressure: {
    height: ft * 0.7,
    label: ["SLP", "hPa"],
    draw: (t, e, o, n, i, s) => St(t, e.pos, n, i, s, [
      { values: e.surface.pmsl, fmt: (r) => String(Math.round(r)), color: "#1a6b4a" }
    ])
  },
  weather: {
    height: ft * 0.55,
    label: ["Wetter", "(METAR)"],
    draw: (t, e, o, n, i, s) => da(t, e, o, n, i, s)
  }
}, rl = ["wind", "gust", "visibility", "weather", "tempdew", "pressure"], ll = 150;
function al(t, e, o, n = {}) {
  t.__gmObserver?.disconnect();
  let i = null, s = null, r = null, a = null;
  function l() {
    t.innerHTML = "";
    const { times: h, pos: p, nk: d } = e;
    if (!h || h.length < 2)
      return t.textContent = "Keine Gitterdaten.", null;
    const m = (n.activeRows ?? rl).filter((z) => de[z]), b = e.meta.mode === "path", _ = b ? Al(e) : e, M = b ? El(o, e) : o, g = b ? (z) => bt(e.pos, e.elevation, z) : null, y = n.axis ? n.axis === "lin" : b;
    let N, F;
    if (b) {
      let z = 1 / 0, H = -1 / 0;
      for (let yt = 0; yt < h.length; yt++) {
        const Vt = e.elevation[yt];
        Number.isFinite(Vt) && Vt < z && (z = Vt);
        const Kt = _.z[yt * d + d - 1];
        Number.isFinite(Kt) && Kt > H && (H = Kt);
      }
      const Ao = Number.isFinite(H) && Number.isFinite(z) ? H - z : 0;
      N = Math.max(0, (Number.isFinite(z) ? z : 0) - 0.04 * Ao), F = Number.isFinite(H) ? H : _.z[d - 1];
    } else
      N = Math.max(10, e.z[0] || 10), F = e.z[d - 1];
    F = Math.max(N + 100, Math.min(F, kl(M.tropopause)));
    const S = n.zMin ?? N, T = n.zMax ?? F, w = b ? 0 : $r, v = b ? Tn.path : Tn.point, R = Math.max(1, (p[p.length - 1] - p[0]) / 3600), k = m.reduce((z, H) => z + de[H].height, 0);
    i = { hours: R, rowsH: k, stripH: w, axisH: v, minMainH: n.minMainH ?? Rr };
    const { pw: $, mainH: O } = s = vn(t, i), W = G.l + $ + G.r, I = Rt + O + w + v + k + go, D = window.devicePixelRatio || 1, C = document.createElement("canvas");
    C.width = Math.round(W * D), C.height = Math.round(I * D), C.style.width = `${W}px`, C.style.height = `${I}px`, C.className = "gm-canvas";
    const A = C.getContext("2d");
    A.scale(D, D);
    const ot = p[0], Yt = p[p.length - 1], E = (z) => G.l + (z - ot) / (Yt - ot) * $;
    E.left = G.l, E.right = G.l + $;
    const Z = Rt, U = Rt + O, P = fl(Z, U, S, T, y), Y = n.layerToggles ?? {};
    hl(A, _, M, E, P, Z, U), Nl(A, _, M, E, P, Z, U, g);
    const xt = Y.cb !== !1 ? lr(_, M.cb, E, P) : [];
    Y.cb !== !1 && ar(A, xt, E, P), Y.clouds !== !1 && Us(A, _, Fl(e, o.cloudFrac, o.fog), E, P), Y.cb !== !1 && (ur(A, xt, E, P), Gl(A, xt));
    const So = mt(`${e.meta.lat},${e.meta.lon},${e.meta.elevation},${h[0]}`);
    Y.precip !== !1 && jl(A, M.precip, p, E, P, So, g), Y.w && na(A, _, E, P), Y.hazards !== !1 && (Pn(A, _, M.hazards.icing, Wr, E, P), $l(A, _, M.hazards.icing, E, P), Pn(A, _, M.hazards.turbulence, Zr, E, P), Dl(A, _, M.hazards.turbulence, E, P)), Y.isentropes && oa(A, M.isentropes, E, P, n.zMax == null ? ol : 1), Y.isotherms !== !1 && ta(A, M.isotherms, E, P), Y.isotachs !== !1 && ea(A, M.isotachs, E, P), Y.tropopause !== !1 && ia(A, M.tropopause, E, P), Y.windbarbs && (A.fillStyle = "rgba(255,255,255,0.6)", A.fillRect(E.left, Z, E.right - E.left, U - Z), Mr(A, _, E, P, { nRows: 14 }));
    const qt = b && n.terrain && Y.terrain !== !1;
    b && Cl(A, e, M, E, P, U), qt && zl(A, n.terrain, E, P, U), b && n.maxHeightM && Il(A, e, qt ? n.terrain : null, n.maxHeightM, E, P), b && n.profile && Ll(A, n.profile, E, P, Z, U, S, T), A.strokeStyle = nt, A.lineWidth = 1, A.strokeRect(E.left + 0.5, Z + 0.5, $ - 1, O - 1), sa(A, P, S, T, E, y, b), b ? ca(A, e, E, Z, U) : la(A, h, E, Z, U), n.pathStop && fa(A, E, Z, U, n.pathStop.reason), b || Sl(A, e, o, E, U, w);
    const Xt = U + w;
    b ? ua(A, e, E, Z, Xt) : aa(A, h, E, Z, Xt);
    let it = Xt + v;
    for (const z of m) {
      const H = de[z];
      A.save(), A.beginPath(), A.rect(E.left, it, $, H.height), A.clip(), H.draw(A, e, o, E, it, H.height), A.restore(), A.strokeStyle = _o, A.lineWidth = 1, A.strokeRect(E.left + 0.5, it + 0.5, $ - 1, H.height - 1), ra(A, typeof H.label == "function" ? H.label() : H.label, E.left - 4, it, H.height), it += H.height;
    }
    const $e = it;
    A.fillStyle = Dt, A.font = "bold 12px system-ui, sans-serif", A.textAlign = "left", A.fillText("GRAMET", E.left, 13);
    const Oe = cl(C, W, I, D), Mt = document.createElement("div");
    if (Mt.className = "gm-plot", Mt.append(Oe, C), t.append(Mt), qt) {
      const z = document.createElement("a");
      z.href = wn.url, z.target = "_blank", z.rel = "noopener noreferrer", z.textContent = wn.label, z.style.cssText = "display:block;font:10px system-ui,sans-serif;color:#8a8a86;text-decoration:none;padding:2px 4px;", t.append(z);
    }
    return ha(t, C, Oe, e, { x: E, y: P, mainTop: Z, mainBot: U, chartBot: $e, view: o, isPath: b }), a = pa(Mt, t, {
      x: E,
      y: P,
      grid: e,
      isPath: b,
      top: Z,
      bot: $e,
      zMin: S,
      zMax: T,
      profile: b ? n.profile : null
    }), a(r), n.onRedraw?.(C), C;
  }
  const c = l();
  t.__gmSetCursor = (h, p = !1) => {
    r = h == null || !Number.isFinite(h) ? null : h, a?.(r, p);
  };
  let u = null;
  const f = new ResizeObserver(() => {
    if (i && s) {
      const h = vn(t, i);
      if (h.pw === s.pw && h.mainH === s.mainH) return;
    }
    clearTimeout(u), u = setTimeout(l, ll);
  });
  return f.observe(t), t.__gmObserver = f, c;
}
function cl(t, e, o, n) {
  const i = document.createElement("canvas");
  i.className = "gm-axis", i.width = Math.round(G.l * n), i.height = Math.round(o * n), i.style.width = `${G.l}px`, i.style.height = `${o}px`;
  const s = i.getContext("2d");
  return s.scale(n, n), s.fillStyle = zr, s.fillRect(0, 0, G.l, o), s.drawImage(t, 0, 0, Math.round(G.l * n), t.height, 0, 0, G.l, o), t.style.marginLeft = "-50px", i;
}
function ul(t, e) {
  t.toBlob((o) => {
    if (!o) return;
    const n = URL.createObjectURL(o), i = document.createElement("a");
    i.href = n, i.download = `${e.filter(Boolean).join("_")}.png`, i.click(), URL.revokeObjectURL(n);
  });
}
function fl(t, e, o, n, i) {
  const s = Math.max(o, i ? o : 1), r = i ? s : Math.log(s), a = i ? n : Math.log(n), l = (c) => {
    const u = i ? B(c, s, n) : Math.log(B(c, s, n));
    return e - (u - r) / (a - r) * (e - t);
  };
  return l.top = t, l.bot = e, l.inv = (c) => {
    const u = B((e - c) / (e - t), 0, 1);
    return i ? o + u * (n - o) : Math.exp(r + u * (a - r));
  }, l;
}
function hl(t, e, o, n, i, s, r) {
  const { pos: a } = e, l = n.right - n.left, c = r - s, u = t.createLinearGradient(n.left, 0, n.right, 0);
  let f = -1;
  for (let d = 0; d < a.length; d++) {
    let m = B((n(a[d]) - n.left) / l, 0, 1);
    m <= f && (m = Math.min(1, f + 1e-4)), u.addColorStop(m, ba(Ir, Lr, o.daylight[d])), f = m;
  }
  t.fillStyle = u, t.fillRect(n.left, s, l, c);
  const h = t.createLinearGradient(0, s, 0, r), p = 40;
  for (let d = 0; d <= p; d++) {
    const m = s + c * d / p, b = dl * ml(i.inv(m));
    h.addColorStop(d / p, `rgba(2,6,16,${b})`);
  }
  t.save(), t.globalCompositeOperation = "multiply", t.fillStyle = h, t.fillRect(n.left, s, l, c), t.restore();
}
const An = 10, pl = 12e3, dl = 0.55;
function ml(t) {
  return B((t - An) / (pl - An), 0, 1);
}
const At = 10, En = 400, kn = 0.7, bl = "195,215,232", _l = "196,155,74", gl = "196,197,199", Ml = 0.92;
function yl(t, e) {
  if (!t) return null;
  if (t.type === "FG") return { color: gl, alpha: Ml };
  Number.isFinite(e) || (e = t.visEst);
  const o = Number.isFinite(e) ? B(1 - (e - Ct) / (ge - Ct), 0, 1) : 0.5;
  return t.type === "BR" ? { color: bl, alpha: kn * (0.65 + 0.35 * o) } : t.type === "HZ" ? { color: _l, alpha: kn * (0.45 + 0.4 * o) } : null;
}
function Nl(t, e, o, n, i, s, r, a = null) {
  const { pos: l } = e, c = n.right - n.left, u = r - s;
  if (c <= 0 || u <= 0 || !o.fog) return;
  const f = t.createLinearGradient(n.left, 0, n.right, 0);
  let h = -1, p = !1;
  for (let M = 0; M < l.length; M++) {
    let g = B((n(l[M]) - n.left) / c, 0, 1);
    g <= h && (g = Math.min(1, h + 1e-4));
    const y = yl(o.fog[M], e.surface?.visibility?.[M]);
    y && (p = !0), f.addColorStop(g, y ? `rgba(${y.color},${y.alpha})` : "rgba(0,0,0,0)"), h = g;
  }
  if (!p) return;
  const d = window.devicePixelRatio || 1, m = document.createElement("canvas");
  m.width = Math.max(1, Math.round(c * d)), m.height = Math.max(1, Math.round(u * d));
  const b = m.getContext("2d");
  b.scale(d, d), b.translate(-n.left, -s), b.fillStyle = f, b.fillRect(n.left, s, c, u);
  const _ = 24;
  if (a) {
    const g = document.createElement("canvas");
    g.width = m.width, g.height = m.height;
    const y = g.getContext("2d");
    y.scale(d, d), y.translate(-n.left, -s);
    for (let N = n.left; N < n.right; N += 8) {
      const F = Math.min(8, n.right - N), S = l[0] + (N + F / 2 - n.left) / c * (l[l.length - 1] - l[0]), T = a(S), w = y.createLinearGradient(0, s, 0, r);
      for (let v = 0; v <= _; v++) {
        const R = s + u * v / _, k = B(1 - (i.inv(R) - T - At) / (En - At), 0, 1);
        w.addColorStop(v / _, `rgba(0,0,0,${k})`);
      }
      y.fillStyle = w, y.fillRect(N, s, F, u);
    }
    b.globalCompositeOperation = "destination-in", b.save(), b.setTransform(1, 0, 0, 1, 0, 0), b.drawImage(g, 0, 0), b.restore();
  } else {
    const M = b.createLinearGradient(0, s, 0, r);
    for (let g = 0; g <= _; g++) {
      const y = s + u * g / _, N = i.inv(y), F = B(1 - (N - At) / (En - At), 0, 1);
      M.addColorStop(g / _, `rgba(0,0,0,${F})`);
    }
    b.globalCompositeOperation = "destination-in", b.fillStyle = M, b.fillRect(n.left, s, c, u);
  }
  t.save(), t.globalCompositeOperation = "screen", t.drawImage(m, n.left, s, c, u), t.restore();
}
const wl = 100;
function Tl(t, e) {
  const { nk: o, times: n } = t, i = new Float32Array(n.length * o);
  let s = !1;
  for (let r = 0; r < n.length; r++) {
    const a = e?.[r];
    if (!a || a.type !== "FG") continue;
    const l = a.top ?? wl;
    for (let c = 0; c < o; c++) {
      const u = r * o + c;
      t.z[u] <= l && (i[u] = 1, s = !0);
    }
  }
  return s ? i : null;
}
function Fl(t, e, o) {
  const n = Tl(t, o);
  if (!n) return e;
  const i = Float32Array.from(e);
  for (let s = 0; s < i.length; s++) n[s] && (i[s] = 0);
  return i;
}
const vl = 5;
function Mo(t, e, o, n) {
  const { pos: i, surface: s } = e, r = n.right - n.left, a = t.createLinearGradient(n.left, 0, n.right, 0);
  let l = -1;
  for (let c = 0; c < i.length; c++) {
    let u = B((n(i[c]) - n.left) / r, 0, 1);
    u <= l && (u = Math.min(1, l + 1e-4));
    const f = _a(Hr, Gr, o.daylight[c]), h = s?.t2m?.[c], p = Number.isFinite(h) ? B(-h / vl, 0, 1) : 0;
    a.addColorStop(u, ga(vo(f, _t(Br), p))), l = u;
  }
  return a;
}
function Sl(t, e, o, n, i, s) {
  const r = n.right - n.left;
  t.fillStyle = Mo(t, e, o, n), t.fillRect(n.left, i, r, s), t.strokeStyle = "rgba(0,0,0,0.3)", t.lineWidth = 1, t.beginPath(), t.moveTo(n.left, i + 0.5), t.lineTo(n.right, i + 0.5), t.stroke();
}
function bt(t, e, o) {
  if (!(t.length > 1) || o <= t[0]) return e[0];
  for (let n = 1; n < t.length; n++)
    if (t[n] >= o) {
      const i = t[n] > t[n - 1] ? (o - t[n - 1]) / (t[n] - t[n - 1]) : 0;
      return e[n - 1] + i * (e[n] - e[n - 1]);
    }
  return e[t.length - 1];
}
const Rn = /* @__PURE__ */ new WeakMap();
function Al(t) {
  let e = Rn.get(t);
  if (e) return e;
  const { nk: o } = t, n = t.times.length, i = new Float32Array(t.z.length);
  for (let s = 0; s < n; s++)
    for (let r = 0; r < o; r++) i[s * o + r] = t.z[s * o + r] + t.elevation[s];
  return e = { ...t, z: i }, Rn.set(t, e), e;
}
const Cn = /* @__PURE__ */ new WeakMap();
function El(t, e) {
  let o = Cn.get(t);
  if (o) return o;
  const n = (s) => bt(e.pos, e.elevation, s), i = (s) => s.map((r) => ({ ...r, z: r.z + n(r.t) }));
  return o = {
    ...t,
    isotherms: t.isotherms.map(({ tempC: s, polylines: r }) => ({ tempC: s, polylines: r.map(i) })),
    isotachs: t.isotachs.map(({ kt: s, polylines: r }) => ({ kt: s, polylines: r.map(i) })),
    isentropes: t.isentropes.map(({ thetaK: s, polylines: r }) => ({ thetaK: s, polylines: r.map(i) })),
    tropopause: i(t.tropopause),
    precip: t.precip.map((s) => ({
      ...s,
      zTop: s.zTop + n(s.t),
      freezingZ: Number.isFinite(s.freezingZ) ? s.freezingZ + n(s.t) : s.freezingZ
    })),
    cb: t.cb.map((s, r) => s ? { ...s, base: s.base + e.elevation[r], top: s.top + e.elevation[r] } : null)
  }, Cn.set(t, o), o;
}
function kl(t) {
  let e = -1 / 0;
  for (const o of t ?? []) Number.isFinite(o.z) && o.z > e && (e = o.z);
  return Number.isFinite(e) ? e + Or : Dr;
}
function Ce(t, e) {
  let o = null;
  for (let n = 0; n < t.length; n++)
    Number.isFinite(t[n]) ? o == null && (o = n) : o != null && (e(o, n - 1), o = null);
  o != null && e(o, t.length - 1);
}
function yo(t) {
  for (let e = t.length - 1; e >= 0; e--) if (Number.isFinite(t[e])) return e;
  return null;
}
function No(t, e, o, n, i) {
  const s = new Path2D();
  s.moveTo(i(t[e]), n(e));
  for (let r = e + 1; r <= o; r++) s.lineTo(i(t[r]), n(r));
  return s;
}
function Rl(t, e) {
  t.lineJoin = "round", t.strokeStyle = "rgba(255,255,255,0.65)", t.lineWidth = 2.5, t.stroke(e), t.strokeStyle = "rgba(0,0,0,0.6)", t.lineWidth = 1, t.stroke(e);
}
function Cl(t, e, o, n, i, s) {
  const { pos: r, elevation: a } = e;
  t.fillStyle = Mo(t, e, o, n), t.beginPath(), t.moveTo(n(r[0]), s);
  for (let l = 0; l < r.length; l++) t.lineTo(n(r[l]), i(a[l]));
  t.lineTo(n(r[r.length - 1]), s), t.closePath(), t.fill(), Rl(t, No(r, 0, r.length - 1, (l) => i(a[l]), n));
}
const Pl = "rgba(46,36,24,0.35)";
function zl(t, e, o, n, i) {
  const { pos: s, elevation: r } = e;
  Ce(r, (l, c) => {
    if (c === l) return;
    t.beginPath(), t.moveTo(o(s[l]), i);
    for (let f = l; f <= c; f++) t.lineTo(o(s[f]), n(r[f]));
    t.lineTo(o(s[c]), i), t.closePath(), t.fillStyle = Pl, t.fill();
    const u = No(s, l, c, (f) => n(r[f]), o);
    t.save(), t.lineJoin = "round", t.setLineDash([5, 3]), t.strokeStyle = "rgba(216,210,198,0.2)", t.lineWidth = 1.3, t.stroke(u), t.restore();
  });
  const a = yo(r);
  a != null && (t.fillStyle = "#d8d2c6", t.font = "600 9px system-ui, sans-serif", t.textAlign = "right", t.textBaseline = "bottom", t.fillText("Gelände real", o(s[a]) - 4, n(r[a]) - 3));
}
function Il(t, e, o, n, i, s) {
  const r = o ? o.pos : e.pos, a = o ? o.elevation : e.elevation;
  t.save(), t.lineJoin = "round", Ce(a, (c, u) => {
    if (u === c) return;
    const f = new Path2D();
    f.moveTo(i(r[c]), s(a[c] + n));
    for (let h = c + 1; h <= u; h++) f.lineTo(i(r[h]), s(a[h] + n));
    t.strokeStyle = "#fff", t.lineWidth = 3, t.setLineDash([]), t.stroke(f), t.strokeStyle = "#b5179e", t.lineWidth = 1.4, t.setLineDash([6, 3]), t.stroke(f);
  }), t.setLineDash([]);
  const l = yo(a);
  l != null && (t.fillStyle = "#b5179e", t.font = "600 10px system-ui, sans-serif", t.textAlign = "right", t.textBaseline = "bottom", t.fillText(`Max. Flughöhe ${bo(n)} AGL`, i(r[l]) - 4, s(a[l] + n) - 4)), t.restore();
}
function Ll(t, e, o, n, i, s, r, a) {
  const { pos: l, z: c } = e, u = e.color || "#b5179e";
  t.save(), t.beginPath(), t.rect(o.left, i, o.right - o.left, s - i), t.clip(), t.lineJoin = "round", t.setLineDash([]);
  let f = null;
  Ce(c, (h, p) => {
    if (p === h) return;
    const d = [];
    for (let m = h; m <= p; m++) d.push({ t: l[m], z: c[m] });
    for (const m of gt(d, r, a)) {
      const b = new Path2D();
      b.moveTo(o(m[0].t), n(m[0].z));
      for (let M = 1; M < m.length; M++) b.lineTo(o(m[M].t), n(m[M].z));
      t.strokeStyle = "#fff", t.lineWidth = 3, t.stroke(b), t.strokeStyle = u, t.lineWidth = 1.8, t.stroke(b);
      const _ = m[m.length - 1];
      (!f || _.t > f.t) && (f = _);
    }
  }), f && e.label && (t.fillStyle = u, t.font = "600 10px system-ui, sans-serif", t.textAlign = "right", t.textBaseline = "bottom", t.fillText(e.label, Math.min(o(f.t), o.right) - 4, n(f.z) - 4)), t.restore();
}
function gt(t, e, o) {
  if (t.length < 2) return [];
  const n = (c) => c >= e && c <= o, i = (c, u, f) => {
    const h = (f - c.z) / (u.z - c.z);
    return { t: c.t + h * (u.t - c.t), z: f };
  }, s = (c) => c < e, r = (c) => c > o, a = [];
  let l = n(t[0].z) ? [t[0]] : [];
  for (let c = 1; c < t.length; c++) {
    const u = t[c - 1], f = t[c], h = [];
    s(u.z) !== s(f.z) && h.push({ f: (e - u.z) / (f.z - u.z), pt: i(u, f, e) }), r(u.z) !== r(f.z) && h.push({ f: (o - u.z) / (f.z - u.z), pt: i(u, f, o) }), h.sort((p, d) => p.f - d.f);
    for (const { pt: p } of h)
      l.push(p), l.length >= 2 && a.push(l), l = [p];
    n(f.z) ? l.push(f) : l = h.length ? [] : l;
  }
  return l.length >= 2 && a.push(l), a;
}
function Pe(t, e, o) {
  const n = (s, r, a) => {
    if (s.length < 2) return [];
    const l = [];
    for (let c = 0; c < s.length; c++) {
      const u = s[c], f = s[(c - 1 + s.length) % s.length], h = r(u.z, a), p = r(f.z, a);
      if (h) {
        if (!p) {
          const d = (a - f.z) / (u.z - f.z);
          l.push({ t: f.t + d * (u.t - f.t), z: a });
        }
        l.push(u);
      } else if (p) {
        const d = (a - f.z) / (u.z - f.z);
        l.push({ t: f.t + d * (u.t - f.t), z: a });
      }
    }
    return l;
  };
  let i = n(t, (s, r) => s >= r, e);
  return i = n(i, (s, r) => s <= r, o), i;
}
function Pn(t, e, o, n, i, s) {
  const r = e.times.length * e.nk, a = new Float32Array(r);
  for (let u = 0; u < r; u++) a[u] = Ur[o[u]] || 0;
  const l = s.inv(s.bot), c = s.inv(s.top);
  for (const [u, f] of [[1, "light"], [2, "moderate"], [3, "severe"]]) {
    const h = dt(e, a, u - 0.5).map((d) => Pe(d, l, c)).filter((d) => d.length >= 3);
    if (!h.length) continue;
    const p = n[f];
    for (const d of h)
      t.beginPath(), d.forEach((m, b) => {
        const _ = i(m.t), M = s(m.z);
        b === 0 ? t.moveTo(_, M) : t.lineTo(_, M);
      }), t.closePath(), t.fillStyle = `${p}33`, t.fill(), t.setLineDash([4, 3]), t.strokeStyle = p, t.lineWidth = 1.4, t.stroke(), t.setLineDash([]);
  }
}
function $l(t, e, o, n, i) {
  const s = e.times.length * e.nk, r = new Float32Array(s);
  for (let p = 0; p < s; p++) r[p] = o[p] === "severe" ? 1 : 0;
  const a = i.inv(i.bot), l = i.inv(i.top), c = dt(e, r, 0.5).map((p) => Pe(p, a, l)).filter((p) => p.length >= 3), u = 20, f = c.map((p) => ({
    cx: p.reduce((d, m) => d + n(m.t), 0) / p.length,
    cy: p.reduce((d, m) => d + i(m.z), 0) / p.length
  })).sort((p, d) => p.cx - d.cx);
  let h = -1 / 0;
  for (const p of f)
    p.cx - h < u * ze || (Ie(t, Ol(p.cx, p.cy, u), u, qr), h = p.cx);
}
function Ol(t, e, o) {
  const n = new Path2D(), i = o * 0.35, s = e - o * 0.25;
  n.moveTo(t - i, s), n.quadraticCurveTo(t, e + o * 0.6, t + i, s);
  const r = o * 0.08, a = e - o * 0.05, l = e + o * 0.45;
  return n.moveTo(t - r, a), n.lineTo(t - r, l), n.moveTo(t + r, a), n.lineTo(t + r, l), n;
}
function Dl(t, e, o, n, i) {
  const s = e.times.length * e.nk, r = new Float32Array(s);
  for (let p = 0; p < s; p++) r[p] = o[p] === "severe" ? 1 : 0;
  const a = i.inv(i.bot), l = i.inv(i.top), c = dt(e, r, 0.5).map((p) => Pe(p, a, l)).filter((p) => p.length >= 3), u = 20, f = c.map((p) => ({
    cx: p.reduce((d, m) => d + n(m.t), 0) / p.length,
    cy: p.reduce((d, m) => d + i(m.z), 0) / p.length
  })).sort((p, d) => p.cx - d.cx);
  let h = -1 / 0;
  for (const p of f)
    p.cx - h < u * ze || (Ie(t, Hl(p.cx, p.cy, u), u, Xr), h = p.cx);
}
function Hl(t, e, o) {
  const n = new Path2D(), i = o * 0.4, s = e + o * 0.2, r = e - o * 0.3, a = o * 0.15;
  return n.moveTo(t - i, s), n.lineTo(t - a, s), n.lineTo(t, r), n.lineTo(t + a, s), n.lineTo(t + i, s), n;
}
const ze = 1.4;
function Gl(t, e) {
  let o = -1 / 0;
  for (const n of e) {
    if (n.kind === "none") continue;
    const i = Math.min(24, n.hw * 1.9);
    if (n.cx - o < i * ze) continue;
    const s = n.yTop + (n.yBot - n.yTop) * 0.45;
    Ie(t, n.kind === "cb" ? Bl(n.cx, s, i) : Wl(n.cx, s, i), i), o = n.cx;
  }
}
function Bl(t, e, o) {
  const n = o * 0.42, i = e + n * 0.5, s = new Path2D();
  s.moveTo(t - n, i), s.arc(t, i, n, Math.PI, 0), s.lineTo(t - n, i);
  const r = n * 0.7, a = e - n * 0.9, l = n * 0.48, c = i - Math.sqrt(n * n - l * l);
  return s.moveTo(t - r, a), s.lineTo(t + r, a), s.lineTo(t + l, c), s.moveTo(t - r, a), s.lineTo(t - l, c), s;
}
function Wl(t, e, o) {
  const n = o * 0.42, i = e + n * 0.5, s = new Path2D();
  s.moveTo(t - n, i), s.arc(t, i, n, Math.PI, 0), s.lineTo(t - n, i);
  const r = n * 0.35, a = i - Math.sqrt(n * n - r * r);
  s.moveTo(t - r, a), s.arc(t, a, r, Math.PI, 0);
  const l = i - n, c = a - r;
  return s.moveTo(t, l), s.lineTo(t, c), s;
}
function Ie(t, e, o, n = Yr) {
  t.save(), t.lineJoin = "round", t.lineCap = "round";
  const i = Math.max(1.2, o * 0.075);
  t.strokeStyle = xr, t.lineWidth = i + 2.2, t.stroke(e), t.strokeStyle = n, t.lineWidth = i, t.stroke(e), t.restore();
}
const zn = 30, Zl = 11, Ul = 6;
function Yl(t) {
  const e = Math.max(0, Number.isFinite(t) ? t : 0.5), o = zn - Zl;
  return zn - o * Math.tanh(e / Ul);
}
const xl = 0.5, ql = 0.32, Xl = 0.8, Vl = 0.45, Kl = 0.5;
function jl(t, e, o, n, i, s, r = null) {
  const a = o.length > 1 ? o[1] - o[0] : 3600, l = Math.max(1, n(o[0] + a) - n(o[0]));
  t.save();
  for (const c of e) {
    const u = B(n(c.t - Kl * a), n.left, n.right), f = r ? i(r(c.t)) - 1 : i.bot - 4, h = Math.max(i.top, i(Math.max(0, c.zTop))), p = f - h, d = p > 0 ? Math.max(1, Math.round(p / Yl(c.rate))) : 0, m = d > 0 ? p / d : 0, b = Math.round((c.t - o[0]) / a);
    for (let _ = 0; _ <= d; _++) {
      const M = _ === 0 || _ === d ? 0 : (V(s, b, _, 1) - 0.5) * 2 * ql * m, g = f - _ * m + M, y = (V(s, b, _, 0) - 0.5) * 2 * xl * l, N = B(u + y, n.left + 3, n.right - 3), F = i.inv(g), S = Number.isFinite(c.freezingZ) ? F > c.freezingZ : c.type === "sn", T = Xl + V(s, b, _, 2) * Vl, w = V(s, b, _, 3);
      S ? Jl(t, N, g, 3.2 * T, w * Math.PI / 3) : Ql(t, N, g, 4.5 * T, w);
    }
  }
  t.restore();
}
const wo = "#134a7a";
function Jl(t, e, o, n, i = 0) {
  for (const [s, r] of [["#fff", 2.6], [wo, 1.2]]) {
    t.strokeStyle = s, t.lineWidth = r;
    for (const a of [0, 60, 120]) {
      const l = a * Math.PI / 180 + i;
      t.beginPath(), t.moveTo(e - n * Math.cos(l), o - n * Math.sin(l)), t.lineTo(e + n * Math.cos(l), o + n * Math.sin(l)), t.stroke();
    }
  }
}
function Ql(t, e, o, n, i = 0.5) {
  const s = n * (0.15 + i * 0.3);
  for (const [r, a] of [["#fff", 2.8], [wo, 1.4]])
    t.strokeStyle = r, t.lineWidth = a, t.beginPath(), t.moveTo(e - s, o - n * 0.5), t.lineTo(e + s, o + n * 0.5), t.stroke();
}
function Le(t, e, o, n, i, s, r = 1.4) {
  e.length < 2 || (t.save(), t.setLineDash(s), t.lineJoin = "round", t.strokeStyle = "#fff", t.lineWidth = r + 1.6, Ht(t, e, o, n), t.stroke(), t.strokeStyle = i, t.lineWidth = r, Ht(t, e, o, n), t.stroke(), t.restore());
}
function Ht(t, e, o, n) {
  t.beginPath(), e.forEach((i, s) => {
    const r = o(i.t), a = n(i.z);
    s === 0 ? t.moveTo(r, a) : t.lineTo(r, a);
  });
}
function Zt(t, e, o, n, i, s) {
  t.font = "10px system-ui, sans-serif", t.textAlign = "start", t.textBaseline = "middle";
  const r = t.measureText(n).width + 8, a = Math.min(e + 2, s - r - 2);
  t.fillStyle = "rgba(255,255,255,0.9)", t.fillRect(a, o - 8, r, 16), t.strokeStyle = i, t.lineWidth = 1, t.strokeRect(a, o - 8, r, 16), t.fillStyle = i, t.fillText(n, a + 4, o);
}
function Ut(t) {
  return t.reduce((e, o) => o[o.length - 1].t > e[e.length - 1].t ? o : e);
}
function ta(t, e, o, n) {
  const i = n.inv(n.bot), s = n.inv(n.top);
  for (const { tempC: r, polylines: a } of e) {
    const l = a.flatMap((h) => gt(h, i, s));
    if (!l.length) continue;
    const c = r === 0 ? "#1d4c8c" : "#7a1414";
    for (const h of l) Le(t, h, o, n, c, [5, 3]);
    const u = Ut(l), f = u[u.length - 1];
    Zt(t, o(f.t), n(f.z), `${r}°C`, c, o.right + G.r);
  }
}
function ea(t, e, o, n) {
  const i = n.inv(n.bot), s = n.inv(n.top);
  for (const { kt: r, polylines: a } of e) {
    const l = a.flatMap((f) => gt(f, i, s));
    if (!l.length) continue;
    for (const f of l) Le(t, f, o, n, Sn, Vr, 1.7);
    const c = Ut(l), u = c[c.length - 1];
    Zt(t, o(u.t), n(u.z), `${r} kt`, Sn, o.right + G.r);
  }
}
function na(t, e, o, n) {
  const { nk: i, pos: s } = e, r = s.length, a = (l, c) => (l + c) / 2;
  for (let l = 0; l < r; l++) {
    const c = o(l > 0 ? a(s[l - 1], s[l]) : s[l]), u = o(l < r - 1 ? a(s[l], s[l + 1]) : s[l]);
    if (u > c)
      for (let f = 0; f < i; f++) {
        const h = l * i + f, p = e.w[h];
        if (!Number.isFinite(p) || Math.abs(p) < pe) continue;
        const d = f > 0 ? a(e.z[h - 1], e.z[h]) : e.z[h], m = f < i - 1 ? a(e.z[h], e.z[h + 1]) : e.z[h], b = n(m), _ = n(d);
        if (!(_ > b)) continue;
        const M = nl * Math.min((Math.abs(p) - pe) / (el - pe), 1), [g, y, N] = p > 0 ? Qr : tl;
        t.fillStyle = `rgba(${g},${y},${N},${M.toFixed(3)})`, t.fillRect(c, b, u - c + 0.5, _ - b + 0.5);
      }
  }
}
function oa(t, e, o, n, i) {
  const s = n.inv(n.bot), r = n.inv(n.top);
  t.save(), t.lineJoin = "round";
  for (const { thetaK: a, polylines: l } of e) {
    if (a % i !== 0) continue;
    const c = l.flatMap((h) => gt(h, s, r));
    if (!c.length) continue;
    const u = a % il === 0, f = u ? 1.4 : 0.8;
    for (const h of c)
      h.length < 2 || (t.strokeStyle = jr, t.lineWidth = f + 1.2, Ht(t, h, o, n), t.stroke(), t.strokeStyle = Kr, t.lineWidth = f, Ht(t, h, o, n), t.stroke());
    if (u) {
      const h = Ut(c), p = h[h.length - 1];
      Zt(t, o(p.t), n(p.z), `${a} K`, Jr, o.right + G.r);
    }
  }
  t.restore();
}
function ia(t, e, o, n) {
  const i = n.inv(n.bot), s = n.inv(n.top), r = gt(e, i, s);
  if (!r.length) return;
  for (const c of r) Le(t, c, o, n, "#cc0000", []);
  const a = Ut(r), l = a[a.length - 1];
  Zt(t, o(l.t), n(l.z), "Trop", "#cc0000", o.right + G.r);
}
function sa(t, e, o, n, i, s, r = !1) {
  const a = s ? Re(o, n, 6) : kr(o, n);
  t.font = "10px system-ui, sans-serif", t.textBaseline = "middle";
  for (const l of a) {
    const c = e(l);
    t.strokeStyle = _o, t.globalAlpha = 0.6, t.lineWidth = 1, t.beginPath(), t.moveTo(i.left, c), t.lineTo(i.right, c), t.stroke(), t.globalAlpha = 1, t.fillStyle = nt, t.textAlign = "right", t.fillText(bo(l), i.left - 4, c);
  }
  t.fillStyle = nt, t.font = "600 8px system-ui, sans-serif", t.textAlign = "right", t.fillText(r ? "AMSL" : "AGL", i.left - 4, e.top - 7);
}
function ra(t, e, o, n, i) {
  t.font = "9px system-ui, sans-serif", t.textAlign = "right", t.textBaseline = "middle", t.fillStyle = nt;
  const s = 11, r = n + i / 2 - (e.length - 1) * s / 2;
  e.forEach((a, l) => t.fillText(a, o, r + l * s));
}
function la(t, e, o, n, i) {
  let s = null;
  for (let r = 0; r < e.length; r++) {
    const a = new Date(e[r] * 1e3);
    if (po(a) !== 0) continue;
    const l = mo(a);
    l !== s && (s = l, t.strokeStyle = "#c9c8c2", t.lineWidth = 1, t.setLineDash([2, 3]), t.beginPath(), t.moveTo(o(e[r]), n), t.lineTo(o(e[r]), i), t.stroke(), t.setLineDash([]));
  }
}
function aa(t, e, o, n, i) {
  let s = null;
  t.textBaseline = "alphabetic";
  for (let r = 0; r < e.length; r++) {
    const a = new Date(e[r] * 1e3);
    if (po(a) !== 0) continue;
    const l = Tr(a), c = mo(a);
    c !== s ? (s = c, t.fillStyle = Dt, t.font = "600 11px system-ui, sans-serif", t.textAlign = "left", t.fillText(Er(a, { day: "2-digit", month: "2-digit" }), o(e[r]) + 3, i + 12)) : l === 6 || l === 12 || l === 18 ? (t.fillStyle = Dt, t.font = "600 10px system-ui, sans-serif", t.textAlign = "center", t.fillText(String(l).padStart(2, "0"), o(e[r]), i + 12)) : (t.fillStyle = nt, t.font = "8px system-ui, sans-serif", t.textAlign = "center", t.fillText(String(l).padStart(2, "0"), o(e[r]), i + 11));
  }
  t.fillStyle = nt, t.font = "600 8px system-ui, sans-serif", t.textAlign = "right", t.fillText(wr(), o.left - 4, i + 12);
}
const To = 8;
function ca(t, e, o, n, i) {
  const { pos: s } = e, r = Re(s[0], s[s.length - 1], To);
  t.strokeStyle = "#c9c8c2", t.lineWidth = 1, t.setLineDash([2, 3]);
  for (const a of r)
    t.beginPath(), t.moveTo(o(a), n), t.lineTo(o(a), i), t.stroke();
  t.setLineDash([]);
}
function ua(t, e, o, n, i) {
  const { pos: s, times: r } = e, a = Re(s[0], s[s.length - 1], To);
  t.textBaseline = "alphabetic", t.textAlign = "center";
  let l = null;
  for (const c of a) {
    t.fillStyle = Dt, t.font = "600 10px system-ui, sans-serif", t.fillText(Fo(c), o(c), i + 11);
    const u = bt(s, r, c);
    if (!Number.isFinite(u)) continue;
    const f = new Date(u * 1e3), h = f.toISOString().slice(0, 10), p = `${String(f.getUTCHours()).padStart(2, "0")}:${String(f.getUTCMinutes()).padStart(2, "0")}`, d = h !== l;
    l = h, t.fillStyle = nt, t.font = "9px system-ui, sans-serif", t.fillText(
      d ? `${String(f.getUTCDate()).padStart(2, "0")}.${String(f.getUTCMonth() + 1).padStart(2, "0")}. ${p} UTC` : `${p} UTC`,
      o(c),
      i + 23
    );
  }
}
function Fo(t) {
  const e = Math.round(t), o = Math.floor(e / 3600), n = Math.round(e % 3600 / 60);
  return o <= 0 ? `+${n} min` : n === 0 ? `+${o} h` : `+${o}:${String(n).padStart(2, "0")} h`;
}
function Te(t, e) {
  return e ? new Date(t * 1e3).toLocaleString("de-DE", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  }) : Ar(new Date(t * 1e3), { weekday: "short", hour: "2-digit", minute: "2-digit" });
}
function fa(t, e, o, n, i) {
  const s = e.right;
  t.save(), t.strokeStyle = "#b71c1c", t.lineWidth = 1.5, t.setLineDash([4, 3]), t.beginPath(), t.moveTo(s, o), t.lineTo(s, n), t.stroke(), t.setLineDash([]), t.fillStyle = "#b71c1c", t.font = "600 10px system-ui, sans-serif", t.textAlign = "right", t.textBaseline = "top", t.fillText(i, s - 3, o + 3), t.restore();
}
function ha(t, e, o, n, i) {
  const { x: s, y: r, mainTop: a, mainBot: l, chartBot: c, view: u, isPath: f } = i;
  t.style.position = t.style.position || "relative";
  const h = document.createElement("div");
  h.className = "gm-tip", h.style.display = "none", t.append(h);
  let p;
  const d = (g, y) => {
    g === null && p === null || (p = g, t.dispatchEvent(new CustomEvent("poshover", {
      bubbles: !0,
      composed: !0,
      detail: { pos: g, index: g === null ? null : y }
    })));
  };
  o.addEventListener("pointerenter", () => {
    h.style.display = "none", d(null);
  });
  const m = n.pos[0], b = n.pos[n.pos.length - 1];
  function _(g) {
    const y = B(m + (g - s.left) / (s.right - s.left) * (b - m), m, b);
    let N = 0, F = 1 / 0;
    for (let S = 0; S < n.pos.length; S++) {
      const T = Math.abs(n.pos[S] - y);
      T < F && (F = T, N = S);
    }
    return { pos: y, index: N };
  }
  let M = null;
  e.addEventListener("pointerdown", (g) => {
    M = { x: g.clientX, y: g.clientY };
  }), e.addEventListener("pointercancel", () => {
    M = null;
  }), e.addEventListener("click", (g) => {
    const y = M;
    if (M = null, y && Math.hypot(g.clientX - y.x, g.clientY - y.y) > Pr) return;
    const N = e.getBoundingClientRect(), F = g.clientX - N.left, S = g.clientY - N.top;
    F < s.left || F > s.right || S < a || S > c || t.dispatchEvent(new CustomEvent("posclick", {
      bubbles: !0,
      composed: !0,
      detail: _(F)
    }));
  }), e.addEventListener("pointermove", (g) => {
    const y = e.getBoundingClientRect(), N = g.clientX - y.left, F = g.clientY - y.top, { pos: S, index: T } = _(N), w = N >= s.left && N <= s.right;
    if (d(w && F >= a && F <= c ? S : null, T), F < a || F > l || !w) {
      h.style.display = "none";
      return;
    }
    const v = r.inv(F), R = f ? v - n.elevation[T] : v;
    if (f && R < 0) {
      h.style.display = "block", h.style.left = `${N + 12}px`, h.style.top = `${F + 12}px`, h.innerHTML = [
        `<b>${Te(n.times[T], f)}</b>`,
        `Höhe ${wt(v)} AMSL`,
        "unter Modell-Grund"
      ].join("<br>");
      return;
    }
    const k = xn(n, T, R), $ = k.dir, O = n.surface?.wcode?.[T], W = Number.isFinite(O) ? `${Bt(O, Gt(u.fog?.[T]))} (ww ${String(O).padStart(2, "0")})` : "N/A", I = n.surface?.precip?.[T], D = n.surface?.snow?.[T], C = (Yt, E = 2) => Yt.toLocaleString("de-DE", { maximumFractionDigits: E }), A = Number.isFinite(I) ? `${C(I)} mm` : "N/A", ot = Number.isFinite(D) && D > 0 ? ` · Schnee ${C(D, 1)} cm` : "";
    h.style.display = "block", h.style.left = `${N + 12}px`, h.style.top = `${F + 12}px`, h.innerHTML = [
      `<b>${Te(n.times[T], f)}</b>`,
      f ? `Höhe ${wt(v)} AMSL · ${wt(R)} über Modellgrund` : `Höhe ${wt(v)}`,
      `Temp ${Ri(k.T - 273.15)}${Number.isFinite(k.p) ? ` · θ ${Math.round(k.T * Math.pow(1e5 / k.p, 0.2857))} K` : ""}`,
      `Wind ${zi($)} ${Si(k.spd)}${Number.isFinite(k.w) ? ` · w ${k.w >= 0 ? "+" : "−"}${C(Math.abs(k.w))} m/s` : ""}`,
      `Wolken ${Math.round((k.cloudFrac || 0) * 100)} %`,
      `WW (Boden) ${W}`,
      `Nd (Vorstunde) ${A}${ot}`
    ].join("<br>");
  }), e.addEventListener("pointerleave", () => {
    h.style.display = "none", d(null);
  });
}
function pa(t, e, { x: o, y: n, grid: i, isPath: s, top: r, bot: a, zMin: l, zMax: c, profile: u }) {
  const f = i.pos[0], h = i.pos[i.pos.length - 1], p = document.createElement("div");
  p.className = "gm-cursor", p.hidden = !0;
  const d = document.createElement("div");
  d.className = "gm-cursor-dot";
  const m = document.createElement("div");
  return m.className = "gm-cursor-label", p.append(d, m), t.append(p), p.style.top = `${r}px`, p.style.height = `${a - r}px`, function(_, M = !1) {
    if (_ == null || !Number.isFinite(_) || _ < f || _ > h) {
      p.hidden = !0;
      return;
    }
    const g = o(_);
    p.hidden = !1, p.style.left = `${g}px`;
    let y = NaN;
    u?.pos?.length && (y = bt(u.pos, u.z, _));
    const N = Number.isFinite(y) && y >= l && y <= c;
    d.hidden = !N, N && (d.style.top = `${n(y) - r}px`, d.style.background = u.color || Cr);
    const F = bt(i.pos, i.times, _), S = Number.isFinite(F) ? Te(F, s) : "";
    if (m.textContent = s ? `${Fo(_ - f)} · ${S}` : S, M && e) {
      const T = e.scrollLeft + G.l + Fn, w = e.scrollLeft + e.clientWidth - Fn;
      (g < T || g > w) && (e.scrollLeft = B(
        g - e.clientWidth / 2,
        0,
        e.scrollWidth - e.clientWidth
      ));
    }
  };
}
function da(t, e, o, n, i, s) {
  const { pos: r, surface: a } = e;
  if (!a?.wcode) return;
  t.font = "10px system-ui, sans-serif", t.textAlign = "center", t.textBaseline = "middle";
  const l = i + s / 2;
  let c = -1 / 0;
  for (let u = 0; u < r.length; u++) {
    const f = a.wcode[u];
    if (!Number.isFinite(f)) continue;
    const h = o?.fog?.[u], p = Bt(f, Gt(h));
    if (p === "NSW" || p === "N/A") continue;
    const d = n(r[u]), m = t.measureText(p).width;
    d - m / 2 < c + 4 || (t.globalAlpha = h && h.certain === !1 ? 0.55 : 1, t.fillStyle = ma(p), t.fillText(p, d, l), t.globalAlpha = 1, c = d + m / 2);
  }
}
function ma(t) {
  return t.includes("TS") ? "#b71c1c" : t.includes("SN") || t.includes("SG") ? "#1565c0" : t.includes("FZ") ? "#6a1b9a" : t === "FG" ? "#616161" : t === "BR" ? "#78909c" : t === "HZ" ? "#8d6e63" : "#01579b";
}
function B(t, e, o) {
  return t < e ? e : t > o ? o : t;
}
function ba(t, e, o) {
  const n = _t(t), i = _t(e), s = B(o, 0, 1), r = Math.round(n[0] + (i[0] - n[0]) * s), a = Math.round(n[1] + (i[1] - n[1]) * s), l = Math.round(n[2] + (i[2] - n[2]) * s);
  return `rgb(${r},${a},${l})`;
}
function _t(t) {
  return [parseInt(t.slice(1, 3), 16), parseInt(t.slice(3, 5), 16), parseInt(t.slice(5, 7), 16)];
}
function vo(t, e, o) {
  const n = B(o, 0, 1);
  return [0, 1, 2].map((i) => Math.round(t[i] + (e[i] - t[i]) * n));
}
function _a(t, e, o) {
  return vo(_t(t), _t(e), o);
}
function ga(t) {
  return `rgb(${t[0]},${t[1]},${t[2]})`;
}
const In = 1.15, me = ["isotherms", "isotachs", "isentropes", "w", "hazards", "windbarbs", "terrain"];
class Ma extends HTMLElement {
  static observedAttributes = ["subtitle", "range", "max-height"];
  #t = null;
  #l = null;
  #i = null;
  #n = null;
  // Default 300 m fürs droneforecast-Punktszenario; `null` (via `update({
  // maxHeight: null })`) heißt "keine Deckellinie" -- im Path-Modus einer
  // Trajektorien-App gibt es keine gesetzliche Max-Flughöhe zu zeichnen.
  #e = 300;
  #o = "full";
  #a = ["gramet"];
  #u = null;
  #f = null;
  #c = null;
  // `null` = Renderer-Default (s. `MIN_MAIN_H` in render.js).
  #s = null;
  #r = null;
  constructor() {
    super();
    const e = this.attachShadow({ mode: "open" });
    e.innerHTML = `
      <style>${Eo}</style>
      <div class="head">
        <span class="title">GRAMET</span>
        <span class="subtitle"></span>
        <div class="layers">
          <label><input type="checkbox" data-layer="isotherms" checked> Isothermen</label>
          <label><input type="checkbox" data-layer="isotachs" checked> Isotachen</label>
          <label><input type="checkbox" data-layer="isentropes"> Isentropen</label>
          <label><input type="checkbox" data-layer="w"> Vertikalwind</label>
          <label><input type="checkbox" data-layer="hazards" checked> Hazards</label>
          <label><input type="checkbox" data-layer="windbarbs"> Windfiedern</label>
          <label class="terrain"><input type="checkbox" data-layer="terrain" checked> Gelände</label>
        </div>
        <div class="range-toggle">
          <button type="button" data-range="full">Gesamthöhe</button>
          <button type="button" data-range="zoom">bis Flughöhe</button>
        </div>
        <button type="button" class="export-btn" title="Als PNG speichern">⭳ PNG</button>
        <button type="button" class="close-btn" title="Schließen">×</button>
      </div>
      <div class="notice" hidden></div>
      <div class="plot">
        <div class="body"></div>
        <div class="busy" hidden></div>
      </div>
    `, this._subtitleEl = e.querySelector(".subtitle"), this._bodyEl = e.querySelector(".body"), this._busyEl = e.querySelector(".busy"), this._noticeEl = e.querySelector(".notice"), this._zoomBtn = e.querySelector('button[data-range="zoom"]'), e.querySelector(".layers").addEventListener("change", (o) => {
      o.target.closest("input[data-layer]") && (this._render(), this._emitChange());
    }), e.querySelector(".range-toggle").addEventListener("click", (o) => {
      const n = o.target.closest("button[data-range]");
      n && (this.range = n.dataset.range, this._emitChange());
    }), e.querySelector(".export-btn").addEventListener("click", () => this.exportPng()), e.querySelector(".close-btn").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
    }), this._syncRangeButtons();
  }
  attributeChangedCallback(e, o, n) {
    o !== n && (e === "subtitle" ? this.subtitle = n ?? "" : e === "range" ? this.range = n : e === "max-height" && (this.maxHeight = Number(n)));
  }
  get grid() {
    return this.#t;
  }
  set grid(e) {
    this.#t = e ?? null, this.#l = this.#t ? _n(this.#t) : null, this.#n = null, this._render();
  }
  get range() {
    return this.#o;
  }
  set range(e) {
    this.#o = e === "zoom" ? "zoom" : "full", this._syncRangeButtons(), this._render();
  }
  get maxHeight() {
    return this.#e;
  }
  set maxHeight(e) {
    const o = Number(e);
    Number.isFinite(o) && o > 0 && (this.#e = o), this._render();
  }
  get subtitle() {
    return this._subtitleEl.textContent;
  }
  set subtitle(e) {
    this._subtitleEl.textContent = e ?? "";
  }
  /** Beschriftung des Zoom-Knopfes. Default "bis Flughöhe" passt, wo die
   *  Host-App eine Flughöhe VORGIBT (droneforecast: Eingabefeld, daraus die
   *  Deckellinie). Wo der Ausschnitt stattdessen aus den Daten folgt -- etwa
   *  aus einem übergebenen `profile` --, kann die Host-App hier den
   *  zutreffenden Namen setzen, statt eine Flughöhe zu behaupten, die es
   *  nicht gibt. */
  get zoomLabel() {
    return this._zoomBtn.textContent;
  }
  set zoomLabel(e) {
    this._zoomBtn.textContent = e || "bis Flughöhe";
  }
  /** Mindesthöhe der Hauptfläche in px. Der Chart füllt den Container, solange
   *  darin mehr Platz ist; darunter behält er diese Höhe und der Rest wird
   *  gescrollt, statt die Wetterdarstellung zusammenzuquetschen. Für ein
   *  bildschirmfüllendes Panel genügt der Renderer-Default -- zu setzen ist
   *  das hier von Host-Apps, die das GRAMET in einen flachen Ausschnitt
   *  hängen (angedocktes Fenster neben einer Karte o. Ä.). `null` gibt an den
   *  Default zurück. */
  get minMainHeight() {
    return this.#s;
  }
  set minMainHeight(e) {
    const o = Number(e), n = e == null || !Number.isFinite(o) || o <= 0 ? null : o;
    n !== this.#s && (this.#s = n, this._render());
  }
  /** Meldetext STATT Chart -- für den Erstaufbau und für Fehler, wo es nichts
   *  Sinnvolles zu zeigen gibt. Beim Nachladen über einem bereits stehenden
   *  Chart stattdessen `busy` setzen (s. dort), sonst blinkt die Tafel bei
   *  jedem Datenwechsel auf eine Textmeldung zurück. */
  get loading() {
    return this.#n;
  }
  set loading(e) {
    this.#n = e || null, this.#n && (this.busy = null), this._render();
  }
  /** Ladehinweis ÜBER dem weiterhin sichtbaren Chart -- für Aktualisierungen,
   *  die dauern (im Path-Modus kostet ein Datenwechsel etliche Säulenabrufe),
   *  ohne die alte Darstellung wegzunehmen. `null` blendet ihn aus. */
  get busy() {
    return this._busyEl.hidden ? null : this._busyEl.textContent;
  }
  set busy(e) {
    this._busyEl.textContent = e || "", this._busyEl.hidden = !e;
  }
  /** Dauerhafter Warnhinweis über dem Chart -- für Zustände, die das Gezeigte
   *  entwerten, ohne es falsch zu machen: etwa "die Einstellungen der Host-App
   *  passen nicht mehr zu diesen Daten". Anders als `busy` transportiert er
   *  keine Aktivität, sondern eine Einordnung, und wird deshalb von `update()`
   *  NICHT automatisch gelöscht -- ein Datenwechsel hebt die Ursache ja nicht
   *  auf. Die Host-App setzt ihn auf `null`, wenn der Zustand vorbei ist. */
  get notice() {
    return this._noticeEl.hidden ? null : this._noticeEl.textContent;
  }
  set notice(e) {
    this._noticeEl.textContent = e || "", this._noticeEl.hidden = !e;
  }
  get layers() {
    const e = {};
    for (const o of me) e[o] = this._layerCheckbox(o).checked;
    return e;
  }
  set layers(e = {}) {
    for (const o of me)
      o in e && (this._layerCheckbox(o).checked = !!e[o]);
    this._render();
  }
  /** Positionscursor: eine Stelle auf der X-Achse, die von AUSSEN kommt --
   *  gedacht für Host-Apps, die dieselbe Strecke noch anderswo zeigen (eine
   *  Karte, einen Zeitregler) und beide Ansichten aufeinander zeigen lassen
   *  wollen. Der Wert hat dieselbe Einheit wie die X-Achse, also genau die,
   *  die das `poshover`-Event in der Gegenrichtung meldet: im Punkt-Modus
   *  Epochensekunden, im Path-Modus verstrichene Sekunden seit Pfadbeginn.
   *  `null` blendet ihn aus. Kostet keinen Redraw (DOM-Overlay). */
  get cursor() {
    return this.#r;
  }
  set cursor(e) {
    this.setCursor(e);
  }
  /** Wie die `cursor`-Property, aber mit `reveal: true` scrollt der Chart
   *  waagerecht nach, bis die Stelle im Blick ist. Für Positionen, die von
   *  außen kommen -- beim Hovern im Chart selbst wäre Scrollen unter dem
   *  Zeiger eine Zumutung. */
  setCursor(e, { reveal: o = !1 } = {}) {
    const n = Number(e);
    this.#r = e == null || !Number.isFinite(n) ? null : n, this._bodyEl.__gmSetCursor?.(this.#r, o);
  }
  /** Dateiname-Bausteine für den PNG-Export, s. `render.js` `exportPng()`. */
  get exportNameParts() {
    return this.#a;
  }
  set exportNameParts(e) {
    this.#a = Array.isArray(e) ? e : ["gramet"];
  }
  exportPng() {
    this.#i && ul(this.#i, this.#a);
  }
  /** Mehrere Properties in einem Rutsch setzen -- ein einziger Redraw statt
   *  einem pro Einzel-Setter (relevant beim Öffnen/bei Datenwechsel, wo
   *  Grid, Flughöhe, Höhenbereich und Ebenen zusammen aktualisiert werden). */
  update({ grid: e, maxHeight: o, range: n, layers: i, subtitle: s, exportNameParts: r, terrain: a, pathStop: l, profile: c, zoomLabel: u, minMainHeight: f } = {}) {
    if (this.#n = null, this.busy = null, u !== void 0 && (this.zoomLabel = u), f !== void 0) {
      const h = Number(f);
      this.#s = f == null || !Number.isFinite(h) || h <= 0 ? null : h;
    }
    if (e !== void 0 && (this.#t = e ?? null, this.#l = this.#t ? _n(this.#t) : null), o !== void 0) {
      const h = Number(o);
      o === null ? this.#e = null : Number.isFinite(h) && h > 0 && (this.#e = h);
    }
    if (a !== void 0 && (this.#u = a ?? null), l !== void 0 && (this.#f = l ?? null), c !== void 0 && (this.#c = c ?? null), n !== void 0 && (this.#o = n === "zoom" ? "zoom" : "full", this._syncRangeButtons()), i)
      for (const h of me)
        h in i && (this._layerCheckbox(h).checked = !!i[h]);
    s !== void 0 && (this.subtitle = s), r !== void 0 && (this.#a = r), this._render();
  }
  _layerCheckbox(e) {
    return this.shadowRoot.querySelector(`input[data-layer="${e}"]`);
  }
  _syncRangeButtons() {
    this.shadowRoot.querySelectorAll(".range-toggle button").forEach((e) => {
      e.classList.toggle("active", e.dataset.range === this.#o);
    });
  }
  _emitChange() {
    this.dispatchEvent(new CustomEvent("settingschange", {
      bubbles: !0,
      composed: !0,
      detail: { range: this.#o, layers: this.layers }
    }));
  }
  _render() {
    if (this.#n) {
      this._bodyEl.innerHTML = "";
      const i = document.createElement("div");
      i.className = "body-message", i.textContent = this.#n, this._bodyEl.append(i), this.#i = null;
      return;
    }
    if (!this.#t || !this.#l) {
      this._bodyEl.innerHTML = "", this.#i = null, this.removeAttribute("path");
      return;
    }
    const e = this.#t.meta?.mode === "path";
    this.toggleAttribute("path", e);
    let o, n;
    this.#o === "zoom" && (e ? { zMin: o, zMax: n } = this._pathZoom() : this.#e && (n = Math.round(this.#e * In), o = Math.max(10, this.#t.z[0] || 10))), this.#i = al(this._bodyEl, this.#t, this.#l, {
      // Path-Modus: Achse dem Renderer überlassen (linear auf AMSL, s.
      // render.js) -- ein erzwungenes "log" wäre dort Unsinn, weil der
      // log-Nullpunkt auf Meereshöhe statt am Boden läge.
      axis: e ? void 0 : this.#o === "zoom" ? "lin" : "log",
      zMin: o,
      zMax: n,
      maxHeightM: this.#e ?? void 0,
      terrain: e ? this.#u ?? void 0 : void 0,
      pathStop: e ? this.#f ?? void 0 : void 0,
      profile: e ? this.#c ?? void 0 : void 0,
      layerToggles: this.layers,
      minMainH: this.#s ?? void 0,
      onRedraw: (i) => {
        this.#i = i;
      }
    }), this.#r != null && this._bodyEl.__gmSetCursor?.(this.#r);
  }
  /** Zoombereich ("bis Flughöhe") im Path-Modus: AMSL-Spanne vom tiefsten
   *  Modell-Boden bis Gelände + Flughöhe bzw. bis übers Profilmaximum --
   *  Konvention aus dem Debug-Harness (`debug/gramet-path.js`), erweitert um
   *  das Trajektorien-Profil. Die Punkt-Modus-Rechnung (`grid.z[0]`, AGL)
   *  wäre hier falsch, `grid.z` sind im Path-Modus AGL-Werte auf einer
   *  AMSL-Achse. Ohne Flughöhe UND ohne Profil gibt es nichts, worauf man
   *  zoomen könnte -> volle Höhe (leeres Objekt). */
  _pathZoom() {
    let e = 1 / 0, o = -1 / 0;
    for (const r of this.#t.elevation)
      Number.isFinite(r) && (r < e && (e = r), r > o && (o = r));
    if (!Number.isFinite(e)) return {};
    let n = -1 / 0;
    for (const r of this.#c?.z ?? [])
      Number.isFinite(r) && r > n && (n = r);
    if (this.#e == null && !Number.isFinite(n)) return {};
    const i = Math.max(0, e - 20);
    let s = o + (this.#e ?? 0) * In;
    return Number.isFinite(n) && (s = Math.max(s, n + 0.15 * Math.max(n - i, 100))), s > i ? { zMin: i, zMax: s } : {};
  }
}
customElements.define("gramet-panel", Ma);
function ya(t, e, { margin: o = 0.3 } = {}) {
  return Object.keys(tt).filter((n) => {
    const i = tt[n].bbox;
    return i ? i.latMin <= -90 && i.latMax >= 90 && i.lonMin <= -180 && i.lonMax >= 180 ? !0 : t >= i.latMin + o && t <= i.latMax - o && e >= i.lonMin + o && e <= i.lonMax - o : !1;
  }).sort((n, i) => tt[n].grid - tt[i].grid);
}
async function Na(t, e, o, { coverFrom: n, coverUntil: i, margin: s = 0.3, only: r, fetchImpl: a } = {}) {
  let l = ya(t, e, { margin: s });
  r && (l = l.filter((f) => r.includes(f)));
  const c = [];
  for (const f of l) {
    let h;
    try {
      h = await ai(t, e, f, o, a);
    } catch (d) {
      c.push({ model: f, reason: d.message || String(d) });
      continue;
    }
    const p = wa(h, n, i);
    if (p) {
      c.push({ model: f, reason: p });
      continue;
    }
    return { model: f, col: h, tried: c };
  }
  const u = c.map((f) => `${f.model}: ${f.reason}`).join("; ");
  throw new Error(`Kein Modell liefert Daten für ${t.toFixed(2)}, ${e.toFixed(2)}` + (u ? ` (${u})` : ""));
}
function wa(t, e, o) {
  const n = t.time;
  return n.length ? e != null && n[0] > e ? "Zeitraum beginnt zu spät" : o != null && n[n.length - 1] < o ? "Vorhersagehorizont zu kurz" : null : "keine Modelldaten an diesem Punkt";
}
const Fa = Object.fromEntries(
  Object.entries(tt).map(([t, e]) => [t, e.label])
), be = 86400;
async function va(t, e, { model: o = "auto", date: n = /* @__PURE__ */ new Date() } = {}) {
  const i = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()) / 1e3, s = (u) => new Date(u * 1e3).toISOString().slice(0, 10), r = { startDate: s(i), endDate: s(i + be) }, a = await Na(t, e, r, {
    coverFrom: i,
    coverUntil: i + be,
    only: o === "auto" ? void 0 : [o]
  }), l = await ti(t, e, a.model, r).catch(() => null), c = ui(a.col, i, i + be);
  return {
    grid: di(c, l, t, e),
    model: a.model,
    label: tt[a.model].label,
    tried: a.tried
  };
}
export {
  Fa as MODEL_LABELS,
  va as loadDayGrid,
  Ta as setUnits
};
