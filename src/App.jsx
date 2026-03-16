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
    try { return JSON.parse(text); }
    catch { return { statusCode: res.status, message: text }; }
  } catch (err) {
    return { statusCode: 0, message: "NETWORK_ERROR" };
  }
};

const api = {
  post:  (path, body)   => apiFetch(path, { method: "POST",  body: JSON.stringify(body) }),
  patch: (path, body)   => apiFetch(path, { method: "PATCH", body: JSON.stringify(body) }),
  get:   (path)         => apiFetch(path),
  getq:  (path, params) => apiFetch(path + "?" + new URLSearchParams(params).toString()),
};

// ── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #06080f;
    --bg2:      #0a0d18;
    --bg3:      #0e1220;
    --bg4:      #131829;
    --border:   rgba(255,255,255,0.07);
    --border2:  rgba(255,255,255,0.12);

    --gold:     #f0c040;
    --gold2:    #ffd976;
    --cyan:     #38d9f5;
    --cyan2:    #7eeeff;
    --rose:     #ff5c7a;
    --rose2:    #ff8fa3;
    --emerald:  #34d399;
    --violet:   #a78bfa;

    --text:     #eef2ff;
    --text2:    #94a3b8;
    --text3:    #475569;

    --r:        8px;
    --r2:       14px;
    --r3:       20px;
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  /* ── AUTH PAGE ── */
  .auth-wrap {
    min-height: 100vh;
    display: grid;
    place-items: center;
    position: relative;
    overflow: hidden;
    background: radial-gradient(ellipse 100% 80% at 70% 0%, rgba(167,139,250,0.12) 0%, transparent 55%),
                radial-gradient(ellipse 80% 60% at 10% 100%, rgba(56,217,245,0.08) 0%, transparent 50%),
                var(--bg);
  }
  .auth-orbs {
    position: absolute; inset: 0; pointer-events: none;
  }
  .auth-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: orbFloat 8s ease-in-out infinite;
  }
  .auth-orb-1 { width: 500px; height: 500px; background: rgba(167,139,250,0.06); top: -200px; right: -100px; animation-delay: 0s; }
  .auth-orb-2 { width: 400px; height: 400px; background: rgba(56,217,245,0.05); bottom: -150px; left: -100px; animation-delay: -4s; }
  .auth-orb-3 { width: 300px; height: 300px; background: rgba(240,192,64,0.04); top: 50%; left: 50%; animation-delay: -2s; }
  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -30px) scale(1.05); }
  }

  .auth-card {
    position: relative;
    width: 460px;
    padding: 48px 44px;
    background: rgba(10, 13, 24, 0.85);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: var(--r3);
    backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03),
      0 24px 80px rgba(0,0,0,0.6),
      0 0 100px rgba(167,139,250,0.06);
    animation: authIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes authIn {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .brand {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 6px;
  }
  .brand-icon {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, var(--gold), var(--violet));
    border-radius: 12px;
    display: grid; place-items: center;
    font-size: 20px;
    box-shadow: 0 4px 20px rgba(167,139,250,0.35);
  }
  .brand-name {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.8px;
    background: linear-gradient(135deg, var(--text) 40%, var(--text2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .brand-name em {
    font-style: normal;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .brand-sub { color: var(--text3); font-size: 13px; margin-bottom: 36px; font-weight: 400; }

  .auth-tabs {
    display: flex; gap: 4px;
    background: rgba(255,255,255,0.04);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 28px;
  }
  .auth-tab {
    flex: 1; padding: 9px;
    background: none; border: none;
    color: var(--text2); font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 600;
    border-radius: 7px; cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .auth-tab.active {
    background: rgba(255,255,255,0.09);
    color: var(--text);
    box-shadow: 0 1px 8px rgba(0,0,0,0.3);
  }

  .field { margin-bottom: 16px; }
  .field label {
    display: block; font-size: 12px; font-weight: 600;
    color: var(--text2); letter-spacing: 0.3px;
    text-transform: uppercase; margin-bottom: 7px;
  }
  .field input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: var(--r);
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 400;
    padding: 12px 14px;
    outline: none;
    transition: all 0.2s;
  }
  .field input::placeholder { color: var(--text3); }
  .field input:focus {
    border-color: rgba(167,139,250,0.5);
    background: rgba(167,139,250,0.04);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.08);
  }

  .btn-primary {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--violet) 0%, #818cf8 100%);
    border: none; border-radius: var(--r);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 700; font-size: 14px;
    letter-spacing: 0.5px;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(167,139,250,0.3);
    position: relative; overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(167,139,250,0.4); }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .error-msg { color: var(--rose2); font-size: 12px; margin-top: 10px; text-align: center; }
  .success-msg { color: var(--emerald); font-size: 12px; margin-top: 10px; text-align: center; }
  .network-banner {
    margin-top: 14px;
    background: rgba(255,92,122,0.08);
    border: 1px solid rgba(255,92,122,0.2);
    border-radius: var(--r);
    color: var(--rose2); padding: 14px; font-size: 12px; line-height: 1.9;
  }
  .network-banner strong { color: var(--rose); display: block; margin-bottom: 4px; font-weight: 700; }
  .network-banner code { background: rgba(255,92,122,0.12); padding: 1px 6px; border-radius: 4px; font-size: 11px; }

  /* ── LAYOUT ── */
  .layout { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 24px 16px;
    position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 20;
  }

  .sidebar-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 4px 8px 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }
  .sidebar-brand-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--gold), var(--violet));
    border-radius: 9px;
    display: grid; place-items: center; font-size: 16px;
    box-shadow: 0 2px 12px rgba(167,139,250,0.3);
    flex-shrink: 0;
  }
  .sidebar-brand-name {
    font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, var(--text) 40%, var(--text2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .sidebar-brand-name em {
    font-style: normal;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .nav { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .nav-item {
    display: flex; align-items: center; gap: 11px;
    padding: 11px 14px; border-radius: var(--r);
    cursor: pointer; color: var(--text2);
    font-size: 14px; font-weight: 500;
    transition: all 0.15s; position: relative;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text); }
  .nav-item.active {
    background: rgba(167,139,250,0.12);
    color: var(--violet);
    border-color: rgba(167,139,250,0.2);
    box-shadow: 0 2px 12px rgba(167,139,250,0.08);
  }
  .nav-icon { font-size: 17px; width: 22px; text-align: center; flex-shrink: 0; }
  .nav-label { font-weight: 600; }

  .sidebar-section-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--text3);
    padding: 16px 14px 6px;
  }

  .wallet-card {
    background: linear-gradient(135deg, rgba(240,192,64,0.1) 0%, rgba(167,139,250,0.08) 100%);
    border: 1px solid rgba(240,192,64,0.2);
    border-radius: var(--r2);
    padding: 16px;
    margin-bottom: 12px;
    position: relative; overflow: hidden;
  }
  .wallet-card::before {
    content: '◈';
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    font-size: 40px; opacity: 0.06; color: var(--gold);
  }
  .wallet-label { font-size: 11px; font-weight: 600; color: var(--text3); letter-spacing: 0.5px; text-transform: uppercase; }
  .wallet-balance {
    font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
    color: var(--gold2); margin-top: 4px;
  }
  .wallet-sub { font-size: 11px; color: var(--text3); margin-top: 2px; }

  .user-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; margin-bottom: 8px;
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, var(--violet), var(--cyan));
    display: grid; place-items: center;
    font-size: 13px; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 600; color: var(--text2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .btn-logout {
    width: 100%; padding: 10px;
    background: rgba(255,92,122,0.08);
    border: 1px solid rgba(255,92,122,0.15);
    border-radius: var(--r);
    color: var(--rose);
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-logout:hover { background: rgba(255,92,122,0.15); border-color: rgba(255,92,122,0.3); }

  .main { margin-left: 240px; flex: 1; padding: 36px 40px; max-width: calc(100vw - 240px); }

  /* ── PAGE HEADER ── */
  .page-header { margin-bottom: 32px; }
  .page-title {
    font-size: 30px; font-weight: 800; letter-spacing: -0.8px;
    background: linear-gradient(135deg, var(--text) 50%, var(--text2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .page-sub { color: var(--text3); font-size: 14px; margin-top: 4px; font-weight: 400; }

  /* ── STAT CARDS ── */
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }

  .stat-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--r2);
    padding: 22px 24px;
    position: relative; overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }
  .stat-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .stat-glow {
    position: absolute; top: -60px; right: -60px;
    width: 180px; height: 180px; border-radius: 50%;
    opacity: 0.15; pointer-events: none;
  }
  .stat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text3); }
  .stat-value { font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-top: 8px; }
  .stat-sub { font-size: 12px; color: var(--text3); margin-top: 4px; }
  .stat-icon {
    position: absolute; right: 20px; top: 20px;
    font-size: 28px; opacity: 0.15;
  }

  /* ── STOCK GRID ── */
  .stocks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
  .stock-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--r2);
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .stock-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(56,217,245,0.04), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .stock-card:hover {
    border-color: rgba(56,217,245,0.3);
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(56,217,245,0.06);
  }
  .stock-card:hover::before { opacity: 1; }
  .stock-ticker {
    font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--text3); margin-bottom: 6px;
  }
  .stock-name { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
  .stock-price {
    font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
    color: var(--cyan); margin: 10px 0 2px;
  }
  .stock-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
  }
  .chip-up { background: rgba(52,211,153,0.12); color: var(--emerald); }
  .chip-down { background: rgba(255,92,122,0.12); color: var(--rose); }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(6,8,15,0.8);
    display: grid; place-items: center;
    z-index: 100;
    backdrop-filter: blur(16px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: var(--r3);
    padding: 40px;
    width: 420px;
    animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal-close {
    position: absolute; top: 18px; right: 18px;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    color: var(--text2); cursor: pointer; font-size: 16px;
    display: grid; place-items: center; transition: all 0.2s;
  }
  .modal-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }
  .modal-stock-badge {
    display: inline-block;
    background: rgba(56,217,245,0.1);
    border: 1px solid rgba(56,217,245,0.2);
    color: var(--cyan); border-radius: 6px;
    padding: 4px 12px; font-size: 12px; font-weight: 700;
    letter-spacing: 0.5px; margin-bottom: 12px;
  }
  .modal-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
  .modal-sub { font-size: 13px; color: var(--text3); margin-bottom: 20px; }
  .modal-price-row {
    display: flex; align-items: baseline; gap: 8px; margin-bottom: 24px;
    padding: 14px 16px;
    background: rgba(56,217,245,0.06);
    border: 1px solid rgba(56,217,245,0.12);
    border-radius: var(--r);
  }
  .modal-price { font-size: 32px; font-weight: 800; color: var(--cyan); letter-spacing: -1px; }
  .modal-price-label { font-size: 13px; color: var(--text3); }
  .modal-total-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 14px;
    background: rgba(255,255,255,0.03);
    border-radius: var(--r);
    margin: 12px 0; font-size: 13px; color: var(--text2);
  }
  .modal-total-val { font-size: 16px; font-weight: 700; color: var(--text); }
  .modal-wallet-row {
    display: flex; justify-content: space-between;
    font-size: 12px; color: var(--text3);
    padding: 0 4px; margin-bottom: 20px;
  }
  .modal-actions { display: flex; gap: 10px; }
  .btn-buy {
    flex: 1; padding: 13px;
    background: linear-gradient(135deg, #34d399, #10b981);
    border: none; border-radius: var(--r);
    color: #000; font-family: 'Outfit', sans-serif;
    font-weight: 800; font-size: 13px; letter-spacing: 0.5px;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(52,211,153,0.25);
  }
  .btn-buy:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(52,211,153,0.35); }
  .btn-buy:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-sell {
    flex: 1; padding: 13px;
    background: rgba(255,92,122,0.1);
    border: 1px solid rgba(255,92,122,0.3);
    border-radius: var(--r);
    color: var(--rose); font-family: 'Outfit', sans-serif;
    font-weight: 800; font-size: 13px; letter-spacing: 0.5px;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-sell:hover { background: rgba(255,92,122,0.18); border-color: rgba(255,92,122,0.5); color: var(--rose2); }
  .btn-sell:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── TABLE ── */
  .table-wrap {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--r2);
    overflow: hidden;
  }
  table { width: 100%; border-collapse: collapse; }
  thead { background: rgba(255,255,255,0.03); }
  th {
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: var(--text3);
    padding: 14px 20px; text-align: left;
    border-bottom: 1px solid var(--border);
  }
  td { padding: 14px 20px; font-size: 14px; font-weight: 500; border-bottom: 1px solid var(--border); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.018); }
  .td-stock { font-weight: 700; letter-spacing: -0.2px; }

  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 20px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
  }
  .badge-buy  { background: rgba(52,211,153,0.12); color: var(--emerald); }
  .badge-sell { background: rgba(255,92,122,0.12); color: var(--rose); }

  /* ── PORTFOLIO ── */
  .portfolio-item {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--r2);
    padding: 20px 24px;
    margin-bottom: 10px;
    transition: border-color 0.2s;
  }
  .portfolio-item:hover { border-color: var(--border2); }
  .pf-top { display: flex; align-items: center; justify-content: space-between; }
  .pf-name { font-size: 17px; font-weight: 800; letter-spacing: -0.3px; }
  .pf-qty { font-size: 12px; color: var(--text3); margin-top: 3px; }
  .pf-right { display: flex; align-items: center; gap: 20px; }
  .pf-price { font-size: 20px; font-weight: 800; color: var(--cyan); }
  .pf-pnl { font-size: 13px; font-weight: 700; margin-top: 2px; text-align: right; }
  .pnl-pos { color: var(--emerald); }
  .pnl-neg { color: var(--rose); }
  .btn-sell-mini {
    padding: 9px 18px; border-radius: var(--r);
    font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; white-space: nowrap;
  }
  .btn-sell-mini.idle {
    background: rgba(255,92,122,0.08);
    border: 1px solid rgba(255,92,122,0.2);
    color: var(--rose);
  }
  .btn-sell-mini.idle:hover { background: rgba(255,92,122,0.15); border-color: rgba(255,92,122,0.35); }
  .btn-sell-mini.cancel {
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    color: var(--text2);
  }
  .sell-panel {
    margin-top: 16px; padding-top: 16px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .sell-panel input {
    width: 80px; background: rgba(255,255,255,0.04);
    border: 1px solid var(--border); border-radius: var(--r);
    color: var(--text); font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 600; padding: 8px 10px; outline: none;
    transition: border-color 0.2s;
  }
  .sell-panel input:focus { border-color: rgba(167,139,250,0.4); }
  .sell-total { font-size: 13px; color: var(--text3); }
  .sell-total span { color: var(--emerald); font-weight: 700; }
  .btn-confirm-sell {
    padding: 9px 20px; background: var(--rose);
    border: none; border-radius: var(--r);
    color: #fff; font-family: 'Outfit', sans-serif;
    font-weight: 800; font-size: 12px; cursor: pointer;
    transition: all 0.2s; letter-spacing: 0.3px;
  }
  .btn-confirm-sell:hover { background: var(--rose2); transform: translateY(-1px); }
  .btn-confirm-sell:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── LEADERBOARD ── */
  .lb-list { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--r2); overflow: hidden; }
  .lb-item {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 22px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .lb-item:last-child { border-bottom: none; }
  .lb-item:hover { background: rgba(255,255,255,0.02); }
  .lb-rank {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    display: grid; place-items: center;
    font-size: 14px; font-weight: 800; color: var(--text3);
    flex-shrink: 0;
  }
  .lb-rank.gold { background: rgba(240,192,64,0.12); border-color: rgba(240,192,64,0.3); color: var(--gold); }
  .lb-rank.silver { background: rgba(148,163,184,0.1); border-color: rgba(148,163,184,0.2); color: #94a3b8; }
  .lb-rank.bronze { background: rgba(205,127,50,0.1); border-color: rgba(205,127,50,0.2); color: #cd7f32; }
  .lb-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, var(--violet), var(--cyan));
    display: grid; place-items: center;
    font-size: 15px; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }
  .lb-name { flex: 1; font-size: 15px; font-weight: 600; }
  .lb-score { font-size: 16px; font-weight: 800; color: var(--gold2); }

  /* ── CHART PAGE ── */
  .search-row { display: flex; gap: 10px; margin-bottom: 24px; }
  .search-row input {
    flex: 1; background: var(--bg3);
    border: 1px solid var(--border); border-radius: var(--r);
    color: var(--text); font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500;
    padding: 11px 16px; outline: none;
    transition: all 0.2s;
  }
  .search-row input::placeholder { color: var(--text3); }
  .search-row input:focus { border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.03); }
  .search-row input.narrow { flex: 0 0 100px; }
  .btn-load {
    padding: 11px 28px;
    background: linear-gradient(135deg, var(--violet), #818cf8);
    border: none; border-radius: var(--r);
    color: #fff; font-family: 'Outfit', sans-serif;
    font-weight: 700; font-size: 13px;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 2px 12px rgba(167,139,250,0.25);
  }
  .btn-load:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(167,139,250,0.35); }
  .chart-area {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--r2);
    padding: 28px;
  }
  .chart-header {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 20px;
  }
  .chart-name { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; }
  .chart-pts { font-size: 12px; color: var(--text3); }

  /* ── LOADING & EMPTY ── */
  .spinner {
    width: 22px; height: 22px;
    border: 2px solid rgba(255,255,255,0.08);
    border-top-color: var(--violet);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-wrap {
    display: flex; align-items: center; justify-content: center;
    padding: 80px; gap: 14px; color: var(--text3); font-size: 13px;
  }
  .empty-state {
    text-align: center; padding: 80px 20px;
    color: var(--text3); font-size: 14px;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--r2);
  }
  .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }
  .empty-title { font-size: 16px; font-weight: 700; color: var(--text2); margin-bottom: 6px; }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 28px; right: 28px;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: var(--r2);
    padding: 16px 20px;
    font-size: 14px; font-weight: 500;
    animation: toastIn 0.35s cubic-bezier(0.16,1,0.3,1);
    z-index: 300;
    max-width: 340px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    display: flex; align-items: center; gap: 10px;
  }
  .toast.success { border-left: 3px solid var(--emerald); }
  .toast.error   { border-left: 3px solid var(--rose); }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(24px) scale(0.96); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
