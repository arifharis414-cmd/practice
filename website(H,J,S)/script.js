/* =====================================================================
   BRIGHT SMILE DENTAL CLINIC — SCRIPT.JS
   Modern ES6 JavaScript — Mobile Menu, Sticky Navbar, Smooth Scroll,
   Scrollspy, Form Validation, Success Popup, Dark Mode, Scroll-to-Top,
   Gallery Lightbox, Testimonial Slider, FAQ Accordion, Counters,
   Page Loader, Button Ripple Effect.

   NOTE: Every feature checks that its target element(s) exist before
   running, so this file is safe to drop into the site even if some
   optional markup (e.g. an FAQ section) hasn't been added yet.
   Elements that have no existing HTML hook (success popup, dark-mode
   toggle, scroll-to-top button, page loader, gallery lightbox,
   slider arrows) are created dynamically at runtime.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1. PAGE LOADER
     Shows a full-screen loader while the page's assets finish loading,
     then fades it out for a polished first impression.
     =================================================================== */
  const initPageLoader = () => {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `<div class="loader-spinner" aria-label="Loading"></div>`;
    Object.assign(loader.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      transition: 'opacity 0.5s ease, visibility 0.5s ease'
    });

    const spinner = loader.querySelector('.loader-spinner');
    Object.assign(spinner.style, {
      width: '52px',
      height: '52px',
      border: '5px solid #E2E8F0',
      borderTopColor: '#2563EB',
      borderRadius: '50%',
      animation: 'dental-spin 0.8s linear infinite'
    });

    // Inject the keyframe animation once
    const styleTag = document.createElement('style');
    styleTag.textContent = `@keyframes dental-spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(styleTag);

    document.body.appendChild(loader);

    const hideLoader = () => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      setTimeout(() => loader.remove(), 500);
    };

    // Hide once everything (images etc.) has loaded, with a safety fallback
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 2500); // fallback in case 'load' fires late/never
  };

  /* ===================================================================
     2. MOBILE MENU (Hamburger Toggle)
     =================================================================== */
  const initMobileMenu = () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;

    const toggleMenu = () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu whenever a nav link is clicked (mobile UX)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) toggleMenu();
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      const clickedInsideNav = navMenu.contains(e.target) || navToggle.contains(e.target);
      if (!clickedInsideNav && navMenu.classList.contains('active')) toggleMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) toggleMenu();
    });
  };

  /* ===================================================================
     3. STICKY NAVBAR
     Adds a 'scrolled' class once the user scrolls past the hero area,
     so the header can be styled (smaller, shadow, etc.) via CSS.
     =================================================================== */
  const initStickyNavbar = () => {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  };

  /* ===================================================================
     4. SMOOTH SCROLLING (with sticky-header offset)
     =================================================================== */
  const initSmoothScroll = () => {
    const header = document.getElementById('header');
    const headerOffset = header ? header.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId.length <= 1) return; // ignore bare "#"
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset - 10;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });
  };

  /* ===================================================================
     5. ACTIVE NAVIGATION LINKS (Scrollspy)
     Highlights the nav link matching the section currently in view.
     =================================================================== */
  const initScrollSpy = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    const sections = [...navLinks]
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  };

  /* ===================================================================
     6. APPOINTMENT FORM VALIDATION + SUCCESS POPUP
     =================================================================== */
  const initAppointmentForm = () => {
    const form = document.getElementById('appointment-form');
    if (!form) return;

    // Build (once) a reusable success popup/modal
    const buildSuccessPopup = () => {
      const overlay = document.createElement('div');
      overlay.id = 'success-popup-overlay';
      overlay.innerHTML = `
        <div class="success-popup-box" role="dialog" aria-modal="true" aria-labelledby="success-popup-title">
          <i class="fa-solid fa-circle-check success-popup-icon"></i>
          <h3 id="success-popup-title">Appointment Requested!</h3>
          <p>Thank you — our team will contact you shortly to confirm your appointment.</p>
          <button type="button" class="btn btn-primary success-popup-close">Close</button>
        </div>`;

      Object.assign(overlay.style, {
        position: 'fixed', inset: '0', zIndex: '2000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(30, 41, 59, 0.55)', opacity: '0',
        visibility: 'hidden', transition: 'opacity 0.35s ease, visibility 0.35s ease',
        padding: '1rem'
      });

      const box = overlay.querySelector('.success-popup-box');
      Object.assign(box.style, {
        background: '#FFFFFF', borderRadius: '18px', padding: '2.5rem 2rem',
        maxWidth: '380px', width: '100%', textAlign: 'center',
        boxShadow: '0 20px 50px rgba(37, 99, 235, 0.25)',
        transform: 'scale(0.9)', transition: 'transform 0.35s ease'
      });

      const icon = overlay.querySelector('.success-popup-icon');
      Object.assign(icon.style, { fontSize: '3rem', color: '#22C55E', marginBottom: '1rem' });

      document.body.appendChild(overlay);

      const show = () => {
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        box.style.transform = 'scale(1)';
      };
      const hide = () => {
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.9)';
        setTimeout(() => { overlay.style.visibility = 'hidden'; }, 350);
      };

      overlay.querySelector('.success-popup-close').addEventListener('click', hide);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) hide(); });

      return { show, hide };
    };

    const successPopup = buildSuccessPopup();

    // Helper to show an inline error message under a field
    const setFieldError = (field, message) => {
      clearFieldError(field);
      field.style.borderColor = '#EF4444';
      if (message) {
        const errorEl = document.createElement('small');
        errorEl.className = 'field-error-msg';
        errorEl.textContent = message;
        errorEl.style.color = '#EF4444';
        errorEl.style.fontSize = '0.78rem';
        errorEl.style.marginTop = '0.25rem';
        field.insertAdjacentElement('afterend', errorEl);
      }
    };

    const clearFieldError = (field) => {
      field.style.borderColor = '';
      const next = field.nextElementSibling;
      if (next && next.classList.contains('field-error-msg')) next.remove();
    };

    const validators = {
      'patient-name': (val) => val.trim().length >= 3 || 'Please enter your full name (min 3 characters).',
      'patient-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email address.',
      'patient-phone': (val) => /^[+]?[\d\s-()]{7,15}$/.test(val) || 'Please enter a valid phone number.',
      'patient-service': (val) => val !== '' || 'Please select a service.',
      'appointment-date': (val) => {
        if (!val) return 'Please choose a preferred date.';
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return new Date(val) >= today || 'Please choose a future date.';
      }
    };

    // Live validation as the user types/selects
    Object.keys(validators).forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      field.addEventListener('input', () => {
        const result = validators[id](field.value);
        result === true ? clearFieldError(field) : null;
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      Object.keys(validators).forEach(id => {
        const field = document.getElementById(id);
        if (!field) return;
        const result = validators[id](field.value);
        if (result !== true) {
          setFieldError(field, result);
          isValid = false;
        } else {
          clearFieldError(field);
        }
      });

      if (!isValid) {
        // Scroll to the first invalid field for good UX
        const firstError = form.querySelector('[style*="border-color: rgb(239, 68, 68)"]');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Simulate submission (no backend wired up) then show success popup
      const submitBtn = form.querySelector('.form-submit-btn');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          form.reset();
          successPopup.show();
        }, 900);
      } else {
        form.reset();
        successPopup.show();
      }
    });
  };

  /* ===================================================================
     7. DARK MODE TOGGLE
     Injects a toggle button into the navbar and persists the choice
     for the current session.
     =================================================================== */
  const initDarkMode = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dark-mode-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    Object.assign(toggleBtn.style, {
      background: 'transparent',
      fontSize: '1.1rem',
      color: 'inherit',
      width: '42px',
      height: '42px',
      borderRadius: '10px',
      order: '2'
    });

    const navToggle = document.getElementById('nav-toggle');
    navbar.insertBefore(toggleBtn, navToggle || null);

    const applyMode = (isDark) => {
      document.body.classList.toggle('dark-mode', isDark);
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
      }
    };

    // Restore previous preference for this session
    let isDark = sessionStorage.getItem('dentalClinicDarkMode') === 'true';
    applyMode(isDark);

    toggleBtn.addEventListener('click', () => {
      isDark = !isDark;
      applyMode(isDark);
      sessionStorage.setItem('dentalClinicDarkMode', String(isDark));
    });
  };

  /* ===================================================================
     8. SCROLL-TO-TOP BUTTON
     =================================================================== */
  const initScrollToTop = () => {
    const btn = document.createElement('button');
    btn.id = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: '#2563EB',
      color: '#FFFFFF',
      fontSize: '1.1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 12px 30px rgba(37, 99, 235, 0.35)',
      opacity: '0',
      visibility: 'hidden',
      transform: 'translateY(12px)',
      transition: 'all 0.3s ease',
      zIndex: '900'
    });
    document.body.appendChild(btn);

    const toggleVisibility = () => {
      const show = window.scrollY > 400;
      btn.style.opacity = show ? '1' : '0';
      btn.style.visibility = show ? 'visible' : 'hidden';
      btn.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggleVisibility();
  };

  /* ===================================================================
     9. IMAGE GALLERY POPUP (Lightbox)
     Works with the Before & After gallery images (.gallery-img).
     =================================================================== */
  const initGalleryLightbox = () => {
    const galleryImages = document.querySelectorAll('.gallery-img');
    if (!galleryImages.length) return;

    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close image preview">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <img class="lightbox-img" src="" alt="Enlarged gallery preview">`;

    Object.assign(lightbox.style, {
      position: 'fixed', inset: '0', zIndex: '2100',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(15, 23, 42, 0.9)', opacity: '0', visibility: 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease', padding: '2rem'
    });

    const img = lightbox.querySelector('.lightbox-img');
    Object.assign(img.style, {
      maxWidth: '90%', maxHeight: '85vh', borderRadius: '14px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    });

    const closeBtn = lightbox.querySelector('.lightbox-close');
    Object.assign(closeBtn.style, {
      position: 'absolute', top: '24px', right: '28px',
      width: '44px', height: '44px', borderRadius: '50%',
      background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '1.2rem'
    });

    document.body.appendChild(lightbox);

    const openLightbox = (src, alt) => {
      img.src = src;
      img.alt = alt;
      lightbox.style.visibility = 'visible';
      lightbox.style.opacity = '1';
    };
    const closeLightbox = () => {
      lightbox.style.opacity = '0';
      setTimeout(() => { lightbox.style.visibility = 'hidden'; }, 300);
    };

    galleryImages.forEach(image => {
      image.style.cursor = 'zoom-in';
      image.addEventListener('click', () => openLightbox(image.src, image.alt));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  };

  /* ===================================================================
     10. TESTIMONIAL SLIDER
     Progressively enhances the static testimonials grid into a
     one-at-a-time slider with prev/next controls + autoplay.
     =================================================================== */
  const initTestimonialSlider = () => {
    const track = document.getElementById('testimonials-grid');
    if (!track) return;

    const slides = [...track.children];
    if (slides.length < 2) return;

    let current = 0;

    const goTo = (index) => {
      slides[current].style.display = 'none';
      current = (index + slides.length) % slides.length;
      slides[current].style.display = '';
      dots.forEach((dot, i) => dot.classList.toggle('active-dot', i === current));
    };

    // Hide all but the first slide initially
    slides.forEach((slide, i) => { slide.style.display = i === 0 ? '' : 'none'; });

    // Build prev/next controls
    const controls = document.createElement('div');
    controls.id = 'testimonial-controls';
    controls.innerHTML = `
      <button type="button" class="testimonial-prev" aria-label="Previous testimonial"><i class="fa-solid fa-chevron-left"></i></button>
      <div class="testimonial-dots"></div>
      <button type="button" class="testimonial-next" aria-label="Next testimonial"><i class="fa-solid fa-chevron-right"></i></button>`;
    Object.assign(controls.style, {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '1.25rem', marginTop: '2rem'
    });

    track.insertAdjacentElement('afterend', controls);

    const prevBtn = controls.querySelector('.testimonial-prev');
    const nextBtn = controls.querySelector('.testimonial-next');
    const dotsContainer = controls.querySelector('.testimonial-dots');

    [prevBtn, nextBtn].forEach(btn => Object.assign(btn.style, {
      width: '40px', height: '40px', borderRadius: '50%',
      background: '#2563EB', color: '#FFFFFF', fontSize: '0.9rem'
    }));
    Object.assign(dotsContainer.style, { display: 'flex', gap: '0.5rem' });

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonial-dot';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      Object.assign(dot.style, {
        width: '10px', height: '10px', borderRadius: '50%',
        background: i === 0 ? '#2563EB' : '#CBD5E1', transition: 'background 0.3s ease'
      });
      dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
      dotsContainer.appendChild(dot);
      return dot;
    });

    // Keep dot colors in sync via a MutationObserver-free approach: patch goTo
    const originalGoTo = goTo;
    const syncedGoTo = (index) => {
      originalGoTo(index);
      dots.forEach((dot, i) => { dot.style.background = i === current ? '#2563EB' : '#CBD5E1'; });
    };

    prevBtn.addEventListener('click', () => { syncedGoTo(current - 1); resetAutoplay(); });
    nextBtn.addEventListener('click', () => { syncedGoTo(current + 1); resetAutoplay(); });

    // Autoplay every 6 seconds, pausing on hover
    let autoplayTimer = setInterval(() => syncedGoTo(current + 1), 6000);
    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => syncedGoTo(current + 1), 6000);
    };
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    track.parentElement.addEventListener('mouseleave', resetAutoplay);
  };

  /* ===================================================================
     11. FAQ ACCORDION
     Expects markup like:
       <div class="faq-item">
         <button class="faq-question">Question<i class="fa-solid fa-chevron-down"></i></button>
         <div class="faq-answer"><p>Answer text</p></div>
       </div>
     Safe no-op if no FAQ section exists yet.
     =================================================================== */
  const initFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      answer.style.maxHeight = '0px';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.35s ease';

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq-open');

        // Close all other items (accordion behaviour)
        faqItems.forEach(other => {
          other.classList.remove('faq-open');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0px';
        });

        if (!isOpen) {
          item.classList.add('faq-open');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    });
  };

  /* ===================================================================
     12. COUNTER ANIMATION
     Expects elements like: <span class="counter" data-target="15"></span>
     Animates once each counter scrolls into view.
     =================================================================== */
  const initCounterAnimation = () => {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 1500;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  };

  /* ===================================================================
     13. BUTTON RIPPLE EFFECT
     Applies a material-style ripple to every .btn on click.
     =================================================================== */
  const initButtonRipple = () => {
    const buttons = document.querySelectorAll('.btn');
    if (!buttons.length) return;

    // Inject ripple keyframes once
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      @keyframes dental-ripple {
        to { transform: scale(3); opacity: 0; }
      }`;
    document.head.appendChild(rippleStyle);

    buttons.forEach(btn => {
      btn.style.position = btn.style.position || 'relative';
      btn.style.overflow = 'hidden';

      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        Object.assign(ripple.style, {
          position: 'absolute',
          left: `${e.clientX - rect.left - size / 2}px`,
          top: `${e.clientY - rect.top - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.55)',
          transform: 'scale(0)',
          pointerEvents: 'none',
          animation: 'dental-ripple 0.6s ease-out'
        });

        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  };

  /* ===================================================================
     INITIALIZE EVERYTHING
     =================================================================== */
  initPageLoader();
  initMobileMenu();
  initStickyNavbar();
  initSmoothScroll();
  initScrollSpy();
  initAppointmentForm();
  initDarkMode();
  initScrollToTop();
  initGalleryLightbox();
  initTestimonialSlider();
  initFaqAccordion();
  initCounterAnimation();
  initButtonRipple();
});