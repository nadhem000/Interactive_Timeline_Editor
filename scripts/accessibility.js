const WTHtimelineaccessibility = (function() {
    // Font size management
    let WTHtimelineCurrentFontSize = 12;
    const WTHtimelineFontSizes = [12, 14, 16, 18];
    
    // PWA installation
    let WTHtimelineDeferredPrompt = null;

    // Sync settings
    const WTHtimelineSyncSettings = {
        backgroundSync: true,
        periodicSync: true,
        lastSync: null,
        syncInterval: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    };

    // Define the font size update function FIRST
    function WTHtimelineaccessibilityUpdateFontSize() {
        const fontSizeDisplay = WTHtimelineDOMManager.getElement('WTHtimelineFontSizeDisplay');
        if (fontSizeDisplay) {
            fontSizeDisplay.textContent = WTHtimelineCurrentFontSize + 'px';
        }
        
        // Update button states
        const decreaseBtn = WTHtimelineDOMManager.getElement('WTHtimelineFontSizeDecrease');
        const increaseBtn = WTHtimelineDOMManager.getElement('WTHtimelineFontSizeIncrease');
        
        if (decreaseBtn) {
            decreaseBtn.disabled = WTHtimelineCurrentFontSize === WTHtimelineFontSizes[0];
        }
        if (increaseBtn) {
            increaseBtn.disabled = WTHtimelineCurrentFontSize === WTHtimelineFontSizes[WTHtimelineFontSizes.length - 1];
        }
    }

    // Load sync settings from localStorage
    function WTHtimelineaccessibilityLoadSyncSettings() {
        try {
            const savedSettings = localStorage.getItem('WTHtimelineSyncSettings');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                Object.assign(WTHtimelineSyncSettings, parsedSettings);
            }
            WTHtimelineaccessibilityUpdateSyncUI();
        } catch (error) {
            console.error('WTH Timeline: Error loading sync settings', error);
        }
    }

    // Save sync settings to localStorage
    function WTHtimelineaccessibilitySaveSyncSettings() {
        try {
            localStorage.setItem('WTHtimelineSyncSettings', JSON.stringify(WTHtimelineSyncSettings));
            WTHtimelineaccessibilityUpdateSyncUI();
        } catch (error) {
            console.error('WTH Timeline: Error saving sync settings', error);
        }
    }

    // Update sync UI based on current settings
    function WTHtimelineaccessibilityUpdateSyncUI() {
        // Update radio buttons
        const backgroundSyncYes = document.querySelector('input[name="WTHtimelineBackgroundSyncOption"][value="yes"]');
        const backgroundSyncNo = document.querySelector('input[name="WTHtimelineBackgroundSyncOption"][value="no"]');
        const periodicSyncYes = document.querySelector('input[name="WTHtimelinePeriodicSyncOption"][value="yes"]');
        const periodicSyncNo = document.querySelector('input[name="WTHtimelinePeriodicSyncOption"][value="no"]');

        if (backgroundSyncYes && backgroundSyncNo) {
            if (WTHtimelineSyncSettings.backgroundSync) {
                backgroundSyncYes.checked = true;
            } else {
                backgroundSyncNo.checked = true;
            }
        }

        if (periodicSyncYes && periodicSyncNo) {
            if (WTHtimelineSyncSettings.periodicSync) {
                periodicSyncYes.checked = true;
            } else {
                periodicSyncNo.checked = true;
            }
        }
    }

    // Initialize accessibility features
    function WTHtimelineaccessibilityInit() {
        WTHtimelineaccessibilityLoadSyncSettings();
        WTHtimelineaccessibilityBindEvents();
        WTHtimelineaccessibilityUpdateFontSize();
        WTHtimelineaccessibilityInitializePWA();
        WTHtimelineaccessibilityInitializeSync();
    }

    // Initialize sync functionality
    function WTHtimelineaccessibilityInitializeSync() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                // Register periodic sync if enabled
                if (WTHtimelineSyncSettings.periodicSync) {
                    WTHtimelineaccessibilityRegisterPeriodicSync(registration);
                }
                
                // Check if background sync should be triggered
                if (WTHtimelineSyncSettings.backgroundSync) {
                    WTHtimelineaccessibilityCheckBackgroundSync();
                }
            });
        }
    }

    // Register periodic background sync
    function WTHtimelineaccessibilityRegisterPeriodicSync(registration) {
        if ('periodicSync' in registration) {
            try {
                registration.periodicSync.register('WTH-timeline-update', {
                    minInterval: WTHtimelineSyncSettings.syncInterval // 24 hours
                }).then(() => {
                    console.log('WTH Timeline: Periodic sync registered');
                }).catch(error => {
                    console.log('WTH Timeline: Periodic sync registration failed:', error);
                });
            } catch (error) {
                console.log('WTH Timeline: Periodic sync not supported:', error);
            }
        }
    }

    // Unregister periodic sync
    function WTHtimelineaccessibilityUnregisterPeriodicSync(registration) {
        if ('periodicSync' in registration) {
            registration.periodicSync.unregister('WTH-timeline-update').then(() => {
                console.log('WTH Timeline: Periodic sync unregistered');
            }).catch(error => {
                console.log('WTH Timeline: Periodic sync unregistration failed:', error);
            });
        }
    }

    // Check if background sync should be triggered
    function WTHtimelineaccessibilityCheckBackgroundSync() {
        const now = Date.now();
        const shouldSync = !WTHtimelineSyncSettings.lastSync || 
                          (now - WTHtimelineSyncSettings.lastSync) > WTHtimelineSyncSettings.syncInterval;
        
        if (shouldSync && WTHtimelineSyncSettings.backgroundSync) {
            WTHtimelineaccessibilityTriggerBackgroundSync();
        }
    }

    // Trigger background sync
    function WTHtimelineaccessibilityTriggerBackgroundSync() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('WTH-timeline-background-sync').then(() => {
                    console.log('WTH Timeline: Background sync registered');
                    WTHtimelineSyncSettings.lastSync = Date.now();
                    WTHtimelineaccessibilitySaveSyncSettings();
                }).catch(error => {
                    console.log('WTH Timeline: Background sync registration failed:', error);
                });
            });
        }
    }

    // Handle sync setting changes
    function WTHtimelineaccessibilityHandleSyncSettingChange(setting, value) {
        WTHtimelineSyncSettings[setting] = value;
        WTHtimelineaccessibilitySaveSyncSettings();

        // Update service worker registration if needed
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                if (setting === 'periodicSync') {
                    if (value) {
                        WTHtimelineaccessibilityRegisterPeriodicSync(registration);
                    } else {
                        WTHtimelineaccessibilityUnregisterPeriodicSync(registration);
                    }
                }
                
                if (setting === 'backgroundSync' && value) {
                    WTHtimelineaccessibilityTriggerBackgroundSync();
                }
            });
        }
    }

    // Initialize PWA installation
    function WTHtimelineaccessibilityInitializePWA() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            WTHtimelineDeferredPrompt = e;
            // Show the install button
            WTHtimelineaccessibilityShowInstallButton();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            // Hide the install button
            WTHtimelineaccessibilityHideInstallButton();
            // Clear the deferredPrompt
            WTHtimelineDeferredPrompt = null;
            console.log('WTH Timeline: PWA installed successfully');
        });

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            WTHtimelineaccessibilityHideInstallButton();
        }
    }

    // Show install button
    function WTHtimelineaccessibilityShowInstallButton() {
        const installBtn = WTHtimelineDOMManager.getElement('WTHtimelineInstallBtn');
        if (installBtn) {
            installBtn.style.display = 'flex';
        }
    }

    // Hide install button
    function WTHtimelineaccessibilityHideInstallButton() {
        const installBtn = WTHtimelineDOMManager.getElement('WTHtimelineInstallBtn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    // Handle install button click
    function WTHtimelineaccessibilityHandleInstall() {
        if (!WTHtimelineDeferredPrompt) {
            return;
        }

        // Show the install prompt
        WTHtimelineDeferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        WTHtimelineDeferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('WTH Timeline: User accepted the install prompt');
            } else {
                console.log('WTH Timeline: User dismissed the install prompt');
            }
            // Clear the deferredPrompt variable
            WTHtimelineDeferredPrompt = null;
            // Hide the install button regardless of outcome
            WTHtimelineaccessibilityHideInstallButton();
        });
    }
	
    function WTHtimelineaccessibilityBindEvents() {
        // Options modal events
        const WTHtimelineaccessibilityOptionsIcon = WTHtimelineDOMManager.getElement('WTHtimelineOptionsIcon');
        if (WTHtimelineaccessibilityOptionsIcon) {
            WTHtimelineaccessibilityOptionsIcon.addEventListener('click', WTHtimelineaccessibilityOpenOptionsModal);
        }
        
        const WTHtimelineaccessibilityModalClose = WTHtimelineDOMManager.getElement('WTHtimelineModalClose');
        if (WTHtimelineaccessibilityModalClose) {
            WTHtimelineaccessibilityModalClose.addEventListener('click', WTHtimelineaccessibilityCloseOptionsModal);
        }
        
        const WTHtimelineaccessibilityComingSoonClose = WTHtimelineDOMManager.getElement('WTHtimelineComingSoonClose');
        if (WTHtimelineaccessibilityComingSoonClose) {
            WTHtimelineaccessibilityComingSoonClose.addEventListener('click', WTHtimelineaccessibilityCloseComingSoon);
        }
        
        // Question icon event
        const WTHtimelineaccessibilityQuestionIcon = WTHtimelineDOMManager.getElement('WTHtimelineQuestionIcon');
        if (WTHtimelineaccessibilityQuestionIcon) {
            WTHtimelineaccessibilityQuestionIcon.addEventListener('click', WTHtimelineaccessibilityShowComingSoon);
        }
        
        // NEW: Font size control events
        const fontSizeDecreaseBtn = WTHtimelineDOMManager.getElement('WTHtimelineFontSizeDecrease');
        if (fontSizeDecreaseBtn) {
            fontSizeDecreaseBtn.addEventListener('click', WTHtimelineaccessibilityDecreaseFontSize);
        }
        
        const fontSizeIncreaseBtn = WTHtimelineDOMManager.getElement('WTHtimelineFontSizeIncrease');
        if (fontSizeIncreaseBtn) {
            fontSizeIncreaseBtn.addEventListener('click', WTHtimelineaccessibilityIncreaseFontSize);
        }
        
        // NEW: Sync option events
        const backgroundSyncOptions = document.querySelectorAll('input[name="WTHtimelineBackgroundSyncOption"]');
        backgroundSyncOptions.forEach(option => {
            option.addEventListener('change', function() {
                WTHtimelineaccessibilityHandleSyncSettingChange('backgroundSync', this.value === 'yes');
            });
        });
        
        const periodicSyncOptions = document.querySelectorAll('input[name="WTHtimelinePeriodicSyncOption"]');
        periodicSyncOptions.forEach(option => {
            option.addEventListener('change', function() {
                WTHtimelineaccessibilityHandleSyncSettingChange('periodicSync', this.value === 'yes');
            });
        });
        
        // NEW: Action button events
        const saveChangesBtn = WTHtimelineDOMManager.getElement('WTHtimelineSaveChanges');
        if (saveChangesBtn) {
            saveChangesBtn.addEventListener('click', WTHtimelineaccessibilitySaveChanges);
        }
        
        const discardChangesBtn = WTHtimelineDOMManager.getElement('WTHtimelineDiscardChanges');
        if (discardChangesBtn) {
            discardChangesBtn.addEventListener('click', WTHtimelineaccessibilityDiscardChanges);
        }
        
        const resetDefaultBtn = WTHtimelineDOMManager.getElement('WTHtimelineResetDefault');
        if (resetDefaultBtn) {
            resetDefaultBtn.addEventListener('click', WTHtimelineaccessibilityResetToDefault);
        }
        
        // Sync now button event
        const WTHtimelineaccessibilitySyncNow = WTHtimelineDOMManager.getElement('WTHtimelineSyncNow');
        if (WTHtimelineaccessibilitySyncNow) {
            WTHtimelineaccessibilitySyncNow.addEventListener('click', WTHtimelineaccessibilityHandleSyncNow);
        }
        
        // Install button event
        const installBtn = WTHtimelineDOMManager.getElement('WTHtimelineInstallBtn');
        if (installBtn) {
            installBtn.addEventListener('click', WTHtimelineaccessibilityHandleInstall);
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            const WTHtimelineaccessibilityOptionsModal = WTHtimelineDOMManager.getElement('WTHtimelineOptionsModal');
            const WTHtimelineaccessibilityComingSoon = WTHtimelineDOMManager.getElement('WTHtimelineComingSoon');
            
            if (event.target === WTHtimelineaccessibilityOptionsModal) {
                WTHtimelineaccessibilityCloseOptionsModal();
            }
            if (event.target === WTHtimelineaccessibilityComingSoon) {
                WTHtimelineaccessibilityCloseComingSoon();
            }
        });
    }

    // Font size control functions
    function WTHtimelineaccessibilityDecreaseFontSize() {
        const currentIndex = WTHtimelineFontSizes.indexOf(WTHtimelineCurrentFontSize);
        if (currentIndex > 0) {
            WTHtimelineCurrentFontSize = WTHtimelineFontSizes[currentIndex - 1];
            WTHtimelineaccessibilityUpdateFontSize();
        }
    }

    function WTHtimelineaccessibilityIncreaseFontSize() {
        const currentIndex = WTHtimelineFontSizes.indexOf(WTHtimelineCurrentFontSize);
        if (currentIndex < WTHtimelineFontSizes.length - 1) {
            WTHtimelineCurrentFontSize = WTHtimelineFontSizes[currentIndex + 1];
            WTHtimelineaccessibilityUpdateFontSize();
        }
    }

    // Open options modal
    function WTHtimelineaccessibilityOpenOptionsModal() {
        const WTHtimelineaccessibilityOptionsModal = WTHtimelineDOMManager.getElement('WTHtimelineOptionsModal');
        if (WTHtimelineaccessibilityOptionsModal) {
            WTHtimelineaccessibilityOptionsModal.style.display = 'flex';
        }
    }

    // Close options modal
    function WTHtimelineaccessibilityCloseOptionsModal() {
        const WTHtimelineaccessibilityOptionsModal = WTHtimelineDOMManager.getElement('WTHtimelineOptionsModal');
        if (WTHtimelineaccessibilityOptionsModal) {
            WTHtimelineaccessibilityOptionsModal.style.display = 'none';
        }
    }

    // Show coming soon modal
    function WTHtimelineaccessibilityShowComingSoon() {
        const WTHtimelineaccessibilityComingSoon = WTHtimelineDOMManager.getElement('WTHtimelineComingSoon');
        if (WTHtimelineaccessibilityComingSoon) {
            WTHtimelineaccessibilityComingSoon.style.display = 'flex';
        }
    }

    // Close coming soon modal
    function WTHtimelineaccessibilityCloseComingSoon() {
        const WTHtimelineaccessibilityComingSoon = WTHtimelineDOMManager.getElement('WTHtimelineComingSoon');
        if (WTHtimelineaccessibilityComingSoon) {
            WTHtimelineaccessibilityComingSoon.style.display = 'none';
        }
    }

    // Handle sync now functionality
    function WTHtimelineaccessibilityHandleSyncNow() {
        if (WTHtimelineSyncSettings.backgroundSync) {
            WTHtimelineaccessibilityTriggerBackgroundSync();
            alert('Sync started! Your timeline data will be updated in the background.');
        } else {
            alert('Background sync is disabled. Enable it in settings to use this feature.');
        }
    }

    // Action button handlers
    function WTHtimelineaccessibilitySaveChanges() {
        // Save current settings
        const settings = WTHtimelineaccessibilityGetSettings();
        
        // Update sync settings based on form
        const backgroundSyncYes = document.querySelector('input[name="WTHtimelineBackgroundSyncOption"][value="yes"]');
        const periodicSyncYes = document.querySelector('input[name="WTHtimelinePeriodicSyncOption"][value="yes"]');
        
        if (backgroundSyncYes) {
            WTHtimelineSyncSettings.backgroundSync = backgroundSyncYes.checked;
        }
        if (periodicSyncYes) {
            WTHtimelineSyncSettings.periodicSync = periodicSyncYes.checked;
        }
        
        WTHtimelineaccessibilitySaveSyncSettings();
        
        console.log('WTH Timeline: Saving settings', settings);
        
        // Show success feedback
        alert('Settings saved successfully!');
        WTHtimelineaccessibilityCloseOptionsModal();
    }

    function WTHtimelineaccessibilityDiscardChanges() {
        // Reset to previously saved settings
        WTHtimelineaccessibilityLoadSyncSettings();
        console.log('WTH Timeline: Discarding changes');
        WTHtimelineaccessibilityCloseOptionsModal();
    }

    function WTHtimelineaccessibilityResetToDefault() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            // Reset all settings to default
            WTHtimelineCurrentFontSize = 12;
            WTHtimelineaccessibilityUpdateFontSize();
            
            // Reset radio buttons to default
            const readingModeNormal = document.querySelector('input[name="WTHtimelineReadingModeOption"][value="normal"]');
            if (readingModeNormal) readingModeNormal.checked = true;
            
            const modeLight = document.querySelector('input[name="WTHtimelineModeOption"][value="light"]');
            if (modeLight) modeLight.checked = true;
            
            const notificationsYes = document.querySelector('input[name="WTHtimelineNotificationsOption"][value="yes"]');
            if (notificationsYes) notificationsYes.checked = true;
            
            const updatesNo = document.querySelector('input[name="WTHtimelineUpdatesOption"][value="no"]');
            if (updatesNo) updatesNo.checked = true;
            
            // Reset sync settings to default
            WTHtimelineSyncSettings.backgroundSync = true;
            WTHtimelineSyncSettings.periodicSync = true;
            WTHtimelineSyncSettings.lastSync = null;
            WTHtimelineaccessibilitySaveSyncSettings();
            
            console.log('WTH Timeline: Settings reset to default');
        }
    }

    // Apply accessibility settings (for future use)
    function WTHtimelineaccessibilityApplySettings(settings) {
        // Future implementation for applying accessibility settings
        console.log('WTH Timeline: Applying settings', settings);
    }

    // Get current accessibility settings
    function WTHtimelineaccessibilityGetSettings() {
        const WTHtimelineLanguageOption = WTHtimelineDOMManager.getElement('WTHtimelineLanguageOption');
        const language = WTHtimelineLanguageOption ? WTHtimelineLanguageOption.value : 'en';
        
        // Get radio button values
        const mode = document.querySelector('input[name="WTHtimelineModeOption"]:checked')?.value || 'light';
        const readingMode = document.querySelector('input[name="WTHtimelineReadingModeOption"]:checked')?.value || 'normal';
        const notifications = document.querySelector('input[name="WTHtimelineNotificationsOption"]:checked')?.value || 'yes';
        const updates = document.querySelector('input[name="WTHtimelineUpdatesOption"]:checked')?.value || 'no';
        const backgroundSync = document.querySelector('input[name="WTHtimelineBackgroundSyncOption"]:checked')?.value || 'yes';
        const periodicSync = document.querySelector('input[name="WTHtimelinePeriodicSyncOption"]:checked')?.value || 'yes';
        
        const settings = {
            language: language,
            mode: mode,
            readingMode: readingMode,
            fontSize: WTHtimelineCurrentFontSize,
            notifications: notifications,
            updates: updates,
            backgroundSync: backgroundSync,
            periodicSync: periodicSync
        };
        return settings;
    }

    // Public API
    return {
        init: WTHtimelineaccessibilityInit,
        openOptions: WTHtimelineaccessibilityOpenOptionsModal,
        closeOptions: WTHtimelineaccessibilityCloseOptionsModal,
        showHelp: WTHtimelineaccessibilityShowComingSoon,
        getSettings: WTHtimelineaccessibilityGetSettings,
        applySettings: WTHtimelineaccessibilityApplySettings,
        getSyncSettings: function() { return WTHtimelineSyncSettings; }
    };
})();