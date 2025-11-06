/**
 * script.js
 * - Smooth scroll
 * - Scroll reveal (IntersectionObserver)
 * - Active nav detection
 * - Skill progress animation
 * - Theme toggle (persist)
 * - Profile upload preview (persist via localStorage)
 * - Form handling (EmailJS placeholders)
 * - Parallax micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Elements ----
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const currentYearEl = document.getElementById('currentYear');
  const scrollReveals = document.querySelectorAll('.scroll-reveal');
  const skillCards = document.querySelectorAll('.skill-card');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const fileInput = document.getElementById('fileInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const heroImage = document.getElementById('heroImage');
  const logoBtn = document.getElementById('logoBtn');
  const logoIS = document.getElementById('logoIS');

  // Set current year
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

  // --- Smooth scroll for nav links and same-page anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --- Active nav link highlight ---
  function highlightNav(){
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top - navbar.offsetHeight - 30;
      if (top <= 0) current = section.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active-nav', a.getAttribute('href').includes(current));
    });
  }
  highlightNav();
  window.addEventListener('scroll', highlightNav);

  // --- Scroll reveal for elements ---
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  scrollReveals.forEach(el => revealObserver.observe(el));

  // --- Skill progress animation ---
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const prog = entry.target.getAttribute('data-progress') || 0;
        const bar = entry.target.querySelector('.progress-bar');
        if (bar) bar.style.width = `${prog}%`;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  skillCards.forEach(card => skillObserver.observe(card));

  // --- Back to top visibility & behavior ---
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 360);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // --- Theme toggle with persistence ---
  const THEME_KEY = 'isabelle_theme_pref';
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') body.classList.add('dark-mode');

  function toggleTheme() {
    body.classList.toggle('dark-mode');
    localStorage.setItem(THEME_KEY, body.classList.contains('dark-mode') ? 'dark' : 'light');
  }
  themeToggle.addEventListener('click', toggleTheme);

  // --- Profile upload preview and persistence (hero image) ---
  const PROFILE_KEY = 'isabelle_profile_image';
  // restore saved image if exists
  const saved = localStorage.getItem(PROFILE_KEY);
  if (saved && heroImage) heroImage.src = saved;

  function handleFile(e){
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return alert('Por favor, selecione uma imagem.');
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      if (heroImage) heroImage.src = data;
      try { localStorage.setItem(PROFILE_KEY, data); } catch(_) {}
      // update small logo pill
      if (logoIS) logoIS.textContent = '';
      // create thumbnail letter fallback
    };
    reader.readAsDataURL(f);
  }
  if (uploadBtn) uploadBtn.addEventListener('click', () => fileInput.click());
  if (logoBtn) logoBtn.addEventListener('click', () => fileInput.click());
  if (fileInput) fileInput.addEventListener('change', handleFile);

  // --- Parallax micro-interactions (mouse + scroll) ---
  const heroCard = document.getElementById('heroCard');
  window.addEventListener('mousemove', (ev) => {
    if (!heroCard) return;
    const x = (ev.clientX - window.innerWidth / 2) / 80;
    const y = (ev.clientY - window.innerHeight / 2) / 160;
    heroCard.style.transform = `translate(${x}px, ${y}px)`;
  });
  // subtle scroll parallax for hero background transform
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const offset = Math.min(window.scrollY / 3, 60);
    hero.style.backgroundPosition = `center ${-offset}px`;
  });

  // --- Contact form handling (EmailJS instructions) ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // EmailJS placeholders - replace with your values
  const SERVICE_ID = 'SERVICE_ID';    // <--- substituir
  const TEMPLATE_ID = 'TEMPLATE_ID';  // <--- substituir
  const USER_ID = 'USER_ID';          // <--- substituir (public key)

  async function ensureEmailJs(){
    if (window.emailjs) return;
    const s = document.createElement('script');
    s.src = 'https://cdn.emailjs.com/sdk/3.2.0/email.min.js';
    document.head.appendChild(s);
    await new Promise(res => s.onload = res);
  }

  async function sendForm(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Por favor preencha todos os campos.';
      formStatus.style.color = 'tomato';
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      formStatus.textContent = 'E-mail inválido.';
      formStatus.style.color = 'tomato';
      return;
    }

    formStatus.textContent = 'Enviando...';
    formStatus.style.color = varColor('--muted') || '#555';

    // If placeholders still present, show instructions and stop
    if ([SERVICE_ID, TEMPLATE_ID, USER_ID].includes('SERVICE_ID') ||
        [SERVICE_ID, TEMPLATE_ID, USER_ID].includes('TEMPLATE_ID') ||
        [SERVICE_ID, TEMPLATE_ID, USER_ID].includes('USER_ID')) {
      formStatus.innerHTML = '⚠️ Formulário não está configurado. Substitua SERVICE_ID / TEMPLATE_ID / USER_ID no <code>script.js</code> para envio real via EmailJS.';
      formStatus.style.color = 'orange';
      return;
    }

    try {
      await ensureEmailJs();
      window.emailjs.init(USER_ID);
      const res = await window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, '#contact-form');
      formStatus.textContent = 'Mensagem enviada com sucesso — obrigado!';
      formStatus.style.color = 'limegreen';
      contactForm.reset();
    } catch (err) {
      console.error(err);
      formStatus.textContent = 'Erro ao enviar. Verifique as configurações do EmailJS.';
      formStatus.style.color = 'tomato';
    }
  }

  if (contactForm) contactForm.addEventListener('submit', sendForm);
  const resetFormBtn = document.getElementById('resetForm');
  if (resetFormBtn) resetFormBtn.addEventListener('click', () => {
    if (contactForm) contactForm.reset();
    if (formStatus) { formStatus.textContent = ''; }
  });

  // helper to get CSS var fallback
  function varColor(name){ try { return getComputedStyle(document.documentElement).getPropertyValue(name); } catch { return null; } }

  // --- Accessibility: close mobile nav by clicking links (if a mobile menu added) ---
  navLinks.forEach(l => l.addEventListener('click', () => {
    // If future mobile menu exists, close it here
  }));

  // --- Optional: lazy load heavy images (already using loading=lazy in markup) ---

  // End DOMContentLoaded
});
