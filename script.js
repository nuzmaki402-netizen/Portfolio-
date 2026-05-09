/**
 * Portfolio Website - Production Grade JavaScript
 * Architecture: Module pattern with utility layer + separation of concerns
 *
 * Features:
 * - DOM caching and batch queries
 * - Utility layer for reusable functions
 * - Robust error handling and edge case management
 * - Performance optimizations (debounce, throttle)
 * - Accessibility enhancements
 * - ARIA live regions for notifications
 */

// ============================================================================
// UTILITY LAYER - Reusable helper functions
// ============================================================================

/**
 * Utility functions for common operations
 */
const Utils = (() => {
  /**
   * Debounce function - delays execution until idle
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  const debounce = (fn, delay = 300) => {
    let timeoutId = null;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  /**
   * Throttle function - ensures function runs at most every X milliseconds
   * @param {Function} fn - Function to throttle
   * @param {number} delay - Minimum delay between executions
   * @returns {Function} Throttled function
   */
  const throttle = (fn, delay = 300) => {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  };

  /**
   * Safely query DOM element
   * @param {string} selector - CSS selector
   * @param {Element} parent - Optional parent element
   * @returns {Element|null} Found element or null
   */
  const querySelector = (selector, parent = document) => {
    try {
      return parent.querySelector(selector);
    } catch (e) {
      console.error(`Invalid selector: ${selector}`, e);
      return null;
    }
  };

  /**
   * Safely query multiple DOM elements
   * @param {string} selector - CSS selector
   * @param {Element} parent - Optional parent element
   * @returns {NodeList} Found elements
   */
  const querySelectorAll = (selector, parent = document) => {
    try {
      return parent.querySelectorAll(selector);
    } catch (e) {
      console.error(`Invalid selector: ${selector}`, e);
      return [];
    }
  };

  /**
   * Convert NodeList to Array
   * @param {NodeList} nodeList - NodeList to convert
   * @returns {Array} Array of elements
   */
  const nodeListToArray = (nodeList) => {
    return Array.from(nodeList || []);
  };

  /**
   * Check if element is in viewport
   * @param {Element} el - Element to check
   * @returns {boolean} True if element is visible
   */
  const isInViewport = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  /**
   * Safe localStorage operation
   * @param {string} operation - 'get' or 'set'
   * @param {string} key - Storage key
   * @param {any} value - Value (for set operation)
   * @returns {any} Retrieved value or null
   */
  const storage = (operation, key, value = null) => {
    try {
      if (operation === 'get') {
        return localStorage.getItem(key);
      } else if (operation === 'set') {
        localStorage.setItem(key, value);
        return true;
      } else if (operation === 'remove') {
        localStorage.removeItem(key);
        return true;
      }
    } catch (e) {
      console.warn('localStorage unavailable:', e);
      return operation === 'get' ? null : false;
    }
  };

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Sanitize text input (prevent XSS)
   * @param {string} text - Text to sanitize
   * @returns {string} Sanitized text
   */
  const sanitizeText = (text) => {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return {
    debounce,
    throttle,
    querySelector,
    querySelectorAll,
    nodeListToArray,
    isInViewport,
    storage,
    validateEmail,
    sanitizeText,
  };
})();

// ============================================================================
// DOM CACHE - Single source of truth for all DOM references
// ============================================================================

const DOM = (() => {
  const cache = {
    body: document.body,
    html: document.documentElement,
    themeToggle: Utils.querySelector('#themeToggle'),
    scrollToContact: Utils.querySelector('#scrollToContact'),
    contactForm: Utils.querySelector('#contactForm'),
    heroHighlight: Utils.querySelector('.hero__highlight'),
    notificationContainer: Utils.querySelector('#notificationContainer'),
  };

  // Cache animated elements
  const animatedElements = Utils.nodeListToArray(
    Utils.querySelectorAll(
      '.project-card, .contact-form, .contact-info, .tech-icon, .hero__content, .hero__actions'
    )
  );

  return {
    ...cache,
    animatedElements,
    /**
     * Safe element getter with fallback
     * @param {string} key - Cache key
     * @returns {Element|null} Element or null
     */
    get: (key) => cache[key] || null,
  };
})();

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  THEME_STORAGE_KEY: 'portfolio-theme',
  TYPING_WORDS: ['about it!', 'with passion!', 'every day!', 'to inspire!'],
  TYPING_SPEED_FORWARD: 100,
  TYPING_SPEED_BACKWARD: 60,
  TYPING_PAUSE_DURATION: 1000,
  TYPING_NEXT_WORD_DELAY: 300,
  SCROLL_ANIMATION_THRESHOLD: 0.2,
  NOTIFICATION_DURATION: 3000,
  FORM_VALIDATION_DEBOUNCE: 300,
};

