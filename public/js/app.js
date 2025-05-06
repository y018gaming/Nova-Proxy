document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const urlInput = document.getElementById('url-input');
  const browseButton = document.getElementById('browse-button');
  
  // Configuration
  let proxyConfig = {
    type: 'ultraviolet', // Default proxy type
    prefix: '/service/'
  };
  
  // Fetch proxy configuration from API
  async function fetchProxyConfig() {
    try {
      const response = await fetch('/api/proxy/config');
      const config = await response.json();
      proxyConfig.type = config.defaultProxy;
      console.log('Proxy configuration loaded:', config);
    } catch (error) {
      console.error('Failed to load proxy configuration:', error);
    }
  }
  
  // Initialize the application
  async function init() {
    await fetchProxyConfig();
    attachEventListeners();
    checkForServiceWorker();
  }
  
  // Event listeners
  function attachEventListeners() {
    // Browse button click
    browseButton.addEventListener('click', handleBrowse);
    
    // Enter key in URL input
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleBrowse();
      }
    });
  }
  
  // Handle browse action
  function handleBrowse() {
    const input = urlInput.value.trim();
    
    if (!input) return;
    
    let url;
    
    // Check if input is a valid URL
    if (isValidURL(input)) {
      url = input;
      // Add https:// if protocol is missing
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
    } else {
      // Treat as search query
      url = 'https://www.google.com/search?q=' + encodeURIComponent(input);
    }
    
    // Navigate to proxied URL
    navigateToProxiedUrl(url);
  }
  
  // Check if string is valid URL
  function isValidURL(string) {
    // Simple regex for domain validation
    const pattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/i;
    return pattern.test(string) || /^https?:\/\//i.test(string);
  }
  
  // Navigate to proxied URL
  function navigateToProxiedUrl(url) {
    switch(proxyConfig.type) {
      case 'ultraviolet':
        navigateUltraviolet(url);
        break;
      case 'corrosion':
        navigateCorrosion(url);
        break;
      case 'dynamic':
        navigateDynamic(url);
        break;
      default:
        navigateUltraviolet(url);
    }
  }
  
  // Navigate using Ultraviolet proxy
  function navigateUltraviolet(url) {
    const encodedUrl = encodeURIComponent(btoa(url));
    window.location.href = '/proxy/ultraviolet/' + encodedUrl;
  }
  
  // Navigate using Corrosion proxy
  function navigateCorrosion(url) {
    const encodedUrl = encodeURIComponent(url);
    window.location.href = '/proxy/corrosion/' + encodedUrl;
  }
  
  // Navigate using Dynamic proxy selection
  function navigateDynamic(url) {
    const encodedUrl = encodeURIComponent(url);
    window.location.href = '/proxy/browse?url=' + encodedUrl;
  }
  
  // Check for service worker installation
  function checkForServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }
