/*
  This file contains the JavaScript for the portfolio website.
  It handles interactivity such as the mobile menu, scroll animations, and the contact form submission via Formspree.
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile menu toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }


    // --- Fade-in sections on scroll ---
    const sections = document.querySelectorAll('.fade-in-section');
    
    if (sections.length > 0) {
        const options = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the item must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // When the element is in view, add the 'is-visible' class
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stop observing the element once it's visible
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // --- Contact Form Handling with Formspree ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const formData = new FormData(contactForm);
            
            // Clear previous status and set to sending
            formStatus.innerHTML = '';
            formStatus.classList.remove('text-green-400', 'text-red-400');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = "Thanks for your message! I'll get back to you soon.";
                    formStatus.classList.add('text-green-400');
                    contactForm.reset();
                } else {
                    // Handle server-side errors from Formspree
                    const data = await response.json();
                    formStatus.textContent = data.errors ? data.errors.map(error => error.message).join(', ') : 'Oops! Something went wrong. Please try again.';
                    formStatus.classList.add('text-red-400');
                }
            } catch (error) {
                // Handle network errors
                formStatus.textContent = 'Oops! There was a problem submitting your form. Please check your connection.';
                formStatus.classList.add('text-red-400');
            } finally {
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }
});
