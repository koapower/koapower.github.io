// Section Navigation JavaScript with Dynamic Content Loading
document.addEventListener('DOMContentLoaded', function() {
    const sectionNav = document.getElementById('sectionNav');
    const sectionLinks = document.querySelectorAll('.section-nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    let isScrolling = false;
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
                // Load content before switching sections
                await loadSectionContent(targetId);
                
                // Update active states
                updateActiveStates(this, targetSection);
                
                // Smooth scroll to section
                const sectionNavHeight = sectionNav.offsetHeight;
                const targetPosition = targetSection.offsetTop - sectionNavHeight;
                
                isScrolling = true;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Reset scrolling flag after animation
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
    });

    // Handle scroll events for active section detection
    let ticking = false;
    
    function updateOnScroll() {
        if (isScrolling) return; // Skip updates during programmatic scrolling
        
        const scrollPosition = window.scrollY + sectionNav.offsetHeight + 100; // Add offset for better detection
        let currentSection = null;
        
        // Find the current section based on scroll position
        contentSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section;
            }
        });
        
        // Update active states if we found a current section
        if (currentSection) {
            const currentSectionId = currentSection.id;
            const correspondingLink = document.querySelector(`[data-target="${currentSectionId}"]`);
            
            if (correspondingLink && !correspondingLink.classList.contains('active')) {
                updateActiveStates(correspondingLink, currentSection);
            }
        }
        
        // Add scrolled class to nav for styling
        if (window.scrollY > 100) {
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
    
    // Update active states function
    function updateActiveStates(activeLink, activeSection) {
        // Update navigation links
        sectionLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
        
        // Update content sections with fade effect
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Add a small delay for smooth transition
        setTimeout(() => {
            activeSection.classList.add('active');
        }, 50);
    }
    
    // Initialize with first section active
    if (sectionLinks.length > 0 && contentSections.length > 0) {
        updateActiveStates(sectionLinks[0], contentSections[0]);
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1); // Remove #
        if (hash) {
            const targetSection = document.getElementById(hash);
            const targetLink = document.querySelector(`[data-target="${hash}"]`);
            
            if (targetSection && targetLink) {
                updateActiveStates(targetLink, targetSection);
            }
        }
    });
    
    // Check for initial hash on page load
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        const targetSection = document.getElementById(initialHash);
        const targetLink = document.querySelector(`[data-target="${initialHash}"]`);
        
        if (targetSection && targetLink) {
            updateActiveStates(targetLink, targetSection);
            
            // Scroll to the section after a short delay
            setTimeout(() => {
                const sectionNavHeight = sectionNav.offsetHeight;
                const targetPosition = targetSection.offsetTop - sectionNavHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
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
    
    // Initialize with first section (games) content loading
    loadSectionContent('games');
});