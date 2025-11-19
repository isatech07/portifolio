/**
 * script.js - Portfólio Tânia Isabelle 2025
 * Funcionalidades:
 * - Menu mobile hamburguer (com animação bonita)
 * - Scroll suave
 * - Destaque no link ativo do menu
 * - Animações de entrada (scroll reveal)
 * - Theme toggle (dark/light) com persistência
 * - Back to top
 * - Formulário de contato funcional (simulado + pronto pra EmailJS)
 * - Ano automático no footer
 */

document.addEventListener("DOMContentLoaded", () => {
  // === Elementos principais ===
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const backToTop = document.createElement("button");
  backToTop.innerHTML = `<i class="fas fa-arrow-up"></i>`;
  backToTop.id = "back-to-top";
  backToTop.setAttribute("aria-label", "Voltar ao topo");
  document.body.appendChild(backToTop);

  const mobileMenuBtn = document.createElement("button");
  mobileMenuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
  mobileMenuBtn.id = "mobile-menu-btn";
  mobileMenuBtn.setAttribute("aria-label", "Abrir menu");
  navbar.querySelector(".nav-inner").appendChild(mobileMenuBtn);

  const mobileNav = document.querySelector("nav");
  const yearSpan = document.getElementById("year");
  const contactForm = document.getElementById("contact-form");

  // === Ano atual no footer ===
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // === Menu Mobile (hambúrguer) ===
  mobileMenuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
  });

  // Fechar menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      mobileMenuBtn.querySelector("i").classList.replace("fa-times", "fa-bars");
    });
  });

  // === Scroll suave para links internos ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.offsetTop - navbar.offsetHeight - 20;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    });
  });

  // === Destaque no link ativo do menu ===
  function highlightActiveLink() {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active-nav");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active-nav");
      }
    });
  }
  window.addEventListener("scroll", highlightActiveLink);
  highlightActiveLink();

  // === Scroll Reveal (animações ao entrar na tela) ===
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Aplicar animação inicial via CSS inline para garantir o efeito
  document.querySelectorAll(".hero-left > *, .about-text p, .highlight-card, .skill-item, .project-card, .contact-item, .contact-form").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(el);
  });

  // === Back to Top ===
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // === Theme Toggle (Dark / Light) com persistência ===
  const savedTheme = localStorage.getItem("tania-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.querySelector(".fa-sun").style.opacity = "0";
    themeToggle.querySelector(".fa-moon").style.opacity = "1";
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    localStorage.setItem("tania-theme", isDark ? "dark" : "light");

    // Animação suave dos ícones
    const moon = themeToggle.querySelector(".fa-moon");
    const sun = themeToggle.querySelector(".fa-sun");
    if (isDark) {
      moon.style.opacity = "1";
      sun.style.opacity = "0";
    } else {
      moon.style.opacity = "0";
      sun.style.opacity = "1";
    }
  });

  // === Formulário de Contato (simulado + pronto pra EmailJS) ===
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simulação de envio (você pode conectar ao EmailJS depois)
      const button = this.querySelector("button[type='submit']");
      const originalText = button.textContent;
      button.textContent = "Enviando...";
      button.disabled = true;

      setTimeout(() => {
        alert("Mensagem enviada com sucesso! Entrarei em contato em breve.");
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
      }, 1500);
    });
  }

  // === Pequenos melhoramentos de UX ===
  // Navbar fica mais transparente no topo
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.style.background = body.classList.contains("dark-mode")
        ? "rgba(15, 10, 31, 0.95)"
        : "rgba(255, 255, 255, 0.95)";
      navbar.style.backdropFilter = "blur(20px)";
    } else {
      navbar.style.background = body.classList.contains("dark-mode")
        ? "rgba(15, 10, 31, 0.8)"
        : "rgba(255, 255, 255, 0.85)";
    }
  });
});