// ============================================================================
// TYPING EFFECT MODULE
// ============================================================================

const TypingEffect = (() => {
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isRunning = false;

  const type = () => {
    if (!DOM.heroHighlight) return;

    const currentWord = CONFIG.TYPING_WORDS[wordIndex];
    const typingSpeed = isDeleting
      ? CONFIG.TYPING_SPEED_BACKWARD
      : CONFIG.TYPING_SPEED_FORWARD;

    if (!isDeleting) {
      // Typing forward
      DOM.heroHighlight.textContent = currentWord.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        // Word complete — pause then start deleting
        isDeleting = true;
        setTimeout(type, CONFIG.TYPING_PAUSE_DURATION);
        return;
      }
    } else {
      // Deleting
      DOM.heroHighlight.textContent = currentWord.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Word deleted — move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % CONFIG.TYPING_WORDS.length;
        setTimeout(type, CONFIG.TYPING_NEXT_WORD_DELAY);
        return;
      }
    }

    setTimeout(type, typingSpeed);
  };

  const init = () => {
    if (!DOM.heroHighlight) {
      console.warn('TypingEffect: heroHighlight element not found');
      return;
    }
    if (!isRunning) {
      isRunning = true;
      type();
    }
  };

  const stop = () => {
    isRunning = false;
  };

  return { init, stop };
})();

// ============================================================================
// SCROLL ANIMATION MODULE (One-directional, optimized)
// ============================================================================
const animatedElements = document.querySelectorAll(  
        ".hero__avatar, .hero__title, .hero__subtitle, .hero__actions, .about, .profile-card__header, " +  
        ".profile-card__description, .skills, .stats, .projects, .tech-icons, .projects__section, .project-card, " +  
        ".project-card__title, .project-card__type, .contact, .contact__title, .contact__subtitle, " +
        ".contact-form, .form-group, .button button--primary button--submit, .contact-info, .social-links, .contact-info__email"
    );  
  
    const scrollObserver = new IntersectionObserver((entries) => {  
        entries.forEach(entry => {  
            const isVisible = entry.isIntersecting;  
            entry.target.classList.toggle("show", isVisible);  
            entry.target.classList.toggle("hide", !isVisible);  
        });  
    }, {   
        threshold: 0.2,  
        rootMargin: "0px 0px -50px 0px"   
    });  
  
    animatedElements.forEach(el => {  
        el.classList.add("hide");  
        scrollObserver.observe(el);  
    });  
// ============================================================================
// NAVIGATION MODULE
// ============================================================================

const Navigation = (() => {
  const scrollToContact = () => {
    const contactSection = Utils.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Navigation: contact section not found');
    }
  };

  const init = () => {
    const btn = DOM.get('scrollToContact');
    if (!btn) {
      console.warn('Navigation: scroll button not found');
      return;
    }

    btn.addEventListener('click', scrollToContact);
  };

  return { init };
})();

// ============================================================================
// THEME MODULE
// ============================================================================

