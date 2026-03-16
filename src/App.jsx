import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "/api/v1";
let _accessToken = null;
export const setToken = (t) => { _accessToken = t; };
export const clearToken = () => { _accessToken = null; };

const apiFetch = async (path, options = {}) => {
  try {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (_accessToken) headers["Authorization"] = `Bearer ${_accessToken}`;
    const res = await fetch(`${API_BASE}${path}`, { ...options, credentials: "include", headers });
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { statusCode: res.status, message: text }; }
  } catch { return { statusCode: 0, message: "NETWORK_ERROR" }; }
};

const api = {
  post:  (p, b) => apiFetch(p, { method: "POST",  body: JSON.stringify(b) }),
  patch: (p, b) => apiFetch(p, { method: "PATCH", body: JSON.stringify(b) }),
  get:   (p)    => apiFetch(p),
  getq:  (p, q) => apiFetch(p + "?" + new URLSearchParams(q).toString()),
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white:      #ffffff;
    --bg:         #f7f5f2;
    --bg2:        #f0ede8;
    --bg3:        #ebe7e0;
    --surface:    #ffffff;
    --surface2:   #faf9f7;
    --ink:        #1a1714;
    --ink2:       #3d3832;
    --ink3:       #7a7268;
    --ink4:       #b5afa6;
    --border:     #e4dfd8;
    --border2:    #d4cfc8;
    --teal:       #007a6e;
    --teal2:      #00a693;
    --teal-bg:    #edf6f5;
    --teal-bd:    #b3deda;
    --red:        #c0392b;
    --red2:       #e74c3c;
    --red-bg:     #fdf2f1;
    --red-bd:     #f5c6c2;
    --amber:      #b45309;
    --amber-bg:   #fffbeb;
    --amber-bd:   #fde68a;
    --gold:       #d4a017;
    --gold-bg:    #fef9ee;
    --gold-bd:    #f9d97a;
    --purple:     #7c3aed;
    --purple-bg:  #f5f3ff;
    --purple-bd:  #c4b5fd;
    --sh-sm:  0 1px 3px rgba(26,23,20,0.06),0 1px 2px rgba(26,23,20,0.04);
    --sh:     0 4px 12px rgba(26,23,20,0.08),0 2px 4px rgba(26,23,20,0.04);
    --sh-md:  0 8px 24px rgba(26,23,20,0.10),0 4px 8px rgba(26,23,20,0.05);
    --sh-lg:  0 20px 48px rgba(26,23,20,0.14),0 8px 16px rgba(26,23,20,0.06);
    --r:  6px;
    --r2: 10px;
    --r3: 16px;
  }

  body {
    background: var(--bg);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  /* AUTH */
  .auth-wrap { min-height: 100vh; display: grid; place-items: center; background: var(--bg); padding: 24px; }
  .auth-card { width: 100%; max-width: 420px; background: var(--white); border: 1px solid var(--border); border-radius: var(--r3); padding: 40px; box-shadow: var(--sh-md); animation: slideUp 0.35s ease both; }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .auth-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .auth-brand-mark { width: 32px; height: 32px; background: var(--ink); border-radius: 8px; display: grid; place-items: center; font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: var(--white); flex-shrink: 0; }
  .auth-brand-name { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; letter-spacing: -0.3px; color: var(--ink); }
  .auth-brand-name em { font-style: italic; color: var(--ink3); }
  .auth-divider { height: 1px; background: var(--border); margin-bottom: 28px; }
  .auth-tabs { display: flex; margin-bottom: 32px; border-bottom: 1.5px solid var(--border); }
  .auth-tab { padding: 10px 0; margin-right: 28px; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -1.5px; color: var(--ink4); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
  .auth-tab.active { color: var(--ink); border-bottom-color: var(--ink); }
  .auth-tab:hover:not(.active) { color: var(--ink2); }
  .field { margin-bottom: 18px; }
  .field label { display: block; font-size: 11px; font-weight: 700; color: var(--ink3); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 7px; }
  .field input { width: 100%; background: var(--surface2); border: 1.5px solid var(--border); border-radius: var(--r); color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 11px 14px; outline: none; transition: all 0.18s; }
  .field input::placeholder { color: var(--ink4); }
  .field input:focus { border-color: var(--ink2); background: var(--white); box-shadow: 0 0 0 3px rgba(26,23,20,0.06); }
  .btn-primary { width: 100%; padding: 13px; background: var(--ink); color: var(--white); border: none; border-radius: var(--r); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 8px; transition: all 0.18s; box-shadow: var(--sh); }
  .btn-primary:hover { background: var(--ink2); transform: translateY(-1px); box-shadow: var(--sh-md); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .error-msg { color: var(--red); font-size: 13px; margin-top: 10px; text-align: center; }
  .success-msg { color: var(--teal); font-size: 13px; margin-top: 10px; text-align: center; }
  .network-banner { margin-top: 14px; background: var(--red-bg); border: 1px solid var(--red-bd); border-radius: var(--r); color: var(--red); padding: 14px; font-size: 12px; line-height: 1.9; }
  .network-banner strong { display: block; margin-bottom: 4px; font-weight: 700; }
  .network-banner code { background: rgba(192,57,43,0.1); padding: 1px 6px; border-radius: 3px; font-family: 'DM Mono', monospace; font-size: 11px; }

  /* SIDEBAR */
  .layout { display: flex; min-height: 100vh; }
  .sidebar { width: 252px; background: var(--white); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 20; }
  .sidebar-head { padding: 22px 20px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
  .sidebar-mark { width: 34px; height: 34px; background: var(--ink); border-radius: 9px; display: grid; place-items: center; font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; color: var(--white); flex-shrink: 0; }
  .sidebar-title { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; letter-spacing: -0.4px; color: var(--ink); }
  .sidebar-title em { font-style: italic; color: var(--ink3); }
  .nav-section { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink4); padding: 16px 20px 6px; }
  .nav { flex: 1; padding: 6px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--r2); cursor: pointer; color: var(--ink3); font-size: 14px; font-weight: 500; transition: all 0.15s; }
  .nav-item:hover { background: var(--bg); color: var(--ink); }
  .nav-item.active { background: var(--bg2); color: var(--ink); font-weight: 600; }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }
  .nav-badge { margin-left: auto; background: linear-gradient(135deg,#d4a017,#f59e0b); color: white; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 10px; letter-spacing: 0.5px; }
  .sidebar-foot { padding: 16px 20px 20px; border-top: 1px solid var(--border); }
  .wallet-card { background: var(--ink); border-radius: var(--r2); padding: 16px 18px; margin-bottom: 14px; overflow: hidden; position: relative; }
  .wallet-card::before { content: ''; position: absolute; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.03); top: -40px; right: -30px; }
  .wallet-lbl { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.35); }
  .wallet-bal { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; color: #fff; margin-top: 4px; letter-spacing: -0.5px; }
  .wallet-hint { font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 2px; }
  .user-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .user-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--bg3); border: 1.5px solid var(--border2); display: grid; place-items: center; font-size: 13px; font-weight: 700; color: var(--ink2); flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: var(--ink2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .btn-logout { width: 100%; padding: 9px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--r); color: var(--ink3); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
  .btn-logout:hover { background: var(--red-bg); border-color: var(--red-bd); color: var(--red); }
  .main { margin-left: 252px; flex: 1; padding: 40px 48px; }

  /* PAGE HEADER */
  .page-header { margin-bottom: 32px; }
  .page-title { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 400; letter-spacing: -0.8px; }
  .page-sub { font-size: 14px; color: var(--ink3); margin-top: 4px; }

  /* STATS */
  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r2); padding: 22px 24px; box-shadow: var(--sh-sm); position: relative; transition: box-shadow 0.2s, transform 0.2s; }
  .stat-card:hover { box-shadow: var(--sh); transform: translateY(-1px); }
  .stat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--ink4); }
  .stat-value { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin-top: 8px; }
  .stat-pill { position: absolute; top: 20px; right: 20px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .pill-teal  { background: var(--teal-bg); color: var(--teal); border: 1px solid var(--teal-bd); }
  .pill-red   { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-bd); }
  .pill-amber { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--amber-bd); }
  .pill-gold  { background: var(--gold-bg); color: var(--gold); border: 1px solid var(--gold-bd); }
  .pill-purple{ background: var(--purple-bg); color: var(--purple); border: 1px solid var(--purple-bd); }

  /* MARKET */
  .search-bar { width: 100%; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r); color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 11px 16px; outline: none; transition: all 0.18s; margin-bottom: 20px; box-shadow: var(--sh-sm); }
  .search-bar::placeholder { color: var(--ink4); }
  .search-bar:focus { border-color: var(--ink2); box-shadow: 0 0 0 3px rgba(26,23,20,0.06); }
  .stocks-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(190px,1fr)); gap: 14px; }
  .stock-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r2); padding: 20px; cursor: pointer; transition: all 0.2s; box-shadow: var(--sh-sm); position: relative; overflow: hidden; }
  .stock-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--teal); transform: scaleX(0); transform-origin: left; transition: transform 0.25s; }
  .stock-card:hover { box-shadow: var(--sh-md); transform: translateY(-2px); border-color: var(--border2); }
  .stock-card:hover::after { transform: scaleX(1); }
  .stock-ticker { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink4); margin-bottom: 5px; font-family: 'DM Mono', monospace; }
  .stock-name { font-size: 15px; font-weight: 700; color: var(--ink); }
  .stock-price { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: var(--ink); margin: 10px 0 6px; letter-spacing: -0.5px; }
  .live-dot-wrap { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: var(--teal); }
  .live-dot { width: 6px; height: 6px; background: var(--teal2); border-radius: 50%; animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(26,23,20,0.3); display: grid; place-items: center; z-index: 100; backdrop-filter: blur(10px); animation: fadeIn 0.18s ease; }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  .modal { background: var(--white); border: 1px solid var(--border); border-radius: var(--r3); padding: 40px; width: 420px; box-shadow: var(--sh-lg); position: relative; animation: modalIn 0.22s cubic-bezier(0.16,1,0.3,1); }
  @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px);} to{opacity:1;transform:scale(1) translateY(0);} }
  .modal-close { position: absolute; top: 18px; right: 18px; width: 30px; height: 30px; border-radius: 50%; background: var(--bg2); border: 1px solid var(--border); color: var(--ink3); cursor: pointer; font-size: 16px; display: grid; place-items: center; transition: all 0.15s; }
  .modal-close:hover { background: var(--bg3); color: var(--ink); }
  .modal-badge { display: inline-block; background: var(--bg2); border: 1px solid var(--border2); color: var(--ink2); border-radius: 6px; padding: 4px 11px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; font-family: 'DM Mono', monospace; }
  .modal-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 400; letter-spacing: -0.5px; margin-bottom: 4px; }
  .modal-sub { font-size: 13px; color: var(--ink3); margin-bottom: 22px; }
  .modal-price-box { background: var(--bg); border: 1px solid var(--border); border-radius: var(--r); padding: 14px 18px; display: flex; align-items: baseline; gap: 8px; margin-bottom: 20px; }
  .modal-price { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; color: var(--ink); letter-spacing: -1px; }
  .modal-per { font-size: 13px; color: var(--ink4); }
  .modal-total-row { display: flex; justify-content: space-between; align-items: center; background: var(--bg); border-radius: var(--r); padding: 11px 14px; margin: 12px 0; font-size: 13px; color: var(--ink3); }
  .modal-total-val { font-size: 16px; font-weight: 700; color: var(--ink); }
  .modal-wallet-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--ink4); padding: 0 4px; margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 10px; }
  .btn-buy-m { flex: 1; padding: 13px; background: var(--teal); color: var(--white); border: none; border-radius: var(--r); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.18s; box-shadow: 0 2px 10px rgba(0,122,110,0.2); }
  .btn-buy-m:hover { background: var(--teal2); transform: translateY(-1px); }
  .btn-buy-m:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .btn-sell-m { flex: 1; padding: 13px; background: var(--white); border: 1.5px solid var(--red-bd); border-radius: var(--r); color: var(--red); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.18s; }
  .btn-sell-m:hover { background: var(--red-bg); border-color: var(--red); }
  .btn-sell-m:disabled { opacity: 0.45; cursor: not-allowed; }

  /* TABLE */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r2); overflow: hidden; box-shadow: var(--sh-sm); }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--bg); }
  th { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--ink4); padding: 13px 20px; text-align: left; border-bottom: 1px solid var(--border); }
  td { padding: 14px 20px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--ink2); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface2); }
  .td-bold { font-weight: 700; color: var(--ink); }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .badge-buy  { background: var(--teal-bg); color: var(--teal); border: 1px solid var(--teal-bd); }
  .badge-sell { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-bd); }

  /* PORTFOLIO */
  .pf-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r2); padding: 20px 24px; margin-bottom: 10px; box-shadow: var(--sh-sm); }
  .pf-top { display: flex; align-items: center; justify-content: space-between; }
  .pf-name { font-size: 17px; font-weight: 700; color: var(--ink); letter-spacing: -0.2px; }
  .pf-qty { font-size: 12px; color: var(--ink4); margin-top: 3px; font-family: 'DM Mono', monospace; }
  .pf-right { display: flex; align-items: center; gap: 20px; }
  .pf-price { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: var(--ink); }
  .pf-pnl { font-size: 12px; font-weight: 700; margin-top: 2px; text-align: right; }
  .pnl-pos { color: var(--teal); }
  .pnl-neg { color: var(--red); }
  .btn-sell-mini { padding: 8px 16px; border-radius: var(--r); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
  .btn-sell-mini.idle { background: var(--white); border: 1.5px solid var(--red-bd); color: var(--red); }
  .btn-sell-mini.idle:hover { background: var(--red-bg); }
  .btn-sell-mini.cancel { background: var(--bg2); border: 1px solid var(--border); color: var(--ink3); }
  .sell-panel { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .sell-panel input { width: 80px; background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--r); color: var(--ink); font-family: 'DM Mono', monospace; font-size: 14px; padding: 8px 10px; outline: none; transition: border-color 0.18s; }
  .sell-panel input:focus { border-color: var(--ink2); }
  .sell-total { font-size: 13px; color: var(--ink3); }
  .sell-total strong { color: var(--teal); font-weight: 700; }
  .btn-confirm-sell { padding: 8px 20px; background: var(--red); border: none; border-radius: var(--r); color: var(--white); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.18s; }
  .btn-confirm-sell:hover { background: var(--red2); transform: translateY(-1px); }
  .btn-confirm-sell:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* LEADERBOARD */
  .lb-list { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r2); overflow: hidden; box-shadow: var(--sh-sm); }
  .lb-item { display: flex; align-items: center; gap: 16px; padding: 16px 22px; border-bottom: 1px solid var(--border); transition: background 0.15s; }
  .lb-item:last-child { border-bottom: none; }
  .lb-item:hover { background: var(--surface2); }
  .lb-rank { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
  .lb-rank.top0 { background: var(--amber-bg); border: 1px solid var(--amber-bd); color: var(--amber); }
  .lb-rank.top1 { background: #f3f4f6; border: 1px solid #d1d5db; color: #6b7280; }
  .lb-rank.top2 { background: #fdf4ec; border: 1px solid #f8c899; color: #b45309; }
  .lb-rank.rest { background: var(--bg2); border: 1px solid var(--border); color: var(--ink4); }
  .lb-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--bg3); border: 1.5px solid var(--border2); display: grid; place-items: center; font-size: 14px; font-weight: 700; color: var(--ink2); flex-shrink: 0; }
  .lb-name { flex: 1; font-size: 15px; font-weight: 600; color: var(--ink); }
  .lb-score { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: var(--ink); }

  /* CHART */
  .chart-search { display: flex; gap: 10px; margin-bottom: 24px; }
  .chart-search input { flex: 1; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r); color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 11px 16px; outline: none; transition: all 0.18s; box-shadow: var(--sh-sm); }
  .chart-search input::placeholder { color: var(--ink4); }
  .chart-search input:focus { border-color: var(--ink2); box-shadow: 0 0 0 3px rgba(26,23,20,0.05); }
  .chart-search input.narrow { flex: 0 0 100px; }
  .btn-load { padding: 11px 28px; background: var(--ink); color: var(--white); border: none; border-radius: var(--r); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.18s; box-shadow: var(--sh); }
  .btn-load:hover { background: var(--ink2); transform: translateY(-1px); }
  .chart-area { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r2); padding: 28px; box-shadow: var(--sh-sm); }
  .chart-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .chart-name { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 400; color: var(--ink); }
  .chart-pts { font-size: 12px; color: var(--ink4); font-family: 'DM Mono', monospace; }

  /* MISC */
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border2); border-top-color: var(--ink2); border-radius: 50%; animation: spin 0.65s linear infinite; display: inline-block; }
  @keyframes spin { to{transform:rotate(360deg);} }
  .loading-wrap { display: flex; align-items: center; justify-content: center; padding: 80px; gap: 14px; color: var(--ink4); font-size: 14px; }
  .empty-state { text-align: center; padding: 80px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r2); color: var(--ink3); box-shadow: var(--sh-sm); }
  .empty-icon { font-size: 40px; margin-bottom: 14px; opacity: 0.4; }
  .empty-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 400; color: var(--ink2); margin-bottom: 6px; }
  .toast { position: fixed; bottom: 28px; right: 28px; background: var(--white); border: 1px solid var(--border); border-radius: var(--r2); padding: 14px 20px; font-size: 14px; font-weight: 500; color: var(--ink); animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1); z-index: 300; max-width: 340px; box-shadow: var(--sh-lg); display: flex; align-items: center; gap: 10px; }
  .toast.success { border-left: 3px solid var(--teal); }
  .toast.error   { border-left: 3px solid var(--red); }
  .toast-icon { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .toast.success .toast-icon { background: var(--teal-bg); color: var(--teal); }
  .toast.error   .toast-icon { background: var(--red-bg); color: var(--red); }
  @keyframes toastIn { from{opacity:0;transform:translateX(20px);} to{opacity:1;transform:translateX(0);} }

  /* ============================================================
     CASINO / GAMES
  ============================================================ */
  .casino-wrap { display: flex; flex-direction: column; gap: 0; }

  /* game selector tabs */
  .game-tabs { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .game-tab {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: var(--r2);
    border: 1.5px solid var(--border); background: var(--surface);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--ink3); cursor: pointer; transition: all 0.18s; box-shadow: var(--sh-sm);
  }
  .game-tab:hover { border-color: var(--border2); color: var(--ink); transform: translateY(-1px); }
  .game-tab.active { border-color: var(--ink); background: var(--ink); color: var(--white); }
  .game-tab-icon { font-size: 16px; }

  /* shared game card */
  .game-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r3); padding: 32px; box-shadow: var(--sh); }
  .game-header { margin-bottom: 24px; }
  .game-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 400; letter-spacing: -0.5px; }
  .game-desc { font-size: 13px; color: var(--ink3); margin-top: 4px; }

  /* bet row */
  .bet-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  .bet-row label { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--ink4); }
  .bet-input { background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--r); color: var(--ink); font-family: 'DM Mono', monospace; font-size: 15px; padding: 9px 14px; width: 130px; outline: none; transition: border-color 0.18s; }
  .bet-input:focus { border-color: var(--ink2); }
  .bet-chip { padding: 7px 14px; background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--r); font-size: 12px; font-weight: 700; cursor: pointer; color: var(--ink2); transition: all 0.15s; }
  .bet-chip:hover { background: var(--bg3); border-color: var(--border2); }
  .balance-hint { font-size: 12px; color: var(--ink4); margin-left: auto; }

  /* coin flip */
  .coin-wrap { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 20px 0; }
  .coin {
    width: 120px; height: 120px; border-radius: 50%; position: relative;
    transform-style: preserve-3d; transition: transform 1s cubic-bezier(0.4,0,0.2,1);
    cursor: pointer; box-shadow: 0 8px 32px rgba(26,23,20,0.15);
  }
  .coin.flipping { animation: coinFlip 1s cubic-bezier(0.4,0,0.2,1) forwards; }
  @keyframes coinFlip {
    0%   { transform: rotateY(0); }
    50%  { transform: rotateY(900deg) scale(1.1); }
    100% { transform: rotateY(1800deg); }
  }
  .coin-face { position: absolute; inset: 0; border-radius: 50%; display: grid; place-items: center; backface-visibility: hidden; }
  .coin-heads { background: linear-gradient(135deg, #d4a017, #f59e0b, #d4a017); border: 4px solid rgba(255,255,255,0.3); }
  .coin-tails { background: linear-gradient(135deg, #94a3b8, #cbd5e1, #94a3b8); border: 4px solid rgba(255,255,255,0.3); transform: rotateY(180deg); }
  .coin-symbol { font-size: 48px; }
  .coin-choice-row { display: flex; gap: 12px; }
  .coin-btn { padding: 12px 32px; border-radius: var(--r2); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; border: 2px solid; }
  .coin-btn.heads { background: var(--gold-bg); border-color: var(--gold-bd); color: var(--gold); }
  .coin-btn.heads:hover,.coin-btn.heads.chosen { background: linear-gradient(135deg,#d4a017,#f59e0b); border-color: #d4a017; color: white; }
  .coin-btn.tails { background: #f8fafc; border-color: #cbd5e1; color: #64748b; }
  .coin-btn.tails:hover,.coin-btn.tails.chosen { background: linear-gradient(135deg,#94a3b8,#cbd5e1); border-color: #94a3b8; color: white; }
  .coin-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* game result overlay */
  .game-result { margin-top: 20px; padding: 20px; border-radius: var(--r2); text-align: center; animation: slideUp 0.3s ease; }
  .game-result.win { background: var(--teal-bg); border: 1px solid var(--teal-bd); }
  .game-result.lose { background: var(--red-bg); border: 1px solid var(--red-bd); }
  .game-result-icon { font-size: 36px; margin-bottom: 8px; }
  .game-result-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; }
  .game-result.win .game-result-title { color: var(--teal); }
  .game-result.lose .game-result-title { color: var(--red); }
  .game-result-sub { font-size: 13px; color: var(--ink3); margin-top: 4px; }

  /* crash game */
  .crash-canvas-wrap { background: #0f1117; border-radius: var(--r2); overflow: hidden; margin-bottom: 20px; position: relative; }
  .crash-canvas { display: block; width: 100%; }
  .crash-multiplier { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); font-family: 'Fraunces', serif; font-size: 52px; font-weight: 700; letter-spacing: -2px; text-shadow: 0 0 30px currentColor; transition: color 0.2s; }
  .crash-multiplier.safe { color: #4ade80; }
  .crash-multiplier.warning { color: #facc15; }
  .crash-multiplier.danger { color: #f87171; }
  .crash-multiplier.crashed { color: #ef4444; }
  .crash-status { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .crash-status.waiting { color: #64748b; }
  .crash-status.flying { color: #4ade80; }
  .crash-status.crashed { color: #f87171; }
  .crash-controls { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .btn-crash-start { flex: 1; padding: 13px; background: linear-gradient(135deg, #4ade80, #22c55e); color: #052e16; border: none; border-radius: var(--r); font-family: 'DM Sans', sans-serif; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
  .btn-crash-start:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(34,197,94,0.4); }
  .btn-crash-start:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .btn-crash-cashout { flex: 1; padding: 13px; background: linear-gradient(135deg, #facc15, #f59e0b); color: #451a03; border: none; border-radius: var(--r); font-family: 'DM Sans', sans-serif; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 16px rgba(245,158,11,0.3); animation: glow 1s ease-in-out infinite alternate; }
  @keyframes glow { from{box-shadow:0 4px 16px rgba(245,158,11,0.3);} to{box-shadow:0 6px 28px rgba(245,158,11,0.6);} }
  .btn-crash-cashout:hover { transform: translateY(-1px); }
  .btn-crash-cashout:disabled { opacity: 0.45; cursor: not-allowed; transform: none; animation: none; }

  /* slider game */
  .slider-track-wrap { margin: 24px 0; }
  .slider-track { width: 100%; height: 8px; background: var(--bg3); border-radius: 4px; position: relative; cursor: pointer; }
  .slider-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--teal), var(--teal2)); transition: width 0.05s; }
  .slider-thumb { position: absolute; top: 50%; transform: translate(-50%,-50%); width: 24px; height: 24px; border-radius: 50%; background: var(--white); border: 3px solid var(--teal); box-shadow: var(--sh); cursor: grab; transition: box-shadow 0.15s; }
  .slider-thumb:active { cursor: grabbing; box-shadow: var(--sh-md), 0 0 0 6px rgba(0,122,110,0.1); }
  .slider-target-line { position: absolute; top: -8px; bottom: -8px; width: 3px; background: var(--red); border-radius: 2px; opacity: 0.7; transform: translateX(-50%); }
  .slider-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink4); font-family: 'DM Mono', monospace; margin-top: 6px; }
  .slider-choice { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 13px; color: var(--ink3); }
  .slider-choice select { background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--r); color: var(--ink); font-family: 'DM Sans', sans-serif; padding: 6px 10px; outline: none; font-size: 13px; }
  .slider-multiplier-hint { text-align: center; font-family: 'Fraunces', serif; font-size: 36px; font-weight: 600; letter-spacing: -1px; color: var(--teal); margin-bottom: 8px; }
  .slider-hint-sub { text-align: center; font-size: 12px; color: var(--ink4); margin-bottom: 16px; }

  /* dice game */
  .dice-arena { display: flex; justify-content: center; align-items: center; gap: 32px; padding: 32px 0; }
  .die { width: 80px; height: 80px; border-radius: 16px; background: var(--white); border: 2px solid var(--border2); box-shadow: var(--sh); display: grid; place-items: center; font-size: 40px; transition: all 0.3s; }
  .die.rolling { animation: diceRoll 0.5s ease-in-out; }
  @keyframes diceRoll { 0%,100%{transform:rotate(0);} 25%{transform:rotate(-15deg) scale(1.1);} 75%{transform:rotate(15deg) scale(1.1);} }
  .dice-vs { font-family: 'Fraunces', serif; font-size: 20px; color: var(--ink4); }
  .dice-choice-row { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap; }
  .dice-choice-btn { padding: 8px 18px; border-radius: var(--r); border: 1.5px solid var(--border2); background: var(--bg); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; color: var(--ink2); }
  .dice-choice-btn.selected { background: var(--ink); border-color: var(--ink); color: var(--white); }
  .dice-choice-btn:hover:not(.selected) { border-color: var(--ink2); background: var(--bg2); }

  /* mines game */
  .mines-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; margin: 20px 0; }
  .mine-cell {
    aspect-ratio: 1; border-radius: var(--r2); border: 2px solid var(--border2);
    background: var(--bg); display: grid; place-items: center; font-size: 24px;
    cursor: pointer; transition: all 0.18s; box-shadow: var(--sh-sm);
  }
  .mine-cell:hover:not(.revealed):not(.disabled) { background: var(--bg2); border-color: var(--border2); transform: translateY(-2px); box-shadow: var(--sh); }
  .mine-cell.safe-reveal { background: var(--teal-bg); border-color: var(--teal-bd); animation: popIn 0.25s cubic-bezier(0.16,1,0.3,1); }
  .mine-cell.bomb-reveal { background: var(--red-bg); border-color: var(--red-bd); animation: shake 0.3s ease; }
  .mine-cell.disabled { cursor: default; opacity: 0.7; }
  @keyframes popIn { from{transform:scale(0.7);} to{transform:scale(1);} }
  @keyframes shake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-6px);} 75%{transform:translateX(6px);} }
  .mines-info { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink3); margin-bottom: 16px; }
  .mines-info strong { color: var(--ink); }
  .btn-mines-cashout { padding: 12px 32px; background: linear-gradient(135deg,var(--teal),var(--teal2)); color: white; border: none; border-radius: var(--r); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.18s; }
  .btn-mines-cashout:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,122,110,0.3); }
  .btn-mines-cashout:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* plinko */
  .plinko-wrap { display: flex; flex-direction: column; align-items: center; }
  .plinko-canvas { border-radius: var(--r2); background: #0f1117; }
  .plinko-multipliers { display: flex; gap: 4px; margin-top: 8px; width: 100%; justify-content: center; }
  .plinko-mult { flex: 1; text-align: center; padding: 6px 2px; border-radius: 6px; font-size: 11px; font-weight: 800; font-family: 'DM Mono', monospace; }
  .plinko-mult.high { background: #fee2e2; color: #991b1b; }
  .plinko-mult.med  { background: #fef3c7; color: #92400e; }
  .plinko-mult.low  { background: #d1fae5; color: #065f46; }
  .plinko-mult.hit  { animation: plinkoHit 0.4s ease; }
  @keyframes plinkoHit { 0%{transform:scale(1.4);} 100%{transform:scale(1);} }

  /* game history strip */
  .game-history { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 20px; }
  .game-hist-chip { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'DM Mono', monospace; }
  .game-hist-chip.win { background: var(--teal-bg); color: var(--teal); border: 1px solid var(--teal-bd); }
  .game-hist-chip.lose { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-bd); }
`;

/* =========================================================
   UTILITIES
========================================================= */
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function fmt(n) { return Number(n).toLocaleString("en-IN"); }

function useLocalWallet(serverWallet) {
  // For games we use a local mirror since server may not exist
  const [w, setW] = useState(null);
  useEffect(() => { if (serverWallet !== null) setW(serverWallet); }, [serverWallet]);
  const debit  = (amt) => setW(prev => Math.max(0, prev - amt));
  const credit = (amt) => setW(prev => prev + amt);
  return [w, debit, credit];
}

/* =========================================================
   COIN FLIP GAME
========================================================= */
function CoinFlipGame({ wallet, onResult }) {
  const [bet, setBet]       = useState(100);
  const [choice, setChoice] = useState(null);
  const [flipping, setFlipping]= useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory]  = useState([]);

  const flip = () => {
    if (!choice || bet <= 0 || bet > wallet) return;
    setFlipping(true); setResult(null);
    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? "heads" : "tails";
      const won = outcome === choice;
      const pnl = won ? bet : -bet;
      setResult({ outcome, won, pnl });
      setFlipping(false);
      setHistory(h => [{ won, pnl }, ...h.slice(0, 11)]);
      onResult(won ? bet : -bet, won ? `Flipped ${outcome} — You win ₹${fmt(bet)}!` : `Flipped ${outcome} — You lose ₹${fmt(bet)}`);
    }, 1050);
  };

  return (
    <div className="game-card">
      <div className="game-header">
        <div className="game-title">Coin Flip</div>
        <div className="game-desc">Call heads or tails — double or nothing. 50/50 odds.</div>
      </div>

      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} />
        {[50,100,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>

      <div className="coin-wrap">
        <div className={`coin ${flipping?"flipping":""}`}>
          <div className="coin-face coin-heads"><span className="coin-symbol">₹</span></div>
          <div className="coin-face coin-tails"><span className="coin-symbol">🦅</span></div>
        </div>
        <div className="coin-choice-row">
          <button className={`coin-btn heads ${choice==="heads"?"chosen":""}`} onClick={()=>setChoice("heads")} disabled={flipping}>Heads ₹</button>
          <button className={`coin-btn tails ${choice==="tails"?"chosen":""}`} onClick={()=>setChoice("tails")} disabled={flipping}>Tails 🦅</button>
        </div>
        <button className="btn-primary" style={{width:"auto",padding:"12px 40px"}} onClick={flip} disabled={flipping||!choice||bet<=0||bet>wallet}>
          {flipping ? "Flipping…" : "Flip Coin"}
        </button>
      </div>

      {result && (
        <div className={`game-result ${result.won?"win":"lose"}`}>
          <div className="game-result-icon">{result.won ? "🎉" : "😢"}</div>
          <div className="game-result-title">{result.won ? `You Win ₹${fmt(bet)}!` : `You Lost ₹${fmt(bet)}`}</div>
          <div className="game-result-sub">The coin landed on <strong>{result.outcome}</strong></div>
        </div>
      )}
      <div className="game-history">
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`}>{h.won?`+₹${fmt(h.pnl)}`:`-₹${fmt(Math.abs(h.pnl))}`}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   CRASH GAME (AEROPLANE)
========================================================= */
function CrashGame({ wallet, onResult }) {
  const canvasRef  = useRef(null);
  const stateRef   = useRef({ phase:"idle", mult:1, target:1, points:[], rafId:null });
  const [phase, setPhase]     = useState("idle");   // idle | countdown | flying | crashed
  const [mult, setMult]       = useState(1.00);
  const [bet, setBet]         = useState(200);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState([]);
  const [myBetActive, setMyBetActive] = useState(false);
  const cashoutRef = useRef(false);

  const randomTarget = () => {
    // house edge ~ 5% → E[target] ≈ 1.95
    const r = Math.random();
    if (r < 0.05) return 1.00;          // instant crash
    if (r < 0.30) return 1 + Math.random()*0.9;
    if (r < 0.65) return 1.9 + Math.random()*1.5;
    if (r < 0.85) return 3.4 + Math.random()*3;
    if (r < 0.95) return 6 + Math.random()*10;
    return 16 + Math.random()*34;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const st = stateRef.current;
    ctx.clearRect(0,0,W,H);

    // dark bg
    ctx.fillStyle = "#0f1117"; ctx.fillRect(0,0,W,H);

    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
    for (let x=0; x<W; x+=60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y=0; y<H; y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    if (st.points.length < 2) return;
    const pts = st.points;
    const maxM = Math.max(st.mult, 2);

    const toX = i => (i / (pts.length - 1)) * (W - 40) + 20;
    const toY = m => H - 20 - ((m - 1) / (maxM - 1)) * (H - 40);

    // glow fill
    const grad = ctx.createLinearGradient(0, H, 0, toY(st.mult));
    grad.addColorStop(0, "rgba(74,222,128,0.0)");
    grad.addColorStop(1, st.phase==="crashed" ? "rgba(248,113,113,0.15)" : "rgba(74,222,128,0.15)");
    ctx.beginPath();
    ctx.moveTo(toX(0), H);
    pts.forEach((m,i) => ctx.lineTo(toX(i), toY(m)));
    ctx.lineTo(toX(pts.length-1), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = st.phase==="crashed" ? "#f87171" : "#4ade80";
    ctx.lineJoin = "round";
    pts.forEach((m,i) => i===0 ? ctx.moveTo(toX(i),toY(m)) : ctx.lineTo(toX(i),toY(m)));
    ctx.stroke();

    // plane emoji at tip
    const tipX = toX(pts.length-1);
    const tipY = toY(pts[pts.length-1]);
    ctx.font = "22px serif";
    ctx.fillText(st.phase==="crashed" ? "💥" : "✈️", tipX - 12, tipY - 6);
  };

  const startRound = () => {
    if (bet <= 0 || bet > wallet) return;
    cashoutRef.current = false;
    setCashedOut(false);
    setMyBetActive(true);
    const target = randomTarget();
    stateRef.current = { phase:"countdown", mult:1, target, points:[1], rafId:null };
    setPhase("countdown");

    // short countdown then fly
    setTimeout(() => {
      stateRef.current.phase = "flying";
      setPhase("flying");
      const startTime = performance.now();
      // Slower exponential growth: mult = e^(K * seconds)
      // K=0.07 → 2x at ~10s, 5x at ~23s, 10x at ~33s
      const K = 0.07;

      const tick = (now) => {
        const elapsed = (now - startTime) / 1000; // convert to seconds
        const newMult = Math.max(1, parseFloat(Math.exp(K * elapsed).toFixed(2)));
        stateRef.current.mult = newMult;
        stateRef.current.points = [...stateRef.current.points, newMult];
        setMult(stateRef.current.mult);
        drawCanvas();

        if (stateRef.current.mult >= stateRef.current.target) {
          // crash!
          stateRef.current.phase = "crashed";
          setPhase("crashed");
          drawCanvas();
          const cm = stateRef.current.mult;
          setHistory(h => [{ mult: cm, won: cashoutRef.current }, ...h.slice(0, 14)]);
          if (!cashoutRef.current) {
            onResult(-bet, `Crashed at ${cm.toFixed(2)}x — Lost ₹${fmt(bet)}`);
          }
          setMyBetActive(false);
          setTimeout(() => {
            stateRef.current = { phase:"idle", mult:1, target:1, points:[], rafId:null };
            setPhase("idle"); setMult(1.00);
            const canvas = canvasRef.current;
            if (canvas) { const ctx=canvas.getContext("2d"); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle="#0f1117"; ctx.fillRect(0,0,canvas.width,canvas.height); }
          }, 2500);
          return;
        }
        stateRef.current.rafId = requestAnimationFrame(tick);
      };
      stateRef.current.rafId = requestAnimationFrame(tick);
    }, 1200);
  };

  const cashOut = () => {
    if (phase !== "flying" || cashoutRef.current || !myBetActive) return;
    cashoutRef.current = true;
    setCashedOut(true);
    const cm = stateRef.current.mult;
    const win = Math.floor(bet * cm);
    onResult(win - bet, `Cashed out at ${cm.toFixed(2)}x — Won ₹${fmt(win)}!`);
  };

  const multColor = mult < 1.5 ? "safe" : mult < 3 ? "warning" : "danger";
  const phaseLabel = { idle:"Ready to fly", countdown:"3… 2… 1…", flying:"Flying!", crashed:"CRASHED!" };

  return (
    <div className="game-card">
      <div className="game-header">
        <div className="game-title">Aeroplane Crash</div>
        <div className="game-desc">Bet before takeoff. The multiplier climbs — cash out before it crashes or lose everything.</div>
      </div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} disabled={phase!=="idle"} />
        {[100,250,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>phase==="idle"&&setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>

      <div className="crash-canvas-wrap">
        <canvas ref={canvasRef} className="crash-canvas" width={720} height={300} style={{width:"100%",height:300}} />
        <div className={`crash-multiplier ${phase==="crashed"?"crashed":multColor}`}>{mult.toFixed(2)}x</div>
        <div className={`crash-status ${phase==="flying"?"flying":phase==="crashed"?"crashed":"waiting"}`}>{phaseLabel[phase]}</div>
      </div>

      <div className="crash-controls">
        <button className="btn-crash-start" onClick={startRound} disabled={phase!=="idle"}>
          {phase==="idle" ? `🛫 Bet ₹${fmt(bet)} & Fly` : phase==="countdown" ? "Preparing…" : phase==="flying" ? "In Flight…" : "Crashed!"}
        </button>
        {phase==="flying" && !cashedOut && (
          <button className="btn-crash-cashout" onClick={cashOut}>
            💰 Cash Out {(bet * mult).toFixed(0) !== "0" ? `₹${fmt(Math.floor(bet*mult))}` : ""}
          </button>
        )}
        {cashedOut && <span style={{fontWeight:700,color:"var(--teal)",fontSize:14}}>✓ Cashed out!</span>}
      </div>

      <div className="game-history" style={{marginTop:16}}>
        {history.map((h,i)=>(
          <span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`}>{h.mult.toFixed(2)}x</span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SLIDER GAME
========================================================= */
function SliderGame({ wallet, onResult }) {
  const [bet, setBet]   = useState(100);
  const [value, setValue]= useState(50);   // 0–100
  const [dir, setDir]   = useState("under"); // under | over
  const [playing, setPlaying]= useState(false);
  const [result, setResult]  = useState(null);
  const [history, setHistory]= useState([]);
  const [targetReveal, setTargetReveal]= useState(null);

  // multiplier based on probability
  const prob   = dir==="under" ? value/100 : (100-value)/100;
  const mult   = prob > 0.02 ? parseFloat(((0.97 / prob)).toFixed(2)) : 99;

  const roll = () => {
    if (bet <= 0 || bet > wallet) return;
    setPlaying(true); setResult(null); setTargetReveal(null);
    setTimeout(() => {
      const rolled = Math.floor(Math.random()*101);
      const won = dir==="under" ? rolled < value : rolled > value;
      const pnl = won ? Math.floor(bet * mult - bet) : -bet;
      setResult({ rolled, won, pnl });
      setTargetReveal(rolled);
      setPlaying(false);
      setHistory(h=>[{won,pnl,rolled},...h.slice(0,11)]);
      onResult(pnl, won ? `Rolled ${rolled} — Win ₹${fmt(Math.abs(pnl))}!` : `Rolled ${rolled} — Lost ₹${fmt(bet)}`);
    }, 900);
  };

  return (
    <div className="game-card">
      <div className="game-header">
        <div className="game-title">Number Slider</div>
        <div className="game-desc">Pick a threshold. Bet under or over. A random number is drawn.</div>
      </div>

      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} />
        {[50,100,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>

      <div className="slider-multiplier-hint">{mult}x</div>
      <div className="slider-hint-sub">Win chance: {(prob*100).toFixed(1)}% · Payout: ₹{fmt(Math.floor(bet*mult))}</div>

      <div className="slider-choice">
        <span>Roll</span>
        <select value={dir} onChange={e=>setDir(e.target.value)}>
          <option value="under">Under</option>
          <option value="over">Over</option>
        </select>
        <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:15,color:"var(--ink)"}}>{value}</span>
      </div>

      <div className="slider-track-wrap">
        <div className="slider-track" onClick={e=>{
          const r=e.currentTarget.getBoundingClientRect();
          setValue(clamp(Math.round((e.clientX-r.left)/r.width*100),1,99));
        }}>
          <div className="slider-fill" style={{width:`${value}%`}} />
          <div className="slider-thumb" style={{left:`${value}%`}}
            onMouseDown={e=>{
              const move=ev=>{
                const r=e.currentTarget.parentElement.getBoundingClientRect();
                setValue(clamp(Math.round((ev.clientX-r.left)/r.width*100),1,99));
              };
              const up=()=>{window.removeEventListener("mousemove",move);window.removeEventListener("mouseup",up);};
              window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
            }}
          />
          {targetReveal !== null && (
            <div className="slider-target-line" style={{left:`${targetReveal}%`}} />
          )}
        </div>
        <div className="slider-labels"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
      </div>

      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:16}}>
        <button className="btn-primary" style={{width:"auto",padding:"12px 40px"}} onClick={roll} disabled={playing||bet<=0||bet>wallet}>
          {playing ? "Rolling…" : "🎲 Roll"}
        </button>
      </div>

      {result && (
        <div className={`game-result ${result.won?"win":"lose"}`}>
          <div className="game-result-icon">{result.won?"🎯":"😬"}</div>
          <div className="game-result-title">{result.won?`Win ₹${fmt(Math.abs(result.pnl))}`:`Lost ₹${fmt(bet)}`}</div>
          <div className="game-result-sub">Rolled <strong>{result.rolled}</strong> · needed {dir} {value}</div>
        </div>
      )}
      <div className="game-history">
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`}>{h.rolled} {h.won?`+₹${fmt(Math.abs(h.pnl))}`:`-₹${fmt(bet)}`}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   MINES GAME
========================================================= */
function MinesGame({ wallet, onResult }) {
  const SIZE  = 25; // 5x5
  const [bet, setBet]     = useState(150);
  const [mineCount, setMineCount] = useState(5);
  const [board, setBoard] = useState(null);   // null = not started
  const [revealed, setRevealed] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [hitMine, setHitMine]   = useState(false);
  const [profit, setProfit]     = useState(0);
  const [history, setHistory]   = useState([]);

  const currentMult = () => {
    const safe = SIZE - mineCount;
    const found = revealed.size;
    if (found === 0) return 1;
    let m = 1;
    for (let i = 0; i < found; i++) {
      m *= (safe - i) > 0 ? ((SIZE - i) / (SIZE - mineCount - i)) : 1;
    }
    return parseFloat((m * 0.97).toFixed(2));
  };

  const startGame = () => {
    if (bet <= 0 || bet > wallet) return;
    // plant mines
    const mines = new Set();
    while (mines.size < mineCount) mines.add(Math.floor(Math.random()*SIZE));
    setBoard(mines);
    setRevealed(new Set());
    setGameOver(false); setHitMine(false); setProfit(0);
  };

  const reveal = (i) => {
    if (gameOver || !board || revealed.has(i)) return;
    const newRev = new Set([...revealed, i]);
    if (board.has(i)) {
      // bomb!
      setRevealed(newRev); setHitMine(true); setGameOver(true);
      setHistory(h=>[{won:false,mult:0},...h.slice(0,11)]);
      onResult(-bet, `Hit a mine! Lost ₹${fmt(bet)}`);
      setBoard(null);
    } else {
      setRevealed(newRev);
      const m = currentMult();
      setProfit(Math.floor(bet * m - bet));
    }
  };

  const cashOut = () => {
    if (!board || gameOver || revealed.size === 0) return;
    const m = currentMult();
    const win = Math.floor(bet * m);
    setGameOver(true);
    setHistory(h=>[{won:true,mult:m},...h.slice(0,11)]);
    onResult(win - bet, `Mines cashed out at ${m}x — Won ₹${fmt(win)}!`);
    setBoard(null);
  };

  const cellIcon = (i) => {
    if (!board) return ""; // pre-game, show nothing
    if (revealed.has(i)) {
      if (board.has(i)) return "💣";
      return "💎";
    }
    if (gameOver && board.has(i)) return "💣"; // show all mines on game over
    return "";
  };
  const cellClass = (i) => {
    if (!revealed.has(i)) return gameOver && board?.has(i) ? "revealed bomb-reveal" : "";
    return board?.has(i) ? "revealed bomb-reveal" : "safe-reveal revealed";
  };

  return (
    <div className="game-card" style={{padding:24}}>
      <div style={{display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap"}}>
        {/* LEFT: controls */}
        <div style={{width:200,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div className="game-title" style={{fontSize:20,marginBottom:2}}>Mines</div>
            <div className="game-desc" style={{fontSize:12}}>Reveal gems, avoid bombs. Cash out anytime.</div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",color:"var(--ink4)",marginBottom:5}}>Bet Amount</div>
            <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} disabled={!!board} style={{width:"100%",marginBottom:6}} />
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {[50,100,500].map(v=><span key={v} className="bet-chip" style={{fontSize:11,padding:"4px 8px"}} onClick={()=>!board&&setBet(v)}>₹{v}</span>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",color:"var(--ink4)",marginBottom:5}}>Mine Count</div>
            <select style={{width:"100%",background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:"var(--r)",padding:"8px 10px",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none",color:"var(--ink)"}} value={mineCount} onChange={e=>setMineCount(Number(e.target.value))} disabled={!!board}>
              {[1,3,5,8,10,15,20].map(v=><option key={v} value={v}>{v} mines</option>)}
            </select>
          </div>
          {board && (
            <div style={{background:"var(--bg)",borderRadius:"var(--r)",padding:"10px 12px",fontSize:12}}>
              <div style={{color:"var(--ink4)",marginBottom:4}}>Safe tiles: <strong style={{color:"var(--ink)"}}>{revealed.size}</strong></div>
              <div style={{color:"var(--ink4)",marginBottom:4}}>Multiplier: <strong style={{color:"var(--teal)"}}>{currentMult()}x</strong></div>
              <div style={{color:"var(--ink4)"}}>Profit: <strong style={{color:"var(--teal)"}}>₹{fmt(profit)}</strong></div>
            </div>
          )}
          {!board ? (
            <button className="btn-primary" style={{padding:"11px"}} onClick={startGame} disabled={bet<=0||bet>wallet}>
              💣 Start (₹{fmt(bet)})
            </button>
          ) : (
            <button className="btn-mines-cashout" style={{padding:"11px"}} onClick={cashOut} disabled={gameOver||revealed.size===0}>
              💰 Cash Out<br/><span style={{fontSize:12}}>₹{fmt(Math.floor(bet*currentMult()))}</span>
            </button>
          )}
          {gameOver && (
            <div style={{textAlign:"center",padding:"10px 0",fontWeight:700,fontSize:14,color:hitMine?"var(--red)":"var(--teal)"}}>
              {hitMine?"💥 Boom! Lost":"💎 Cashed out!"}
            </div>
          )}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
            {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`} style={{fontSize:10}}>{h.won?`${h.mult}x`:"💣"}</span>)}
          </div>
        </div>
        {/* RIGHT: grid */}
        <div style={{flex:1,minWidth:200}}>
          <div className="mines-grid" style={{gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
            {Array.from({length:SIZE},(_,i)=>(
              <div
                key={i}
                className={`mine-cell ${cellClass(i)} ${(!board||gameOver)?"disabled":""}`}
                onClick={()=>reveal(i)}
                style={{fontSize:board?18:"16px",color:"var(--border2)",height:52}}
              >
                {board ? cellIcon(i) : "◻"}
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--ink4)",textAlign:"center",marginTop:8}}>
            Bal: ₹{fmt(wallet)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DICE DUEL GAME
========================================================= */
function DiceDuelGame({ wallet, onResult }) {
  const FACES = ["⚀","⚁","⚂","⚃","⚄","⚅"];
  const [bet, setBet]    = useState(100);
  const [pred, setPred]  = useState("player"); // player | house | tie
  const [rolling, setRolling]= useState(false);
  const [dice, setDice]  = useState([null, null]);
  const [result, setResult]  = useState(null);
  const [history, setHistory]= useState([]);

  const roll = () => {
    if (bet <= 0 || bet > wallet) return;
    setRolling(true); setResult(null);
    setDice([null,null]);
    setTimeout(() => {
      const p = Math.floor(Math.random()*6);
      const h = Math.floor(Math.random()*6);
      setDice([p, h]);
      const outcome = p > h ? "player" : p < h ? "house" : "tie";
      const payout = pred==="tie" ? 5 : 2;
      const won = outcome === pred;
      const pnl = won ? bet * (payout-1) : -bet;
      setResult({ p, h, outcome, won, pnl });
      setRolling(false);
      setHistory(hs=>[{won,pnl},...hs.slice(0,11)]);
      onResult(pnl, won ? `Dice: You ${p+1} vs House ${h+1} — Win ₹${fmt(Math.abs(pnl))}!` : `Dice: You ${p+1} vs House ${h+1} — Lost ₹${fmt(bet)}`);
    }, 700);
  };

  const multFor = t => t==="player"?"2x":t==="house"?"2x":"5x";

  return (
    <div className="game-card">
      <div className="game-header">
        <div className="game-title">Dice Duel</div>
        <div className="game-desc">You vs the House. Predict who rolls higher. Tie pays 5x.</div>
      </div>

      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} />
        {[50,100,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>

      <div className="dice-choice-row">
        {["player","tie","house"].map(t=>(
          <button key={t} className={`dice-choice-btn ${pred===t?"selected":""}`} onClick={()=>setPred(t)}>
            {t==="player"?"🎲 I Win":t==="tie"?"🤝 Tie (5x)":"🏠 House Wins"} · {multFor(t)}
          </button>
        ))}
      </div>

      <div className="dice-arena">
        <div>
          <div style={{textAlign:"center",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--ink4)",marginBottom:8}}>You</div>
          <div className={`die ${rolling?"rolling":""}`}>{dice[0]!==null?FACES[dice[0]]:"🎲"}</div>
        </div>
        <div className="dice-vs">vs</div>
        <div>
          <div style={{textAlign:"center",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--ink4)",marginBottom:8}}>House</div>
          <div className={`die ${rolling?"rolling":""}`}>{dice[1]!==null?FACES[dice[1]]:"🎲"}</div>
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"center"}}>
        <button className="btn-primary" style={{width:"auto",padding:"12px 40px"}} onClick={roll} disabled={rolling||bet<=0||bet>wallet}>
          {rolling?"Rolling…":"🎲 Roll Dice"}
        </button>
      </div>

      {result && (
        <div className={`game-result ${result.won?"win":"lose"}`} style={{marginTop:16}}>
          <div className="game-result-icon">{result.won?"🏆":"💸"}</div>
          <div className="game-result-title">{result.won?`Win ₹${fmt(Math.abs(result.pnl))}`:`Lost ₹${fmt(bet)}`}</div>
          <div className="game-result-sub">You rolled <strong>{result.p+1}</strong> · House rolled <strong>{result.h+1}</strong> · {result.outcome==="tie"?"It's a tie!":result.outcome==="player"?"You win!":"House wins"}</div>
        </div>
      )}

      <div className="game-history">
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`}>{h.won?`+₹${fmt(h.pnl)}`:`-₹${fmt(Math.abs(h.pnl))}`}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   PLINKO GAME
========================================================= */
function PlinkoGame({ wallet, onResult }) {
  const canvasRef = useRef(null);
  const [bet, setBet]     = useState(100);
  const [dropping, setDropping]= useState(false);
  const [lastMult, setLastMult]= useState(null);
  const [hitIdx, setHitIdx]   = useState(null);
  const [history, setHistory] = useState([]);

  const ROWS   = 8;
  const COLS   = ROWS + 1; // 9 buckets
  const MULTS  = [10, 4, 2, 1.5, 1, 1.5, 2, 4, 10]; // symmetric

  const multClass = (v) => v >= 4 ? "high" : v >= 1.5 ? "med" : "low";

  const drawPegs = (ctx, W, H) => {
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#0f1117"; ctx.fillRect(0,0,W,H);
    const pegR = 5;
    const marginX = 40, marginY = 40;
    const spacingY = (H - marginY * 2 - 50) / ROWS;

    for (let r = 0; r < ROWS; r++) {
      const cols = r + 2;
      const spacingX = (W - marginX*2) / (cols - 1);
      const startX   = marginX + ((W - marginX*2) - spacingX*(cols-1)) / 2;
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const y = marginY + r * spacingY;
        ctx.beginPath();
        ctx.arc(x, y, pegR, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();
      }
    }
  };

  const animateBall = (ctx, W, H, finalIdx) => {
    const marginX = 40, marginY = 40;
    const spacingY = (H - marginY * 2 - 50) / ROWS;
    const ballR = 8;

    // compute path
    let col = 0;
    let path = [{ x: W/2, y: 10 }];
    for (let r = 0; r < ROWS; r++) {
      const cols = r + 2;
      const spacingX = (W - marginX*2) / (cols - 1);
      const startX   = marginX + ((W - marginX*2) - spacingX*(cols-1)) / 2;
      // steer toward finalIdx
      const go = col <= finalIdx - (ROWS - r) ? 1 : (col > finalIdx ? 0 : Math.round(Math.random()));
      col += go;
      const x = startX + col * spacingX;
      const y = marginY + r * spacingY;
      path.push({ x, y });
    }
    // final bucket x
    const bucketW = (W - marginX*2) / (COLS - 1);
    const bucketX = marginX + finalIdx * bucketW;
    path.push({ x: bucketX, y: H - 50 });

    let step = 0;
    const animate = () => {
      drawPegs(ctx, W, H);
      if (step < path.length - 1) {
        const cur  = path[step];
        const next = path[step+1];
        // draw trail
        ctx.beginPath();
        ctx.arc(next.x, next.y, ballR, 0, Math.PI*2);
        ctx.fillStyle = "#facc15";
        ctx.fill();
        ctx.shadowBlur = 14; ctx.shadowColor = "#facc15";
        ctx.fill(); ctx.shadowBlur = 0;
        step++;
        setTimeout(() => requestAnimationFrame(animate), 80);
      } else {
        // final
        ctx.beginPath();
        ctx.arc(bucketX, H - 50, ballR+2, 0, Math.PI*2);
        ctx.fillStyle = "#f59e0b"; ctx.fill();
        setTimeout(() => { setDropping(false); setHitIdx(finalIdx); }, 200);
      }
    };
    requestAnimationFrame(animate);
  };

  const drop = () => {
    if (bet <= 0 || bet > wallet || dropping) return;
    setHitIdx(null); setDropping(true);
    const finalIdx = Math.floor(Math.random() * COLS);
    const m = MULTS[finalIdx];
    const pnl = Math.floor(bet * m) - bet;
    setTimeout(() => {
      setLastMult(m);
      setHistory(h=>[{m,won:pnl>0},...h.slice(0,11)]);
      onResult(pnl, pnl >= 0 ? `Plinko landed on ${m}x — Win ₹${fmt(Math.floor(bet*m))}!` : `Plinko landed on ${m}x — Lost ₹${fmt(Math.abs(pnl))}`);
    }, ROWS * 80 + 400);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    drawPegs(ctx, canvas.width, canvas.height);
    animateBall(ctx, canvas.width, canvas.height, finalIdx);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    drawPegs(ctx, canvas.width, canvas.height);
  }, []);

  return (
    <div className="game-card">
      <div className="game-header">
        <div className="game-title">Plinko</div>
        <div className="game-desc">Drop a ball through pegs. Where it lands determines your multiplier.</div>
      </div>

      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} />
        {[50,100,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>

      <div className="plinko-wrap">
        <canvas ref={canvasRef} className="plinko-canvas" width={560} height={340} style={{width:"100%",maxWidth:560}} />
        <div className="plinko-multipliers">
          {MULTS.map((m,i)=>(
            <div key={i} className={`plinko-mult ${multClass(m)} ${hitIdx===i?"hit":""}`}>{m}x</div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"center",marginTop:16}}>
        <button className="btn-primary" style={{width:"auto",padding:"12px 40px"}} onClick={drop} disabled={dropping||bet<=0||bet>wallet}>
          {dropping?"Dropping…":"🎱 Drop Ball"}
        </button>
      </div>

      {lastMult && !dropping && (
        <div className={`game-result ${lastMult>=1?"win":"lose"}`} style={{marginTop:16}}>
          <div className="game-result-title">{lastMult}x Multiplier!</div>
        </div>
      )}

      <div className="game-history">
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`}>{h.m}x</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   ROULETTE GAME
========================================================= */
function RouletteGame({ wallet, onResult }) {
  const canvasRef = useRef(null);
  const spinRef   = useRef(null);
  const [bet, setBet]       = useState(100);
  const [betType, setBetType] = useState("red");   // red|black|green|odd|even|1-12|13-24|25-36
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded]   = useState(null);
  const [history, setHistory] = useState([]);

  const NUMBERS = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const RED_NOS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  const numColor = n => n===0?"#16a34a":RED_NOS.has(n)?"#dc2626":"#1c1917";

  const BETS = [
    {id:"red",   label:"Red",    payout:2,  check:n=>n!==0&&RED_NOS.has(n)},
    {id:"black", label:"Black",  payout:2,  check:n=>n!==0&&!RED_NOS.has(n)},
    {id:"green", label:"Green 0",payout:14, check:n=>n===0},
    {id:"odd",   label:"Odd",    payout:2,  check:n=>n!==0&&n%2===1},
    {id:"even",  label:"Even",   payout:2,  check:n=>n!==0&&n%2===0},
    {id:"1-12",  label:"1–12",   payout:3,  check:n=>n>=1&&n<=12},
    {id:"13-24", label:"13–24",  payout:3,  check:n=>n>=13&&n<=24},
    {id:"25-36", label:"25–36",  payout:3,  check:n=>n>=25&&n<=36},
  ];

  const drawWheel = (angle) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, CX = W/2, CY = W/2, R = W/2 - 10;
    ctx.clearRect(0,0,W,W);
    const slice = (Math.PI*2)/NUMBERS.length;
    NUMBERS.forEach((n,i) => {
      const a = angle + i * slice;
      ctx.beginPath(); ctx.moveTo(CX,CY);
      ctx.arc(CX,CY,R,a,a+slice); ctx.closePath();
      ctx.fillStyle = numColor(n); ctx.fill();
      ctx.strokeStyle="#2d2d2d"; ctx.lineWidth=1; ctx.stroke();
      ctx.save(); ctx.translate(CX,CY); ctx.rotate(a + slice/2);
      ctx.textAlign="right"; ctx.fillStyle="#fff";
      ctx.font="bold 10px 'DM Mono',monospace"; ctx.fillText(n, R-6, 4);
      ctx.restore();
    });
    // center hub
    ctx.beginPath(); ctx.arc(CX,CY,18,0,Math.PI*2);
    ctx.fillStyle="#111"; ctx.fill();
    ctx.strokeStyle="#444"; ctx.lineWidth=2; ctx.stroke();
    // pointer
    ctx.beginPath(); ctx.moveTo(CX, 6); ctx.lineTo(CX-7,20); ctx.lineTo(CX+7,20); ctx.closePath();
    ctx.fillStyle="#facc15"; ctx.fill();
  };

  useEffect(() => { drawWheel(0); }, []);

  const spin = () => {
    if (bet<=0||bet>wallet||spinning) return;
    setSpinning(true); setLanded(null);
    const finalIdx = Math.floor(Math.random()*NUMBERS.length);
    const finalNum = NUMBERS[finalIdx];
    const slice = (Math.PI*2)/NUMBERS.length;
    const fullSpins = 6 + Math.random()*4;
    const targetAngle = -(finalIdx * slice) + Math.PI*2*fullSpins - slice/2;
    let start = null, duration = 4000;
    const ease = t => 1 - Math.pow(1-t, 4);
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts-start)/duration, 1);
      const angle = ease(p) * targetAngle;
      drawWheel(angle % (Math.PI*2));
      if (p < 1) { requestAnimationFrame(animate); }
      else {
        setLanded(finalNum);
        setSpinning(false);
        const bObj = BETS.find(b=>b.id===betType);
        const won = bObj.check(finalNum);
        const pnl = won ? bet*(bObj.payout-1) : -bet;
        setHistory(h=>[{n:finalNum,won,pnl},...h.slice(0,14)]);
        onResult(pnl, won?`Roulette landed ${finalNum} — Win ₹${fmt(Math.abs(pnl))}!`:`Roulette landed ${finalNum} — Lost ₹${fmt(bet)}`);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="game-card">
      <div className="game-header"><div className="game-title">Roulette</div><div className="game-desc">European roulette — 37 pockets. Pick a bet type and spin.</div></div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} />
        {[50,100,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {BETS.map(b=>(
          <button key={b.id} onClick={()=>setBetType(b.id)} style={{
            padding:"8px 14px",borderRadius:"var(--r)",border:"1.5px solid",
            fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",transition:"all 0.15s",
            background: betType===b.id ? (b.id==="red"?"#dc2626":b.id==="black"?"#1c1917":b.id==="green"?"#16a34a":"var(--ink)") : "var(--bg)",
            color: betType===b.id?"white":"var(--ink2)",
            borderColor: betType===b.id?"transparent":"var(--border2)",
          }}>
            {b.label} · {b.payout}x
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
        <canvas ref={canvasRef} width={280} height={280} style={{borderRadius:"50%",boxShadow:"var(--sh-md)",flexShrink:0}} />
        <div style={{flex:1}}>
          {landed !== null && (
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:numColor(landed),display:"grid",placeItems:"center",margin:"0 auto 8px",fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:700,color:"white",boxShadow:"var(--sh-md)"}}>{landed}</div>
              <div style={{fontSize:13,color:"var(--ink3)"}}>Landed on <strong style={{color:numColor(landed)}}>{landed===0?"Zero":RED_NOS.has(landed)?"Red":"Black"}</strong></div>
            </div>
          )}
          <button className="btn-primary" onClick={spin} disabled={spinning||bet<=0||bet>wallet} style={{marginBottom:16}}>
            {spinning?"Spinning…":"🎡 Spin"}
          </button>
          <div className="game-history" style={{marginTop:8}}>
            {history.map((h,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:20,fontSize:11,fontWeight:700,background:numColor(h.n),color:"white",border:"none",marginBottom:4}}>
                {h.n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   BLACKJACK GAME
========================================================= */
function BlackjackGame({ wallet, onResult }) {
  const SUITS = ["♠","♥","♦","♣"];
  const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const mkDeck = () => SUITS.flatMap(s=>RANKS.map(r=>({s,r})));
  const shuffle = d => { const a=[...d]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  const cardVal = c => { if(["J","Q","K"].includes(c.r)) return 10; if(c.r==="A") return 11; return parseInt(c.r); };
  const handVal = cards => {
    let v = cards.reduce((a,c)=>a+cardVal(c),0);
    let aces = cards.filter(c=>c.r==="A").length;
    while(v>21&&aces>0){v-=10;aces--;}
    return v;
  };

  const [bet, setBet]   = useState(100);
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle|playing|done
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const deal = () => {
    if(bet<=0||bet>wallet) return;
    const d = shuffle(mkDeck());
    const p = [d[0],d[2]], dl = [d[1],d[3]];
    setDeck(d.slice(4)); setPlayer(p); setDealer(dl); setPhase("playing"); setResult(null);
    if(handVal(p)===21){ finish(p,dl,d.slice(4),"blackjack"); }
  };

  const hit = () => {
    const newCard = deck[0]; const newDeck = deck.slice(1);
    const newP = [...player, newCard];
    setPlayer(newP); setDeck(newDeck);
    if(handVal(newP)>21) finish(newP, dealer, newDeck, "bust");
  };

  const stand = () => {
    let dl = [...dealer], dk = [...deck];
    while(handVal(dl)<17){ dl.push(dk[0]); dk=dk.slice(1); }
    setDealer(dl); setDeck(dk);
    finish(player, dl, dk, "stand");
  };

  const double = () => {
    if(bet*2>wallet) return;
    const newCard = deck[0]; const newDeck = deck.slice(1);
    const newP = [...player, newCard];
    setPlayer(newP); setDeck(newDeck);
    let dl=[...dealer],dk=[...newDeck];
    while(handVal(dl)<17){dl.push(dk[0]);dk=dk.slice(1);}
    setDealer(dl); setDeck(dk);
    finish(newP,dl,dk,"double");
  };

  const finish = (p, dl, dk, how) => {
    const pv=handVal(p), dv=handVal(dl);
    let outcome, pnl;
    if(how==="blackjack")             { outcome="Blackjack! 🃏"; pnl=Math.floor(bet*1.5); }
    else if(how==="bust")             { outcome="Bust! 💥"; pnl=-bet; }
    else if(pv>21)                    { outcome="Bust! 💥"; pnl=-bet; }
    else if(dv>21)                    { outcome="Dealer Busts! 🎉"; pnl=how==="double"?bet*2:bet; }
    else if(pv>dv)                    { outcome="You Win! ✓"; pnl=how==="double"?bet*2:bet; }
    else if(pv<dv)                    { outcome="Dealer Wins"; pnl=how==="double"?-bet*2:-bet; }
    else                              { outcome="Push — Tie"; pnl=0; }
    setPhase("done"); setResult({outcome,pnl,pv,dv});
    setHistory(h=>[{outcome,pnl},...h.slice(0,11)]);
    onResult(pnl, `Blackjack: ${outcome} ${pnl>=0?`+₹${fmt(pnl)}`:`-₹${fmt(Math.abs(pnl))}`}`);
  };

  const Card = ({c,hidden}) => (
    <div style={{
      width:52,height:76,borderRadius:8,background:hidden?"#1e293b":"white",
      border:"2px solid var(--border2)",display:"grid",placeItems:"center",
      fontSize:hidden?22:18,fontWeight:700,boxShadow:"var(--sh-sm)",flexShrink:0,
      color:hidden?"white":c&&["♥","♦"].includes(c.s)?"#dc2626":"#1c1917",
    }}>
      {hidden?"🂠":c?`${c.r}${c.s}`:""}
    </div>
  );

  const pv = handVal(player), dv = handVal(dealer);

  return (
    <div className="game-card">
      <div className="game-header"><div className="game-title">Blackjack</div><div className="game-desc">Beat the dealer to 21. Hit, Stand, or Double Down. Blackjack pays 1.5x.</div></div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} disabled={phase==="playing"} />
        {[50,100,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>phase!=="playing"&&setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>

      {phase!=="idle" && (
        <div style={{background:"#0f1117",borderRadius:"var(--r2)",padding:24,marginBottom:20}}>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#64748b",marginBottom:8}}>
              Dealer {phase==="done"?`— ${dv}`:"— ?"}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {dealer.map((c,i)=><Card key={i} c={c} hidden={i===1&&phase==="playing"} />)}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#64748b",marginBottom:8}}>
              You — {pv}{pv===21?" 🎯":""}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {player.map((c,i)=><Card key={i} c={c} />)}
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {phase==="idle" && <button className="btn-primary" style={{width:"auto",padding:"12px 32px"}} onClick={deal} disabled={bet<=0||bet>wallet}>🃏 Deal (₹{fmt(bet)})</button>}
        {phase==="playing" && <>
          <button className="btn-primary" style={{width:"auto",padding:"12px 24px",background:"var(--teal)"}} onClick={hit}>Hit</button>
          <button className="btn-primary" style={{width:"auto",padding:"12px 24px",background:"var(--ink)"}} onClick={stand}>Stand</button>
          {player.length===2 && <button className="btn-primary" style={{width:"auto",padding:"12px 24px",background:"var(--amber)"}} onClick={double} disabled={bet*2>wallet}>Double ↑</button>}
        </>}
        {phase==="done" && <button className="btn-primary" style={{width:"auto",padding:"12px 32px"}} onClick={()=>{setPhase("idle");setResult(null);}}>Deal Again</button>}
      </div>

      {result && (
        <div className={`game-result ${result.pnl>=0?"win":"lose"}`} style={{marginTop:16}}>
          <div className="game-result-title">{result.outcome}</div>
          <div className="game-result-sub">You: {result.pv} · Dealer: {result.dv} · {result.pnl>=0?`+₹${fmt(result.pnl)}`:`-₹${fmt(Math.abs(result.pnl))}`}</div>
        </div>
      )}
      <div className="game-history" style={{marginTop:12}}>
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.pnl>=0?"win":"lose"}`}>{h.pnl>=0?`+₹${fmt(h.pnl)}`:`-₹${fmt(Math.abs(h.pnl))}`}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   SPIN WHEEL GAME
========================================================= */
function SpinWheelGame({ wallet, onResult }) {
  const canvasRef = useRef(null);
  const SEGMENTS = [
    {label:"0.2x",mult:0.2,color:"#dc2626"},{label:"50x",mult:50,color:"#7c3aed"},
    {label:"1.5x",mult:1.5,color:"#2563eb"},{label:"0x",mult:0,color:"#1c1917"},
    {label:"3x",  mult:3,  color:"#16a34a"},{label:"0.5x",mult:0.5,color:"#dc2626"},
    {label:"10x", mult:10, color:"#d97706"},{label:"0x",  mult:0,  color:"#1c1917"},
    {label:"2x",  mult:2,  color:"#2563eb"},{label:"0.2x",mult:0.2,color:"#dc2626"},
    {label:"5x",  mult:5,  color:"#7c3aed"},{label:"1x",  mult:1,  color:"#16a34a"},
  ];
  const [bet, setBet]       = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult]   = useState(null);
  const [history, setHistory] = useState([]);

  const drawWheel = (angle) => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d"), W=canvas.width, CX=W/2, R=W/2-10;
    ctx.clearRect(0,0,W,W);
    const slice=(Math.PI*2)/SEGMENTS.length;
    SEGMENTS.forEach((seg,i)=>{
      const a=angle+i*slice;
      ctx.beginPath(); ctx.moveTo(CX,CX); ctx.arc(CX,CX,R,a,a+slice); ctx.closePath();
      ctx.fillStyle=seg.color; ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.15)"; ctx.lineWidth=1.5; ctx.stroke();
      ctx.save(); ctx.translate(CX,CX); ctx.rotate(a+slice/2);
      ctx.fillStyle="#fff"; ctx.font="bold 13px 'DM Mono',monospace"; ctx.textAlign="right";
      ctx.fillText(seg.label, R-12, 5); ctx.restore();
    });
    ctx.beginPath(); ctx.arc(CX,CX,20,0,Math.PI*2); ctx.fillStyle="#111"; ctx.fill();
    ctx.strokeStyle="#444"; ctx.lineWidth=2; ctx.stroke();
    // top pointer
    ctx.beginPath(); ctx.moveTo(CX,4); ctx.lineTo(CX-9,22); ctx.lineTo(CX+9,22); ctx.closePath();
    ctx.fillStyle="#facc15"; ctx.fill();
  };

  useEffect(()=>{ drawWheel(0); },[]);

  const spin = () => {
    if(bet<=0||bet>wallet||spinning) return;
    setSpinning(true); setResult(null);
    const finalIdx = Math.floor(Math.random()*SEGMENTS.length);
    const slice=(Math.PI*2)/SEGMENTS.length;
    const targetAngle = Math.PI*2*8 + (SEGMENTS.length-finalIdx)*slice - slice/2;
    let start=null, dur=4500;
    const ease = t=>1-Math.pow(1-t,4);
    const animate=ts=>{
      if(!start)start=ts;
      const p=Math.min((ts-start)/dur,1);
      drawWheel(ease(p)*targetAngle%(Math.PI*2));
      if(p<1){requestAnimationFrame(animate);}
      else {
        const seg=SEGMENTS[finalIdx];
        const pnl=Math.floor(bet*seg.mult)-bet;
        setResult({seg,pnl});
        setSpinning(false);
        setHistory(h=>[{seg,pnl},...h.slice(0,11)]);
        onResult(pnl, pnl>=0?`Wheel landed ${seg.label} — Win ₹${fmt(Math.floor(bet*seg.mult))}!`:`Wheel landed ${seg.label} — Lost ₹${fmt(Math.abs(pnl))}`);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="game-card">
      <div className="game-header"><div className="game-title">Spin Wheel</div><div className="game-desc">12 segments from 0x to 50x. Spin and pray for the jackpot.</div></div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} />
        {[50,100,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>
      <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
        <canvas ref={canvasRef} width={300} height={300} style={{borderRadius:"50%",boxShadow:"var(--sh-lg)",flexShrink:0}} />
        <div style={{flex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16}}>
            {SEGMENTS.filter((s,i)=>i%2===0).map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
                <div style={{width:10,height:10,borderRadius:2,background:s.color,flexShrink:0}}/>
                <span style={{color:"var(--ink3)"}}>{s.label}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={spin} disabled={spinning||bet<=0||bet>wallet}>
            {spinning?"Spinning…":"🎡 Spin Wheel"}
          </button>
          {result && (
            <div className={`game-result ${result.pnl>=0?"win":"lose"}`} style={{marginTop:12}}>
              <div className="game-result-title" style={{fontSize:18}}>{result.seg.label} Multiplier!</div>
              <div className="game-result-sub">{result.pnl>=0?`Won ₹${fmt(Math.floor(bet*result.seg.mult))}`:`Lost ₹${fmt(bet)}`}</div>
            </div>
          )}
        </div>
      </div>
      <div className="game-history" style={{marginTop:12}}>
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.pnl>=0?"win":"lose"}`}>{h.seg.label}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   KENO GAME
========================================================= */
function KenoGame({ wallet, onResult }) {
  const TOTAL=40, MAX_PICK=10;
  const PAYOUTS={1:[0,3],2:[0,1,9],3:[0,0,2,16],4:[0,0,1,5,50],5:[0,0,1,3,15,100],6:[0,0,0,2,6,25,500],7:[0,0,0,1,3,12,100,1000],8:[0,0,0,1,2,6,30,200,5000],9:[0,0,0,0,1,3,15,80,400,10000],10:[0,0,0,0,1,2,8,30,150,1000,25000]};
  const [bet, setBet]   = useState(100);
  const [picked, setPicked] = useState(new Set());
  const [drawn, setDrawn]   = useState(new Set());
  const [phase, setPhase]   = useState("pick"); // pick|drawing|done
  const [history, setHistory] = useState([]);

  const toggle = (n) => {
    if(phase!=="pick") return;
    setPicked(prev=>{
      const s=new Set(prev);
      if(s.has(n)) s.delete(n);
      else if(s.size<MAX_PICK) s.add(n);
      return s;
    });
  };

  const play = async () => {
    if(picked.size===0||bet<=0||bet>wallet) return;
    setPhase("drawing"); setDrawn(new Set());
    const pool=Array.from({length:TOTAL},(_,i)=>i+1);
    const draws=[];
    while(draws.length<20){ const i=Math.floor(Math.random()*pool.length); draws.push(pool.splice(i,1)[0]); }
    // animate draws one by one
    for(let i=0;i<draws.length;i++){
      await new Promise(r=>setTimeout(r,120));
      setDrawn(prev=>new Set([...prev,draws[i]]));
    }
    const drawnSet=new Set(draws);
    const hits=[...picked].filter(n=>drawnSet.has(n)).length;
    const payTable=PAYOUTS[picked.size]||[0];
    const mult=payTable[hits]||0;
    const pnl=Math.floor(bet*mult)-bet;
    setPhase("done");
    setHistory(h=>[{hits,mult,pnl},...h.slice(0,11)]);
    onResult(pnl, mult>0?`Keno: ${hits} hits, ${mult}x — Win ₹${fmt(Math.floor(bet*mult))}!`:`Keno: ${hits} hits — Lost ₹${fmt(bet)}`);
  };

  const reset = () => { setPicked(new Set()); setDrawn(new Set()); setPhase("pick"); };

  return (
    <div className="game-card">
      <div className="game-header"><div className="game-title">Keno</div><div className="game-desc">Pick up to 10 numbers from 1–40. 20 numbers are drawn. More hits = bigger payout.</div></div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} disabled={phase!=="pick"} />
        {[50,100,500].map(v=><span key={v} className="bet-chip" onClick={()=>phase==="pick"&&setBet(v)}>₹{v}</span>)}
        <span style={{fontSize:12,color:"var(--ink4)",marginLeft:"auto"}}>Pick {picked.size}/{MAX_PICK} numbers</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:5,marginBottom:16}}>
        {Array.from({length:TOTAL},(_,i)=>i+1).map(n=>{
          const isPicked=picked.has(n), isDrawn=drawn.has(n), isHit=isPicked&&isDrawn;
          return (
            <div key={n} onClick={()=>toggle(n)} style={{
              aspectRatio:"1",borderRadius:6,display:"grid",placeItems:"center",
              fontSize:11,fontWeight:700,cursor:phase==="pick"?"pointer":"default",
              transition:"all 0.15s",fontFamily:"'DM Mono',monospace",
              background: isHit?"#16a34a":isDrawn?"#374151":isPicked?"var(--ink)":"var(--bg)",
              color: isHit||isDrawn||isPicked?"white":"var(--ink3)",
              border:`2px solid ${isHit?"#16a34a":isDrawn?"#4b5563":isPicked?"var(--ink)":"var(--border2)"}`,
              transform: isDrawn?"scale(1.05)":"scale(1)",
              boxShadow: isHit?"0 0 8px rgba(22,163,74,0.5)":"none",
            }}>{n}</div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:10}}>
        {phase==="pick" && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={play} disabled={picked.size===0||bet<=0||bet>wallet}>🎱 Play Keno</button>}
        {phase==="done" && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={reset}>Play Again</button>}
        {phase==="drawing" && <div style={{display:"flex",alignItems:"center",gap:10,color:"var(--ink3)",fontSize:14}}><div className="spinner"/>Drawing numbers…</div>}
      </div>
      <div className="game-history" style={{marginTop:12}}>
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.pnl>=0?"win":"lose"}`}>{h.hits} hits {h.mult>0?`${h.mult}x`:""}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   TOWER CLIMB GAME
========================================================= */
function TowerClimbGame({ wallet, onResult }) {
  const ROWS=8, COLS=3;
  const [bet, setBet]     = useState(100);
  const [tower, setTower] = useState(null);   // array of rows, each has bomb index
  const [revealed, setRevealed] = useState([]); // per row which col revealed
  const [currentRow, setCurrentRow] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle|playing|won|lost
  const [history, setHistory] = useState([]);
  const MULTS = [1.3,1.7,2.2,3,4.2,6,10,20];

  const startGame = () => {
    if(bet<=0||bet>wallet) return;
    const t=Array.from({length:ROWS},()=>Math.floor(Math.random()*COLS));
    setTower(t); setRevealed(Array(ROWS).fill(null)); setCurrentRow(0); setPhase("playing");
  };

  const pick = (row, col) => {
    if(phase!=="playing"||row!==currentRow) return;
    const newRev=[...revealed]; newRev[row]=col; setRevealed(newRev);
    if(tower[row]===col){
      // bomb
      setPhase("lost");
      setHistory(h=>[{won:false,row},...h.slice(0,11)]);
      onResult(-bet, `Tower: Hit a bomb on floor ${row+1}! Lost ₹${fmt(bet)}`);
    } else if(row===ROWS-1){
      // top!
      setPhase("won");
      const m=MULTS[ROWS-1];
      const pnl=Math.floor(bet*m)-bet;
      setHistory(h=>[{won:true,row:ROWS,pnl},...h.slice(0,11)]);
      onResult(pnl, `Tower: Reached the top! ${m}x — Win ₹${fmt(Math.floor(bet*m))}!`);
    } else {
      setCurrentRow(row+1);
    }
  };

  const cashout = () => {
    if(phase!=="playing"||currentRow===0) return;
    const m=MULTS[currentRow-1];
    const pnl=Math.floor(bet*m)-bet;
    setPhase("won");
    setHistory(h=>[{won:true,row:currentRow,pnl},...h.slice(0,11)]);
    onResult(pnl, `Tower: Cashed out at floor ${currentRow}, ${m}x — Win ₹${fmt(Math.floor(bet*m))}!`);
  };

  const rows = Array.from({length:ROWS},(_,i)=>ROWS-1-i); // top to bottom display

  return (
    <div className="game-card">
      <div className="game-header"><div className="game-title">Tower Climb</div><div className="game-desc">Each floor has one hidden bomb. Pick a safe tile to climb. Cash out anytime.</div></div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} disabled={phase==="playing"} />
        {[50,100,500].map(v=><span key={v} className="bet-chip" onClick={()=>phase!=="playing"&&setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>
      <div style={{maxWidth:320,margin:"0 auto"}}>
        {rows.map(row=>{
          const isActive=phase==="playing"&&row===currentRow;
          const isDone=revealed[row]!==null;
          const isFuture=phase==="playing"&&row>currentRow;
          return (
            <div key={row} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,opacity:isFuture?0.4:1}}>
              <div style={{width:36,fontSize:10,fontWeight:700,color:"var(--ink4)",fontFamily:"'DM Mono',monospace",textAlign:"right",flexShrink:0}}>
                {MULTS[row]}x
              </div>
              <div style={{flex:1,display:"grid",gridTemplateColumns:`repeat(${COLS},1fr)`,gap:6}}>
                {Array.from({length:COLS},(_,col)=>{
                  const isBomb=isDone&&tower&&tower[row]===col;
                  const isSafe=isDone&&revealed[row]===col&&!isBomb;
                  const isPickedBomb=isBomb&&revealed[row]===col;
                  return (
                    <div key={col} onClick={()=>pick(row,col)} style={{
                      height:40,borderRadius:8,display:"grid",placeItems:"center",fontSize:18,
                      cursor:isActive?"pointer":"default",transition:"all 0.18s",
                      background: isPickedBomb?"#dc2626":isSafe?"#16a34a":isDone&&isBomb?"rgba(220,38,38,0.3)":isActive?"var(--bg2)":"var(--bg)",
                      border:`2px solid ${isPickedBomb?"#dc2626":isSafe?"#16a34a":isActive?"var(--border2)":"var(--border)"}`,
                      transform:isActive?"scale(1)":"scale(1)",
                      boxShadow:isActive?"var(--sh)":"none",
                    }}>
                      {isPickedBomb?"💣":isSafe?"✅":isDone&&isBomb?"💣":isActive?"?":""}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:10,marginTop:16,justifyContent:"center"}}>
        {phase==="idle" && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={startGame}>🏗️ Start Climbing</button>}
        {phase==="playing" && currentRow>0 && <button className="btn-mines-cashout" onClick={cashout}>💰 Cash Out ₹{fmt(Math.floor(bet*MULTS[currentRow-1]))}</button>}
        {(phase==="won"||phase==="lost") && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={()=>{setPhase("idle");setTower(null);setRevealed([]);setCurrentRow(0);}}>Play Again</button>}
      </div>
      <div className="game-history" style={{marginTop:12}}>
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`}>{h.won?`Floor ${h.row} ✓`:"💣"}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   LIMBO GAME
========================================================= */
function LimboGame({ wallet, onResult }) {
  const [bet, setBet]     = useState(100);
  const [target, setTarget] = useState(2.00);
  const [rolling, setRolling] = useState(false);
  const [display, setDisplay] = useState(null);
  const [result, setResult]   = useState(null);
  const [history, setHistory] = useState([]);

  // house edge 3%: result = 0.97 / rand
  const roll = () => {
    if(bet<=0||bet>wallet||target<1.01) return;
    setRolling(true); setResult(null); setDisplay(null);
    // animate counter quickly
    let frame=0;
    const interval=setInterval(()=>{
      setDisplay((1+Math.random()*50).toFixed(2));
      frame++;
      if(frame>20) clearInterval(interval);
    },50);
    setTimeout(()=>{
      clearInterval(interval);
      const rand=Math.random();
      const rolled=rand<0.003?1.00:parseFloat((0.97/rand).toFixed(2));
      setDisplay(rolled.toFixed(2));
      const won=rolled>=target;
      const payout=target;
      const pnl=won?Math.floor(bet*(payout-1)):-bet;
      setResult({rolled,won,pnl});
      setRolling(false);
      setHistory(h=>[{rolled,won,pnl},...h.slice(0,14)]);
      onResult(pnl,won?`Limbo: rolled ${rolled} ≥ ${target} — Win ₹${fmt(Math.abs(pnl))}!`:`Limbo: rolled ${rolled} < ${target} — Lost ₹${fmt(bet)}`);
    },1100);
  };

  const winChance = Math.min(97, parseFloat((97/target).toFixed(1)));

  return (
    <div className="game-card">
      <div className="game-header"><div className="game-title">Limbo</div><div className="game-desc">Set your target multiplier. A random number generates — hit or exceed it to win.</div></div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} />
        {[50,100,500,1000].map(v=><span key={v} className="bet-chip" onClick={()=>setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>
      <div style={{textAlign:"center",padding:"32px 0"}}>
        <div style={{
          fontFamily:"'Fraunces',serif",fontSize:72,fontWeight:700,letterSpacing:-3,
          color: result?(result.won?"var(--teal)":"var(--red)"):"var(--ink)",
          transition:"color 0.3s",lineHeight:1,
        }}>
          {display!==null?display:"—"}
        </div>
        <div style={{fontSize:13,color:"var(--ink4)",marginTop:8,fontFamily:"'DM Mono',monospace"}}>result multiplier</div>
      </div>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",color:"var(--ink4)",marginBottom:6}}>Target Multiplier</div>
          <input className="bet-input" type="number" min="1.01" step="0.1" value={target} onChange={e=>setTarget(parseFloat(e.target.value)||1.01)} style={{width:110}} />
        </div>
        <div style={{fontSize:13,color:"var(--ink3)"}}>
          Win chance: <strong style={{color:"var(--teal)"}}>{winChance}%</strong><br/>
          Payout: <strong>₹{fmt(Math.floor(bet*target))}</strong>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[1.5,2,3,5,10,50].map(t=><span key={t} className="bet-chip" onClick={()=>setTarget(t)}>{t}x</span>)}
        </div>
      </div>
      <button className="btn-primary" style={{width:"auto",padding:"12px 40px"}} onClick={roll} disabled={rolling||bet<=0||bet>wallet||target<1.01}>
        {rolling?"Rolling…":"🚀 Launch"}
      </button>
      {result && (
        <div className={`game-result ${result.won?"win":"lose"}`} style={{marginTop:16}}>
          <div className="game-result-title">{result.won?`Hit ${result.rolled}x — Win ₹${fmt(Math.abs(result.pnl))}!`:`Rolled ${result.rolled} — Lost ₹${fmt(bet)}`}</div>
          <div className="game-result-sub">Target was {target}x</div>
        </div>
      )}
      <div className="game-history" style={{marginTop:12}}>
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`}>{h.rolled}x</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   HI-LO CARD STREAK GAME
========================================================= */
function HiLoGame({ wallet, onResult }) {
  const SUITS=["♠","♥","♦","♣"], RANKS=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
  const rankVal = r => RANKS.indexOf(r);
  const mkDeck = () => SUITS.flatMap(s=>RANKS.map(r=>({s,r})));
  const shuffle = d=>{const a=[...d];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

  const [bet, setBet]     = useState(100);
  const [deck, setDeck]   = useState([]);
  const [current, setCurrent] = useState(null);
  const [next, setNext]   = useState(null);
  const [streak, setStreak]   = useState(0);
  const [mult, setMult]   = useState(1);
  const [phase, setPhase] = useState("idle"); // idle|guessing|reveal|done
  const [correct, setCorrect] = useState(null);
  const [history, setHistory] = useState([]);

  const STREAK_MULTS=[1,1.5,2.2,3.3,5,7.5,11,17,25,40];

  const start = () => {
    if(bet<=0||bet>wallet) return;
    const d=shuffle(mkDeck());
    setCurrent(d[0]); setDeck(d.slice(1)); setStreak(0); setMult(1); setPhase("guessing"); setCorrect(null); setNext(null);
  };

  const guess = (dir) => {
    if(phase!=="guessing"||deck.length===0) return;
    const nxt=deck[0], rest=deck.slice(1);
    setNext(nxt); setDeck(rest); setPhase("reveal");
    const curV=rankVal(current.r), nxtV=rankVal(nxt.r);
    const won=(dir==="hi"&&nxtV>curV)||(dir==="lo"&&nxtV<curV);
    setCorrect(won);
    if(won){
      const ns=streak+1, nm=STREAK_MULTS[Math.min(ns,STREAK_MULTS.length-1)];
      setStreak(ns); setMult(nm);
      setTimeout(()=>{ setCurrent(nxt); setNext(null); setPhase("guessing"); setCorrect(null); }, 900);
    } else {
      setTimeout(()=>{
        const pnl=-bet;
        setPhase("done");
        setHistory(h=>[{won:false,streak,pnl},...h.slice(0,11)]);
        onResult(pnl,`Hi-Lo: Wrong on streak ${streak} — Lost ₹${fmt(bet)}`);
      },900);
    }
  };

  const cashout = () => {
    if(phase!=="guessing"||streak===0) return;
    const pnl=Math.floor(bet*mult)-bet;
    setPhase("done");
    setHistory(h=>[{won:true,streak,pnl},...h.slice(0,11)]);
    onResult(pnl,`Hi-Lo: Cashed out at streak ${streak}, ${mult}x — Win ₹${fmt(Math.floor(bet*mult))}!`);
  };

  const CardDisplay=({card,hidden,highlight})=>(
    <div style={{
      width:70,height:100,borderRadius:10,
      background:hidden?"#1e293b":highlight===true?"#d1fae5":highlight===false?"#fee2e2":"white",
      border:`2px solid ${highlight===true?"#16a34a":highlight===false?"#dc2626":"var(--border2)"}`,
      display:"grid",placeItems:"center",fontSize:hidden?32:22,fontWeight:700,
      boxShadow:"var(--sh)",color:card&&["♥","♦"].includes(card.s)?"#dc2626":"#1c1917",
      transition:"all 0.3s",
    }}>
      {hidden?"🂠":card?`${card.r}${card.s}`:""}
    </div>
  );

  return (
    <div className="game-card">
      <div className="game-header"><div className="game-title">Hi-Lo Streak</div><div className="game-desc">Predict if the next card is higher or lower. Each correct guess multiplies your payout.</div></div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} disabled={phase!=="idle"&&phase!=="done"} />
        {[50,100,500].map(v=><span key={v} className="bet-chip" onClick={()=>(phase==="idle"||phase==="done")&&setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>

      {phase!=="idle" && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20,padding:"24px 0"}}>
          <CardDisplay card={current} highlight={correct===false?false:correct===true?true:null}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32}}>→</div>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:600,color:"var(--teal)",marginTop:4}}>{mult}x</div>
            <div style={{fontSize:11,color:"var(--ink4)"}}>streak {streak}</div>
          </div>
          <CardDisplay card={next} hidden={phase==="guessing"} highlight={correct===true?true:correct===false?false:null}/>
        </div>
      )}

      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        {phase==="idle" && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={start} disabled={bet<=0||bet>wallet}>🃏 Start Hi-Lo</button>}
        {phase==="guessing" && <>
          <button className="btn-primary" style={{width:"auto",padding:"11px 28px",background:"var(--teal)"}} onClick={()=>guess("hi")}>↑ Higher</button>
          <button className="btn-primary" style={{width:"auto",padding:"11px 28px",background:"var(--red)"}}  onClick={()=>guess("lo")}>↓ Lower</button>
          {streak>0&&<button className="btn-primary" style={{width:"auto",padding:"11px 24px",background:"var(--amber)"}} onClick={cashout}>💰 Cash Out ₹{fmt(Math.floor(bet*mult))}</button>}
        </>}
        {phase==="done" && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={()=>{setPhase("idle");setCurrent(null);setNext(null);setStreak(0);setMult(1);}}>Play Again</button>}
      </div>

      <div className="game-history" style={{marginTop:16}}>
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.won?"win":"lose"}`}>{h.won?`${h.streak} streak`:h.streak>0?`${h.streak}→💥`:"❌"}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   VIDEO POKER GAME
========================================================= */
function VideoPokerGame({ wallet, onResult }) {
  const SUITS=["♠","♥","♦","♣"], RANKS=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
  const mkDeck=()=>SUITS.flatMap(s=>RANKS.map(r=>({s,r})));
  const shuffle=d=>{const a=[...d];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const rankVal=r=>RANKS.indexOf(r);
  const PAYTABLE=[
    {name:"Royal Flush",   mult:800, check:h=>{const s=h.every(c=>c.s===h[0].s);const vs=h.map(c=>rankVal(c.r)).sort((a,b)=>a-b);return s&&JSON.stringify(vs)===JSON.stringify([8,9,10,11,12]);}},
    {name:"Straight Flush",mult:50,  check:h=>{const s=h.every(c=>c.s===h[0].s);const vs=h.map(c=>rankVal(c.r)).sort((a,b)=>a-b);const str=vs[4]-vs[0]===4&&new Set(vs).size===5;return s&&str;}},
    {name:"Four of a Kind",mult:25,  check:h=>{const g=Object.values(h.reduce((a,c)=>{a[c.r]=(a[c.r]||0)+1;return a},{}));return g.includes(4);}},
    {name:"Full House",    mult:9,   check:h=>{const g=Object.values(h.reduce((a,c)=>{a[c.r]=(a[c.r]||0)+1;return a},{})).sort();return JSON.stringify(g)==='[2,3]';}},
    {name:"Flush",         mult:6,   check:h=>h.every(c=>c.s===h[0].s)},
    {name:"Straight",      mult:4,   check:h=>{const vs=h.map(c=>rankVal(c.r)).sort((a,b)=>a-b);return vs[4]-vs[0]===4&&new Set(vs).size===5;}},
    {name:"Three of a Kind",mult:3,  check:h=>{const g=Object.values(h.reduce((a,c)=>{a[c.r]=(a[c.r]||0)+1;return a},{}));return g.includes(3);}},
    {name:"Two Pair",      mult:2,   check:h=>{const g=Object.values(h.reduce((a,c)=>{a[c.r]=(a[c.r]||0)+1;return a},{}));return g.filter(v=>v===2).length===2;}},
    {name:"Jacks or Better",mult:1,  check:h=>{const g=h.reduce((a,c)=>{a[c.r]=(a[c.r]||0)+1;return a},{});return Object.entries(g).some(([r,v])=>v>=2&&["J","Q","K","A"].includes(r));}},
  ];

  const [bet, setBet]     = useState(100);
  const [deck, setDeck]   = useState([]);
  const [hand, setHand]   = useState([]);
  const [held, setHeld]   = useState(new Set());
  const [phase, setPhase] = useState("idle"); // idle|hold|result
  const [handName, setHandName]= useState(null);
  const [history, setHistory]  = useState([]);

  const deal = () => {
    if(bet<=0||bet>wallet) return;
    const d=shuffle(mkDeck());
    setHand(d.slice(0,5)); setDeck(d.slice(5)); setHeld(new Set()); setPhase("hold"); setHandName(null);
  };

  const draw = () => {
    let dk=[...deck];
    const newHand=hand.map((c,i)=>held.has(i)?c:dk.shift());
    setHand(newHand); setDeck(dk);
    const win=PAYTABLE.find(p=>p.check(newHand));
    const pnl=win?Math.floor(bet*win.mult)-bet:-bet;
    setHandName(win?.name||"No Win");
    setPhase("result");
    setHistory(h=>[{name:win?.name||"No Win",pnl},...h.slice(0,11)]);
    onResult(pnl, win?`Poker: ${win.name}! Win ₹${fmt(Math.floor(bet*win.mult))}`:`Poker: No Win — Lost ₹${fmt(bet)}`);
  };

  const Card=({c,isHeld,onClick,disabled})=>(
    <div onClick={!disabled?onClick:null} style={{
      width:72,height:104,borderRadius:10,background:isHeld?"#fffbeb":"white",
      border:`2px solid ${isHeld?"#d97706":"var(--border2)"}`,
      display:"flex",flexDirection:"column",padding:"6px 8px",
      boxShadow:isHeld?"var(--sh-md)":"var(--sh-sm)",
      cursor:disabled?"default":"pointer",transition:"all 0.15s",
      transform:isHeld?"translateY(-8px)":"none",flexShrink:0,
    }}>
      <div style={{fontSize:14,fontWeight:800,color:["♥","♦"].includes(c.s)?"#dc2626":"#1c1917"}}>{c.r}</div>
      <div style={{fontSize:22,textAlign:"center",flex:1,display:"grid",placeItems:"center",color:["♥","♦"].includes(c.s)?"#dc2626":"#1c1917"}}>{c.s}</div>
      {isHeld&&<div style={{fontSize:9,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"#d97706",textAlign:"center"}}>HELD</div>}
    </div>
  );

  return (
    <div className="game-card">
      <div className="game-header"><div className="game-title">Video Poker</div><div className="game-desc">Jacks or Better. Hold cards, draw replacements. Hit any winning hand.</div></div>
      <div className="bet-row">
        <label>Bet</label>
        <input className="bet-input" type="number" min="1" value={bet} onChange={e=>setBet(Number(e.target.value))} disabled={phase==="hold"} />
        {[50,100,500].map(v=><span key={v} className="bet-chip" onClick={()=>phase!=="hold"&&setBet(v)}>₹{v}</span>)}
        <span className="balance-hint">Bal: ₹{fmt(wallet)}</span>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",fontSize:11,color:"var(--ink4)"}}>
        {PAYTABLE.map(p=><span key={p.name} style={{padding:"2px 8px",background:"var(--bg)",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>{p.name}: {p.mult}x</span>)}
      </div>
      {hand.length>0&&(
        <div style={{display:"flex",gap:10,justifyContent:"center",padding:"16px 0",flexWrap:"wrap"}}>
          {hand.map((c,i)=>(
            <Card key={i} c={c} isHeld={held.has(i)} disabled={phase==="result"}
              onClick={()=>{setHeld(prev=>{const s=new Set(prev);s.has(i)?s.delete(i):s.add(i);return s;});}}/>
          ))}
        </div>
      )}
      {handName&&<div style={{textAlign:"center",fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:600,color:handName==="No Win"?"var(--red)":"var(--teal)",marginBottom:12}}>{handName}</div>}
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        {phase==="idle"   && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={deal} disabled={bet<=0||bet>wallet}>🃏 Deal (₹{fmt(bet)})</button>}
        {phase==="hold"   && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={draw}>🎯 Draw Cards</button>}
        {phase==="result" && <button className="btn-primary" style={{width:"auto",padding:"11px 32px"}} onClick={()=>{setPhase("idle");setHand([]);setHandName(null);}}>Deal Again</button>}
      </div>
      {phase==="hold"&&<div style={{textAlign:"center",fontSize:12,color:"var(--ink4)",marginTop:8}}>Click cards to hold, then Draw</div>}
      <div className="game-history" style={{marginTop:12}}>
        {history.map((h,i)=><span key={i} className={`game-hist-chip ${h.pnl>=0?"win":"lose"}`}>{h.name==="No Win"?"No Win":h.name.split(" ").map(w=>w[0]).join("")} {h.pnl>=0?`+₹${fmt(h.pnl)}`:``}</span>)}
      </div>
    </div>
  );
}

/* =========================================================
   GAMES HUB PAGE
========================================================= */
function GamesPage({ wallet, onGameResult }) {
  const [activeGame, setActiveGame] = useState("crash");
  const games = [
    { id:"crash",    icon:"✈️", label:"Crash",       desc:"Multiplier climbs until it crashes" },
    { id:"coin",     icon:"🪙", label:"Coin Flip",   desc:"Heads or tails — double or nothing" },
    { id:"slider",   icon:"🎯", label:"Slider",      desc:"Pick under/over threshold" },
    { id:"mines",    icon:"💣", label:"Mines",       desc:"Avoid bombs, collect gems" },
    { id:"dice",     icon:"🎲", label:"Dice Duel",   desc:"Beat the house roll" },
    { id:"plinko",   icon:"🎱", label:"Plinko",      desc:"Drop ball through pegs" },
    { id:"roulette", icon:"🎡", label:"Roulette",    desc:"European wheel, 37 pockets" },
    { id:"blackjack",icon:"🃏", label:"Blackjack",   desc:"Beat dealer to 21" },
    { id:"wheel",    icon:"🎰", label:"Spin Wheel",  desc:"12 segments, 0x–50x jackpot" },
    { id:"keno",     icon:"🔢", label:"Keno",        desc:"Pick numbers, match the draw" },
    { id:"tower",    icon:"🏗️", label:"Tower Climb", desc:"Climb floors, avoid traps" },
    { id:"limbo",    icon:"🚀", label:"Limbo",       desc:"Set target, hit or exceed it" },
    { id:"hilo",     icon:"↕️", label:"Hi-Lo",       desc:"Chain higher/lower guesses" },
    { id:"poker",    icon:"♠️", label:"Video Poker", desc:"Jacks or Better, 5-card draw" },
  ];
  const active = games.find(g=>g.id===activeGame);

  return (
    <div style={{display:"flex",gap:0,minHeight:"calc(100vh - 80px)"}}>
      {/* LEFT SIDEBAR – game selector */}
      <div style={{
        width:200,flexShrink:0,background:"var(--white)",
        border:"1px solid var(--border)",borderRadius:"var(--r3)",
        padding:"16px 10px",marginRight:20,alignSelf:"flex-start",
        position:"sticky",top:0,
      }}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"var(--ink4)",padding:"0 8px",marginBottom:10}}>
          🎰 Select Game
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {games.map(g=>(
            <button key={g.id} onClick={()=>setActiveGame(g.id)} style={{
              display:"flex",alignItems:"center",gap:8,
              padding:"9px 10px",borderRadius:"var(--r)",border:"none",
              background:activeGame===g.id?"var(--ink)":"transparent",
              color:activeGame===g.id?"white":"var(--ink3)",
              fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:activeGame===g.id?700:500,
              cursor:"pointer",textAlign:"left",width:"100%",transition:"all 0.15s",
            }}>
              <span style={{fontSize:14,width:18,flexShrink:0}}>{g.icon}</span>
              {g.label}
            </button>
          ))}
        </div>
        <div style={{margin:"12px 8px 0",paddingTop:12,borderTop:"1px solid var(--border)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Balance</div>
          <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:600,color:"var(--ink)"}}>
            {wallet!==null?`₹${fmt(wallet)}`:"—"}
          </div>
          <div style={{fontSize:10,color:"var(--ink4)",marginTop:2}}>Syncs after each game</div>
        </div>
      </div>

      {/* RIGHT – active game */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>{active?.icon}</span>
          <div>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:400,letterSpacing:-0.5}}>{active?.label}</div>
            <div style={{fontSize:12,color:"var(--ink4)"}}>{active?.desc}</div>
          </div>
        </div>
        {wallet === null && <div className="loading-wrap"><div className="spinner"/><span>Loading balance…</span></div>}
        {wallet !== null && (
          <div>
            {activeGame==="crash"    && <CrashGame      wallet={wallet} onResult={onGameResult} />}
            {activeGame==="coin"     && <CoinFlipGame   wallet={wallet} onResult={onGameResult} />}
            {activeGame==="slider"   && <SliderGame     wallet={wallet} onResult={onGameResult} />}
            {activeGame==="mines"    && <MinesGame      wallet={wallet} onResult={onGameResult} />}
            {activeGame==="dice"     && <DiceDuelGame   wallet={wallet} onResult={onGameResult} />}
            {activeGame==="plinko"   && <PlinkoGame     wallet={wallet} onResult={onGameResult} />}
            {activeGame==="roulette" && <RouletteGame   wallet={wallet} onResult={onGameResult} />}
            {activeGame==="blackjack"&& <BlackjackGame  wallet={wallet} onResult={onGameResult} />}
            {activeGame==="wheel"    && <SpinWheelGame  wallet={wallet} onResult={onGameResult} />}
            {activeGame==="keno"     && <KenoGame       wallet={wallet} onResult={onGameResult} />}
            {activeGame==="tower"    && <TowerClimbGame wallet={wallet} onResult={onGameResult} />}
            {activeGame==="limbo"    && <LimboGame      wallet={wallet} onResult={onGameResult} />}
            {activeGame==="hilo"     && <HiLoGame       wallet={wallet} onResult={onGameResult} />}
            {activeGame==="poker"    && <VideoPokerGame wallet={wallet} onResult={onGameResult} />}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CRYPTO COMING SOON PAGE
========================================================= */
function CryptoComingSoon() {
  const coins = [
    {sym:"BTC",name:"Bitcoin",      icon:"₿",  color:"#f7931a",bg:"#fff8f0",change:"+2.4%"},
    {sym:"ETH",name:"Ethereum",     icon:"Ξ",  color:"#627eea",bg:"#f0f2ff",change:"+1.1%"},
    {sym:"SOL",name:"Solana",       icon:"◎",  color:"#9945ff",bg:"#f5f0ff",change:"+5.8%"},
    {sym:"BNB",name:"BNB",          icon:"⬡",  color:"#f3ba2f",bg:"#fffcf0",change:"-0.9%"},
    {sym:"XRP",name:"Ripple",       icon:"✕",  color:"#00aae4",bg:"#f0faff",change:"+0.3%"},
    {sym:"DOGE",name:"Dogecoin",    icon:"Ð",  color:"#c2a633",bg:"#fffdf0",change:"+8.2%"},
  ];
  return (
    <>
      <div className="page-header">
        <div className="page-title">Crypto</div>
        <div className="page-sub">Spot trading, DeFi, and Web3 portfolio management</div>
      </div>

      {/* Coming soon banner */}
      <div style={{
        background:"linear-gradient(135deg,#0f0f23 0%,#1a0a2e 50%,#0d1b2a 100%)",
        borderRadius:"var(--r3)",padding:"48px 40px",marginBottom:28,
        position:"relative",overflow:"hidden",border:"1px solid rgba(124,58,237,0.3)",
        boxShadow:"0 20px 60px rgba(124,58,237,0.15)",
      }}>
        {/* decorative orbs */}
        {["120px 20px","300px 160px","60px 140px","420px 40px"].map((pos,i)=>(
          <div key={i} style={{position:"absolute",left:pos.split(" ")[0],top:pos.split(" ")[1],
            width:[80,120,60,100][i],height:[80,120,60,100][i],borderRadius:"50%",
            background:["rgba(124,58,237,0.15)","rgba(168,85,247,0.08)","rgba(59,130,246,0.1)","rgba(249,115,22,0.08)"][i],
            filter:"blur(20px)",pointerEvents:"none"}}/>
        ))}
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(124,58,237,0.2)",
            border:"1px solid rgba(124,58,237,0.4)",borderRadius:20,padding:"4px 14px",
            fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#c4b5fd",marginBottom:16}}>
            🚀 Coming Soon
          </div>
          <div style={{fontFamily:"'Fraunces',serif",fontSize:40,fontWeight:600,color:"white",
            letterSpacing:-1.5,lineHeight:1.1,marginBottom:12}}>
            Crypto Trading<br/><em style={{color:"#a855f7",fontStyle:"italic"}}>is on its way</em>
          </div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",maxWidth:480,lineHeight:1.7,marginBottom:28}}>
            We're building a full-featured crypto exchange with spot trading, real-time order books, DeFi integrations, and Web3 wallet support. Stay tuned.
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {["Spot Trading","Margin Trading","DeFi Pools","NFT Gallery","Web3 Wallet","Price Alerts"].map(f=>(
              <span key={f} style={{padding:"6px 14px",background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,
                fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)"}}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mock coin list – blurred/locked */}
      <div style={{marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--ink2)"}}>Market Preview</div>
        <span style={{fontSize:11,color:"var(--ink4)",fontFamily:"'DM Mono',monospace"}}>LOCKED — Coming Soon</span>
      </div>
      <div style={{position:"relative"}}>
        <div style={{filter:"blur(3px)",pointerEvents:"none",userSelect:"none",opacity:0.7}}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Asset</th><th>Price</th><th>24h Change</th><th>Market Cap</th><th>Action</th></tr></thead>
              <tbody>
                {coins.map(c=>(
                  <tr key={c.sym}>
                    <td><div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:c.bg,border:`2px solid ${c.color}22`,display:"grid",placeItems:"center",fontSize:16,fontWeight:700,color:c.color}}>{c.icon}</div>
                      <div><div style={{fontWeight:700,color:"var(--ink)"}}>{c.name}</div><div style={{fontSize:11,color:"var(--ink4)",fontFamily:"'DM Mono',monospace"}}>{c.sym}</div></div>
                    </div></td>
                    <td style={{fontFamily:"'Fraunces',serif",fontWeight:600}}>₹{(Math.random()*5000000+1000).toFixed(0)}</td>
                    <td style={{fontWeight:700,color:c.change.startsWith("+")?"var(--teal)":"var(--red)"}}>{c.change}</td>
                    <td style={{color:"var(--ink3)",fontSize:13}}>₹{(Math.random()*100+10).toFixed(1)}T</td>
                    <td><button style={{padding:"6px 16px",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--r)",fontSize:12,fontWeight:600,color:"var(--ink3)",cursor:"not-allowed"}}>Trade</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* lock overlay */}
        <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",borderRadius:"var(--r2)"}}>
          <div style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:"var(--r2)",
            padding:"20px 32px",textAlign:"center",boxShadow:"var(--sh-lg)"}}>
            <div style={{fontSize:32,marginBottom:8}}>🔒</div>
            <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:600,color:"var(--ink)",marginBottom:4}}>Feature Locked</div>
            <div style={{fontSize:13,color:"var(--ink4)"}}>Crypto trading will be available soon</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   EXISTING PAGES (unchanged)
========================================================= */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return (
    <div className={`toast ${type}`}>
      <div className="toast-icon">{type === "success" ? "✓" : "✕"}</div>
      <span>{msg}</span>
    </div>
  );
}

function LineChart({ data, stockName }) {
  const [tooltip, setTooltip] = useState(null);
  if (!data || data.length < 2)
    return <div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">Not enough data</div></div>;

  const W = 760, H = 280, PL = 64, PR = 24, PT = 20, PB = 44;
  const cW = W - PL - PR, cH = H - PT - PB;
  const prices = data.map(d => Number(d.price));
  const times  = data.map(d => new Date(d.created_at || d.updated_at || Date.now()));
  const minP = Math.min(...prices), maxP = Math.max(...prices), range = maxP - minP || 1;
  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? "#007a6e" : "#c0392b";
  const sx = i => PL + (i / (prices.length - 1)) * cW;
  const sy = v => PT + cH - ((v - minP) / range) * cH;
  const pts = prices.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
  const area = `M${sx(0)},${PT+cH} ` + prices.map((v,i) => `L${sx(i)},${sy(v)}`).join(" ") + ` L${sx(prices.length-1)},${PT+cH} Z`;
  const yT = Array.from({ length: 5 }, (_, i) => minP + (range / 4) * i);
  const xI = [0, Math.floor(prices.length*.25), Math.floor(prices.length*.5), Math.floor(prices.length*.75), prices.length-1];
  const fmtD = d => (d instanceof Date && !isNaN(d)) ? d.toLocaleDateString("en-IN", { month:"short", day:"numeric" }) : "";
  const onMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const idx = Math.max(0, Math.min(prices.length-1, Math.round(((mx-PL)/cW)*(prices.length-1))));
    setTooltip({ x: sx(idx), y: sy(prices[idx]), price: prices[idx], time: times[idx] });
  };
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:280 }} onMouseMove={onMove} onMouseLeave={() => setTooltip(null)}>
        <defs><linearGradient id={`g${stockName}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.1" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
        {yT.map((v,i) => (<g key={i}><line x1={PL} y1={sy(v)} x2={W-PR} y2={sy(v)} stroke="#e4dfd8" strokeWidth="1" /><text x={PL-8} y={sy(v)+4} textAnchor="end" fill="#b5afa6" fontSize="10" fontFamily="DM Mono">{v>=1000?`${(v/1000).toFixed(1)}k`:v.toFixed(0)}</text></g>))}
        <path d={area} fill={`url(#g${stockName})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {xI.map(i => <text key={i} x={sx(i)} y={H-10} textAnchor="middle" fill="#b5afa6" fontSize="10" fontFamily="DM Mono">{fmtD(times[i])}</text>)}
        <circle cx={sx(0)} cy={sy(prices[0])} r="3.5" fill={color} stroke="white" strokeWidth="1.5" />
        <circle cx={sx(prices.length-1)} cy={sy(prices[prices.length-1])} r="5" fill={color} stroke="white" strokeWidth="2" />
        {tooltip && (<g><line x1={tooltip.x} y1={PT} x2={tooltip.x} y2={PT+cH} stroke="rgba(26,23,20,0.1)" strokeWidth="1" strokeDasharray="3,3" /><circle cx={tooltip.x} cy={tooltip.y} r="5" fill={color} stroke="white" strokeWidth="2" /><rect x={Math.min(tooltip.x+12,W-145)} y={tooltip.y-42} width="133" height="48" rx="6" fill="white" stroke="#e4dfd8" strokeWidth="1" style={{filter:"drop-shadow(0 2px 8px rgba(26,23,20,0.1))"}} /><text x={Math.min(tooltip.x+20,W-137)} y={tooltip.y-22} fill="#1a1714" fontSize="13" fontFamily="Fraunces" fontWeight="600">₹{tooltip.price.toLocaleString()}</text><text x={Math.min(tooltip.x+20,W-137)} y={tooltip.y-6} fill="#b5afa6" fontSize="10" fontFamily="DM Mono">{fmtD(tooltip.time)}</text></g>)}
      </svg>
      <div style={{ display:"flex", gap:28, marginTop:8, fontSize:13, color:"var(--ink4)" }}>
        {[["Open",`₹${prices[0].toLocaleString()}`,"var(--ink2)"],["Close",`₹${prices[prices.length-1].toLocaleString()}`,color],["High",`₹${maxP.toLocaleString()}`,"var(--teal)"],["Low",`₹${minP.toLocaleString()}`,"var(--red)"],["Chg",`${isUp?"+":""}${((prices[prices.length-1]-prices[0])/prices[0]*100).toFixed(2)}%`,color]].map(([l,v,c])=>
          <span key={l}>{l} <strong style={{color:c,fontWeight:700}}>{v}</strong></span>
        )}
      </div>
    </div>
  );
}

function Auth({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const handle = async () => {
    setLoading(true); setMsg(null);
    const res = await api.post(tab==="login"?"/users/login":"/users/register", tab==="login"?{email:form.email,password:form.password}:form);
    setLoading(false);
    if (res.message==="NETWORK_ERROR"||res.statusCode===0) { setMsg({type:"network"}); return; }
    if (res.statusCode>=200&&res.statusCode<300) { if(tab==="login") onLogin(res.data.user); else { setMsg({type:"success",text:"Account created! Please sign in."}); setTab("login"); } }
    else setMsg({type:"error",text:res.message||"Something went wrong"});
  };
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand"><div className="auth-brand-mark">A</div><div className="auth-brand-name">Apex<em>Trade</em></div></div>
        <div className="auth-divider" />
        <div className="auth-tabs">
          <button className={`auth-tab ${tab==="login"?"active":""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`auth-tab ${tab==="register"?"active":""}`} onClick={() => setTab("register")}>Register</button>
        </div>
        {tab==="register" && <div className="field"><label>Username</label><input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="johndoe" /></div>}
        <div className="field"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" /></div>
        <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handle()} /></div>
        <button className="btn-primary" onClick={handle} disabled={loading}>{loading?"…":tab==="login"?"Sign In":"Create Account"}</button>
        {msg?.type==="network" && <div className="network-banner"><strong>⚠ Cannot reach backend</strong>Ensure backend is running on port <code>3000</code> with CORS.</div>}
        {msg?.type==="error"   && <div className="error-msg">{msg.text}</div>}
        {msg?.type==="success" && <div className="success-msg">{msg.text}</div>}
      </div>
    </div>
  );
}

function TradeModal({ stock, onClose, onDone, wallet }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const trade = async type => {
    setLoading(true); setMsg(null);
    const res = await api[type==="BUY"?"post":"patch"](type==="BUY"?"/users/buy-stock":"/users/sell-stock",{name:stock.stock_name,quantity:Number(qty)});
    setLoading(false);
    if (res.statusCode>=200&&res.statusCode<300) { onDone(type==="BUY"?"Purchase successful":"Shares sold","success"); onClose(); }
    else setMsg(res.message||"Trade failed");
  };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-badge">{stock.stock_name}</div>
        <div className="modal-title">Place Order</div>
        <div className="modal-sub">Market order · Executed immediately</div>
        <div className="modal-price-box"><div className="modal-price">₹{stock.price?.toLocaleString()}</div><div className="modal-per">per share</div></div>
        <div className="field"><label>Quantity</label><input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} /></div>
        <div className="modal-total-row"><span>Order total</span><span className="modal-total-val">₹{(stock.price*qty).toFixed(2)}</span></div>
        <div className="modal-wallet-row"><span>Available balance</span><span>₹{wallet?.toLocaleString()??"—"}</span></div>
        {msg && <div className="error-msg" style={{marginBottom:12}}>{msg}</div>}
        <div className="modal-actions">
          <button className="btn-buy-m" disabled={loading} onClick={()=>trade("BUY")}>{loading?"…":"↑ Buy"}</button>
          <button className="btn-sell-m" disabled={loading} onClick={()=>trade("SELL")}>{loading?"…":"↓ Sell"}</button>
        </div>
      </div>
    </div>
  );
}

function MarketPage({ onTrade, wallet }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => { api.get("/stocks/get-all").then(r=>{setStocks(r.data||[]);setLoading(false);}); }, []);
  if (loading) return <div className="loading-wrap"><div className="spinner"/><span>Loading market data…</span></div>;
  const filtered = stocks.filter(s=>s.stock_name?.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <div className="page-header"><div className="page-title">Live Market</div><div className="page-sub">Click any stock to place a trade</div></div>
      {stocks.length>0 && (<div className="stats-row"><div className="stat-card"><div className="stat-label">Listed Stocks</div><div className="stat-value">{stocks.length}</div><div className="stat-pill pill-amber">All active</div></div><div className="stat-card"><div className="stat-label">Highest Price</div><div className="stat-value" style={{color:"var(--teal)"}}>₹{Math.max(...stocks.map(s=>s.price)).toLocaleString()}</div><div className="stat-pill pill-teal">↑ Top</div></div><div className="stat-card"><div className="stat-label">Lowest Price</div><div className="stat-value" style={{color:"var(--red)"}}>₹{Math.min(...stocks.map(s=>s.price)).toLocaleString()}</div><div className="stat-pill pill-red">↓ Floor</div></div></div>)}
      <input className="search-bar" placeholder="Search stocks…" value={search} onChange={e=>setSearch(e.target.value)} />
      {filtered.length===0 ? <div className="empty-state"><div className="empty-icon">🏪</div><div className="empty-title">No stocks found</div></div>
        : <div className="stocks-grid">{filtered.map(s=>(<div className="stock-card" key={s.stock_id} onClick={()=>setSelected(s)}><div className="stock-ticker">#{s.stock_id}</div><div className="stock-name">{s.stock_name}</div><div className="stock-price">₹{s.price?.toLocaleString()}</div><div className="live-dot-wrap"><div className="live-dot"/>Live</div></div>))}</div>}
      {selected && <TradeModal stock={selected} onClose={()=>setSelected(null)} onDone={onTrade} wallet={wallet}/>}
    </>
  );
}

function PortfolioPage({ onSell }) {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [sellTarget, setSellTarget] = useState(null);
  const [sellQty, setSellQty] = useState(1);
  const [sellLoading, setSellLoading] = useState(false);
  const [sellMsg, setSellMsg] = useState(null);
  const reload = async () => { const r=await api.get("/users/get-all-stocks"); if(r.statusCode>=200) setPortfolio(r.data||[]); };
  useEffect(() => {
    api.get("/users/get-all-stocks").then(r=>{if(r.statusCode>=200)setPortfolio(r.data||[]);setLoading(false);});
    api.get("/stocks/get-all").then(r=>{const m={};(r.data||[]).forEach(s=>m[s.stock_name]=s.price);setPrices(m);});
  }, []);
  if (loading) return <div className="loading-wrap"><div className="spinner"/><span>Loading portfolio…</span></div>;
  const tv=portfolio.reduce((a,p)=>a+(prices[p.stock_name]||0)*p.quantity,0);
  const tc=portfolio.reduce((a,p)=>a+p.avg_buy_price*p.quantity,0);
  const pnl=tv-tc, pnlPct=tc>0?((pnl/tc)*100).toFixed(2):"0.00";
  return (
    <>
      <div className="page-header"><div className="page-title">My Portfolio</div><div className="page-sub">Holdings and performance overview</div></div>
      {portfolio.length>0&&(<div className="stats-row"><div className="stat-card"><div className="stat-label">Holdings</div><div className="stat-value">{portfolio.length}</div><div className="stat-pill pill-amber">Stocks</div></div><div className="stat-card"><div className="stat-label">Market Value</div><div className="stat-value" style={{fontSize:22}}>₹{tv.toFixed(0)}</div><div className="stat-pill pill-teal">Current</div></div><div className="stat-card"><div className="stat-label">Total P&L</div><div className="stat-value" style={{color:pnl>=0?"var(--teal)":"var(--red)",fontSize:22}}>{pnl>=0?"+":""}₹{Math.abs(pnl).toFixed(0)}</div><div className={`stat-pill ${pnl>=0?"pill-teal":"pill-red"}`}>{pnl>=0?"+":""}{pnlPct}%</div></div></div>)}
      {portfolio.length===0 ? <div className="empty-state"><div className="empty-icon">💼</div><div className="empty-title">No holdings yet</div><div>Head to Market to make your first trade</div></div>
        : portfolio.map(p=>{
            const cur=prices[p.stock_name]||p.avg_buy_price;
            const gain=(cur-p.avg_buy_price)*p.quantity;
            const gp=((gain/(p.avg_buy_price*p.quantity))*100).toFixed(2);
            const open=sellTarget===p.stock_name;
            return (<div className="pf-item" key={p.portfolio_id}><div className="pf-top"><div><div className="pf-name">{p.stock_name}</div><div className="pf-qty">{p.quantity} shares · avg ₹{Number(p.avg_buy_price).toFixed(2)}</div></div><div className="pf-right"><div><div className="pf-price">₹{cur.toLocaleString()}</div><div className={`pf-pnl ${gain>=0?"pnl-pos":"pnl-neg"}`}>{gain>=0?"+":""}₹{gain.toFixed(2)} ({gain>=0?"+":""}{gp}%)</div></div><button className={`btn-sell-mini ${open?"cancel":"idle"}`} onClick={()=>{setSellTarget(open?null:p.stock_name);setSellQty(1);setSellMsg(null);}}>{open?"Cancel":"Sell"}</button></div></div>{open&&(<div className="sell-panel"><span style={{fontSize:12,color:"var(--ink3)",fontWeight:600}}>Qty:</span><input type="number" min="1" max={p.quantity} value={sellQty} onChange={e=>setSellQty(Number(e.target.value))}/><div className="sell-total">= <strong>₹{(cur*Math.min(sellQty,p.quantity)).toLocaleString()}</strong></div><button className="btn-confirm-sell" disabled={sellLoading} onClick={async()=>{if(sellQty<1||sellQty>p.quantity){setSellMsg("Invalid quantity");return;}setSellLoading(true);const res=await api.patch("/users/sell-stock",{name:p.stock_name,quantity:sellQty});setSellLoading(false);if(res.statusCode>=200){setSellTarget(null);onSell(`Sold ${sellQty} shares of ${p.stock_name}`);reload();}else setSellMsg(res.message||"Sell failed");}}>{sellLoading?"…":"Confirm Sell"}</button>{sellMsg&&<span style={{fontSize:12,color:"var(--red)"}}>{sellMsg}</span>}</div>)}</div>);
          })}
    </>
  );
}

function HistoryPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{api.get("/users/get-all-trans").then(r=>{if(r.statusCode>=200)setTrades(r.data?.rows||[]);setLoading(false);});},[]);
  if (loading) return <div className="loading-wrap"><div className="spinner"/><span>Loading history…</span></div>;
  return (
    <>
      <div className="page-header"><div className="page-title">Trade History</div><div className="page-sub">All executed orders</div></div>
      {trades.length===0 ? <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No trades yet</div></div>
        : <div className="table-wrap"><table><thead><tr><th>Stock</th><th>Type</th><th>Qty</th><th>Price</th><th>Total</th><th>Date</th></tr></thead><tbody>{trades.map(t=>(<tr key={t.trade_id}><td className="td-bold">{t.stock_name}</td><td><span className={`badge badge-${t.trade_type==="BUY"?"buy":"sell"}`}>{t.trade_type}</span></td><td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{t.quantity}</td><td>₹{Number(t.price).toLocaleString()}</td><td style={{fontWeight:700,color:t.trade_type==="BUY"?"var(--red)":"var(--teal)"}}>{t.trade_type==="SELL"?"+":"-"}₹{Number(t.total_amount).toLocaleString()}</td><td style={{color:"var(--ink4)",fontFamily:"'DM Mono',monospace",fontSize:12}}>{new Date(t.created_at).toLocaleDateString()}</td></tr>))}</tbody></table></div>}
    </>
  );
}

function LeaderboardPage() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{api.patch("/users/leaderboard",{}).then(r=>{if(r.statusCode>=200)setBoard(r.data?.leaderboard||[]);setLoading(false);});},[]);
  if (loading) return <div className="loading-wrap"><div className="spinner"/><span>Loading leaderboard…</span></div>;
  const rc=i=>i===0?"top0":i===1?"top1":i===2?"top2":"rest";
  const rl=i=>i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1;
  return (
    <>
      <div className="page-header"><div className="page-title">Leaderboard</div><div className="page-sub">Top traders by portfolio balance</div></div>
      {board.length===0 ? <div className="empty-state"><div className="empty-icon">🏆</div><div className="empty-title">No data yet</div></div>
        : <div className="lb-list">{board.map((e,i)=>(<div className="lb-item" key={i}><div className={`lb-rank ${rc(i)}`}>{rl(i)}</div><div className="lb-avatar">{(e.username||"T")[0].toUpperCase()}</div><div className="lb-name">{e.username||e.user||`Trader #${i+1}`}</div><div className="lb-score">₹{Number(e.balance||e.total_value||0).toLocaleString()}</div></div>))}</div>}
    </>
  );
}

function ChartPage() {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const load = async () => {
    if(!name) return; setLoading(true); setErr(null);
    const res=await api.getq("/stocks/get-graph",{name,duration:Number(duration)});
    setLoading(false);
    if(res.statusCode>=200) setData(res.data); else setErr(res.message);
  };
  return (
    <>
      <div className="page-header"><div className="page-title">Price Charts</div><div className="page-sub">Historical price data for any listed stock</div></div>
      <div className="chart-search"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Stock name (e.g. AAPL)" onKeyDown={e=>e.key==="Enter"&&load()} /><input className="narrow" type="number" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="Points" /><button className="btn-load" onClick={load}>Load Chart</button></div>
      {loading && <div className="loading-wrap"><div className="spinner"/></div>}
      {err && <div className="empty-state" style={{color:"var(--red)"}}>{err}</div>}
      {data && <div className="chart-area"><div className="chart-head"><div className="chart-name">{name}</div><div className="chart-pts">{data.length} data points</div></div><LineChart data={data} stockName={name}/></div>}
      {!data&&!loading&&!err && <div className="empty-state"><div className="empty-icon">📈</div><div className="empty-title">Enter a stock name above</div><div>Chart will appear here</div></div>}
    </>
  );
}

/* =========================================================
   ROOT APP
========================================================= */
export default function App() {
  const [user, setUser]   = useState(null);
  const [page, setPage]   = useState("market");
  const [wallet, setWallet] = useState(null);
  const [localWallet, setLocalWallet] = useState(null); // for games (offline)
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="success") => setToast({ msg, type });

  const fetchWallet = useCallback(() => {
    api.get("/users/get-wallet").then(r => {
      if(r.statusCode>=200){
        const b=r.data?.balance??r.data?.[0]?.balance??null;
        setWallet(Number(b));
        setLocalWallet(prev => prev === null ? Number(b) : prev);
      } else setWallet(0);
    });
  }, []);

  useEffect(() => { if(user) fetchWallet(); }, [user, fetchWallet]);

  // game result: call real update-balance API + update local wallet
  const handleGameResult = useCallback(async (pnl, msg) => {
    // Optimistic update for instant UI feedback
    setLocalWallet(prev => Math.max(0, (prev ?? 0) + pnl));
    showToast(msg, pnl >= 0 ? "success" : "error");

    if (pnl === 0) return;
    try {
      const res = await api.patch("/users/update-balance", {
        amount: Math.abs(pnl),
        type: pnl > 0 ? "credit" : "debit",
      });
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const serverBal = res.data?.balance ?? null;
        if (serverBal !== null) {
          setLocalWallet(Number(serverBal));
          setWallet(Number(serverBal));
        }
      } else {
        // Rollback on server rejection
        setLocalWallet(prev => Math.max(0, (prev ?? 0) - pnl));
      }
    } catch { /* network error — keep optimistic state */ }
  }, []);

  const logout = async () => { await api.post("/users/logout",{}); clearToken(); setUser(null); setPage("market"); setWallet(null); setLocalWallet(null); };

  const nav = [
    {id:"market",     icon:"◈", label:"Market",      section:"trade"},
    {id:"portfolio",  icon:"◉", label:"Portfolio",   section:"trade"},
    {id:"history",    icon:"◎", label:"History",     section:"trade"},
    {id:"chart",      icon:"◇", label:"Charts",      section:"trade"},
    {id:"leaderboard",icon:"◆", label:"Leaderboard", section:"trade"},
    {id:"games",      icon:"🎰", label:"Games",       section:"games", badge:"HOT"},
    {id:"crypto",     icon:"₿",  label:"Crypto",      section:"crypto", badge:"SOON", disabled:true},
  ];

  if (!user) return <><style>{css}</style><Auth onLogin={u=>setUser(u)}/></>;
  const initials = (user.username||user.email||"U")[0].toUpperCase();

  // always show localWallet (synced with server), fall back to server wallet
  const displayWallet = localWallet ?? wallet;

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <div className="sidebar">
          <div className="sidebar-head">
            <div className="sidebar-mark">A</div>
            <div className="sidebar-title">Apex<em>Trade</em></div>
          </div>
          <nav className="nav">
            <div className="nav-section" style={{paddingLeft:0,paddingTop:12}}>Trading</div>
            {nav.filter(n=>n.section==="trade").map(n=>(
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
            <div className="nav-section" style={{paddingLeft:0}}>Games</div>
            {nav.filter(n=>n.section==="games").map(n=>(
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </div>
            ))}
            <div className="nav-section" style={{paddingLeft:0}}>Crypto</div>
            {nav.filter(n=>n.section==="crypto").map(n=>(
              <div key={n.id} className="nav-item" style={{opacity:0.5,cursor:"not-allowed",position:"relative"}}
                onClick={()=>setPage("crypto")}>
                <span className="nav-icon">{n.icon}</span>{n.label}
                <span className="nav-badge" style={{background:"linear-gradient(135deg,#7c3aed,#a855f7)"}}>{n.badge}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="wallet-card">
              <div className="wallet-lbl">Balance</div>
              <div className="wallet-bal">{displayWallet!==null?`₹${Number(displayWallet).toLocaleString()}`:<div className="spinner" style={{borderTopColor:"rgba(255,255,255,0.5)"}}/>}</div>
              <div className="wallet-hint">Available to trade & play</div>
            </div>
            <div className="user-row">
              <div className="user-avatar">{initials}</div>
              <div className="user-name">{user.username||user.email}</div>
            </div>
            <button className="btn-logout" onClick={logout}>Sign Out</button>
          </div>
        </div>
        <main className="main" style={{padding: page==="games" ? "28px 32px" : undefined}}>
          {page==="market"      && <MarketPage onTrade={(m,t)=>{showToast(m,t);fetchWallet();}} wallet={wallet}/>}
          {page==="portfolio"   && <PortfolioPage onSell={m=>{showToast(m,"success");fetchWallet();}}/>}
          {page==="history"     && <HistoryPage/>}
          {page==="chart"       && <ChartPage/>}
          {page==="leaderboard" && <LeaderboardPage/>}
          {page==="games"       && <GamesPage wallet={localWallet ?? wallet ?? 0} onGameResult={handleGameResult}/>}
          {page==="crypto"      && <CryptoComingSoon/>}
          {page==="crypto"      && <CryptoComingSoon/>}
        </main>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}