/* ============================================
   MLM AI-Powered Sales & Automation System
   Interactive JavaScript Application
   ============================================ */

// ============================================
// Application State
// ============================================

const AppState = {
  currentModule: null,
  progress: {
    '01-ai-sales-bot': 0,
    '02-social-sidekick': 0,
    '03-unified-inbox': 0,
    '04-multi-channel-follow-up': 0,
    '05-ai-social-planner': 0,
    '06-mlm-sales-flow-integration': 0,
    '07-automation-workflow-builder': 0,
    '08-analytics-dashboard': 0
  },
  settings: {
    theme: 'dark',
    notifications: true,
    autoSave: true
  },
  chatHistory: [],
  isChatActive: false
};

// ============================================
// DOM Elements
// ============================================

const DOM = {
  navbar: document.querySelector('.navbar'),
  navbarToggle: document.querySelector('.navbar-toggle'),
  navbarNav: document.querySelector('.navbar-nav'),
  moduleCards: document.querySelectorAll('.module-card'),
  chatInterface: document.querySelector('.chat-interface'),
  chatInput: document.querySelector('.chat-input input'),
  chatSendBtn: document.querySelector('.chat-input button'),
  chatMessages: document.querySelector('.chat-messages'),
  progressBars: document.querySelectorAll('.progress-bar'),
  copyButtons: document.querySelectorAll('.copy-btn'),
  accordionItems: document.querySelectorAll('.accordion-item'),
  tabs: document.querySelectorAll('.tab'),
  tabContents: document.querySelectorAll('.tab-content')
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  loadProgress();
  setupEventListeners();
  initializeChat();
  animateOnScroll();
});

function initializeApp() {
  console.log('MLM AI Sales Automation System initialized');
  updateProgressDisplay();
  checkNotifications();
}

// ============================================
// Navigation
// ============================================

function setupEventListeners() {
  // Navbar toggle for mobile
  if (DOM.navbarToggle) {
    DOM.navbarToggle.addEventListener('click', toggleNavbar);
  }

  // Navbar scroll effect
  window.addEventListener('scroll', handleNavbarScroll);

  // Module card clicks
  DOM.moduleCards.forEach(card => {
    card.addEventListener('click', handleModuleClick);
  });

  // Copy buttons
  DOM.copyButtons.forEach(btn => {
    btn.addEventListener('click', handleCopy);
  });

  // Accordion items
  DOM.accordionItems.forEach(item => {
    item.addEventListener('click', handleAccordion);
  });

  // Tabs
  DOM.tabs.forEach(tab => {
    tab.addEventListener('click', handleTabClick);
  });

  // Chat functionality
  if (DOM.chatSendBtn) {
    DOM.chatSendBtn.addEventListener('click', handleChatSend);
  }

  if (DOM.chatInput) {
    DOM.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleChatSend();
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleSmoothScroll);
  });
}

function toggleNavbar() {
  DOM.navbarNav.classList.toggle('active');
}

function handleNavbarScroll() {
  if (window.scrollY > 50) {
    DOM.navbar.classList.add('scrolled');
  } else {
    DOM.navbar.classList.remove('scrolled');
  }
}

function handleSmoothScroll(e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    // Close mobile navbar if open
    DOM.navbarNav.classList.remove('active');
  }
}

// ============================================
// Module Navigation
// ============================================

function handleModuleClick(e) {
  const card = e.currentTarget;
  const moduleId = card.dataset.module;
  
  if (moduleId) {
    openModule(moduleId);
  }
}

function openModule(moduleId) {
  AppState.currentModule = moduleId;
  
  // Update active state
  DOM.moduleCards.forEach(card => {
    card.classList.remove('active');
    if (card.dataset.module === moduleId) {
      card.classList.add('active');
    }
  });

  // Scroll to module section
  const moduleSection = document.querySelector(`#module-${moduleId}`);
  if (moduleSection) {
    moduleSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // Update progress
  updateModuleProgress(moduleId, 10);
}

// ============================================
// Progress Tracking
// ============================================

function updateModuleProgress(moduleId, progress) {
  AppState.progress[moduleId] = Math.min(100, progress);
  updateProgressDisplay();
  saveProgress();
}

function updateProgressDisplay() {
  DOM.progressBars.forEach(bar => {
    const moduleId = bar.dataset.module;
    const progress = AppState.progress[moduleId] || 0;
    bar.style.width = `${progress}%`;
    bar.setAttribute('aria-valuenow', progress);
  });
}

function saveProgress() {
  if (AppState.settings.autoSave) {
    localStorage.setItem('mlm-ai-progress', JSON.stringify(AppState.progress));
  }
}

function loadProgress() {
  const saved = localStorage.getItem('mlm-ai-progress');
  if (saved) {
    try {
      AppState.progress = JSON.parse(saved);
      updateProgressDisplay();
    } catch (e) {
      console.error('Error loading progress:', e);
    }
  }
}

function getTotalProgress() {
  const values = Object.values(AppState.progress);
  const total = values.reduce((sum, val) => sum + val, 0);
  return Math.round(total / values.length);
}

// ============================================
// Copy to Clipboard
// ============================================

function handleCopy(e) {
  const btn = e.currentTarget;
  const textToCopy = btn.dataset.copy || btn.parentElement.dataset.copy;
  
  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showCopyFeedback(btn);
    }).catch(err => {
      console.error('Copy failed:', err);
      // Fallback for older browsers
      fallbackCopy(textToCopy, btn);
    });
  }
}