const Theme = (() => {
  const LIGHT_THEME_CLASS = 'light-theme';
  const LIGHT_THEME_TEXT = 'Dark Mode';
  const DARK_THEME_TEXT = 'Light Mode';

  const getSavedTheme = () => {
    return Utils.storage('get', CONFIG.THEME_STORAGE_KEY) || 'dark';
  };

  const setTheme = (theme) => {
    const isLight = theme === 'light';
    const themeBtn = DOM.get('themeToggle');
    const html = DOM.get('html');

    if (isLight) {
      DOM.body.classList.add(LIGHT_THEME_CLASS);
      html?.setAttribute('data-theme', 'light');
    } else {
      DOM.body.classList.remove(LIGHT_THEME_CLASS);
      html?.setAttribute('data-theme', 'dark');
    }

    if (themeBtn) {
      const textSpan = Utils.querySelector('.theme-toggle__text', themeBtn);
      if (textSpan) {
        textSpan.textContent = isLight ? LIGHT_THEME_TEXT : DARK_THEME_TEXT;
      }
      themeBtn.setAttribute('aria-pressed', isLight);
    }

    Utils.storage('set', CONFIG.THEME_STORAGE_KEY, theme);
  };

  const toggleTheme = () => {
    const currentTheme = getSavedTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const init = () => {
    const savedTheme = getSavedTheme();
    setTheme(savedTheme);

    const themeBtn = DOM.get('themeToggle');
    if (!themeBtn) {
      console.warn('Theme: toggle button not found');
      return;
    }

    themeBtn.addEventListener('click', toggleTheme);
  };

  return { init, setTheme, getSavedTheme };
})();

// ============================================================================
// FORM MODULE (Advanced validation, accessibility)
// ============================================================================

const Form = (() => {
  const fields = {
    name: { id: 'contactName', error: 'nameError' },
    email: { id: 'contactEmail', error: 'emailError' },
    message: { id: 'contactMessage', error: 'messageError' },
  };

  const clearAllErrors = () => {
    Object.values(fields).forEach(({ error }) => {
      const errorEl = Utils.querySelector(`#${error}`);
      if (errorEl) {
        errorEl.textContent = '';
      }
    });
  };

  const showFieldError = (fieldName, message) => {
    const field = fields[fieldName];
    if (!field) return;

    const errorEl = Utils.querySelector(`#${field.error}`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.setAttribute('role', 'alert');
    }
  };

  const validateField = (fieldName, value) => {
    const trimmedValue = value.trim();

    switch (fieldName) {
      case 'name':
        if (!trimmedValue) {
          showFieldError('name', 'Name is required');
          return false;
        }
        if (trimmedValue.length < 2) {
          showFieldError('name', 'Name must be at least 2 characters');
          return false;
        }
        return true;

      case 'email':
        if (!trimmedValue) {
          showFieldError('email', 'Email is required');
          return false;
        }
        if (!Utils.validateEmail(trimmedValue)) {
          showFieldError('email', 'Please enter a valid email');
          return false;
        }
        return true;

      case 'message':
        if (!trimmedValue) {
          showFieldError('message', 'Message is required');
          return false;
        }
        if (trimmedValue.length < 10) {
          showFieldError('message', 'Message must be at least 10 characters');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const validateForm = (formData) => {
    clearAllErrors();

    const isNameValid = validateField('name', formData.name || '');
    const isEmailValid = validateField('email', formData.email || '');
    const isMessageValid = validateField('message', formData.message || '');

    return isNameValid && isEmailValid && isMessageValid;
  };

  const showNotification = (message, type = 'success') => {
    Notification.show(message, type);
  };

  const handleSubmission = (formData) => {
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    DOM.get('contactForm')?.reset();
    clearAllErrors();

    // TODO: Integrate with backend
    // Example: API.sendContactForm(formData)
    //   .then(() => showNotification('Message sent!', 'success'))
    //   .catch((err) => showNotification(err.message, 'error'));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = DOM.get('contactForm');
    if (!form) {
      console.error('Form: contactForm not found');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (!validateForm(data)) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      name: Utils.sanitizeText(data.name),
      email: Utils.sanitizeText(data.email),
      message: Utils.sanitizeText(data.message),
    };

    handleSubmission(sanitizedData);
  };

  const init = () => {
    const form = DOM.get('contactForm');
    if (!form) {
      console.warn('Form: contactForm not found');
      return;
    }

    form.addEventListener('submit', handleSubmit);

    // Add real-time validation
    Object.entries(fields).forEach(([fieldName, { id }]) => {
      const input = Utils.querySelector(`#${id}`);
      if (input) {
        input.addEventListener(
          'blur',
          Utils.debounce(() => {
            validateField(fieldName, input.value);
          }, CONFIG.FORM_VALIDATION_DEBOUNCE)
        );
      }
    });
  };

  return { init };
})();

// ============================================================================
// NOTIFICATION MODULE (ARIA live region)
// ============================================================================

const Notification = (() => {
  const removeNotification = (element) => {
    element.classList.add('removing');
    setTimeout(() => {
      element.remove();
    }, 300);
  };

  const show = (message, type = 'success', duration = CONFIG.NOTIFICATION_DURATION) => {
    const container = DOM.get('notificationContainer');
    if (!container) {
      console.warn('Notification: container not found');
      return;
    }

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.textContent = Utils.sanitizeText(message);

    container.appendChild(notification);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification);
      }, duration);
    }
  };

  return { show };
})();

// ============================================================================
// APP INITIALIZATION & LIFECYCLE
// ============================================================================

const App = (() => {
  const isInitialized = false;

  const init = () => {
    if (isInitialized) {
      console.warn('App: Already initialized');
      return;
    }

    // Initialize modules in order
    try {
      Theme.init();
      TypingEffect.init();
      ScrollAnimation.init();
      Navigation.init();
      Form.init();

      console.log('App: Initialization complete');
    } catch (error) {
      console.error('App: Initialization failed', error);
    }
  };

  const cleanup = () => {
    ScrollAnimation.cleanup();
    TypingEffect.stop();
  };

  return { init, cleanup };
})();

// ============================================================================
// ENTRY POINT
// ============================================================================

// Ensure DOM is ready before initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  // DOM is already loaded
  App.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  App.cleanup();
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    TypingEffect.stop();
  } else {
    // Resume typing when page becomes visible
  }
});
