Document.addEventListener(‘DOMContentLoaded’, () => {

    // 1. Mobile Navigation Toggle
    Const navToggle = document.getElementById(‘navToggle’);
    Const navLinks = document.getElementById(‘navLinks’);

    If (navToggle && navLinks) {
        navToggle.addEventListener(‘click’, () => {
            navLinks.classList.toggle(‘active’);
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll(‘a’).forEach(link => {
            link.addEventListener(‘click’, () => {
                navLinks.classList.remove(‘active’);
            });
        });
    }

    // 2. Module Live Search Filter
    Const moduleSearch = document.getElementById(‘moduleSearch’);
    Const moduleCards = document.querySelectorAll(‘.module-card’);

    If (moduleSearch) {
        moduleSearch.addEventListener(‘keyup’, (e) => {
            const query = e.target.value.toLowerCase().trim();

            moduleCards.forEach(card => {
                const title = card.querySelector(‘h3’).textContent.toLowerCase();
                const desc = card.querySelector(‘p’).textContent.toLowerCase();

                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = ‘block’;
                } else {
                    Card.style.display = ‘none’;
                }
            });
        });
    }

    // 3. Contact Form Submission
    Const contactForm = document.getElementById(‘contactForm’);
    Const formSuccess = document.getElementById(‘formSuccess’);

    If (contactForm && formSuccess) {
        contactForm.addEventListener(‘submit’, (e) => {
            e.preventDefault();

            const nameInput = document.getElementById(‘name’).value;

            formSuccess.style.display = ‘block’;
            formSuccess.textContent = `Thank you, ${nameInput}! Your message has been submitted to Group 1.`;

            contactForm.reset();

            setTimeout(() => {
                formSuccess.style.display = ‘none’;
            }, 5000);
        });
    }
});



