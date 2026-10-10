'use strict';
(() => {
  function applyTheme(value) {
    const theme = ['light', 'dark'].includes(value) ? value : 'dark';
    document.documentElement.dataset.theme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#161819' : '#fafaf8';
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('resume-theme'); } catch {}
  applyTheme(savedTheme);

  window.addEventListener('storage', event => {
    if (event.key === 'resume-theme' || event.key === null) applyTheme(event.newValue);
  });
})();