`;

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return (
    <div className={`toast ${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      <span>{msg}</span>
    </div>
  );
}

// ── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ prices, color = "#38d9f5" }) {
  if (!prices || prices.length < 2) return null;
  const W = 80, H = 32;
  const min = Math.min(...prices), max = Math.max(...prices), r = max - min || 1;
  const sx = (i) => (i / (prices.length - 1)) * W;
  const sy = (v) => H - ((v - min) / r) * H;
  const pts = prices.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: 80, height: 32 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── LineChart ────────────────────────────────────────────────────────────────
function LineChart({ data, stockName }) {
  const [tooltip, setTooltip] = useState(null);
  if (!data || data.length < 2)
    return <div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">Not enough data</div></div>;

  const W = 760, H = 280, PL = 64, PR = 24, PT = 20, PB = 44;
  const chartW = W - PL - PR, chartH = H - PT - PB;
  const prices = data.map((d) => Number(d.price));
  const times  = data.map((d) => new Date(d.created_at || d.updated_at || Date.now()));
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const range = maxP - minP || 1;
  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? "#34d399" : "#ff5c7a";

  const sx = (i) => PL + (i / (prices.length - 1)) * chartW;
  const sy = (v) => PT + chartH - ((v - minP) / range) * chartH;

  const linePts = prices.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
  const areaPath = `M${sx(0)},${PT + chartH} ` + prices.map((v, i) => `L${sx(i)},${sy(v)}`).join(" ") + ` L${sx(prices.length - 1)},${PT + chartH} Z`;
  const yTicks = Array.from({ length: 5 }, (_, i) => minP + (range / 4) * i);
  const xIdxs = [0, Math.floor(prices.length * 0.25), Math.floor(prices.length * 0.5), Math.floor(prices.length * 0.75), prices.length - 1];
  const fmtTime = (d) => (d instanceof Date && !isNaN(d)) ? d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "";

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const idx = Math.max(0, Math.min(prices.length - 1, Math.round(((mx - PL) / chartW) * (prices.length - 1))));
    setTooltip({ idx, x: sx(idx), y: sy(prices[idx]), price: prices[idx], time: times[idx] });
  };

  const changeAmt = prices[prices.length-1] - prices[0];
  const changePct = ((changeAmt / prices[0]) * 100).toFixed(2);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 280 }}
        onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}>
        <defs>
          <linearGradient id={`g-${stockName}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={PL} y1={sy(v)} x2={W - PR} y2={sy(v)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={PL - 8} y={sy(v) + 4} textAnchor="end" fill="#475569" fontSize="10" fontFamily="JetBrains Mono">
              {v >= 1000 ? `${(v/1000).toFixed(1)}k` : v.toFixed(0)}
            </text>
          </g>
        ))}
        <path d={areaPath} fill={`url(#g-${stockName})`} />
        <polyline points={linePts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {xIdxs.map((idx) => (
          <text key={idx} x={sx(idx)} y={H - 10} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="JetBrains Mono">
            {fmtTime(times[idx])}
          </text>
        ))}
        <circle cx={sx(0)} cy={sy(prices[0])} r="3.5" fill={color} />
        <circle cx={sx(prices.length-1)} cy={sy(prices[prices.length-1])} r="5" fill={color} stroke="#0e1220" strokeWidth="2.5" />
        {tooltip && (
          <g>
            <line x1={tooltip.x} y1={PT} x2={tooltip.x} y2={PT+chartH} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx={tooltip.x} cy={tooltip.y} r="5" fill={color} stroke="#0e1220" strokeWidth="2.5" />
            <rect x={Math.min(tooltip.x + 12, W - 140)} y={tooltip.y - 40} width="130" height="48" rx="8" fill="#131829" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <text x={Math.min(tooltip.x + 20, W - 132)} y={tooltip.y - 20} fill={color} fontSize="13" fontFamily="Outfit" fontWeight="700">
              ₹{tooltip.price.toLocaleString()}
            </text>
            <text x={Math.min(tooltip.x + 20, W - 132)} y={tooltip.y - 4} fill="#475569" fontSize="10" fontFamily="JetBrains Mono">
              {fmtTime(tooltip.time)}
            </text>
          </g>
        )}
      </svg>
      <div style={{ display: "flex", gap: 28, marginTop: 4, fontSize: 13, color: "var(--text3)" }}>
        <span>Open <strong style={{ color: "var(--text)", fontWeight: 700 }}>₹{prices[0].toLocaleString()}</strong></span>
        <span>Close <strong style={{ color, fontWeight: 700 }}>₹{prices[prices.length-1].toLocaleString()}</strong></span>
        <span>High <strong style={{ color: "var(--emerald)", fontWeight: 700 }}>₹{maxP.toLocaleString()}</strong></span>
        <span>Low <strong style={{ color: "var(--rose)", fontWeight: 700 }}>₹{minP.toLocaleString()}</strong></span>
        <span>Change
          <strong style={{ color, fontWeight: 700 }}> {isUp ? "+" : ""}{changeAmt.toFixed(2)} ({isUp ? "+" : ""}{changePct}%)</strong>
        </span>
      </div>
    </div>
  );
}

// ── Auth ─────────────────────────────────────────────────────────────────────
function Auth({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handle = async () => {
    setLoading(true); setMsg(null);
    const res = await api.post(tab === "login" ? "/users/login" : "/users/register",
      tab === "login" ? { email: form.email, password: form.password } : form);
    setLoading(false);
    if (res.message === "NETWORK_ERROR" || res.statusCode === 0) { setMsg({ type: "network" }); return; }
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (tab === "login") onLogin(res.data.user);
      else { setMsg({ type: "success", text: "Account created! Please sign in." }); setTab("login"); }
    } else { setMsg({ type: "error", text: res.message || "Something went wrong" }); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-orbs">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">▲</div>
          <div className="brand-name">APEX<em>TRADE</em></div>
        </div>
        <div className="brand-sub">Simulated real-time stock trading platform</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Create Account</button>
        </div>
        {tab === "register" && (
          <div className="field">
            <label>Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="johndoe" />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handle()} />
        </div>
        <button className="btn-primary" onClick={handle} disabled={loading}>
          {loading ? "..." : tab === "login" ? "Sign In →" : "Create Account →"}
        </button>
        {msg?.type === "network" && (
          <div className="network-banner">
            <strong>⚠ Cannot reach backend</strong>
            Ensure backend is running on port <code>3000</code> with CORS configured.<br />
            <code>app.use(cors({"{ origin: 'http://localhost:5173', credentials: true }"}))  </code>
          </div>
        )}
        {msg?.type === "error" && <div className="error-msg">{msg.text}</div>}
        {msg?.type === "success" && <div className="success-msg">{msg.text}</div>}
      </div>
    </div>
  );
}

// ── Trade Modal ───────────────────────────────────────────────────────────────
function TradeModal({ stock, onClose, onDone, wallet }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const trade = async (type) => {
    setLoading(true); setMsg(null);
    const endpoint = type === "BUY" ? "/users/buy-stock" : "/users/sell-stock";
    const res = await api[type === "BUY" ? "post" : "patch"](endpoint, { name: stock.stock_name, quantity: Number(qty) });
    setLoading(false);
    if (res.statusCode >= 200 && res.statusCode < 300) { onDone(type === "BUY" ? "✓ Purchase successful" : "✓ Shares sold", "success"); onClose(); }
    else setMsg(res.message || "Trade failed");
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-stock-badge">{stock.stock_name}</div>
        <div className="modal-title">Place Order</div>
        <div className="modal-sub">Market order · Instant execution</div>
        <div className="modal-price-row">
          <div className="modal-price">₹{stock.price?.toLocaleString()}</div>
          <div className="modal-price-label">per share</div>
        </div>
        <div className="field">
          <label>Quantity</label>
          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
        <div className="modal-total-row">
          <span>Order Total</span>
          <span className="modal-total-val">₹{(stock.price * qty).toFixed(2)}</span>
        </div>
        <div className="modal-wallet-row">
          <span>Available balance</span>
          <span>₹{wallet?.toLocaleString() ?? "—"}</span>
        </div>
        {msg && <div className="error-msg" style={{ marginBottom: 12 }}>{msg}</div>}
        <div className="modal-actions">
          <button className="btn-buy" disabled={loading} onClick={() => trade("BUY")}>
            {loading ? "..." : "↑ Buy"}
          </button>
          <button className="btn-sell" disabled={loading} onClick={() => trade("SELL")}>
            {loading ? "..." : "↓ Sell"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Market Page ───────────────────────────────────────────────────────────────
function MarketPage({ onTrade, wallet }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/stocks/get-all").then((r) => { setStocks(r.data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner" /><span>Loading market data…</span></div>;

  const filtered = stocks.filter(s => s.stock_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-header">
        <div className="page-title">Live Market</div>
        <div className="page-sub">Click any stock to place an order</div>
      </div>
      {stocks.length > 0 && (
        <div className="stats-row">
          {[
            { label: "Listed Stocks", value: stocks.length, icon: "◈", color: "var(--violet)", glow: "rgba(167,139,250,0.4)" },
            { label: "Highest Price", value: `₹${Math.max(...stocks.map(s => s.price)).toLocaleString()}`, icon: "↑", color: "var(--emerald)", glow: "rgba(52,211,153,0.4)", cls: "green" },
            { label: "Lowest Price", value: `₹${Math.min(...stocks.map(s => s.price)).toLocaleString()}`, icon: "↓", color: "var(--rose)", glow: "rgba(255,92,122,0.4)", cls: "red" },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-glow" style={{ background: s.glow }} />
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginBottom: 18 }}>
        <input
          style={{
            width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
            borderRadius: "var(--r)", color: "var(--text)", fontFamily: "Outfit, sans-serif",
            fontSize: 14, padding: "11px 16px", outline: "none", transition: "border-color 0.2s"
          }}
          placeholder="🔍  Search stocks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🏪</div><div className="empty-title">No stocks found</div></div>
      ) : (
        <div className="stocks-grid">
          {filtered.map((s) => (
            <div className="stock-card" key={s.stock_id} onClick={() => setSelected(s)}>
              <div className="stock-ticker">#{s.stock_id}</div>
              <div className="stock-name">{s.stock_name}</div>
              <div className="stock-price">₹{s.price?.toLocaleString()}</div>
              <div className="stock-chip chip-up">↑ LIVE</div>
            </div>
          ))}
        </div>
      )}
      {selected && <TradeModal stock={selected} onClose={() => setSelected(null)} onDone={onTrade} wallet={wallet} />}
    </>
  );
}

// ── Portfolio Page ────────────────────────────────────────────────────────────
function PortfolioPage({ onSell }) {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [sellTarget, setSellTarget] = useState(null);
  const [sellQty, setSellQty] = useState(1);
  const [sellLoading, setSellLoading] = useState(false);
  const [sellMsg, setSellMsg] = useState(null);

  const reload = async () => {
    const r = await api.get("/users/get-all-stocks");
    if (r.statusCode >= 200) setPortfolio(r.data || []);
  };

  useEffect(() => {
    api.get("/users/get-all-stocks").then((r) => { if (r.statusCode >= 200) setPortfolio(r.data || []); setLoading(false); });
    api.get("/stocks/get-all").then((r) => { const m = {}; (r.data || []).forEach((s) => (m[s.stock_name] = s.price)); setPrices(m); });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner" /><span>Loading portfolio…</span></div>;

  const totalValue = portfolio.reduce((a, p) => a + (prices[p.stock_name] || 0) * p.quantity, 0);
  const totalCost  = portfolio.reduce((a, p) => a + p.avg_buy_price * p.quantity, 0);
  const pnl = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? ((pnl / totalCost) * 100).toFixed(2) : "0.00";

  return (
    <>
      <div className="page-header">
        <div className="page-title">My Portfolio</div>
        <div className="page-sub">Your current holdings & performance</div>
      </div>
      {portfolio.length > 0 && (
        <div className="stats-row">
          {[
            { label: "Holdings", value: portfolio.length, icon: "◉", color: "var(--cyan)", glow: "rgba(56,217,245,0.3)" },
            { label: "Market Value", value: `₹${totalValue.toFixed(0)}`, icon: "₹", color: "var(--emerald)", glow: "rgba(52,211,153,0.3)" },
            { label: "Total P&L", value: `${pnl >= 0 ? "+" : ""}₹${pnl.toFixed(0)}`, sub: `${pnl >= 0 ? "+" : ""}${pnlPct}%`, icon: pnl >= 0 ? "↑" : "↓", color: pnl >= 0 ? "var(--emerald)" : "var(--rose)", glow: pnl >= 0 ? "rgba(52,211,153,0.3)" : "rgba(255,92,122,0.3)" },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-glow" style={{ background: s.glow }} />
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: 24 }}>{s.value}</div>
              {s.sub && <div className="stat-sub" style={{ color: s.color }}>{s.sub}</div>}
            </div>
          ))}
        </div>
      )}
      {portfolio.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">💼</div><div className="empty-title">No holdings yet</div><div>Head to the Market to make your first trade</div></div>
      ) : (
        portfolio.map((p) => {
          const cur = prices[p.stock_name] || p.avg_buy_price;
          const gain = (cur - p.avg_buy_price) * p.quantity;
          const gainPct = ((gain / (p.avg_buy_price * p.quantity)) * 100).toFixed(2);
          const isOpen = sellTarget === p.stock_name;
          return (
            <div className="portfolio-item" key={p.portfolio_id}>
              <div className="pf-top">
                <div>
                  <div className="pf-name">{p.stock_name}</div>
                  <div className="pf-qty">{p.quantity} shares · Avg ₹{Number(p.avg_buy_price).toFixed(2)}</div>
                </div>
                <div className="pf-right">
                  <div>
                    <div className="pf-price">₹{cur.toLocaleString()}</div>
                    <div className={`pf-pnl ${gain >= 0 ? "pnl-pos" : "pnl-neg"}`}>
                      {gain >= 0 ? "+" : ""}₹{gain.toFixed(2)} ({gain >= 0 ? "+" : ""}{gainPct}%)
                    </div>
                  </div>
                  <button className={`btn-sell-mini ${isOpen ? "cancel" : "idle"}`}
                    onClick={() => { setSellTarget(isOpen ? null : p.stock_name); setSellQty(1); setSellMsg(null); }}>
                    {isOpen ? "Cancel" : "Sell →"}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="sell-panel">
                  <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>Sell qty:</span>
                  <input type="number" min="1" max={p.quantity} value={sellQty} onChange={(e) => setSellQty(Number(e.target.value))} />
                  <div className="sell-total">= <span>₹{(cur * Math.min(sellQty, p.quantity)).toLocaleString()}</span></div>
                  <button className="btn-confirm-sell" disabled={sellLoading}
                    onClick={async () => {
                      if (sellQty < 1 || sellQty > p.quantity) { setSellMsg("Invalid quantity"); return; }
                      setSellLoading(true);
                      const res = await api.patch("/users/sell-stock", { name: p.stock_name, quantity: sellQty });
                      setSellLoading(false);
                      if (res.statusCode >= 200) { setSellTarget(null); onSell(`✓ Sold ${sellQty} shares of ${p.stock_name}`); reload(); }
                      else setSellMsg(res.message || "Sell failed");
                    }}>
                    {sellLoading ? "…" : "Confirm Sell"}
                  </button>
                  {sellMsg && <span style={{ fontSize: 12, color: "var(--rose)" }}>{sellMsg}</span>}
                </div>
              )}
            </div>
          );
        })
      )}
    </>
  );
}

// ── History Page ──────────────────────────────────────────────────────────────
function HistoryPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/get-all-trans").then((r) => { if (r.statusCode >= 200) setTrades(r.data?.rows || []); setLoading(false); });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner" /><span>Loading history…</span></div>;

  return (
    <>
      <div className="page-header">
        <div className="page-title">Trade History</div>
        <div className="page-sub">All executed orders</div>
      </div>
      {trades.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No trades yet</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stock</th><th>Type</th><th>Qty</th><th>Price</th><th>Total</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.trade_id}>
                  <td className="td-stock">{t.stock_name}</td>
                  <td><span className={`badge badge-${t.trade_type === "BUY" ? "buy" : "sell"}`}>{t.trade_type === "BUY" ? "↑ " : "↓ "}{t.trade_type}</span></td>
                  <td style={{ color: "var(--text2)" }}>{t.quantity}</td>
                  <td>₹{Number(t.price).toLocaleString()}</td>
                  <td style={{ color: t.trade_type === "BUY" ? "var(--rose)" : "var(--emerald)", fontWeight: 700 }}>
                    {t.trade_type === "SELL" ? "+" : "-"}₹{Number(t.total_amount).toLocaleString()}
                  </td>
                  <td style={{ color: "var(--text3)", fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── Leaderboard Page ──────────────────────────────────────────────────────────
function LeaderboardPage() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.patch("/users/leaderboard", {}).then((r) => { if (r.statusCode >= 200) setBoard(r.data?.leaderboard || []); setLoading(false); });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner" /><span>Loading leaderboard…</span></div>;

  const rankClass = (i) => i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
  const rankLabel = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1;

  return (
    <>
      <div className="page-header">
        <div className="page-title">Leaderboard</div>
        <div className="page-sub">Top traders ranked by balance</div>
      </div>
      {board.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🏆</div><div className="empty-title">No data yet</div></div>
      ) : (
        <div className="lb-list">
          {board.map((entry, i) => (
            <div className="lb-item" key={i}>
              <div className={`lb-rank ${rankClass(i)}`}>{rankLabel(i)}</div>
              <div className="lb-avatar">{(entry.username || "T")[0].toUpperCase()}</div>
              <div className="lb-name">{entry.username || entry.user || `Trader #${i + 1}`}</div>
              <div className="lb-score">₹{Number(entry.balance || entry.total_value || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Chart Page ────────────────────────────────────────────────────────────────
function ChartPage() {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const load = async () => {
    if (!name) return;
    setLoading(true); setErr(null);
    const res = await api.getq("/stocks/get-graph", { name, duration: Number(duration) });
    setLoading(false);
    if (res.statusCode >= 200) setData(res.data);
    else setErr(res.message);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Price Charts</div>
        <div className="page-sub">Historical price data for any stock</div>
      </div>
      <div className="search-row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Stock name (e.g. AAPL)" onKeyDown={(e) => e.key === "Enter" && load()} />
        <input className="narrow" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Points" />
        <button className="btn-load" onClick={load}>Load Chart</button>
      </div>
      {loading && <div className="loading-wrap"><div className="spinner" /></div>}
      {err && <div className="empty-state" style={{ color: "var(--rose)" }}>{err}</div>}
      {data && (
        <div className="chart-area">
          <div className="chart-header">
            <div className="chart-name">{name}</div>
            <div className="chart-pts">{data.length} data points</div>
          </div>
          <LineChart data={data} stockName={name} />
        </div>
      )}
      {!data && !loading && !err && (
        <div className="empty-state"><div className="empty-icon">📈</div><div className="empty-title">Enter a stock name to view its chart</div></div>
      )}
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("market");
  const [wallet, setWallet] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchWallet = useCallback(() => {
    api.get("/users/get-wallet").then((r) => {
      if (r.statusCode >= 200) {
        const bal = r.data?.balance ?? r.data?.[0]?.balance ?? null;
        setWallet(Number(bal));
      } else setWallet(0);
    });
  }, []);

  useEffect(() => { if (user) fetchWallet(); }, [user, fetchWallet]);

  const logout = async () => {
    await api.post("/users/logout", {}); clearToken(); setUser(null); setPage("market"); setWallet(null);
  };

  const navItems = [
    { id: "market",      icon: "◈", label: "Market" },
    { id: "portfolio",   icon: "◉", label: "Portfolio" },
    { id: "history",     icon: "◎", label: "History" },
    { id: "chart",       icon: "◇", label: "Charts" },
    { id: "leaderboard", icon: "◆", label: "Leaderboard" },
  ];

  if (!user) return <><style>{css}</style><Auth onLogin={(u) => setUser(u)} /></>;

  const initials = (user.username || user.email || "U")[0].toUpperCase();

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <div className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">▲</div>
            <div className="sidebar-brand-name">APEX<em>TRADE</em></div>
          </div>
          <div className="sidebar-section-label">Navigation</div>
          <nav className="nav">
            {navItems.map((n) => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
              </div>
            ))}
          </nav>
          <div style={{ flex: 1 }} />
          <div className="wallet-card">
            <div className="wallet-label">Wallet Balance</div>
            <div className="wallet-balance">
              {wallet !== null ? `₹${Number(wallet).toLocaleString()}` : <div className="spinner" />}
            </div>
            <div className="wallet-sub">Available to trade</div>
          </div>
          <div className="user-row">
            <div className="user-avatar">{initials}</div>
            <div className="user-name">{user.username || user.email}</div>
          </div>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
        <main className="main">
          {page === "market"      && <MarketPage onTrade={(m, t) => { showToast(m, t); fetchWallet(); }} wallet={wallet} />}
          {page === "portfolio"   && <PortfolioPage onSell={(m) => { showToast(m, "success"); fetchWallet(); }} />}
          {page === "history"     && <HistoryPage />}
          {page === "chart"       && <ChartPage />}
          {page === "leaderboard" && <LeaderboardPage />}
        </main>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}