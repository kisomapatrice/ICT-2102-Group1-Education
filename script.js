Document.addEventListener(‘DOMContentLoaded’, () => {

    // 1. Mobile Menu Toggle
    Const hamburger = document.getElementById(‘hamburger’);
    Const navLinks = document.getElementById(‘navLinks’);

    If (hamburger && navLinks) {
        Hamburger.addEventListener(‘click’, () => {
            navLinks.classList.toggle(‘show’);
        });
    }

    // 2. Interactive FAQ Accordion
    Const faqItems = document.querySelectorAll(‘.faq-item’);

    faqItems.forEach(item => {
        const question = item.querySelector(‘.faq-question’);
        question.addEventListener(‘click’, () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove(‘active’);
                }
            });
            // Toggle active on clicked item
            Item.classList.toggle(‘active’);
        });
    });

    // 3. Live Module Search Filter
    Const searchInput = document.getElementById(‘moduleSearch’);
    Const moduleCards = document.querySelectorAll(‘.module-card’);

    If (searchInput) {
        searchInput.addEventListener(‘input’, (e) => {
            const query = e.target.value.toLowerCase().trim();

            moduleCards.forEach(card => {
                const title = card.querySelector(‘h3’).textContent.toLowerCase();
                const description = card.querySelector(‘p’).textContent.toLowerCase();
                const category = card.querySelector(‘.category-tag’).textContent.toLowerCase();

                if (title.includes(query) || description.includes(query) || category.includes(query)) {
                    card.style.display = ‘flex’;
                } else {
                    Card.style.display = ‘none’;
                }
            });
        });
    }

    // 4. Contact Form Validation & Submission
    Const contactForm = document.getElementById(‘contactForm’);
    Const formStatus = document.getElementById(‘formStatus’);

    If (contactForm) {
        contactForm.addEventListener(‘submit’, (e) => {
            e.preventDefault();
            
            const name = document.getElementById(‘name’).value;
            
            formStatus.style.color = ‘#16a34a’;
            formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully to Group 1.`;

            contactForm.reset();

            setTimeout(() => {
                formStatus.textContent = ‘’;
            }, 5000);
        });
    }
});


