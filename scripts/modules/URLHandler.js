export class URLHandler {
    constructor(navigationController, contentLoader) {
        this.navigationController = navigationController;
        this.contentLoader = contentLoader;
        
        this.init();
    }

    init() {
        this.attachHashChangeListener();
        this.handleInitialHash();
    }

    attachHashChangeListener() {
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    }

    handleHashChange() {
        const hash = this.getCurrentHash();
        if (hash) {
            this.navigateToHash(hash);
        }
    }

    async navigateToHash(hash) {
        const targetSection = document.getElementById(hash);
        
        if (targetSection) {
            await this.contentLoader.loadSectionContent(hash);
            this.navigationController.navigateToSection(hash);
        }
    }

    handleInitialHash() {
        const initialHash = this.getCurrentHash();
        if (initialHash) {
            setTimeout(async () => {
                await this.navigateToHash(initialHash);
            }, 500);
        }
    }

    getCurrentHash() {
        return window.location.hash.substring(1);
    }

    setHash(hash) {
        if (window.location.hash !== `#${hash}`) {
            window.location.hash = hash;
        }
    }

    removeHash() {
        if (window.location.hash) {
            history.replaceState(null, null, window.location.pathname + window.location.search);
        }
    }

    updateHashOnScroll(sectionId) {
        const currentHash = this.getCurrentHash();
        if (currentHash !== sectionId) {
            history.replaceState(null, null, `#${sectionId}`);
        }
    }

    isValidHash(hash) {
        return document.getElementById(hash) !== null;
    }
}