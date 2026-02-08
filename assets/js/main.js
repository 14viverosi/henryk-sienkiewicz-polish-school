document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // 2. Internationalization (i18n) Logic
    const langToggleBtn = document.getElementById('lang-toggle');
    const savedLang = localStorage.getItem('site_lang') || 'pl'; // Default to Polish

    // Initialize Language
    setLanguage(savedLang);

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('site_lang') || 'pl';
            const newLang = currentLang === 'pl' ? 'en' : 'pl';
            setLanguage(newLang);
        });
    }

    function setLanguage(lang) {
        // Save preference
        localStorage.setItem('site_lang', lang);

        // Update button text (Show the *other* language option)
        if (langToggleBtn) {
            // If current is PL, show "English". If EN, show "Polski".
            langToggleBtn.textContent = lang === 'pl' ? 'English' : 'Polski';
        }

        // Apply translations
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key]; // Using innerHTML to preserve spans/formatting in translations
                }
            }
        });

        // Optimize: Update html lang attribute
        document.documentElement.lang = lang;

        // Handle Announcement Banner
        updateAnnouncement(lang);
    }

    function updateAnnouncement(lang) {
        const msg = translations[lang] && translations[lang]['announcement'];
        let banner = document.querySelector('.announcement-banner');

        if (msg && msg.trim() !== "") {
            // Create if doesn't exist
            if (!banner) {
                banner = document.createElement('div');
                banner.className = 'announcement-banner';
                document.body.prepend(banner);
            }
            banner.textContent = msg;
        } else {
            // Remove if exists and no message
            if (banner) {
                banner.remove();
            }
        }
    }
});
