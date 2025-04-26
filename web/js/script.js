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
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // If the clicked item wasn't active, make it active
            if (!isActive) {
                item.classList.add('active');
            }
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
    
    if (video && playBtn) {
        // Play/pause functionality
        function togglePlay() {
            if (video.paused || video.ended) {
                video.play();
                videoWrapper.classList.add('playing');
            } else {
                video.pause();
                videoWrapper.classList.remove('playing');
            }
        }
        
        // Event listeners
        playBtn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);
        
        // Show controls when video ends
        video.addEventListener('ended', () => {
            videoWrapper.classList.remove('playing');
        });
        
        // Pause video when it's out of viewport
        window.addEventListener('scroll', () => {
            if (!isInViewport(video) && !video.paused) {
                video.pause();
                videoWrapper.classList.remove('playing');
            }
        });
    }
    
    // Add year to copyright text
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});