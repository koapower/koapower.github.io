// Section Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const sectionNav = document.getElementById('sectionNav');
    const sectionLinks = document.querySelectorAll('.section-nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    let isScrolling = false;

    // Handle section navigation clicks
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
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
});