document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const headerHeight = header ? header.offsetHeight : 0;

    // Menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            if (navMenu.classList.contains('active')) {
                const navItems = navMenu.querySelectorAll('li');
                navItems.forEach(item => {
                    item.style.padding = '10px 0';
                    item.style.display = 'flex';
                    item.style.alignItems = 'center';
                    item.style.justifyContent = 'center';
                });
            }
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            header.style.padding = scrolled ? '5px 0' : '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
    }

    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('.form-control');
        const decorationOptions = document.querySelectorAll('.decoration-option');
        const decorationCheckboxes = document.querySelectorAll('input[name="decorationScope[]"]');
        const submitButton = contactForm.querySelector('button[type="submit"]');

        const validateEmail = email =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

        formInputs.forEach(input => {
            input.addEventListener('focus', () => input.parentElement.classList.add('input-focused'));
            input.addEventListener('blur', () => {
                if (!input.value.trim()) input.parentElement.classList.remove('input-focused');
            });
            input.addEventListener('input', () => input.classList.remove('error'));
        });

        decorationOptions.forEach(option => {
            option.addEventListener('click', e => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
                option.classList.toggle('option-selected', checkbox.checked);
            });
        });

        decorationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const title = document.querySelector('.decoration-options-title');
                if (title) title.classList.remove('error');
            });
        });

        const validateForm = () => {
            let valid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.classList.remove('error');

                if (!field.value.trim() ||
                    (field.type === 'email' && !validateEmail(field.value)) ||
                    (field.id === 'guestCount' && (+field.value < 1 || isNaN(field.value)))
                ) {
                    valid = false;
                    field.classList.add('error');
                    field.classList.add('shake-error');
                    setTimeout(() => field.classList.remove('shake-error'), 500);
                }
            });

            const checkedOptions = document.querySelectorAll('input[name="decorationScope[]"]:checked');
            if (checkedOptions.length === 0) {
                valid = false;
                const title = document.querySelector('.decoration-options-title');
                const container = document.querySelector('.decoration-options-container');
                if (title) title.classList.add('error');
                if (container) {
                    container.classList.add('shake-error');
                    setTimeout(() => container.classList.remove('shake-error'), 500);
                }
            }
            return valid;
        };

        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            document.querySelector('.error-message')?.remove();

            if (validateForm()) {
                submitButton.disabled = true;
                submitButton.textContent = 'Wysyłanie...';
                submitButton.classList.add('btn-loading');

                setTimeout(() => {
                    submitButton.classList.remove('btn-loading');
                    submitButton.classList.add('btn-submit-success');
                    submitButton.textContent = 'Wysłano pomyślnie!';

                    setTimeout(() => {
                        alert('Dziękujemy za wypełnienie formularza! Skontaktujemy się w ciągu 48 godzin.');
                        contactForm.reset();

                        formInputs.forEach(input => input.parentElement.classList.remove('input-focused'));
                        decorationOptions.forEach(option => option.classList.remove('option-selected'));
                        submitButton.disabled = false;
                        submitButton.classList.remove('btn-submit-success');
                        submitButton.textContent = 'Wyślij zapytanie';
                    }, 1500);
                }, 1500);

            } else {
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    window.scrollTo({
                        top: firstError.getBoundingClientRect().top + window.pageYOffset - headerHeight - 50,
                        behavior: 'smooth'
                    });
                }

                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Proszę poprawnie wypełnić wszystkie wymagane pola.';
                contactForm.querySelector('.form-submit').prepend(errorMsg);

                setTimeout(() => {
                    errorMsg.classList.add('fade-out');
                    setTimeout(() => errorMsg.remove(), 300);
                }, 3000);
            }
        });

        // Smooth scroll to form if hash is #formularz
        if (window.location.hash === '#formularz') {
            const formSection = document.querySelector('.form-section');
            if (formSection) {
                setTimeout(() => {
                    window.scrollTo({
                        top: formSection.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }

        // Form animations
        const addFormAnimations = () => {
            const formElements = document.querySelectorAll('.form-group, .decoration-options, .form-check, .form-submit');
            formElements.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;

                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100);
            });
        };

        addFormAnimations();
    }
});