export class ScrollManager {
    constructor(navigationController) {
        this.navigationController = navigationController;
        this.sectionNav = document.getElementById('sectionNav');
        this.contentSections = document.querySelectorAll('.content-section');
        this.ticking = false;
        
        this.init();
    }

    init() {
        this.attachScrollListener();
    }

    attachScrollListener() {
        window.addEventListener('scroll', () => {
            this.requestTick();
        });
    }

    requestTick() {
        if (!this.ticking) {
            requestAnimationFrame(() => this.updateOnScroll());
            this.ticking = true;
        }
    }

    updateOnScroll() {
        if (this.navigationController.getIsScrolling()) {
            this.handleProgrammaticScroll();
            return;
        }
        
        this.updateActiveSection();
        this.updateNavbarStyle();
        this.ticking = false;
    }

    handleProgrammaticScroll() {
        const scrollTimeout = setTimeout(() => {
            this.navigationController.setScrolling(false);
            requestAnimationFrame(() => this.updateOnScroll());
        }, 150);
    }

    updateActiveSection() {
        const currentSection = this.detectCurrentSection();
        
        if (currentSection) {
            this.navigationController.updateActiveLinkBySection(currentSection.id);
        }
    }

    detectCurrentSection() {
        const navHeight = this.sectionNav ? this.sectionNav.offsetHeight : 0;
        const viewportHeight = window.innerHeight;
        
        let currentSection = null;
        let maxVisibleArea = 0;
        
        this.contentSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const visibleHeight = this.calculateVisibleHeight(rect, navHeight, viewportHeight);
            const visibilityRatio = visibleHeight / rect.height;
            
            if (visibilityRatio > 0.3 && visibleHeight > maxVisibleArea) {
                maxVisibleArea = visibleHeight;
                currentSection = section;
            }
        });
        
        return currentSection || this.findClosestToCenter(navHeight, viewportHeight);
    }

    calculateVisibleHeight(rect, navHeight, viewportHeight) {
        const visibleTop = Math.max(rect.top, navHeight);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        return Math.max(0, visibleBottom - visibleTop);
    }

    findClosestToCenter(navHeight, viewportHeight) {
        const viewportCenter = navHeight + (viewportHeight - navHeight) / 2;
        let minDistance = Infinity;
        let closestSection = null;
        
        this.contentSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestSection = section;
            }
        });
        
        return closestSection;
    }

    updateNavbarStyle() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const scrollThreshold = Math.min(100, viewportHeight * 0.1);
        
        if (scrollY > scrollThreshold) {
            this.sectionNav.classList.add('scrolled');
        } else {
            this.sectionNav.classList.remove('scrolled');
        }
    }

    getScrollPosition() {
        return window.scrollY;
    }

    scrollToPosition(position, behavior = 'smooth') {
        window.scrollTo({
            top: position,
            behavior: behavior
        });
    }
}