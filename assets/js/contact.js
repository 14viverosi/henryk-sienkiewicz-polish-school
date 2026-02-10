// Contact Form Logic - Zapier Webhook
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const lang = localStorage.getItem('site_lang') || 'pl';

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 1. Get data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries()); // Convert to JSON object

            // 2. Button Loading State
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = lang === 'pl' ? 'Wysyłanie...' : 'Sending...';

            // 3. Send to Formspree
            // REPLACE THIS URL WITH YOUR ACTUAL FORMSPREE ENDPOINT (e.g., https://formspree.io/f/xyzaqwer)
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjbnrdy';

            fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        showStatus('success');
                        contactForm.reset();
                    } else {
                        return response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                console.error('Formspree Errors:', data.errors.map(error => error["message"]).join(", "));
                            } else {
                                console.error('Formspree Error:', data);
                            }
                            showStatus('error');
                        });
                    }
                })
                .catch(error => {
                    console.error('Network Error:', error);
                    showStatus('error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }

    function showStatus(type) {
        formStatus.style.display = 'block';
        if (type === 'success') {
            formStatus.style.color = 'green';
            formStatus.textContent = lang === 'pl'
                ? 'Wiadomość została wysłana pomyślnie!'
                : 'Message sent successfully!';
        } else {
            formStatus.style.color = 'red';
            formStatus.textContent = lang === 'pl'
                ? 'Błąd wysyłania wiadomości. Spróbuj ponownie później.'
                : 'Error sending message. Please try again later.';
        }

        // Hide after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
});
