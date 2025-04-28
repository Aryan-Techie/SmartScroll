/**
 * Smart Scroll Website JavaScript
 * Handles interactive functionality for the landing page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Improved FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const answerContent = answer.querySelector('.faq-answer-content');
        
        // Set initial heights to 0
        answer.style.height = '0px';
        
        // Create a click handler with better performance
        question.addEventListener('click', () => {
            // Get the current state
            const isActive = item.classList.contains('active');
            
            // If current FAQ is already active, just close it
            if (isActive) {
                item.classList.remove('active');
                answer.style.height = '0px';
                return;
            }
            
            // Close all other FAQs first (more efficient to do this first)
            faqItems.forEach(faqItem => {
                if (faqItem !== item && faqItem.classList.contains('active')) {
                    faqItem.classList.remove('active');
                    faqItem.querySelector('.faq-answer').style.height = '0px';
                }
            });
            
            // Then open the clicked one (prevents layout thrashing)
            requestAnimationFrame(() => {
                // Get content height
                const contentHeight = answerContent.getBoundingClientRect().height;
                
                // Open the FAQ
                item.classList.add('active');
                answer.style.height = contentHeight + 'px';
            });
        });
    });
    
    // Add header shadow on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animated entrance for elements when they come into view
    const animateElements = document.querySelectorAll('.feature-card, .workflow-step, .doc-card, .highlight-item');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Add animation class when element is in viewport
    function checkAnimations() {
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animate');
            }
        });
    }
    
    // Check on load and scroll
    window.addEventListener('load', checkAnimations);
    window.addEventListener('scroll', checkAnimations);
    
    // Add CSS class for animation
    animateElements.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Custom video player functionality
    const videoWrapper = document.querySelector('.video-wrapper');
    const video = document.getElementById('demo-video');
    const playBtn = document.getElementById('play-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (video && playBtn) {
        // Initial state - add paused class since video starts paused
        videoWrapper.classList.add('paused');
        
        // Play/pause functionality
        function togglePlay() {
            if (video.paused || video.ended) {
                video.play();
                videoWrapper.classList.add('playing');
                videoWrapper.classList.remove('paused');
            } else {
                video.pause();
                videoWrapper.classList.remove('playing');
                videoWrapper.classList.add('paused');
            }
        }
        
        // Fullscreen functionality for mobile
        function toggleFullscreen() {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) { /* Safari */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE11 */
                video.msRequestFullscreen();
            }
        }
        
        // Event listeners
        playBtn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);
        
        // Fullscreen button event listener (mobile only)
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }
        
        // Show controls when video ends
        video.addEventListener('ended', () => {
            videoWrapper.classList.remove('playing');
            videoWrapper.classList.add('paused');
        });
        
        // Pause video when it's out of viewport
        window.addEventListener('scroll', () => {
            if (!isInViewport(video) && !video.paused) {
                video.pause();
                videoWrapper.classList.remove('playing');
                videoWrapper.classList.add('paused');
            }
        });
    }
    
    // Add year to copyright text
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Handle window resize for FAQ items that are open
    window.addEventListener('resize', () => {
        const activeFAQs = document.querySelectorAll('.faq-item.active');
        
        activeFAQs.forEach(item => {
            const answer = item.querySelector('.faq-answer');
            const answerContent = answer.querySelector('.faq-answer-content');
            
            // Update height to match new content size after resize
            answer.style.height = answerContent.getBoundingClientRect().height + 'px';
        });
    });
});