export class ContentLoader {
    constructor() {
        this.loadedSections = new Set();
        this.sectionContent = {
            'games': 'content/games.html',
            'tools': 'content/tools.html',
            'osu-beatmap': 'content/osu-beatmap.html'
        };
    }

    async loadSectionContent(sectionId) {
        if (this.loadedSections.has(sectionId)) {
            return;
        }
        
        const section = document.getElementById(sectionId);
        const contentContainer = section.querySelector('.content-container');
        const contentPath = this.sectionContent[sectionId];
        
        if (!contentPath || !contentContainer) {
            console.warn(`No content path or container found for section: ${sectionId}`);
            return;
        }
        
        try {
            this.showLoadingIndicator(contentContainer, sectionId);
            
            const response = await fetch(contentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            contentContainer.innerHTML = html;
            this.loadedSections.add(sectionId);
            
            this.onContentLoaded(contentContainer);
            
        } catch (error) {
            console.error(`Failed to load content for ${sectionId}:`, error);
            this.showErrorMessage(contentContainer);
        }
    }

    showLoadingIndicator(container, sectionId) {
        container.innerHTML = `
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>Loading ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}...</p>
            </div>
        `;
    }

    showErrorMessage(container) {
        container.innerHTML = `
            <div class="error-message">
                <p>Failed to load content. Please try again.</p>
                <button onclick="location.reload()" class="retry-button">Retry</button>
            </div>
        `;
    }

    onContentLoaded(container) {
        // Event for when content is loaded - to be overridden or used with callbacks
        if (this.contentLoadedCallback) {
            this.contentLoadedCallback(container);
        }
    }

    setContentLoadedCallback(callback) {
        this.contentLoadedCallback = callback;
    }

    async initializeAllSections() {
        const sectionIds = Object.keys(this.sectionContent);
        for (const sectionId of sectionIds) {
            await this.loadSectionContent(sectionId);
        }
    }

    isLoaded(sectionId) {
        return this.loadedSections.has(sectionId);
    }
}