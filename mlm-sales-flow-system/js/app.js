/* ============================================
   MLM SALES FLOW SYSTEM - Interactive App
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('.section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  if (sections.length && navItems.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.getAttribute('id');
      });
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) item.classList.add('active');
      });
    });
  }

  // --- Accordion ---
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Close all in same group
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // --- Tabs ---
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabGroup = btn.closest('.tabs-container');
      const target = btn.dataset.tab;
      // Deactivate all
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      // Activate target
      btn.classList.add('active');
      const panel = tabGroup.querySelector(`[data-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Scroll Animations (Intersection Observer) ---
  const animateElements = document.querySelectorAll('.animate-in');
  if (animateElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // --- Copy to Clipboard for Script Boxes ---
  document.querySelectorAll('.script-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scriptBox = btn.closest('.script-box');
      const body = scriptBox.querySelector('.script-box-body');
      if (body) {
        navigator.clipboard.writeText(body.innerText).then(() => {
          const original = btn.textContent;
          btn.textContent = '✓ Copied!';
          btn.style.color = '#2ecc71';
          setTimeout(() => {
            btn.textContent = original;
            btn.style.color = '';
          }, 2000);
        });
      }
    });
  });

  // --- Checklist Toggle ---
  document.querySelectorAll('.checklist li').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const icon = item.querySelector('.check-icon');
      if (item.classList.contains('checked')) {
        icon.style.background = 'var(--gray-400)';
        icon.innerHTML = '✓';
        item.querySelector('.check-text').style.textDecoration = 'line-through';
        item.querySelector('.check-text').style.opacity = '0.6';
      } else {
        icon.style.background = '';
        icon.innerHTML = '';
        item.querySelector('.check-text').style.textDecoration = '';
        item.querySelector('.check-text').style.opacity = '';
      }
    });
  });

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const increment = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 20);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // --- Progress Tracker ---
  const progressSteps = document.querySelectorAll('.flow-map-step');
  progressSteps.forEach((step, index) => {
    step.addEventListener('click', () => {
      step.classList.toggle('completed');
      updateProgress();
    });
  });

  function updateProgress() {
    const completed = document.querySelectorAll('.flow-map-step.completed').length;
    const total = progressSteps.length;
    const bar = document.querySelector('.progress-bar-fill');
    const text = document.querySelector('.progress-text');
    if (bar && text) {
      const pct = Math.round((completed / total) * 100);
      bar.style.width = pct + '%';
      text.textContent = `${completed}/${total} steps completed (${pct}%)`;
    }
  }

  // --- Offer Canvas Editable Fields ---
  document.querySelectorAll('.offer-field .value').forEach(field => {
    field.setAttribute('contenteditable', 'true');
    field.addEventListener('focus', () => {
      field.style.background = 'white';
      field.style.border = '2px solid var(--accent)';
      field.style.borderRadius = '8px';
      field.style.padding = '0.5rem';
    });
    field.addEventListener('blur', () => {
      field.style.background = '';
      field.style.border = '';
      field.style.borderRadius = '';
      field.style.padding = '';
    });
  });

  // --- Export/Print ---
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const content = document.querySelector('.main-content');
      if (content) {
        const blob = new Blob([content.innerHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mlm-sales-flow-system.html';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

});