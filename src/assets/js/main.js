/**
 * @file main.js
 * @description This script handles all client-side interactivity for the iPortfolio website.
 * It is built with vanilla JavaScript, focusing on performance and modern browser APIs.
 *
 * Features:
 * 1. Mobile Navigation: Toggles a sidebar menu.
 * 2. Smooth Scrolling: Smoothly navigates to page sections.
 * 3. Scroll Animations: Fades in elements as they enter the viewport using IntersectionObserver.
 * 4. Active Link Highlighting: Updates navigation links based on the current scroll position.
 * 5. Theme Switcher: Toggles between light and dark modes and persists the choice.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wrap the entire script in a try...catch block for robust error handling on production.
    // This ensures that if one part of the script fails, it doesn't break all other functionality.
    try {
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
                // Add a class to the hamburger itself to control its state (e.g., position, icon).
                hamburger.classList.toggle('toggled');

                // Update the aria-expanded attribute for accessibility.
                // This tells screen readers whether the navigation menu is open or closed.
                const isExpanded = sidebar.classList.contains('active');
                hamburger.setAttribute('aria-expanded', isExpanded);

                // Change the icon from hamburger to 'X' and back, and update the accessible label.
                // This provides clear visual and non-visual feedback about the button's function.
                if (isExpanded) {
                    hamburger.innerHTML = '&times;'; // Use the 'times' HTML entity for a clean "X" icon.
                    hamburger.setAttribute('aria-label', 'Close navigation');
                } else {
                    hamburger.innerHTML = '&#9776;'; // Hamburger icon
                    hamburger.setAttribute('aria-label', 'Toggle navigation');
                }
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
                        block: 'center'    // Aligns the top of the section to the center of the viewport, providing context.
                    });
                }

                // On mobile, if the sidebar is open, close it after a navigation link is clicked.
                if (sidebar.classList.contains('active') && link.closest('.sidebar')) {
                    sidebar.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    // Also reset the hamburger button state to its default.
                    hamburger.classList.remove('toggled');
                    hamburger.innerHTML = '&#9776;';
                    hamburger.setAttribute('aria-label', 'Toggle navigation');
                }
            });
        });

        // =================================================================
        // --- 3. Scroll-Triggered Animations ---
        // =================================================================
        // Uses the Intersection Observer API for performant scroll animations. This is much more efficient
        // than listening to the 'scroll' event, as the browser handles the visibility calculation.
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // If the element is intersecting (i.e., visible in the viewport)...
                if (entry.isIntersecting) {
                    // ...add the 'visible' class to trigger the CSS animation.
                    entry.target.classList.add('visible');
                } else {
                    // OPTIONAL: To make animations re-trigger every time the user scrolls up and down,
                    // we remove the 'visible' class when the element leaves the viewport.
                    entry.target.classList.remove('visible');
                }
            });
        }, { 
            // The 'threshold' determines what percentage of the element must be visible to trigger the callback.
            // 0.15 means the animation triggers when 15% of the element is visible. This prevents the animation
            // from firing too early or too late, creating a natural feel.
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
                    navLinks.forEach(link => link.classList.remove('active'));

                    // Then, add the 'active' class only to the link that corresponds to the visible section.
                    const activeLink = document.querySelector(`.sidebar nav a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, { 
            // 'rootMargin' effectively shrinks or expands the "viewport" used for intersection checking.
            // '-30% 0px -70% 0px' defines a horizontal "activation zone" in the middle of the screen.
            // A section is considered "intersecting" only when it's within the middle 40% of the viewport height.
            // This prevents the active link from changing too erratically at the top and bottom of the screen.
            rootMargin: '-30% 0px -70% 0px'
        });

        // Apply this observer to all main content sections.
        sections.forEach(section => activeLinkObserver.observe(section));

        // =================================================================
        // --- 5. Theme Switcher ---
        // =================================================================
        // Manages the light/dark theme toggle functionality.
        const themeToggleButton = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement; // Selects the <html> element

        /**
         * Applies a given theme to the document and saves it to localStorage.
         * @param {string} theme The theme to apply ('light' or 'dark').
         */
        const applyTheme = (theme) => {
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
        };

        /**
         * Sets the initial theme based on user preference, with a clear priority:
         * 1. Check for a theme explicitly saved in localStorage.
         * 2. If none, check the user's OS-level preference via `prefers-color-scheme`.
         * 3. If no preference is set, default to 'light' theme.
         */
        const initializeTheme = () => {
            // 1. Check for a saved theme in localStorage.
            const savedTheme = localStorage.getItem('portfolio-theme');
            if (savedTheme) {
                applyTheme(savedTheme);
                return;
            }

            // 2. If no saved theme, check the user's OS preference.
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                applyTheme('dark');
            } else {
                applyTheme('light'); // Default to light theme
            }
        };

        // Add click event listener to the toggle button.
        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', () => {
                // Determine the new theme by checking the current one.
                const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                applyTheme(newTheme);
            });
        }

        // =================================================================
        // --- 6. Dynamic Copyright Year ---
        // =================================================================
        // Automatically updates the copyright year in the footer to the current year.
        const copyrightElement = document.getElementById('copyright');
        if (copyrightElement) {
            const currentYear = new Date().getFullYear();
            // Replaces the hardcoded year with the current one.
            // The text content is rebuilt to ensure consistency.
            copyrightElement.textContent = `© ${currentYear} Ayush Yadav. All rights reserved.`;
        }

        initializeTheme(); // Set the theme when the script runs.
    } catch (error) {
        console.error("An error occurred during portfolio script initialization:", error);
    }
});