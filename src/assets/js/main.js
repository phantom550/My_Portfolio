/**
 * @file main.js
 * @description This script handles all client-side interactivity for the iPortfolio website.
 * It includes functionality for mobile navigation, smooth scrolling, scroll-based animations,
 * and active navigation link highlighting.
 * The script waits for the DOM to be fully loaded before executing.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    // Grabs all necessary elements from the DOM to be used throughout the script.
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger-toggle');
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]'); // Selects all links pointing to an on-page anchor
    const navLinks = document.querySelectorAll('.sidebar nav a');
    const sections = document.querySelectorAll('.section[id]'); // Selects all sections that have an ID

    // =================================================================
    // --- 1. Hamburger Menu for Mobile Navigation ---
    // =================================================================
    // Toggles the visibility of the sidebar on mobile devices when the hamburger icon is clicked.
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            // The 'active' class controls the visibility of the sidebar (see style.css).
            sidebar.classList.toggle('active');
            
            // Update the aria-expanded attribute for accessibility.
            // This tells screen readers whether the navigation menu is open or closed.
            const isExpanded = sidebar.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
    }

    // =================================================================
    // --- 2. Smooth Scrolling for Anchor Links ---
    // =================================================================
    // Attaches a click event listener to all anchor links for smooth scrolling.
    allAnchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent the default browser behavior of instantly jumping to the section.
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scrolls the target section into the viewport smoothly and centers it.
                targetElement.scrollIntoView({
                    behavior: 'smooth', // Enables smooth animation
                    block: 'center'    // Aligns the section to the center of the viewport
                });
            }

            // On mobile, if the sidebar is open, close it after a navigation link is clicked.
            if (sidebar.classList.contains('active') && link.closest('.sidebar')) {
                sidebar.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // =================================================================
    // --- 3. Scroll-Triggered Animations ---
    // =================================================================
    // Uses the Intersection Observer API to add a 'visible' class to elements when they enter the viewport.
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is intersecting (i.e., visible in the viewport)...
            if (entry.isIntersecting) {
                // ...add the 'visible' class to trigger the CSS animation.
                entry.target.classList.add('visible');
            } else {
                // ...otherwise, remove the class to reset the animation for the next time it's scrolled to.
                entry.target.classList.remove('visible');
            }
        });
    }, { 
        // The 'threshold' determines what percentage of the element must be visible to trigger the callback.
        // 0.15 means the animation triggers when 15% of the element is visible.
        threshold: 0.15 
    });

    // Apply the observer to all elements that are meant to be animated on scroll.
    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // =================================================================
    // --- 4. Active Navigation Link Highlighting ---
    // =================================================================
    // Uses another Intersection Observer to highlight the correct navigation link in the sidebar
    // based on which section is currently in the viewport.
    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // First, remove the 'active' class from all navigation links.
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Then, add the 'active' class only to the link that corresponds to the visible section.
                const activeLink = document.querySelector(`.sidebar nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { 
        // 'rootMargin' shrinks the "viewport" used for intersection checking.
        // '-30% 0px -70% 0px' means the observer triggers when a section is in a zone
        // that starts 30% from the top of the screen and ends 30% from the bottom (100% - 70%).
        // This ensures the link is highlighted when the section is roughly centered.
        rootMargin: '-30% 0px -70% 0px'
    });

    // Apply this observer to all main content sections.
    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });
});