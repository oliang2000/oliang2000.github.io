(function () {
  const STORAGE_KEY = 'site-lang';

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }

  function applyLang(target) {
    document.documentElement.lang = target === 'zh' ? 'zh' : 'en';

    document.querySelectorAll('[data-zh]').forEach(function (el) {
      if (el.tagName === 'TITLE') {
        if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.textContent);
        el.textContent = target === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
        return;
      }
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
      el.innerHTML = target === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
    });

    document.querySelectorAll('[data-zh-title]').forEach(function (el) {
      if (!el.hasAttribute('data-en-title')) {
        el.setAttribute('data-en-title', el.getAttribute('title') || '');
      }
      el.setAttribute('title', target === 'zh' ? el.getAttribute('data-zh-title') : el.getAttribute('data-en-title'));
    });

    document.querySelectorAll('[data-zh-alt]').forEach(function (el) {
      if (!el.hasAttribute('data-en-alt')) {
        el.setAttribute('data-en-alt', el.getAttribute('alt') || '');
      }
      el.setAttribute('alt', target === 'zh' ? el.getAttribute('data-zh-alt') : el.getAttribute('data-en-alt'));
    });

    document.querySelectorAll('[data-zh-aria]').forEach(function (el) {
      if (!el.hasAttribute('data-en-aria')) {
        el.setAttribute('data-en-aria', el.getAttribute('aria-label') || '');
      }
      el.setAttribute('aria-label', target === 'zh' ? el.getAttribute('data-zh-aria') : el.getAttribute('data-en-aria'));
    });

    const enBtn = document.getElementById('lang-en');
    const zhBtn = document.getElementById('lang-zh');
    if (enBtn && zhBtn) {
      enBtn.classList.toggle('active', target === 'en');
      zhBtn.classList.toggle('active', target === 'zh');
    }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: target } }));
  }

  function injectToggle() {
    if (document.querySelector('.lang-toggle')) return;
    const toggle = document.createElement('div');
    toggle.className = 'lang-toggle';
    toggle.innerHTML =
      '<button id="lang-en" type="button" aria-label="English">EN</button>' +
      '<span class="lang-divider">|</span>' +
      '<button id="lang-zh" type="button" aria-label="中文">中</button>';
    document.body.appendChild(toggle);
    toggle.querySelector('#lang-en').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'en');
      applyLang('en');
    });
    toggle.querySelector('#lang-zh').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'zh');
      applyLang('zh');
    });
  }

  function init() {
    injectToggle();
    applyLang(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.siteLang = { get: getLang, apply: applyLang };
})();
