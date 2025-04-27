        // Store navigation state to localStorage
        function saveNavState() {
            const navState = {};
            
            document.querySelectorAll('.nav-section-button').forEach(btn => {
                const sectionId = btn.getAttribute('aria-controls');
                navState[sectionId] = !btn.classList.contains('collapsed');
            });
            
            localStorage.setItem('smartscroll_nav_state', JSON.stringify(navState));
        }
        
        // Load navigation state from localStorage
        function loadNavState() {
            const savedState = localStorage.getItem('smartscroll_nav_state');
            
            if (savedState) {
                try {
                    const navState = JSON.parse(savedState);
                    
                    for (const [sectionId, isExpanded] of Object.entries(navState)) {
                        const button = document.querySelector(`[aria-controls="${sectionId}"]`);
                        const list = document.getElementById(sectionId);
                        
                        if (button && list) {
                            if (!isExpanded) {
                                button.classList.add('collapsed');
                                button.setAttribute('aria-expanded', 'false');
                                list.classList.add('collapsed');
                            } else {
                                button.classList.remove('collapsed');
                                button.setAttribute('aria-expanded', 'true');
                                list.classList.remove('collapsed');
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error loading navigation state:', e);
                }
            }
        }
        
        // Toggle mobile menu
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Sidebar toggle functionality (mobile)
        const sidebarToggle = document.getElementById('sidebarToggle');
        const manualSidebar = document.getElementById('manualSidebar');
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');
        
        // Toggle sidebar visibility on mobile
        function toggleSidebar() {
            const isVisible = manualSidebar.classList.toggle('active');
            sidebarToggle.classList.toggle('active', isVisible);
            sidebarToggle.setAttribute('aria-expanded', isVisible);
            sidebarBackdrop.classList.toggle('active', isVisible);
            
            // Prevent scrolling of the body when sidebar is open
            document.body.style.overflow = isVisible ? 'hidden' : '';
        }
        
        sidebarToggle.addEventListener('click', toggleSidebar);
        sidebarBackdrop.addEventListener('click', toggleSidebar);
        
        // Section collapsing in sidebar
        document.querySelectorAll('.nav-section-button').forEach(button => {
            button.addEventListener('click', () => {
                const isCollapsed = button.classList.toggle('collapsed');
                const listId = button.getAttribute('aria-controls');
                const list = document.getElementById(listId);
                
                button.setAttribute('aria-expanded', !isCollapsed);
                list.classList.toggle('collapsed', isCollapsed);
                
                // Save navigation state
                saveNavState();
            });
        });
        
        // Show/hide scroll to top button
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top functionality
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Set focus back to the first main heading for screen readers
            setTimeout(() => {
                document.querySelector('h1').focus();
            }, 500);
        });
        
        // Smooth scrolling for anchor links with improved accessibility
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                    
                    // Set focus to the target heading for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    
                    // Close sidebar on mobile when a link is clicked
                    if (window.innerWidth <= 1024 && manualSidebar.classList.contains('active')) {
                        toggleSidebar();
                    }
                }
            });
        });
        
        // Track active section based on scroll position
        function updateActiveNavItem() {
            const sections = document.querySelectorAll('.manual-section, section[id]');
            const scrollPosition = window.pageYOffset;
            
            // Get current visible section
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link, .nav-direct-link').forEach(link => {
                link.classList.remove('active');
                link.setAttribute('aria-current', 'false');
            });
            
            // Add active class to current section links (includes subsection tracking)
            if (current) {
                // First check if we need to highlight a subsection
                const directLink = document.querySelector(`.nav-direct-link[data-section="${current}"]`);
                const subsectionLink = document.querySelector(`.nav-link[data-section="${current}"]`);
                
                if (subsectionLink) {
                    subsectionLink.classList.add('active');
                    subsectionLink.setAttribute('aria-current', 'page');
                    
                    // Make sure parent section is expanded
                    const parentList = subsectionLink.closest('.nav-list');
                    if (parentList && parentList.classList.contains('collapsed')) {
                        const button = document.querySelector(`[aria-controls="${parentList.id}"]`);
                        if (button) {
                            button.classList.remove('collapsed');
                            button.setAttribute('aria-expanded', 'true');
                            parentList.classList.remove('collapsed');
                            saveNavState();
                        }
                    }
                } else if (directLink) {
                    directLink.classList.add('active');
                    directLink.setAttribute('aria-current', 'page');
                }
            }
        }
        
        // Call on scroll and on page load
        window.addEventListener('scroll', updateActiveNavItem);
        
        // Responsive behavior for tablet - convert to icon sidebar at specific breakpoint
        function handleResponsiveSidebar() {
            if (window.innerWidth <= 1024 && window.innerWidth > 768) {
                manualSidebar.classList.add('compact', 'expand-on-hover');
            } else {
                manualSidebar.classList.remove('compact', 'expand-on-hover');
            }
        }
        
        window.addEventListener('resize', handleResponsiveSidebar);
        
        // Initialize on DOM ready
        document.addEventListener('DOMContentLoaded', () => {
            // Load navigation state from localStorage
            loadNavState();
            
            // Initial check for active section
            updateActiveNavItem();
            
            // Set up responsive sidebar
            handleResponsiveSidebar();
            
            // Get current URL hash
            const hash = window.location.hash;
            
            // If hash exists, scroll to the corresponding section
            if (hash) {
                setTimeout(() => {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Set focus to the target heading for accessibility
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                    }
                }, 100);
            }
        });

        // Notion-like sidebar behavior
        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.getElementById('manualSidebar');
            const pinButton = document.getElementById('pinSidebar');
            let sidebarState = localStorage.getItem('smartscroll_sidebar_state') || 'auto-hide';
            let mouseNearSidebar = false;
            let sidebarHoverTimeout;
            
            // Initialize sidebar state from localStorage
            if (sidebarState === 'pinned') {
                sidebar.classList.remove('auto-hide');
                pinButton.classList.add('pinned');
            } else {
                sidebar.classList.add('auto-hide');
                pinButton.classList.remove('pinned');
            }
            
            // Pin button click handler
            pinButton.addEventListener('click', function() {
                if (sidebar.classList.contains('auto-hide')) {
                    // Pin the sidebar
                    sidebar.classList.remove('auto-hide');
                    pinButton.classList.add('pinned');
                    localStorage.setItem('smartscroll_sidebar_state', 'pinned');
                } else {
                    // Unpin the sidebar
                    sidebar.classList.add('auto-hide');
                    pinButton.classList.remove('pinned');
                    localStorage.setItem('smartscroll_sidebar_state', 'auto-hide');
                }
            });
            
            // Mouse movement tracking for auto-hide behavior
            document.addEventListener('mousemove', function(e) {
                if (sidebarState === 'pinned') return;
                
                const sidebarRect = sidebar.getBoundingClientRect();
                const buffer = 50; // Distance in pixels that activates the sidebar
                
                // Check if mouse is near the sidebar
                const isNear = (
                    e.clientX <= sidebarRect.right + buffer && 
                    e.clientY >= sidebarRect.top && 
                    e.clientY <= sidebarRect.bottom
                );
                
                if (isNear !== mouseNearSidebar) {
                    mouseNearSidebar = isNear;
                    
                    if (isNear) {
                        // Mouse approached sidebar - clear any hide timeout and show it
                        clearTimeout(sidebarHoverTimeout);
                        sidebar.classList.add('hovered');
                    } else {
                        // Mouse left sidebar area - set a timeout to hide it
                        clearTimeout(sidebarHoverTimeout);
                        sidebarHoverTimeout = setTimeout(() => {
                            sidebar.classList.remove('hovered');
                        }, 500); // Delay before hiding when mouse leaves
                    }
                }
            });
            
            // Add a listener for mobile responsiveness
            window.addEventListener('resize', function() {
                if (window.innerWidth <= 1024) {
                    // On mobile and tablet views, disable auto-hide
                    sidebar.classList.remove('auto-hide', 'hovered');
                } else if (sidebarState !== 'pinned') {
                    // On desktop, restore auto-hide if not pinned
                    sidebar.classList.add('auto-hide');
                }
            });
            
            // Initial check for screen size
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('auto-hide', 'hovered');
            }
        });