function fallbackCopy(text, btn) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showCopyFeedback(btn);
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }
  
  document.body.removeChild(textarea);
}

function showCopyFeedback(btn) {
  const originalText = btn.textContent;
  btn.textContent = '✓ Copied!';
  btn.classList.add('copied');
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('copied');
  }, 2000);
}

// ============================================
// Accordion
// ============================================

function handleAccordion(e) {
  const item = e.currentTarget;
  const content = item.querySelector('.accordion-content');
  const icon = item.querySelector('.accordion-icon');
  
  // Close other items
  DOM.accordionItems.forEach(otherItem => {
    if (otherItem !== item) {
      const otherContent = otherItem.querySelector('.accordion-content');
      const otherIcon = otherItem.querySelector('.accordion-icon');
      otherContent.style.maxHeight = null;
      otherItem.classList.remove('active');
      if (otherIcon) {
        otherIcon.style.transform = 'rotate(0deg)';
      }
    }
  });
  
  // Toggle current item
  item.classList.toggle('active');
  
  if (item.classList.contains('active')) {
    content.style.maxHeight = content.scrollHeight + 'px';
    if (icon) {
      icon.style.transform = 'rotate(180deg)';
    }
  } else {
    content.style.maxHeight = null;
    if (icon) {
      icon.style.transform = 'rotate(0deg)';
    }
  }
}

// ============================================
// Tabs
// ============================================

function handleTabClick(e) {
  const tab = e.currentTarget;
  const tabId = tab.dataset.tab;
  
  // Update active tab
  DOM.tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  
  // Show corresponding content
  DOM.tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.dataset.tab === tabId) {
      content.classList.add('active');
    }
  });
}

// ============================================
// AI Chat Bot
// ============================================

function initializeChat() {
  // Add welcome message
  addBotMessage("Hi! I'm your AI Sales Assistant. I can help you with lead qualification, appointment booking, and answering questions about your MLM business. How can I help you today?");
}

function handleChatSend() {
  const message = DOM.chatInput.value.trim();
  
  if (message) {
    addUserMessage(message);
    DOM.chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(message);
      addBotMessage(response);
    }, 1000 + Math.random() * 1000);
  }
}

function addUserMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message user';
  messageDiv.innerHTML = `
    <div class="chat-bubble">${escapeHtml(message)}</div>
  `;
  DOM.chatMessages.appendChild(messageDiv);
  scrollToBottom();
  
  AppState.chatHistory.push({
    type: 'user',
    message: message,
    timestamp: new Date().toISOString()
  });
}

function addBotMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message bot';
  messageDiv.innerHTML = `
    <div class="chat-bubble">${escapeHtml(message)}</div>
  `;
  DOM.chatMessages.appendChild(messageDiv);
  scrollToBottom();
  
  AppState.chatHistory.push({
    type: 'bot',
    message: message,
    timestamp: new Date().toISOString()
  });
}

function generateAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Lead qualification responses
  if (lowerMessage.includes('interested') || lowerMessage.includes('want to know')) {
    return "Great! I'd love to help you learn more. Are you looking to start a side business, or are you already in network marketing and looking to grow?";
  }
  
  if (lowerMessage.includes('side business') || lowerMessage.includes('new')) {
    return "Perfect! Our system is designed for beginners. We provide everything you need to get started - training, scripts, and automation tools. Would you like me to book a 15-minute call to explain how it works?";
  }
  
  if (lowerMessage.includes('grow') || lowerMessage.includes('already in')) {
    return "Excellent! For experienced network marketers, our AI-powered automation can help you scale faster. We have tools for lead generation, follow-up automation, and team duplication. What's your biggest challenge right now?";
  }
  
  // Appointment booking responses
  if (lowerMessage.includes('yes') || lowerMessage.includes('sure') || lowerMessage.includes('book')) {
    return "Fantastic! I have a few time slots available this week. Would you prefer:\n\n• Tuesday at 2 PM EST\n• Wednesday at 7 PM EST\n• Thursday at 11 AM EST\n\nJust let me know which works best for you!";
  }
  
  if (lowerMessage.includes('tuesday') || lowerMessage.includes('2 pm')) {
    return "Perfect! I've booked you for Tuesday at 2 PM EST. You'll receive a confirmation email shortly. Is there anything specific you'd like us to focus on during our call?";
  }
  
  if (lowerMessage.includes('wednesday') || lowerMessage.includes('7 pm')) {
    return "Great choice! I've booked you for Wednesday at 7 PM EST. You'll receive a confirmation email shortly. Is there anything specific you'd like us to focus on during our call?";
  }
  
  if (lowerMessage.includes('thursday') || lowerMessage.includes('11 am')) {
    return "Excellent! I've booked you for Thursday at 11 AM EST. You'll receive a confirmation email shortly. Is there anything specific you'd like us to focus on during our call?";
  }
  
  // Objection handling
  if (lowerMessage.includes('scam') || lowerMessage.includes('pyramid')) {
    return "I completely understand your concern. Network marketing is a legitimate business model used by many Fortune 500 companies. Our company has been in business for over 10 years with an A+ BBB rating. Would you like me to share some success stories from people who started just like you?";
  }
  
  if (lowerMessage.includes('no money') || lowerMessage.includes('expensive') || lowerMessage.includes('cost')) {
    return "Great question! You can start with as little as $XX, and we offer a 30-day money-back guarantee. Plus, our system helps you earn back your investment quickly. Would you like to see our starter package options?";
  }
  
  if (lowerMessage.includes('no time') || lowerMessage.includes('busy')) {
    return "I hear you! That's exactly why we built our automation system. You can build your business in just 1-2 hours per day. Our AI tools handle most of the heavy lifting. Would you like to see how our automation works?";
  }
  
  // General responses
  if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return "I'm here to help! I can assist you with:\n\n• Learning about our business opportunity\n• Booking a consultation call\n• Answering questions about products\n• Explaining our compensation plan\n• Sharing success stories\n\nWhat would you like to know more about?";
  }
  
  if (lowerMessage.includes('product') || lowerMessage.includes('what do you sell')) {
    return "We offer [PRODUCT CATEGORY] products that [BENEFIT]. Our products are [UNIQUE SELLING POINT]. Would you like me to send you a product catalog or schedule a product demo?";
  }
  
  if (lowerMessage.includes('money') || lowerMessage.includes('income') || lowerMessage.includes('earn')) {
    return "Our compensation plan is designed to help you earn [INCOME RANGE] per month. You earn through [COMMISSION STRUCTURE]. Many of our team members see results in their first 30 days. Would you like me to share a detailed income disclosure?";
  }
  
  // Default response
  const defaultResponses = [
    "That's a great question! Let me help you with that. Could you tell me a bit more about what you're looking for?",
    "I appreciate you reaching out! To give you the best information, are you more interested in the business opportunity or our products?",
    "Thanks for your message! I'd love to help you explore this further. What's your biggest goal right now - extra income, time freedom, or something else?",
    "Great to hear from you! Our system has helped many people achieve [RESULT]. What would achieving [RESULT] mean for you?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function scrollToBottom() {
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// Notifications
// ============================================

function checkNotifications() {
  if (!AppState.settings.notifications) return;
  
  // Check for new features, updates, etc.
  // This would connect to a backend in production
}

function showNotification(title, message, type = 'info') {
  if (!('Notification' in window)) return;
  
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/icon.png',
      type: type
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showNotification(title, message, type);
      }
    });
  }
}

// ============================================
// Animations
// ============================================

function animateOnScroll() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements
  document.querySelectorAll('.feature-card, .module-card, .integration-item').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// Export/Print Functions
// ============================================

function exportToPDF() {
  window.print();
}

function exportProgress() {
  const data = {
    progress: AppState.progress,
    chatHistory: AppState.chatHistory,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mlm-ai-progress-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// Utility Functions
// ============================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================
// Analytics (Placeholder for production)
// ============================================

function trackEvent(eventName, properties = {}) {
  console.log('Event tracked:', eventName, properties);
  // In production, this would send to analytics service
}

function trackPageView(pageName) {
  console.log('Page view:', pageName);
  // In production, this would send to analytics service
}

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  // In production, send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // In production, send to error tracking service
});

// ============================================
// Export for external use
// ============================================

window.MLMAIApp = {
  AppState,
  openModule,
  updateModuleProgress,
  exportToPDF,
  exportProgress,
  showNotification
};

console.log('MLM AI Sales Automation System loaded successfully');