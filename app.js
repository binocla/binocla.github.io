'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  const savedLanguage = storage.get('resume-language');
  let language = ['ru', 'en'].includes(requestedLanguage) ? requestedLanguage : ['ru', 'en'].includes(savedLanguage) ? savedLanguage : 'ru';
  let filter = 'all';
  let activeCase = null;
  let toastTimer;
  const text = (value) => typeof value === 'string' ? value : value[language];
  const t = (key) => translations[language][key];
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const tags = (items) => `<ul class="tech-tags">${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;

  function renderCases() {
    $('#impact-cards').innerHTML = resume.cases.map(item => `
      <button type="button" class="impact-card" data-case="${item.id}" aria-haspopup="dialog" aria-label="${escape(text(item.title))} — ${t('caseMore')}">
        <span class="case-heading"><span class="card-title">${escape(text(item.title))}</span><span class="card-source">${escape(text(item.source))}</span></span>
        <span class="case-result"><span class="metric">${item.metric}</span><span class="metric-label">${escape(text(item.label))}</span></span>
        <span class="card-arrow" aria-hidden="true">+</span>
        <span class="print-case">${escape(text(item.result))}</span>
      </button>`).join('');
  }

  function renderExperience(openRoles) {
    $('#experience-list').innerHTML = resume.jobs.map(job => `
      <article class="experience-item ${job.current ? 'current-job' : ''}" id="job-${job.id}">
        <div class="job-date"><span class="timeline-dot" aria-hidden="true"></span><span>${escape(text(job.period))}</span>${job.current ? `<span class="current-badge">${t('current')}</span>` : ''}</div>
        <div class="job-body"><div class="job-heading"><h3>${escape(text(job.company))}</h3><span class="job-domain">${escape(text(job.domain))}</span></div>
          <p class="job-role">${escape(text(job.role))}</p><p class="job-summary">${escape(text(job.summary))}</p>
          <details data-role="${job.id}" ${openRoles.has(job.id) ? 'open' : ''}><summary>${t('details')}<span aria-hidden="true">+</span></summary><div class="job-details"><ul class="job-bullets">${job.bullets.map(item => `<li>${escape(text(item))}</li>`).join('')}</ul>${tags(job.tech)}</div></details>
        </div>
      </article>`).join('');
  }

  function renderStack() {
    $('#stack-filters').setAttribute('aria-label', t('stackFilter'));
    const filters = [{ id: 'all', label: t('all') }, ...resume.stack];
    $('#stack-filters').innerHTML = filters.map(item => `<button type="button" data-filter="${item.id}" aria-pressed="${filter === item.id}">${escape(text(item.label))}</button>`).join('');
    $('#stack-content').innerHTML = resume.stack.map(item => `
      <article class="stack-card" ${filter !== 'all' && filter !== item.id ? 'hidden' : ''}><h3>${escape(text(item.title))}</h3><p>${escape(text(item.description))}</p>${tags(item.tech)}<p class="stack-context">${escape(text(item.context))}</p></article>`).join('');
  }

  function renderBackground() {
    $('#background-content').innerHTML = `<div class="education-list"><h3 class="mono background-label">${t('education')}</h3>${resume.education.map(item => `<article><span class="mono education-year">${item.year}</span><div><h4>${escape(text(item.name))}</h4><p>${escape(text(item.faculty))}</p><span class="education-status">${t('incomplete')}</span></div></article>`).join('')}</div><div class="spoken-languages"><h3 class="mono background-label">${t('langTitle')}</h3><p><span>${t('russian')}</span><span>${t('native')}</span></p><p><span>${t('english')}</span><span>${t('advanced')}</span></p></div>`;
  }

  function renderCase(id) {
    const item = resume.cases.find(item => item.id === id);
    if (!item) return;
    $('#case-content').innerHTML = `<p class="eyebrow">${escape(text(item.source))}</p><span class="dialog-metric">${item.metric}</span><h2 id="case-title">${escape(text(item.title))}</h2>${['intro', 'work', 'result'].map((key, index) => `<section><h3>${t(['context', 'work', 'result'][index])}</h3><p>${escape(text(item[key]))}</p></section>`).join('')}${tags(item.tech)}`;
  }

  function updateThemeLabel() {
    const next = document.documentElement.dataset.theme === 'dark' ? t('light') : t('dark');
    $('#theme-button').setAttribute('aria-label', next);
    $('#theme-button').title = next;
    $('meta[name="theme-color"]').content = document.documentElement.dataset.theme === 'dark' ? '#161819' : '#fafaf8';
  }

  function render() {
    const openRoles = new Set([...document.querySelectorAll('details[open]')].map(el => el.dataset.role));
    document.documentElement.lang = language;
    document.title = `${t('name')} · Java Team Lead`;
    $('meta[name="description"]').content = t('meta');
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = t('meta');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    document.querySelector('.wordmark').setAttribute('aria-label', t('name'));
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    renderCases(); renderExperience(openRoles); renderStack(); renderBackground(); updateThemeLabel();
    if (activeCase) renderCase(activeCase);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4200);
  }

  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
    language = button.dataset.language;
    storage.set('resume-language', language);
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(null, '', url);
    render();
  }));

  window.addEventListener('storage', event => {
    if (event.key === 'resume-theme' || event.key === null) updateThemeLabel();
  });
  $('#theme-button').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    storage.set('resume-theme', theme);
    updateThemeLabel();
  });

  $('#impact-cards').addEventListener('click', event => {
    const button = event.target.closest('[data-case]');
    if (!button) return;
    activeCase = button.dataset.case;
    renderCase(activeCase);
    $('#case-dialog').showModal();
    document.body.classList.add('dialog-open');
  });
  $('#close-dialog').addEventListener('click', () => $('#case-dialog').close());
  $('#case-dialog').addEventListener('click', event => {
    const bounds = $('#case-dialog').getBoundingClientRect();
    if (event.target === $('#case-dialog') && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) $('#case-dialog').close();
  });
  $('#case-dialog').addEventListener('close', () => { activeCase = null; document.body.classList.remove('dialog-open'); });
  $('#stack-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filter = button.dataset.filter;
    renderStack();
    document.querySelector(`[data-filter="${filter}"]`).focus({ preventScroll: true });
  });

  $('#share-button').addEventListener('click', async () => {
    const url = new URL('https://binocla.github.io/');
    url.searchParams.set('lang', language);
    try { await navigator.clipboard.writeText(url.href); showToast(t('copied')); }
    catch { showToast(t('copyFailed')); }
  });
  $('#print-button').addEventListener('click', () => { showToast(t('printHint')); window.print(); });
  let printOpenRoles = [];
  window.addEventListener('beforeprint', () => {
    printOpenRoles = [...document.querySelectorAll('details')].filter(el => !el.open);
    document.querySelectorAll('details').forEach(el => { el.open = true; });
  });
  window.addEventListener('afterprint', () => { printOpenRoles.forEach(el => { el.open = false; }); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('nav a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    ['impact', 'experience', 'stack', 'contact'].forEach(id => observer.observe(document.getElementById(id)));
  }
  render();
})();
