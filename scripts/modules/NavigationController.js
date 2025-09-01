export class NavigationController {
    constructor(contentLoader, scrollManager) {
        this.contentLoader = contentLoader;
        this.scrollManager = scrollManager;
        this.sectionLinks = document.querySelectorAll('.section-nav-link');
        this.contentSections = document.querySelectorAll('.content-section');
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }

    init() {
        this.attachNavigationListeners();
        this.setFirstLinkActive();
    }

    attachNavigationListeners() {
        this.sectionLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                await this.handleNavigationClick(e, link);
            });
        });
    }

    async handleNavigationClick(e, link) {
        e.preventDefault();
        
        const targetId = link.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            await this.contentLoader.loadSectionContent(targetId);
            this.updateActiveLink(link);
            this.scrollToSection(targetSection);
        }
    }

    updateActiveLink(activeLink) {
        this.sectionLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateActiveLinkBySection(sectionId) {
        const correspondingLink = document.querySelector(`[data-target="${sectionId}"]`);
        
        if (correspondingLink && !correspondingLink.classList.contains('active')) {
            this.sectionLinks.forEach(link => link.classList.remove('active'));
            correspondingLink.classList.add('active');
        }
    }

    scrollToSection(targetSection) {
        this.isScrolling = true;
        
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
            this.scrollTimeout = null;
        }, 1200);
    }

    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`[data-target="${sectionId}"]`);
        
        if (targetSection && targetLink) {
            this.updateActiveLink(targetLink);
            this.scrollToSection(targetSection);
        }
    }

    setFirstLinkActive() {
        if (this.sectionLinks.length > 0) {
            this.sectionLinks[0].classList.add('active');
        }
    }

    getCurrentActiveSection() {
        return document.querySelector('.section-nav-link.active')?.getAttribute('data-target');
    }

    getIsScrolling() {
        return this.isScrolling;
    }

    setScrolling(value) {
        this.isScrolling = value;
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = null;
        }
    }
}