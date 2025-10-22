// Timeline Controls functionality for WTH Timeline
const WTHtimelineControl = (function() {
    // Sample timeline data
    let WTHtimelineData = [
        { id: 1, year: 1440, event: "Johannes Gutenberg invents the printing press", era: "Renaissance", language: "en" },
        { id: 2, year: 1492, event: "Christopher Columbus reaches the Americas", era: "Age of Exploration", language: "en" },
        { id: 3, year: 1789, event: "French Revolution begins", era: "Modern Era", language: "en" },
        { id: 4, year: 1969, event: "First moon landing", era: "Space Age", language: "en" },
        { id: 5, year: 2020, event: "COVID-19 pandemic begins", era: "Contemporary", language: "en" }
    ];

    let WTHtimelineCurrentLanguage = 'all';
    let WTHtimelineNextId = WTHtimelineData.length > 0 ? Math.max(...WTHtimelineData.map(item => item.id)) + 1 : 1;

    // Initialize timeline controls
    function WTHtimelineControlInit() {
        WTHtimelineControlBindEvents();
        WTHtimelineRenderTimeline();
    }

    // Bind event listeners
    function WTHtimelineControlBindEvents() {
        // Get elements using DOM Manager
        const WTHtimelineAddButton = WTHtimelineDOMManager.getElement('WTHtimelineAddBtn');
        const WTHtimelineClearButton = WTHtimelineDOMManager.getElement('WTHtimelineClearBtn');
        const WTHtimelineExportButton = WTHtimelineDOMManager.getElement('WTHtimelineExportBtn');
        const WTHtimelineImportButton = WTHtimelineDOMManager.getElement('WTHtimelineImportBtn');
        const WTHtimelineToggleSidebar = WTHtimelineDOMManager.getElement('WTHtimelineToggleSidebar');
        const WTHtimelineControlsPanel = WTHtimelineDOMManager.getElement('WTHtimelineControlsPanel');

        // Timeline functionality events
        if (WTHtimelineAddButton) {
            WTHtimelineAddButton.addEventListener('click', WTHtimelineAddTimelineItem);
        }
        
        if (WTHtimelineClearButton) {
            WTHtimelineClearButton.addEventListener('click', WTHtimelineClearTimeline);
        }
        
        if (WTHtimelineExportButton) {
            WTHtimelineExportButton.addEventListener('click', WTHtimelineExportTimeline);
        }
        
        if (WTHtimelineImportButton) {
            WTHtimelineImportButton.addEventListener('click', WTHtimelineImportTimeline);
        }
        
        // Language filter events
        const WTHtimelineLanguageButtons = WTHtimelineDOMManager.getElements('.WTH-timeline-language-btn');
        WTHtimelineLanguageButtons.forEach(button => {
            button.addEventListener('click', function() {
                WTHtimelineLanguageButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                WTHtimelineCurrentLanguage = this.getAttribute('data-lang');
                WTHtimelineRenderTimeline();
            });
        });
        
        // Sidebar toggle event
        if (WTHtimelineToggleSidebar && WTHtimelineControlsPanel) {
            WTHtimelineToggleSidebar.addEventListener('click', function() {
                WTHtimelineControlsPanel.classList.toggle('collapsed');
                
                const buttonText = WTHtimelineControlsPanel.classList.contains('collapsed') ? 
                    WTH_I18N.timeline.body.expand_sidebar : WTH_I18N.timeline.body.collapse_sidebar;
                const icon = WTHtimelineControlsPanel.classList.contains('collapsed') ? '▶' : '◀';
                
                const firstSpan = this.querySelector('span:first-child');
                const iconSpan = this.querySelector('.WTH-timeline-sidebar-toggle-icon');
                
                if (firstSpan) firstSpan.textContent = buttonText;
                if (iconSpan) iconSpan.textContent = icon;
            });
        }
        
        // Section header events
        const WTHtimelineSectionHeaders = WTHtimelineDOMManager.getElements('.WTH-timeline-section-header');
        WTHtimelineSectionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const section = this.parentElement;
                section.classList.toggle('collapsed');
            });
        });
    }

    // Add timeline item
    function WTHtimelineAddTimelineItem() {
        const WTHtimelineYearInput = WTHtimelineDOMManager.getElement('WTHtimelineYear');
        const WTHtimelineEventInput = WTHtimelineDOMManager.getElement('WTHtimelineEvent');
        const WTHtimelineEraInput = WTHtimelineDOMManager.getElement('WTHtimelineEra');
        const WTHtimelineLanguageInput = WTHtimelineDOMManager.getElement('WTHtimelineLanguage');

        if (!WTHtimelineYearInput || !WTHtimelineEventInput) {
            console.error('WTHtimelineControl: Required input elements not found');
            return;
        }

        const year = parseInt(WTHtimelineYearInput.value);
        const event = WTHtimelineEventInput.value.trim();
        const era = WTHtimelineEraInput ? WTHtimelineEraInput.value.trim() : '';
        const language = WTHtimelineLanguageInput ? WTHtimelineLanguageInput.value : 'en';
        
        if (!year || !event) {
            alert(WTH_I18N.timeline.body.validation_year_event_required);
            return;
        }
        
        const newItem = {
            id: WTHtimelineNextId++,
            year: year,
            event: event,
            era: era,
            language: language
        };
        
        WTHtimelineData.push(newItem);
        WTHtimelineData.sort((a, b) => a.year - b.year);
        
        // Clear inputs
        WTHtimelineYearInput.value = '';
        WTHtimelineEventInput.value = '';
        if (WTHtimelineEraInput) WTHtimelineEraInput.value = '';
        
        WTHtimelineRenderTimeline();
    }

    // Render timeline
    function WTHtimelineRenderTimeline() {
        const WTHtimelineElement = WTHtimelineDOMManager.getElement('WTHtimelineTimeline');
        
        if (!WTHtimelineElement) {
            console.error('WTHtimelineControl: Timeline element not found');
            return;
        }

        // Filter data by current language
        const filteredData = WTHtimelineCurrentLanguage === 'all' 
            ? WTHtimelineData 
            : WTHtimelineData.filter(item => item.language === WTHtimelineCurrentLanguage);
        
        if (filteredData.length === 0) {
            WTHtimelineElement.innerHTML = `
                <div class="WTH-timeline-empty-timeline">
                    <p data-i18n="WTH.timeline.body.no_items_message">No timeline items found for the selected language.</p>
                </div>
            `;
            return;
        }
        
        let timelineHTML = '';
        filteredData.forEach(item => {
            timelineHTML += `
                <div class="WTH-timeline-timeline-item" data-id="${item.id}">
                    <div class="WTH-timeline-timeline-marker"></div>
                    <div class="WTH-timeline-timeline-content">
                        <div class="WTH-timeline-timeline-year">${item.year}</div>
                        <div class="WTH-timeline-timeline-event">${item.event}</div>
                        ${item.era ? `<div class="WTH-timeline-timeline-era">${item.era}</div>` : ''}
                        <div style="margin-top: 10px; font-size: 0.8rem; color: #7f8c8d;">
                            <span data-i18n="WTH.timeline.body.item_language_label">Language</span>: ${WTHtimelineGetLanguageName(item.language)}
                        </div>
                        <div class="WTH-timeline-actions">
                            <button class="WTH-timeline-button WTHtimelineEditBtn" data-id="${item.id}" data-i18n="WTH.timeline.body.edit_button">Edit</button>
                            <button class="WTH-timeline-button WTH-timeline-btn-danger WTHtimelineDeleteBtn" data-id="${item.id}" data-i18n="WTH.timeline.body.delete_button">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        WTHtimelineElement.innerHTML = timelineHTML;
        
        // Add event listeners for edit and delete buttons
        const editButtons = WTHtimelineDOMManager.getElements('.WTHtimelineEditBtn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                WTHtimelineEditTimelineItem(id);
            });
        });
        
        const deleteButtons = WTHtimelineDOMManager.getElements('.WTHtimelineDeleteBtn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                WTHtimelineDeleteTimelineItem(id);
            });
        });
    }

    // Edit timeline item
    function WTHtimelineEditTimelineItem(id) {
        const item = WTHtimelineData.find(item => item.id === id);
        if (!item) return;
        
        // Create edit form
        const editForm = `
            <div class="WTH-timeline-form-group">
                <label class="WTH-timeline-label" for="WTHtimelineEditYear-${id}" data-i18n="WTH.timeline.body.year_label">Year</label>
                <input class="WTH-timeline-input" type="number" id="WTHtimelineEditYear-${id}" value="${item.year}">
            </div>
            <div class="WTH-timeline-form-group">
                <label class="WTH-timeline-label" for="WTHtimelineEditEvent-${id}" data-i18n="WTH.timeline.body.event_label">Event</label>
                <textarea class="WTH-timeline-textarea" id="WTHtimelineEditEvent-${id}" rows="3">${item.event}</textarea>
            </div>
            <div class="WTH-timeline-form-group">
                <label class="WTH-timeline-label" for="WTHtimelineEditEra-${id}" data-i18n="WTH.timeline.body.era_label">Era</label>
                <input class="WTH-timeline-input" type="text" id="WTHtimelineEditEra-${id}" value="${item.era || ''}">
            </div>
            <div class="WTH-timeline-form-group">
                <label class="WTH-timeline-label" for="WTHtimelineEditLanguage-${id}" data-i18n="WTH.timeline.body.language_label">Language</label>
                <select class="WTH-timeline-select" id="WTHtimelineEditLanguage-${id}">
                    <option value="en" ${item.language === 'en' ? 'selected' : ''} data-i18n="WTH.timeline.body.language_en">English</option>
                    <option value="es" ${item.language === 'es' ? 'selected' : ''} data-i18n="WTH.timeline.body.language_es">Spanish</option>
                    <option value="fr" ${item.language === 'fr' ? 'selected' : ''} data-i18n="WTH.timeline.body.language_fr">French</option>
                    <option value="de" ${item.language === 'de' ? 'selected' : ''} data-i18n="WTH.timeline.body.language_de">German</option>
                    <option value="it" ${item.language === 'it' ? 'selected' : ''} data-i18n="WTH.timeline.body.language_it">Italian</option>
                </select>
            </div>
            <div class="WTH-timeline-actions">
                <button class="WTH-timeline-button WTH-timeline-btn-success WTHtimelineSaveEditBtn" data-id="${id}" data-i18n="WTH.timeline.body.save_button">Save</button>
                <button class="WTH-timeline-button WTHtimelineCancelEditBtn" data-id="${id}" data-i18n="WTH.timeline.body.cancel_button">Cancel</button>
            </div>
        `;
        
        // Replace timeline item content with edit form
        const timelineItem = document.querySelector(`.WTH-timeline-timeline-item[data-id="${id}"]`);
        if (timelineItem) {
            timelineItem.classList.add('WTH-timeline-editing');
            timelineItem.querySelector('.WTH-timeline-timeline-content').innerHTML = editForm;
            
            // Add event listeners for save and cancel
            const saveButton = timelineItem.querySelector('.WTHtimelineSaveEditBtn');
            const cancelButton = timelineItem.querySelector('.WTHtimelineCancelEditBtn');
            
            if (saveButton) {
                saveButton.addEventListener('click', function() {
                    WTHtimelineSaveTimelineItem(id);
                });
            }
            
            if (cancelButton) {
                cancelButton.addEventListener('click', function() {
                    WTHtimelineRenderTimeline();
                });
            }
        }
    }

    // Save timeline item
    function WTHtimelineSaveTimelineItem(id) {
        const item = WTHtimelineData.find(item => item.id === id);
        if (!item) return;
        
        const yearInput = document.getElementById(`WTHtimelineEditYear-${id}`);
        const eventInput = document.getElementById(`WTHtimelineEditEvent-${id}`);
        const eraInput = document.getElementById(`WTHtimelineEditEra-${id}`);
        const languageInput = document.getElementById(`WTHtimelineEditLanguage-${id}`);
        
        if (!yearInput || !eventInput || !languageInput) {
            alert('Error: Form elements not found');
            return;
        }
        
        const year = parseInt(yearInput.value);
        const event = eventInput.value.trim();
        const era = eraInput ? eraInput.value.trim() : '';
        const language = languageInput.value;
        
        if (!year || !event) {
            alert(WTH_I18N.timeline.body.validation_year_event_required);
            return;
        }
        
        // Update item
        item.year = year;
        item.event = event;
        item.era = era;
        item.language = language;
        
        // Sort timeline
        WTHtimelineData.sort((a, b) => a.year - b.year);
        WTHtimelineRenderTimeline();
    }

    // Delete timeline item
    function WTHtimelineDeleteTimelineItem(id) {
        if (confirm(WTH_I18N.timeline.body.confirm_delete_item)) {
            WTHtimelineData = WTHtimelineData.filter(item => item.id !== id);
            WTHtimelineRenderTimeline();
        }
    }

    // Clear timeline
    function WTHtimelineClearTimeline() {
        if (confirm(WTH_I18N.timeline.body.confirm_clear_timeline)) {
            WTHtimelineData = [];
            WTHtimelineNextId = 1;
            WTHtimelineRenderTimeline();
        }
    }

    // Export timeline
    function WTHtimelineExportTimeline() {
        const dataStr = JSON.stringify(WTHtimelineData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = WTH_I18N.timeline.body.export_filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import timeline
    function WTHtimelineImportTimeline() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (Array.isArray(importedData)) {
                        // Validate imported data
                        const validData = importedData.filter(item => 
                            item.hasOwnProperty('year') && 
                            item.hasOwnProperty('event') &&
                            item.hasOwnProperty('language')
                        );
                        
                        if (validData.length > 0) {
                            WTHtimelineData = validData;
                            WTHtimelineNextId = WTHtimelineData.length > 0 ? Math.max(...WTHtimelineData.map(item => item.id)) + 1 : 1;
                            WTHtimelineRenderTimeline();
                            alert(WTH_I18N.timeline.body.import_success);
                        } else {
                            alert(WTH_I18N.timeline.body.import_invalid_format);
                        }
                    } else {
                        alert(WTH_I18N.timeline.body.import_invalid_format);
                    }
                } catch (error) {
                    alert(WTH_I18N.timeline.body.import_parse_error + error.message);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    // Get language name from code
    function WTHtimelineGetLanguageName(code) {
        const languages = {
            'en': WTH_I18N.timeline.body.language_en,
            'es': WTH_I18N.timeline.body.language_es,
            'fr': WTH_I18N.timeline.body.language_fr,
            'de': WTH_I18N.timeline.body.language_de,
            'it': WTH_I18N.timeline.body.language_it
        };
        return languages[code] || code;
    }

    // Public API
    return {
        init: WTHtimelineControlInit,
        getData: function() { return WTHtimelineData; },
        setData: function(data) { 
            WTHtimelineData = data;
            WTHtimelineNextId = WTHtimelineData.length > 0 ? Math.max(...WTHtimelineData.map(item => item.id)) + 1 : 1;
            WTHtimelineRenderTimeline();
        }
    };
})();