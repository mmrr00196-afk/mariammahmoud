/**
 * ==========================================================================
 * MARIAM MAHMOUD — DEVELOPER PORTFOLIO JAVASCRIPT
 * Vanilla JS implementation:
 * - Dark / Light theme toggle with localStorage persistence
 * - Mobile hamburger drawer navigation
 * - Scroll spy & active navigation links
 * - Scroll-triggered reveal animations (IntersectionObserver)
 * - Accessible contact form validation & interactive feedback
 * - Copy-to-clipboard functionality
 * - Back to top behavior
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Theme Toggle (Dark Mode Default / Light Mode Alternative)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check saved preference or default to dark
  const savedTheme = localStorage.getItem('mm_portfolio_theme');
  const preferredTheme = savedTheme || 'dark';

  setTheme(preferredTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('mm_portfolio_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        `Current theme: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode.`
      );
    }
  }

  // ------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // ------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-footer a');

  function openMobileMenu() {
    if (!mobileMenuBtn || !mobileDrawer) return;
    mobileMenuBtn.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileMenu() {
    if (!mobileMenuBtn || !mobileDrawer) return;
    mobileMenuBtn.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenuBtn.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any nav link inside drawer
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. Sticky Header & Active Navigation Link Spy
  // ------------------------------------------------------------------------
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const trackedSections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy: determine current active section
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    trackedSections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // ------------------------------------------------------------------------
  const scrollElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, observerOptions);

    scrollElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    scrollElements.forEach((el) => el.classList.add('is-visible'));
  }

  // ------------------------------------------------------------------------
  // 5. Contact Form Validation & Submission Handler
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    // Email regex validation helper
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Clear individual errors on input
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const errorElem = document.getElementById(`${input.id}-error`);
        if (errorElem) errorElem.classList.remove('active');
        if (formStatus) formStatus.style.display = 'none';
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.classList.add('active');
        isValid = false;
      } else {
        nameError.classList.remove('active');
      }

      // Validate Email
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        emailError.classList.add('active');
        isValid = false;
      } else {
        emailError.classList.remove('active');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectError.classList.add('active');
        isValid = false;
      } else {
        subjectError.classList.remove('active');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.classList.add('active');
        isValid = false;
      } else {
        messageError.classList.remove('active');
      }

      if (!isValid) {
        showToast('Please fill out all required fields correctly.');
        return;
      }

      // Simulate sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Sending Message...</span>
      `;

      // Simulating client-side submission with clean user feedback
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        formStatus.className = 'form-status success';
        formStatus.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been prepared. You can also reach Mariam directly at mmrr00196@gmail.com.`;
        formStatus.style.display = 'block';

        showToast('Message inquiry submitted successfully!');
        contactForm.reset();

        setTimeout(() => {
          if (formStatus) formStatus.style.display = 'none';
        }, 8000);
      }, 1000);
    });
  }

  // ------------------------------------------------------------------------
  // 6. Copy Email to Clipboard
  // ------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailToCopy = 'mmrr00196@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback method
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast(`Copied email to clipboard: ${emailToCopy}`);
      } catch (err) {
        showToast(`Email address: ${emailToCopy}`);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 7. Toast Notification Utility
  // ------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ------------------------------------------------------------------------
  // 8. Back to Top Smooth Scroll
  // ------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
