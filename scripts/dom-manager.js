const WTHtimelineDOMManager = (function() {
    let elements = {};

    // DOM Elements configuration
    const domConfig = {
        // Header elements
        header: {
            id: 'WTHtimelineHeader',
            html: `
                <h1 class="WTH-timeline-h1" data-i18n="WTH.timeline.header.heading">Interactive Timeline Editor</h1>
                <p class="WTH-timeline-subtitle" data-i18n="WTH.timeline.header.subtitle">Create and customize your own timeline with events, eras, and multiple languages</p>
                
                <!-- Install Button -->
                <div class="WTH-timeline-install-btn-container">
                    <button class="WTH-timeline-install-btn" id="WTHtimelineInstallBtn" style="display: none;">
                        <svg viewBox="0 0 24 24" class="WTH-timeline-install-icon">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                        <span data-i18n="WTH.timeline.header.install_button">Install App</span>
                    </button>
                </div>
                
                <!-- Question Icon -->
                <div class="WTH-timeline-question-icon" id="WTHtimelineQuestionIcon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                    </svg>
                </div>
                
                <!-- Options Icon -->
                <div class="WTH-timeline-options-icon" id="WTHtimelineOptionsIcon">
                    <svg viewBox="0 0 24 24">
                        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                    </svg>
                </div>
            `
        },

        // Options Modal
        optionsModal: {
            id: 'WTHtimelineOptionsModal',
            html: `
                <div class="WTH-timeline-modal-content">
                    <div class="WTH-timeline-modal-header">
                        <h3 class="WTH-timeline-modal-title" data-i18n="WTH.timeline.generalOptions.settings_title">Settings</h3>
                        <button class="WTH-timeline-modal-close" id="WTHtimelineModalClose">&times;</button>
                    </div>
                    <div class="WTH-timeline-modal-body">
                        <div class="WTH-timeline-option-group">
                            <label class="WTH-timeline-option-label" for="WTHtimelineLanguageOption" data-i18n="WTH.timeline.generalOptions.language_label">Language</label>
                            <select class="WTH-timeline-option-select" id="WTHtimelineLanguageOption">
                                <option value="en" data-i18n="WTH.timeline.generalOptions.language_en">English</option>
                                <option value="es" data-i18n="WTH.timeline.generalOptions.language_es">Spanish</option>
                                <option value="fr" data-i18n="WTH.timeline.generalOptions.language_fr">French</option>
                                <option value="de" data-i18n="WTH.timeline.generalOptions.language_de">German</option>
                                <option value="it" data-i18n="WTH.timeline.generalOptions.language_it">Italian</option>
                            </select>
                        </div>
                        
                        <div class="WTH-timeline-option-group">
                            <label class="WTH-timeline-option-label" data-i18n="WTH.timeline.generalOptions.mode_label">Mode</label>
                            <div class="WTH-timeline-radio-group">
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineModeOption" value="light" checked> 
                                    <span data-i18n="WTH.timeline.generalOptions.mode_light">Light</span>
                                </label>
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineModeOption" value="dark"> 
                                    <span data-i18n="WTH.timeline.generalOptions.mode_dark">Dark</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Reading Mode Option -->
                        <div class="WTH-timeline-option-group">
                            <label class="WTH-timeline-option-label" data-i18n="WTH.timeline.generalOptions.reading_mode_label">Reading Mode</label>
                            <div class="WTH-timeline-radio-group">
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineReadingModeOption" value="normal" checked> 
                                    <span data-i18n="WTH.timeline.generalOptions.reading_mode_normal">Normal Contrast</span>
                                </label>
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineReadingModeOption" value="high"> 
                                    <span data-i18n="WTH.timeline.generalOptions.reading_mode_high">High Contrast</span>
                                </label>
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineReadingModeOption" value="low"> 
                                    <span data-i18n="WTH.timeline.generalOptions.reading_mode_low">Low Contrast</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Font Size Control -->
                        <div class="WTH-timeline-option-group">
                            <label class="WTH-timeline-option-label" data-i18n="WTH.timeline.generalOptions.font_size_label">Font Size</label>
                            <div class="WTH-timeline-font-size-control">
                                <button class="WTH-timeline-font-size-btn" id="WTHtimelineFontSizeDecrease" data-i18n="WTH.timeline.generalOptions.font_size_decrease">-</button>
                                <span class="WTH-timeline-font-size-display" id="WTHtimelineFontSizeDisplay" data-i18n="WTH.timeline.generalOptions.font_size_default">12px</span>
                                <button class="WTH-timeline-font-size-btn" id="WTHtimelineFontSizeIncrease" data-i18n="WTH.timeline.generalOptions.font_size_increase">+</button>
                            </div>
                        </div>
                        
                        <!-- NEW: Background Sync Option -->
                        <div class="WTH-timeline-option-group">
                            <label class="WTH-timeline-option-label">Background Sync</label>
                            <div class="WTH-timeline-radio-group">
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineBackgroundSyncOption" value="yes" checked> 
                                    <span>Yes</span>
                                </label>
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineBackgroundSyncOption" value="no"> 
                                    <span>No</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- NEW: Periodic Sync Option -->
                        <div class="WTH-timeline-option-group">
                            <label class="WTH-timeline-option-label">Periodic Sync</label>
                            <div class="WTH-timeline-radio-group">
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelinePeriodicSyncOption" value="yes" checked> 
                                    <span>Yes</span>
                                </label>
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelinePeriodicSyncOption" value="no"> 
                                    <span>No</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="WTH-timeline-option-group">
                            <label class="WTH-timeline-option-label" data-i18n="WTH.timeline.generalOptions.notifications_label">Notifications</label>
                            <div class="WTH-timeline-radio-group">
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineNotificationsOption" value="yes" checked> 
                                    <span data-i18n="WTH.timeline.generalOptions.option_yes">Yes</span>
                                </label>
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineNotificationsOption" value="no"> 
                                    <span data-i18n="WTH.timeline.generalOptions.option_no">No</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="WTH-timeline-option-group">
                            <label class="WTH-timeline-option-label" data-i18n="WTH.timeline.generalOptions.updates_label">Updates Notifications</label>
                            <div class="WTH-timeline-radio-group">
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineUpdatesOption" value="yes"> 
                                    <span data-i18n="WTH.timeline.generalOptions.option_yes">Yes</span>
                                </label>
                                <label class="WTH-timeline-radio-option">
                                    <input type="radio" name="WTHtimelineUpdatesOption" value="no" checked> 
                                    <span data-i18n="WTH.timeline.generalOptions.option_no">No</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="WTH-timeline-option-group">
                            <button class="WTH-timeline-button" id="WTHtimelineSyncNow" data-i18n="WTH.timeline.generalOptions.sync_now_button">Sync Now</button>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="WTH-timeline-option-actions">
                            <button class="WTH-timeline-button WTH-timeline-btn-success" id="WTHtimelineSaveChanges" data-i18n="WTH.timeline.generalOptions.save_changes_button">Save Changes</button>
                            <button class="WTH-timeline-button" id="WTHtimelineDiscardChanges" data-i18n="WTH.timeline.generalOptions.discard_changes_button">Discard Changes</button>
                            <button class="WTH-timeline-button WTH-timeline-btn-danger" id="WTHtimelineResetDefault" data-i18n="WTH.timeline.generalOptions.reset_default_button">Reset to Default</button>
                        </div>
                    </div>
                </div>
            `
        },

        // Coming Soon Modal
        comingSoonModal: {
            id: 'WTHtimelineComingSoon',
            html: `
                <div class="WTH-timeline-coming-soon-content">
                    <div class="WTH-timeline-coming-soon-icon">🚧</div>
                    <h3 class="WTH-timeline-coming-soon-title" data-i18n="WTH.timeline.body.coming_soon_title">Coming Soon</h3>
                    <p class="WTH-timeline-coming-soon-text" data-i18n="WTH.timeline.body.coming_soon_message">This feature is currently under development and will be available in a future update.</p>
                    <button class="WTH-timeline-button" id="WTHtimelineComingSoonClose" data-i18n="WTH.timeline.body.coming_soon_ok">OK</button>
                </div>
            `
        }
    };


    // Service Worker and Initialization Functions

    // Enhanced service worker registration with offline fallback
    function WTHtimelineEnhancedSWRegistration() {
        if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
            navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('WTH Timeline Service Worker registered with scope:', registration.scope);
                
                // Check if we're currently offline
                if (!navigator.onLine) {
                    console.log('WTH Timeline: Starting in offline mode');
                    document.body.classList.add('WTH-timeline-offline');
                }
            })
            .catch(function(error) {
                console.log('WTH Timeline Service Worker registration failed:', error);
                WTHtimelineHandleOfflineFallback();
            });
        } else {
            // File protocol or no service worker support
            WTHtimelineHandleOfflineFallback();
        }
    }

    // Basic service worker registration for offline mode
    function WTHtimelineRegisterServiceWorker() {
        // Only register service worker if not in file:// protocol and if supported
        if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
            navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('WTH Timeline Service Worker registered with scope:', registration.scope);
            })
            .catch(function(error) {
                console.log('WTH Timeline Service Worker registration failed:', error);
                WTHtimelineHandleOfflineEnvironment();
            });
        } else {
            WTHtimelineHandleOfflineEnvironment();
        }
    }

    function WTHtimelineHandleOfflineFallback() {
        console.log('WTH Timeline: Using offline capabilities');
        // Could optionally redirect to offline.html here
        // window.location.href = '/offline.html';
    }

    // Handle offline/file protocol environment
    function WTHtimelineHandleOfflineEnvironment() {
        console.log('WTH Timeline: Running in offline/file environment');
        // Add offline-specific styling
        document.body.classList.add('WTH-timeline-offline-mode');
        
        // Update UI to show offline status
        const header = document.querySelector('.WTH-timeline-header');
        if (header) {
            const offlineIndicator = document.createElement('div');
            offlineIndicator.className = 'WTH-timeline-offline-banner';
            offlineIndicator.innerHTML = `
                <div class="WTH-timeline-offline-message">
                    <strong>Offline Mode</strong> - Working with local data only
                </div>
            `;
            header.appendChild(offlineIndicator);
        }
    }

    // Check online/offline status
    function WTHtimelineUpdateOnlineStatus() {
        const isOnline = navigator.onLine;
        document.body.classList.toggle('WTH-timeline-online', isOnline);
        document.body.classList.toggle('WTH-timeline-offline', !isOnline);
        
        if (!isOnline) {
            console.log('WTH Timeline: App is offline');
        }
    }

    // Fallback initialization if standard initialization fails
    function WTHtimelineFallbackInitialization() {
        setTimeout(function() {
            if (typeof WTHtimelineControl === 'undefined' || typeof WTHtimelineDOMManager === 'undefined') {
                console.log('WTH Timeline: Using fallback initialization for offline mode');
                // Basic functionality for offline mode
                const addButton = document.getElementById('WTHtimelineAddBtn');
                if (addButton) {
                    addButton.addEventListener('click', function() {
                        alert('Offline mode: Feature available in full version when online');
                    });
                }
            }
        }, 1000);
    }

    // Main initialization function
    function WTHtimelineInitializeApp() {
        // Set up online/offline event listeners
        window.addEventListener('online', WTHtimelineUpdateOnlineStatus);
        window.addEventListener('offline', WTHtimelineUpdateOnlineStatus);
        
        // Initial status check
        WTHtimelineUpdateOnlineStatus();
        
        // Register service worker (if applicable)
        if (window.location.pathname.includes('offline.html')) {
            WTHtimelineRegisterServiceWorker();
        } else {
            WTHtimelineEnhancedSWRegistration();
        }
        
        // Initialize app components
        if (typeof WTHtimelineDOMManager !== 'undefined') {
            WTHtimelineDOMManager.init();
        }
        if (typeof WTHtimelineaccessibility !== 'undefined') {
            WTHtimelineaccessibility.init();
        }
        if (typeof WTHtimelineControl !== 'undefined') {
            WTHtimelineControl.init();
        }

        // Set up fallback initialization
        WTHtimelineFallbackInitialization();
    }

    // Initialize DOM Manager
    function WTHtimelineDOMManagerInit() {
        WTHtimelineDOMManagerInjectElements();
    }

    // Inject all DOM elements
    function WTHtimelineDOMManagerInjectElements() {
        // Inject header
        const headerContainer = document.querySelector('.WTH-timeline-header');
        if (headerContainer) {
            headerContainer.innerHTML = domConfig.header.html;
        } else {
            console.error('WTHtimelineDOMManager: Header container not found');
        }

        // Inject options modal
        const optionsModalContainer = document.getElementById('WTHtimelineOptionsModal');
        if (optionsModalContainer) {
            optionsModalContainer.innerHTML = domConfig.optionsModal.html;
        } else {
            console.error('WTHtimelineDOMManager: Options modal container not found');
        }

        // Inject coming soon modal
        const comingSoonContainer = document.getElementById('WTHtimelineComingSoon');
        if (comingSoonContainer) {
            comingSoonContainer.innerHTML = domConfig.comingSoonModal.html;
        } else {
            console.error('WTHtimelineDOMManager: Coming soon modal container not found');
        }

        // Cache all elements for easy access
        WTHtimelineDOMManagerCacheElements();
    }

    // Cache DOM elements for easy access
    function WTHtimelineDOMManagerCacheElements() {
        // Accessibility elements
        elements.WTHtimelineOptionsIcon = document.getElementById('WTHtimelineOptionsIcon');
        elements.WTHtimelineOptionsModal = document.getElementById('WTHtimelineOptionsModal');
        elements.WTHtimelineModalClose = document.getElementById('WTHtimelineModalClose');
        elements.WTHtimelineComingSoon = document.getElementById('WTHtimelineComingSoon');
        elements.WTHtimelineComingSoonClose = document.getElementById('WTHtimelineComingSoonClose');
        elements.WTHtimelineSyncNow = document.getElementById('WTHtimelineSyncNow');
        elements.WTHtimelineQuestionIcon = document.getElementById('WTHtimelineQuestionIcon');
        elements.WTHtimelineInstallBtn = document.getElementById('WTHtimelineInstallBtn');

        // Control elements
        elements.WTHtimelineYearInput = document.getElementById('WTHtimelineYear');
        elements.WTHtimelineEventInput = document.getElementById('WTHtimelineEvent');
        elements.WTHtimelineEraInput = document.getElementById('WTHtimelineEra');
        elements.WTHtimelineLanguageInput = document.getElementById('WTHtimelineLanguage');
        elements.WTHtimelineAddButton = document.getElementById('WTHtimelineAddBtn');
        elements.WTHtimelineClearButton = document.getElementById('WTHtimelineClearBtn');
        elements.WTHtimelineExportButton = document.getElementById('WTHtimelineExportBtn');
        elements.WTHtimelineImportButton = document.getElementById('WTHtimelineImportBtn');
        elements.WTHtimelineElement = document.getElementById('WTHtimelineTimeline');
        elements.WTHtimelineToggleSidebar = document.getElementById('WTHtimelineToggleSidebar');
        elements.WTHtimelineControlsPanel = document.getElementById('WTHtimelineControlsPanel');

        // Font size elements
        elements.WTHtimelineFontSizeDecrease = document.getElementById('WTHtimelineFontSizeDecrease');
        elements.WTHtimelineFontSizeIncrease = document.getElementById('WTHtimelineFontSizeIncrease');
        elements.WTHtimelineFontSizeDisplay = document.getElementById('WTHtimelineFontSizeDisplay');
    }

    // Get element by ID with error handling
    function WTHtimelineDOMManagerGetElement(elementId) {
        const element = elements[elementId] || document.getElementById(elementId);
        
        if (!element) {
            console.warn(`WTHtimelineDOMManager: Element with ID '${elementId}' not found`);
            return null;
        }
        
        return element;
    }

    // Get multiple elements by selector
    function WTHtimelineDOMManagerGetElements(selector) {
        const foundElements = document.querySelectorAll(selector);
        
        if (!foundElements || foundElements.length === 0) {
            console.warn(`WTHtimelineDOMManager: No elements found for selector '${selector}'`);
            return [];
        }
        
        return foundElements;
    }

    // Public API
    return {
        init: WTHtimelineDOMManagerInit,
        getElement: WTHtimelineDOMManagerGetElement,
        getElements: WTHtimelineDOMManagerGetElements,
        injectElements: WTHtimelineDOMManagerInjectElements,
        initializeApp: WTHtimelineInitializeApp
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    WTHtimelineDOMManager.initializeApp();
});