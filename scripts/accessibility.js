// Accessibility and Options functionality for WTH Timeline
const WTHtimelineaccessibility = (function() {
    // Font size management
    let WTHtimelineCurrentFontSize = 12;
    const WTHtimelineFontSizes = [12, 14, 16, 18];

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

    // Initialize accessibility features
    function WTHtimelineaccessibilityInit() {
        WTHtimelineaccessibilityBindEvents();
        WTHtimelineaccessibilityUpdateFontSize();
    }

    // Rest of the code remains the same...
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
        
        // Option interactions (show coming soon for any option change)
        const WTHtimelineaccessibilityOptionElements = WTHtimelineDOMManager.getElements(
            '#WTHtimelineOptionsModal input, #WTHtimelineOptionsModal select, #WTHtimelineSyncNow'
        );
        
        WTHtimelineaccessibilityOptionElements.forEach(element => {
            element.addEventListener('click', function() {
                WTHtimelineaccessibilityShowComingSoon();
                WTHtimelineaccessibilityCloseOptionsModal();
            });
        });
        
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

    // Rest of the existing functions remain unchanged...
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
        WTHtimelineaccessibilityShowComingSoon();
        WTHtimelineaccessibilityCloseOptionsModal();
        
        // Future sync functionality would go here
        console.log('WTHtimelineaccessibility: Sync functionality would be implemented here');
    }

    // Action button handlers
    function WTHtimelineaccessibilitySaveChanges() {
        // Save current settings (in a real app, this would save to localStorage or backend)
        const settings = WTHtimelineaccessibilityGetSettings();
        console.log('WTHtimelineaccessibility: Saving settings', settings);
        
        // Show success feedback
        alert('Settings saved successfully!');
        WTHtimelineaccessibilityCloseOptionsModal();
    }

    function WTHtimelineaccessibilityDiscardChanges() {
        // Reset to previously saved settings (in a real app, this would reload from storage)
        console.log('WTHtimelineaccessibility: Discarding changes');
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
            
            const syncYes = document.querySelector('input[name="WTHtimelineSyncOption"][value="yes"]');
            if (syncYes) syncYes.checked = true;
            
            console.log('WTHtimelineaccessibility: Settings reset to default');
        }
    }

    // Apply accessibility settings (for future use)
    function WTHtimelineaccessibilityApplySettings(settings) {
        // Future implementation for applying accessibility settings
        console.log('WTHtimelineaccessibility: Applying settings', settings);
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
        const sync = document.querySelector('input[name="WTHtimelineSyncOption"]:checked')?.value || 'yes';
        
        const settings = {
            language: language,
            mode: mode,
            readingMode: readingMode,
            fontSize: WTHtimelineCurrentFontSize,
            notifications: notifications,
            updates: updates,
            sync: sync
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
        applySettings: WTHtimelineaccessibilityApplySettings
    };
})();