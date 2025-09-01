// Section Navigation JavaScript with Dynamic Content Loading
document.addEventListener('DOMContentLoaded', function() {
    const sectionNav = document.getElementById('sectionNav');
    const sectionLinks = document.querySelectorAll('.section-nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    let isScrolling = false;
    let scrollTimeout = null;
    let loadedSections = new Set(); // Track loaded sections to avoid reloading
    
    // Content mapping for dynamic loading
    const sectionContent = {
        'games': 'content/games.html',
        'tools': 'content/tools.html',
        'osu-beatmap': 'content/osu-beatmap.html'
    };
    
    // Function to load section content dynamically
    async function loadSectionContent(sectionId) {
        if (loadedSections.has(sectionId)) {
            return; // Already loaded
        }
        
        const section = document.getElementById(sectionId);
        const contentContainer = section.querySelector('.content-container');
        const contentPath = sectionContent[sectionId];
        
        if (!contentPath || !contentContainer) {
            console.warn(`No content path or container found for section: ${sectionId}`);
            return;
        }
        
        try {
            // Show loading indicator
            contentContainer.innerHTML = `
                <div class="loading-indicator">
                    <div class="loading-spinner"></div>
                    <p>Loading ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}...</p>
                </div>
            `;
            
            const response = await fetch(contentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            contentContainer.innerHTML = html;
            loadedSections.add(sectionId);
            
            // Re-attach event listeners for newly loaded portfolio items
            attachPortfolioItemListeners(contentContainer);
            
        } catch (error) {
            console.error(`Failed to load content for ${sectionId}:`, error);
            contentContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load content. Please try again.</p>
                    <button onclick="location.reload()" class="retry-button">Retry</button>
                </div>
            `;
        }
    }

    // Handle section navigation clicks
    sectionLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Load content if not already loaded
                await loadSectionContent(targetId);
                
                // Update active nav link
                sectionLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                isScrolling = true;
                
                // Clear any existing timeout
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Reset scrolling flag with a more reliable method
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    scrollTimeout = null;
                }, 1200); // Slightly longer timeout for safety
            }
        });
    });

    // Handle scroll events for active section detection
    let ticking = false;
    
    function updateOnScroll() {
        // More intelligent detection of programmatic scrolling
        if (isScrolling) {
            // Check if scroll has actually stopped by comparing recent positions
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                scrollTimeout = null;
                // Trigger one final update after programmatic scroll ends
                requestAnimationFrame(updateOnScroll);
            }, 150);
            return;
        }
        
        const navHeight = sectionNav ? sectionNav.offsetHeight : 0;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        let currentSection = null;
        let maxVisibleArea = 0;
        
        // Find the section with the most visible area in the viewport
        contentSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const sectionHeight = rect.height;
            
            // Calculate visible area of this section
            const visibleTop = Math.max(sectionTop, navHeight);
            const visibleBottom = Math.min(sectionBottom, viewportHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // Calculate visibility percentage
            const visibilityRatio = visibleHeight / sectionHeight;
            
            // Use this section if it has more visible area (with minimum threshold)
            if (visibilityRatio > 0.3 && visibleHeight > maxVisibleArea) {
                maxVisibleArea = visibleHeight;
                currentSection = section;
            }
        });
        
        // Fallback: if no section meets the threshold, use the one closest to center
        if (!currentSection) {
            const viewportCenter = navHeight + (viewportHeight - navHeight) / 2;
            let minDistance = Infinity;
            
            contentSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - viewportCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    currentSection = section;
                }
            });
        }
        
        // Update active navigation link
        if (currentSection) {
            const currentSectionId = currentSection.id;
            const correspondingLink = document.querySelector(`[data-target="${currentSectionId}"]`);
            
            if (correspondingLink && !correspondingLink.classList.contains('active')) {
                // Remove active class from all links
                sectionLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                correspondingLink.classList.add('active');
            }
        }
        
        // Add scrolled class to nav for styling (dynamic threshold)
        const scrollThreshold = Math.min(100, viewportHeight * 0.1);
        if (scrollY > scrollThreshold) {
            sectionNav.classList.add('scrolled');
        } else {
            sectionNav.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    // Listen to scroll events
    window.addEventListener('scroll', requestTick);
    
    // Initialize - load all sections and set first link as active
    async function initializeSections() {
        // Load all section content
        const sectionIds = ['games', 'tools', 'osu-beatmap'];
        for (const sectionId of sectionIds) {
            await loadSectionContent(sectionId);
        }
        
        // Set first link as active initially
        if (sectionLinks.length > 0) {
            sectionLinks[0].classList.add('active');
        }
    }
    
    // Initialize sections
    initializeSections();
    
    // Handle browser back/forward navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1); // Remove #
        if (hash) {
            const targetSection = document.getElementById(hash);
            const targetLink = document.querySelector(`[data-target="${hash}"]`);
            
            if (targetSection && targetLink) {
                // Update active link
                sectionLinks.forEach(link => link.classList.remove('active'));
                targetLink.classList.add('active');
                
                // Scroll to section
                isScrolling = true;
                if (scrollTimeout) clearTimeout(scrollTimeout);
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    scrollTimeout = null;
                }, 1200);
            }
        }
    });
    
    // Check for initial hash on page load
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        setTimeout(() => {
            const targetSection = document.getElementById(initialHash);
            const targetLink = document.querySelector(`[data-target="${initialHash}"]`);
            
            if (targetSection && targetLink) {
                // Update active link
                sectionLinks.forEach(link => link.classList.remove('active'));
                targetLink.classList.add('active');
                
                // Scroll to section
                isScrolling = true;
                if (scrollTimeout) clearTimeout(scrollTimeout);
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    scrollTimeout = null;
                }, 1200);
            }
        }, 500); // Give time for content to load
    }
    
    // Function to attach portfolio item listeners (for dynamically loaded content)
    function attachPortfolioItemListeners(container) {
        const portfolioItems = container.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            // Remove existing listeners to avoid duplicates
            item.replaceWith(item.cloneNode(true));
            const newItem = container.querySelector(`[data-project="${item.getAttribute('data-project')}"]`) || item;
            
            newItem.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project');
                
                // For now, just log the project ID and show an alert
                console.log(`Clicked on project: ${projectId}`);
                
                // You can replace this with navigation to a detailed project page
                // For example: window.location.href = `/projects/${projectId}`;
                
                // Temporary feedback for user
                const projectTitle = this.querySelector('.portfolio-title').textContent;
                alert(`Opening details for: ${projectTitle}\n\nThis feature will be implemented soon!`);
            });
            
            // Add keyboard support for accessibility
            newItem.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
});