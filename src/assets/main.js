
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-toggle');
    const sidebar = document.getElementById('sidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            // Toggle the 'active' class on the sidebar
            sidebar.classList.toggle('active');
            
            // Update the aria-expanded attribute for accessibility
            const isExpanded = sidebar.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
    }
});
