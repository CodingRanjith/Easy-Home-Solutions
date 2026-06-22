/**
 * Easy Home Solutions — Main JavaScript
 * SEO helpers, performance, validation, filters, lightbox, counters
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Navbar Scroll Effect ---- */
  const navbar = document.querySelector('.navbar-ehs');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else if (!navbar.classList.contains('inner-page')) {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ---- Mobile Menu ---- */
  const toggler = document.querySelector('.navbar-toggler-ehs');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');

  if (toggler && mobileMenu) {
    toggler.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggler.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggler.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('data-page') === currentPage);
  });

  /* ---- Back to Top ---- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---- Performance: Lazy images + decoding ---- */
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
    if (!img.hasAttribute('loading') && !img.closest('.hero')) {
      img.loading = 'lazy';
    }
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
    }
  });

  /* ---- Project Filter ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterBtns.length && projectItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.getAttribute('data-filter');

        projectItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          const show = filter === 'all' || category === filter;
          item.hidden = !show;
          if (show && !prefersReducedMotion) {
            item.classList.remove('filter-animate');
            void item.offsetWidth;
            item.classList.add('filter-animate');
          }
        });
      });
    });

    filterBtns.forEach((btn, i) => {
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      btn.setAttribute('role', 'button');
    });
  }

  /* ---- Lightbox (Projects + Gallery) ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxTriggers = Array.from(document.querySelectorAll('[data-lightbox]'));
  let lightboxIndex = 0;

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg || !lightboxTriggers.length) return;
    lightboxIndex = index;
    const trigger = lightboxTriggers[lightboxIndex];
    const src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
    const caption = trigger.getAttribute('data-caption') || trigger.querySelector('img')?.alt || '';
    if (!src) return;

    lightboxImg.src = src;
    lightboxImg.alt = caption;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, prefersReducedMotion ? 0 : 350);
  };

  const stepLightbox = (dir) => {
    if (!lightboxTriggers.length) return;
    lightboxIndex = (lightboxIndex + dir + lightboxTriggers.length) % lightboxTriggers.length;
    openLightbox(lightboxIndex);
  };

  if (lightbox && lightboxImg && lightboxTriggers.length) {
    lightboxTriggers.forEach((trigger, index) => {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(1); });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* ---- Contact Form Validation ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fields = {
      name: {
        el: contactForm.querySelector('#name'),
        validate: (v) => v.trim().length >= 2,
        message: 'Please enter your full name (at least 2 characters).'
      },
      phone: {
        el: contactForm.querySelector('#phone'),
        validate: (v) => {
          const digits = v.replace(/\D/g, '');
          if (digits.length === 10) return /^[6-9]/.test(digits);
          if (digits.length === 12) return digits.startsWith('91') && /^91[6-9]/.test(digits);
          return false;
        },
        message: 'Please enter a valid 10-digit Indian mobile number.'
      },
      email: {
        el: contactForm.querySelector('#email'),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        message: 'Please enter a valid email address.'
      },
      message: {
        el: contactForm.querySelector('#message'),
        validate: (v) => v.trim().length >= 10,
        message: 'Please enter a message (at least 10 characters).'
      }
    };

    const showFieldError = (field, isValid) => {
      if (!field.el) return;
      field.el.classList.toggle('is-invalid', !isValid);
      field.el.classList.toggle('is-valid', isValid);
      const feedback = field.el.parentElement.querySelector('.invalid-feedback');
      if (feedback) feedback.textContent = field.message;
    };

    Object.values(fields).forEach((field) => {
      if (!field.el) return;
      field.el.addEventListener('input', () => {
        if (field.el.classList.contains('is-invalid') || field.el.value) {
          showFieldError(field, field.validate(field.el.value));
        }
      });
      field.el.addEventListener('blur', () => {
        if (field.el.value) showFieldError(field, field.validate(field.el.value));
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isFormValid = true;

      Object.values(fields).forEach((field) => {
        const valid = field.validate(field.el?.value || '');
        showFieldError(field, valid);
        if (!valid) isFormValid = false;
      });

      const alertEl = contactForm.querySelector('.form-alert');
      if (!isFormValid) {
        if (alertEl) {
          alertEl.className = 'alert alert-danger form-alert';
          alertEl.textContent = 'Please correct the errors below before submitting.';
          alertEl.hidden = false;
        }
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-2" aria-hidden="true"></i>Message Sent!';
      btn.disabled = true;

      if (alertEl) {
        alertEl.className = 'alert alert-success form-alert';
        alertEl.textContent = 'Thank you! Your message has been sent. We will contact you shortly.';
        alertEl.hidden = false;
      }

      setTimeout(() => {
        contactForm.reset();
        Object.values(fields).forEach((field) => {
          if (field.el) {
            field.el.classList.remove('is-valid', 'is-invalid');
          }
        });
        btn.innerHTML = originalText;
        btn.disabled = false;
        if (alertEl) alertEl.hidden = true;
      }, 4000);
    });
  }

  /* ---- Counter Animation (About page stats) ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      if (prefersReducedMotion) {
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
        return;
      }
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ---- Initialize AOS (respects reduced motion) ---- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: prefersReducedMotion ? 0 : 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: prefersReducedMotion
    });
  }

  /* ---- Live reduced-motion preference changes ---- */
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches && typeof AOS !== 'undefined') AOS.refreshHard();
  });
})();
