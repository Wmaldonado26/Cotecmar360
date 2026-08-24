import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

(function applyPannellumSanitizePatch() {
  try {
    const sanitizeURL = function (url) {
      if (url === null || url === undefined) return "";
      try {
        return String(url).trim();
      } catch (e) {
        return "";
      }
    };
    const sanitizeURLForCss = function (url) {
      const safe = sanitizeURL(url);
      return safe ? 'url("' + safe + '")' : "";
    };
    const tryPatch = () => {
      try {
        const p = window.pannellum;
        if (!p) return false;
        if (typeof p.sanitizeURL !== "function") p.sanitizeURL = sanitizeURL;
        if (typeof p.sanitizeURLForCss !== "function") p.sanitizeURLForCss = sanitizeURLForCss;
        if (p._sanitizePatched) return true;
        p._sanitizePatched = true;
        return true;
      } catch (e) {
        return false;
      }
    };
    let attempts = 0;
    const interval = setInterval(() => {
      tryPatch();
      attempts++;
      if ((window.pannellum && window.pannellum._sanitizePatched) || attempts > 50) {
        clearInterval(interval);
      }
    }, 100);
    window.addEventListener('load', tryPatch);
  } catch (e) {}
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

reportWebVitals();
