import { useState, useEffect, useCallback } from "react";

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
  .auth-wrap {
    min-height: 100vh; display: grid; place-items: center;
    background: var(--bg); padding: 24px;
  }
  .auth-card {
    width: 100%; max-width: 420px;
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--r3); padding: 40px;
    box-shadow: var(--sh-md);
    animation: slideUp 0.35s ease both;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .auth-brand {
    display: flex; align-items: center; gap: 10px; margin-bottom: 28px;
  }
  .auth-brand-mark {
    width: 32px; height: 32px; background: var(--ink);
    border-radius: 8px; display: grid; place-items: center;
    font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600;
    color: var(--white); flex-shrink: 0;
  }
  .auth-brand-name {
    font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600;
    letter-spacing: -0.3px; color: var(--ink);
  }
  .auth-brand-name em { font-style: italic; color: var(--ink3); }
  .auth-divider { height: 1px; background: var(--border); margin-bottom: 28px; }

  .auth-tabs {
    display: flex; margin-bottom: 32px;
    border-bottom: 1.5px solid var(--border);
  }
  .auth-tab {
    padding: 10px 0; margin-right: 28px;
    background: none; border: none; border-bottom: 2px solid transparent;
    margin-bottom: -1.5px; color: var(--ink4);
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
  }
  .auth-tab.active { color: var(--ink); border-bottom-color: var(--ink); }
  .auth-tab:hover:not(.active) { color: var(--ink2); }

  .field { margin-bottom: 18px; }
  .field label { display: block; font-size: 11px; font-weight: 700; color: var(--ink3); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 7px; }
  .field input {
    width: 100%; background: var(--surface2);
    border: 1.5px solid var(--border); border-radius: var(--r);
    color: var(--ink); font-family: 'DM Sans', sans-serif;
    font-size: 15px; padding: 11px 14px; outline: none; transition: all 0.18s;
  }
  .field input::placeholder { color: var(--ink4); }
  .field input:focus { border-color: var(--ink2); background: var(--white); box-shadow: 0 0 0 3px rgba(26,23,20,0.06); }

  .btn-primary {
    width: 100%; padding: 13px; background: var(--ink); color: var(--white);
    border: none; border-radius: var(--r);
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px;
    cursor: pointer; margin-top: 8px; transition: all 0.18s;
    box-shadow: var(--sh);
  }
  .btn-primary:hover { background: var(--ink2); transform: translateY(-1px); box-shadow: var(--sh-md); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .error-msg { color: var(--red); font-size: 13px; margin-top: 10px; text-align: center; }
  .success-msg { color: var(--teal); font-size: 13px; margin-top: 10px; text-align: center; }
  .network-banner {
    margin-top: 14px; background: var(--red-bg); border: 1px solid var(--red-bd);
    border-radius: var(--r); color: var(--red); padding: 14px; font-size: 12px; line-height: 1.9;
  }
  .network-banner strong { display: block; margin-bottom: 4px; font-weight: 700; }
  .network-banner code { background: rgba(192,57,43,0.1); padding: 1px 6px; border-radius: 3px; font-family: 'DM Mono', monospace; font-size: 11px; }

  /* SIDEBAR */
  .layout { display: flex; min-height: 100vh; }
  .sidebar {
    width: 252px; background: var(--white);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 20;
  }
  .sidebar-head {
    padding: 22px 20px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .sidebar-mark {
    width: 34px; height: 34px; background: var(--ink);
    border-radius: 9px; display: grid; place-items: center;
    font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600;
    color: var(--white); flex-shrink: 0;
  }
  .sidebar-title {
    font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600;
    letter-spacing: -0.4px; color: var(--ink);
  }
  .sidebar-title em { font-style: italic; color: var(--ink3); }

  .nav-section { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink4); padding: 16px 20px 6px; }
  .nav { flex: 1; padding: 6px 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--r2);
    cursor: pointer; color: var(--ink3);
    font-size: 14px; font-weight: 500; transition: all 0.15s;
  }
  .nav-item:hover { background: var(--bg); color: var(--ink); }
  .nav-item.active { background: var(--bg2); color: var(--ink); font-weight: 600; }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }

  .sidebar-foot { padding: 16px 20px 20px; border-top: 1px solid var(--border); }
  .wallet-card {
    background: var(--ink); border-radius: var(--r2);
    padding: 16px 18px; margin-bottom: 14px; overflow: hidden; position: relative;
  }
  .wallet-card::before {
    content: ''; position: absolute;
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(255,255,255,0.03); top: -40px; right: -30px;
  }
  .wallet-lbl { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.35); }
  .wallet-bal { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; color: #fff; margin-top: 4px; letter-spacing: -0.5px; }
  .wallet-hint { font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 2px; }

  .user-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .user-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--bg3); border: 1.5px solid var(--border2);
    display: grid; place-items: center; font-size: 13px; font-weight: 700; color: var(--ink2); flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 600; color: var(--ink2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .btn-logout {
    width: 100%; padding: 9px; background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r); color: var(--ink3);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.18s;
  }
  .btn-logout:hover { background: var(--red-bg); border-color: var(--red-bd); color: var(--red); }

  .main { margin-left: 252px; flex: 1; padding: 40px 48px; }

  /* PAGE HEADER */
  .page-header { margin-bottom: 32px; }
  .page-title { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 400; letter-spacing: -0.8px; }
  .page-sub { font-size: 14px; color: var(--ink3); margin-top: 4px; }

  /* STATS */
  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 22px 24px;
    box-shadow: var(--sh-sm); position: relative;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .stat-card:hover { box-shadow: var(--sh); transform: translateY(-1px); }
  .stat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--ink4); }
  .stat-value { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin-top: 8px; }
  .stat-pill {
    position: absolute; top: 20px; right: 20px;
    padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700;
  }
  .pill-teal  { background: var(--teal-bg); color: var(--teal); border: 1px solid var(--teal-bd); }
  .pill-red   { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-bd); }
  .pill-amber { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--amber-bd); }

  /* MARKET */
  .search-bar {
    width: 100%; background: var(--surface);
    border: 1.5px solid var(--border); border-radius: var(--r);
    color: var(--ink); font-family: 'DM Sans', sans-serif;
    font-size: 14px; padding: 11px 16px; outline: none;
    transition: all 0.18s; margin-bottom: 20px; box-shadow: var(--sh-sm);
  }
  .search-bar::placeholder { color: var(--ink4); }
  .search-bar:focus { border-color: var(--ink2); box-shadow: 0 0 0 3px rgba(26,23,20,0.06); }

  .stocks-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(190px,1fr)); gap: 14px; }
  .stock-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 20px;
    cursor: pointer; transition: all 0.2s; box-shadow: var(--sh-sm); position: relative; overflow: hidden;
  }
  .stock-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: var(--teal); transform: scaleX(0); transform-origin: left; transition: transform 0.25s;
  }
  .stock-card:hover { box-shadow: var(--sh-md); transform: translateY(-2px); border-color: var(--border2); }
  .stock-card:hover::after { transform: scaleX(1); }
  .stock-ticker { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink4); margin-bottom: 5px; font-family: 'DM Mono', monospace; }
  .stock-name { font-size: 15px; font-weight: 700; color: var(--ink); }
  .stock-price { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: var(--ink); margin: 10px 0 6px; letter-spacing: -0.5px; }
  .live-dot-wrap { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: var(--teal); }
  .live-dot { width: 6px; height: 6px; background: var(--teal2); border-radius: 50%; animation: pulse 1.6s ease-in-out infinite; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(26,23,20,0.3);
    display: grid; place-items: center; z-index: 100;
    backdrop-filter: blur(10px); animation: fadeIn 0.18s ease;
  }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  .modal {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--r3); padding: 40px; width: 420px;
    box-shadow: var(--sh-lg); position: relative;
    animation: modalIn 0.22s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px);} to{opacity:1;transform:scale(1) translateY(0);} }
  .modal-close {
    position: absolute; top: 18px; right: 18px;
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--bg2); border: 1px solid var(--border);
    color: var(--ink3); cursor: pointer; font-size: 16px;
    display: grid; place-items: center; transition: all 0.15s;
  }
  .modal-close:hover { background: var(--bg3); color: var(--ink); }
  .modal-badge {
    display: inline-block; background: var(--bg2); border: 1px solid var(--border2);
    color: var(--ink2); border-radius: 6px; padding: 4px 11px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
    margin-bottom: 12px; font-family: 'DM Mono', monospace;
  }
  .modal-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 400; letter-spacing: -0.5px; margin-bottom: 4px; }
  .modal-sub { font-size: 13px; color: var(--ink3); margin-bottom: 22px; }
  .modal-price-box {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r); padding: 14px 18px;
    display: flex; align-items: baseline; gap: 8px; margin-bottom: 20px;
  }
  .modal-price { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; color: var(--ink); letter-spacing: -1px; }
  .modal-per { font-size: 13px; color: var(--ink4); }
  .modal-total-row {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--bg); border-radius: var(--r);
    padding: 11px 14px; margin: 12px 0; font-size: 13px; color: var(--ink3);
  }
  .modal-total-val { font-size: 16px; font-weight: 700; color: var(--ink); }
  .modal-wallet-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--ink4); padding: 0 4px; margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 10px; }
  .btn-buy-m {
    flex: 1; padding: 13px; background: var(--teal); color: var(--white);
    border: none; border-radius: var(--r);
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px;
    cursor: pointer; transition: all 0.18s; box-shadow: 0 2px 10px rgba(0,122,110,0.2);
  }
  .btn-buy-m:hover { background: var(--teal2); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,122,110,0.28); }
  .btn-buy-m:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .btn-sell-m {
    flex: 1; padding: 13px; background: var(--white);
    border: 1.5px solid var(--red-bd); border-radius: var(--r);
    color: var(--red); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px;
    cursor: pointer; transition: all 0.18s;
  }
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
  .pf-item {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 20px 24px; margin-bottom: 10px; box-shadow: var(--sh-sm);
  }
  .pf-top { display: flex; align-items: center; justify-content: space-between; }
  .pf-name { font-size: 17px; font-weight: 700; color: var(--ink); letter-spacing: -0.2px; }
  .pf-qty { font-size: 12px; color: var(--ink4); margin-top: 3px; font-family: 'DM Mono', monospace; }
  .pf-right { display: flex; align-items: center; gap: 20px; }
  .pf-price { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: var(--ink); }
  .pf-pnl { font-size: 12px; font-weight: 700; margin-top: 2px; text-align: right; }
  .pnl-pos { color: var(--teal); }
  .pnl-neg { color: var(--red); }
  .btn-sell-mini {
    padding: 8px 16px; border-radius: var(--r); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; white-space: nowrap;
  }
  .btn-sell-mini.idle { background: var(--white); border: 1.5px solid var(--red-bd); color: var(--red); }
  .btn-sell-mini.idle:hover { background: var(--red-bg); }
  .btn-sell-mini.cancel { background: var(--bg2); border: 1px solid var(--border); color: var(--ink3); }
  .sell-panel { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .sell-panel input {
    width: 80px; background: var(--bg); border: 1.5px solid var(--border);
    border-radius: var(--r); color: var(--ink); font-family: 'DM Mono', monospace;
    font-size: 14px; padding: 8px 10px; outline: none; transition: border-color 0.18s;
  }
  .sell-panel input:focus { border-color: var(--ink2); }
  .sell-total { font-size: 13px; color: var(--ink3); }
  .sell-total strong { color: var(--teal); font-weight: 700; }
  .btn-confirm-sell {
    padding: 8px 20px; background: var(--red); border: none; border-radius: var(--r);
    color: var(--white); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px;
    cursor: pointer; transition: all 0.18s;
  }
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
  .chart-search input {
    flex: 1; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r);
    color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 14px;
    padding: 11px 16px; outline: none; transition: all 0.18s; box-shadow: var(--sh-sm);
  }
  .chart-search input::placeholder { color: var(--ink4); }
  .chart-search input:focus { border-color: var(--ink2); box-shadow: 0 0 0 3px rgba(26,23,20,0.05); }
  .chart-search input.narrow { flex: 0 0 100px; }
  .btn-load {
    padding: 11px 28px; background: var(--ink); color: var(--white);
    border: none; border-radius: var(--r);
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px;
    cursor: pointer; transition: all 0.18s; box-shadow: var(--sh);
  }
  .btn-load:hover { background: var(--ink2); transform: translateY(-1px); box-shadow: var(--sh-md); }
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

  .toast {
    position: fixed; bottom: 28px; right: 28px;
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 14px 20px;
    font-size: 14px; font-weight: 500; color: var(--ink);
    animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1);
    z-index: 300; max-width: 340px; box-shadow: var(--sh-lg);
    display: flex; align-items: center; gap: 10px;
  }
  .toast.success { border-left: 3px solid var(--teal); }
  .toast.error   { border-left: 3px solid var(--red); }
  .toast-icon { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .toast.success .toast-icon { background: var(--teal-bg); color: var(--teal); }
  .toast.error   .toast-icon { background: var(--red-bg); color: var(--red); }
  @keyframes toastIn { from{opacity:0;transform:translateX(20px);} to{opacity:1;transform:translateX(0);} }
`;

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
  const fmt = d => (d instanceof Date && !isNaN(d)) ? d.toLocaleDateString("en-IN", { month:"short", day:"numeric" }) : "";

  const onMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const idx = Math.max(0, Math.min(prices.length-1, Math.round(((mx-PL)/cW)*(prices.length-1))));
    setTooltip({ x: sx(idx), y: sy(prices[idx]), price: prices[idx], time: times[idx] });
  };

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:280 }} onMouseMove={onMove} onMouseLeave={() => setTooltip(null)}>
        <defs>
          <linearGradient id={`g${stockName}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {yT.map((v,i) => (
          <g key={i}>
            <line x1={PL} y1={sy(v)} x2={W-PR} y2={sy(v)} stroke="#e4dfd8" strokeWidth="1" />
            <text x={PL-8} y={sy(v)+4} textAnchor="end" fill="#b5afa6" fontSize="10" fontFamily="DM Mono">
              {v>=1000?`${(v/1000).toFixed(1)}k`:v.toFixed(0)}
            </text>
          </g>
        ))}
        <path d={area} fill={`url(#g${stockName})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {xI.map(i => <text key={i} x={sx(i)} y={H-10} textAnchor="middle" fill="#b5afa6" fontSize="10" fontFamily="DM Mono">{fmt(times[i])}</text>)}
        <circle cx={sx(0)} cy={sy(prices[0])} r="3.5" fill={color} stroke="white" strokeWidth="1.5" />
        <circle cx={sx(prices.length-1)} cy={sy(prices[prices.length-1])} r="5" fill={color} stroke="white" strokeWidth="2" />
        {tooltip && (
          <g>
            <line x1={tooltip.x} y1={PT} x2={tooltip.x} y2={PT+cH} stroke="rgba(26,23,20,0.1)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx={tooltip.x} cy={tooltip.y} r="5" fill={color} stroke="white" strokeWidth="2" />
            <rect x={Math.min(tooltip.x+12,W-145)} y={tooltip.y-42} width="133" height="48" rx="6" fill="white" stroke="#e4dfd8" strokeWidth="1" style={{filter:"drop-shadow(0 2px 8px rgba(26,23,20,0.1))"}} />
            <text x={Math.min(tooltip.x+20,W-137)} y={tooltip.y-22} fill="#1a1714" fontSize="13" fontFamily="Fraunces" fontWeight="600">₹{tooltip.price.toLocaleString()}</text>
            <text x={Math.min(tooltip.x+20,W-137)} y={tooltip.y-6}  fill="#b5afa6" fontSize="10" fontFamily="DM Mono">{fmt(tooltip.time)}</text>
          </g>
        )}
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
        <div className="auth-brand">
          <div className="auth-brand-mark">A</div>
          <div className="auth-brand-name">Apex<em>Trade</em></div>
        </div>
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
        <div className="modal-price-box">
          <div className="modal-price">₹{stock.price?.toLocaleString()}</div>
          <div className="modal-per">per share</div>
        </div>
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
      {stocks.length>0 && (
        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Listed Stocks</div><div className="stat-value">{stocks.length}</div><div className="stat-pill pill-amber">All active</div></div>
          <div className="stat-card"><div className="stat-label">Highest Price</div><div className="stat-value" style={{color:"var(--teal)"}}>₹{Math.max(...stocks.map(s=>s.price)).toLocaleString()}</div><div className="stat-pill pill-teal">↑ Top</div></div>
          <div className="stat-card"><div className="stat-label">Lowest Price</div><div className="stat-value" style={{color:"var(--red)"}}>₹{Math.min(...stocks.map(s=>s.price)).toLocaleString()}</div><div className="stat-pill pill-red">↓ Floor</div></div>
        </div>
      )}
      <input className="search-bar" placeholder="Search stocks…" value={search} onChange={e=>setSearch(e.target.value)} />
      {filtered.length===0
        ? <div className="empty-state"><div className="empty-icon">🏪</div><div className="empty-title">No stocks found</div></div>
        : <div className="stocks-grid">
            {filtered.map(s=>(
              <div className="stock-card" key={s.stock_id} onClick={()=>setSelected(s)}>
                <div className="stock-ticker">#{s.stock_id}</div>
                <div className="stock-name">{s.stock_name}</div>
                <div className="stock-price">₹{s.price?.toLocaleString()}</div>
                <div className="live-dot-wrap"><div className="live-dot"/>Live</div>
              </div>
            ))}
          </div>
      }
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
      {portfolio.length>0&&(
        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Holdings</div><div className="stat-value">{portfolio.length}</div><div className="stat-pill pill-amber">Stocks</div></div>
          <div className="stat-card"><div className="stat-label">Market Value</div><div className="stat-value" style={{fontSize:22}}>₹{tv.toFixed(0)}</div><div className="stat-pill pill-teal">Current</div></div>
          <div className="stat-card"><div className="stat-label">Total P&L</div><div className="stat-value" style={{color:pnl>=0?"var(--teal)":"var(--red)",fontSize:22}}>{pnl>=0?"+":""}₹{Math.abs(pnl).toFixed(0)}</div><div className={`stat-pill ${pnl>=0?"pill-teal":"pill-red"}`}>{pnl>=0?"+":""}{pnlPct}%</div></div>
        </div>
      )}
      {portfolio.length===0
        ? <div className="empty-state"><div className="empty-icon">💼</div><div className="empty-title">No holdings yet</div><div>Head to Market to make your first trade</div></div>
        : portfolio.map(p=>{
            const cur=prices[p.stock_name]||p.avg_buy_price;
            const gain=(cur-p.avg_buy_price)*p.quantity;
            const gp=((gain/(p.avg_buy_price*p.quantity))*100).toFixed(2);
            const open=sellTarget===p.stock_name;
            return (
              <div className="pf-item" key={p.portfolio_id}>
                <div className="pf-top">
                  <div><div className="pf-name">{p.stock_name}</div><div className="pf-qty">{p.quantity} shares · avg ₹{Number(p.avg_buy_price).toFixed(2)}</div></div>
                  <div className="pf-right">
                    <div><div className="pf-price">₹{cur.toLocaleString()}</div><div className={`pf-pnl ${gain>=0?"pnl-pos":"pnl-neg"}`}>{gain>=0?"+":""}₹{gain.toFixed(2)} ({gain>=0?"+":""}{gp}%)</div></div>
                    <button className={`btn-sell-mini ${open?"cancel":"idle"}`} onClick={()=>{setSellTarget(open?null:p.stock_name);setSellQty(1);setSellMsg(null);}}>{open?"Cancel":"Sell"}</button>
                  </div>
                </div>
                {open&&(
                  <div className="sell-panel">
                    <span style={{fontSize:12,color:"var(--ink3)",fontWeight:600}}>Qty:</span>
                    <input type="number" min="1" max={p.quantity} value={sellQty} onChange={e=>setSellQty(Number(e.target.value))}/>
                    <div className="sell-total">= <strong>₹{(cur*Math.min(sellQty,p.quantity)).toLocaleString()}</strong></div>
                    <button className="btn-confirm-sell" disabled={sellLoading} onClick={async()=>{
                      if(sellQty<1||sellQty>p.quantity){setSellMsg("Invalid quantity");return;}
                      setSellLoading(true);
                      const res=await api.patch("/users/sell-stock",{name:p.stock_name,quantity:sellQty});
                      setSellLoading(false);
                      if(res.statusCode>=200){setSellTarget(null);onSell(`Sold ${sellQty} shares of ${p.stock_name}`);reload();}
                      else setSellMsg(res.message||"Sell failed");
                    }}>{sellLoading?"…":"Confirm Sell"}</button>
                    {sellMsg&&<span style={{fontSize:12,color:"var(--red)"}}>{sellMsg}</span>}
                  </div>
                )}
              </div>
            );
          })
      }
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
      {trades.length===0
        ? <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No trades yet</div></div>
        : <div className="table-wrap">
            <table>
              <thead><tr><th>Stock</th><th>Type</th><th>Qty</th><th>Price</th><th>Total</th><th>Date</th></tr></thead>
              <tbody>
                {trades.map(t=>(
                  <tr key={t.trade_id}>
                    <td className="td-bold">{t.stock_name}</td>
                    <td><span className={`badge badge-${t.trade_type==="BUY"?"buy":"sell"}`}>{t.trade_type}</span></td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{t.quantity}</td>
                    <td>₹{Number(t.price).toLocaleString()}</td>
                    <td style={{fontWeight:700,color:t.trade_type==="BUY"?"var(--red)":"var(--teal)"}}>{t.trade_type==="SELL"?"+":"-"}₹{Number(t.total_amount).toLocaleString()}</td>
                    <td style={{color:"var(--ink4)",fontFamily:"'DM Mono',monospace",fontSize:12}}>{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
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
      {board.length===0
        ? <div className="empty-state"><div className="empty-icon">🏆</div><div className="empty-title">No data yet</div></div>
        : <div className="lb-list">
            {board.map((e,i)=>(
              <div className="lb-item" key={i}>
                <div className={`lb-rank ${rc(i)}`}>{rl(i)}</div>
                <div className="lb-avatar">{(e.username||"T")[0].toUpperCase()}</div>
                <div className="lb-name">{e.username||e.user||`Trader #${i+1}`}</div>
                <div className="lb-score">₹{Number(e.balance||e.total_value||0).toLocaleString()}</div>
              </div>
            ))}
          </div>
      }
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
      <div className="chart-search">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Stock name (e.g. AAPL)" onKeyDown={e=>e.key==="Enter"&&load()} />
        <input className="narrow" type="number" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="Points" />
        <button className="btn-load" onClick={load}>Load Chart</button>
      </div>
      {loading && <div className="loading-wrap"><div className="spinner"/></div>}
      {err && <div className="empty-state" style={{color:"var(--red)"}}>{err}</div>}
      {data && <div className="chart-area"><div className="chart-head"><div className="chart-name">{name}</div><div className="chart-pts">{data.length} data points</div></div><LineChart data={data} stockName={name}/></div>}
      {!data&&!loading&&!err && <div className="empty-state"><div className="empty-icon">📈</div><div className="empty-title">Enter a stock name above</div><div>Chart will appear here</div></div>}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("market");
  const [wallet, setWallet] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="success") => setToast({ msg, type });
  const fetchWallet = useCallback(() => {
    api.get("/users/get-wallet").then(r => {
      if(r.statusCode>=200){const b=r.data?.balance??r.data?.[0]?.balance??null;setWallet(Number(b));}
      else setWallet(0);
    });
  }, []);

  useEffect(() => { if(user) fetchWallet(); }, [user, fetchWallet]);
  const logout = async () => { await api.post("/users/logout",{}); clearToken(); setUser(null); setPage("market"); setWallet(null); };

  const nav = [
    {id:"market",icon:"◈",label:"Market"},
    {id:"portfolio",icon:"◉",label:"Portfolio"},
    {id:"history",icon:"◎",label:"History"},
    {id:"chart",icon:"◇",label:"Charts"},
    {id:"leaderboard",icon:"◆",label:"Leaderboard"},
  ];

  if (!user) return <><style>{css}</style><Auth onLogin={u=>setUser(u)}/></>;
  const initials = (user.username||user.email||"U")[0].toUpperCase();

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <div className="sidebar">
          <div className="sidebar-head">
            <div className="sidebar-mark">A</div>
            <div className="sidebar-title">Apex<em>Trade</em></div>
          </div>
          <div className="nav-section">Menu</div>
          <nav className="nav">
            {nav.map(n=>(
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="wallet-card">
              <div className="wallet-lbl">Balance</div>
              <div className="wallet-bal">{wallet!==null?`₹${Number(wallet).toLocaleString()}`:<div className="spinner" style={{borderTopColor:"rgba(255,255,255,0.5)"}}/>}</div>
              <div className="wallet-hint">Available to trade</div>
            </div>
            <div className="user-row">
              <div className="user-avatar">{initials}</div>
              <div className="user-name">{user.username||user.email}</div>
            </div>
            <button className="btn-logout" onClick={logout}>Sign Out</button>
          </div>
        </div>
        <main className="main">
          {page==="market"      && <MarketPage onTrade={(m,t)=>{showToast(m,t);fetchWallet();}} wallet={wallet}/>}
          {page==="portfolio"   && <PortfolioPage onSell={m=>{showToast(m,"success");fetchWallet();}}/>}
          {page==="history"     && <HistoryPage/>}
          {page==="chart"       && <ChartPage/>}
          {page==="leaderboard" && <LeaderboardPage/>}
        </main>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}