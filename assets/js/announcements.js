// Announcements Logic
// Relies on translations.js being loaded BEFORE this file

const announcementData = [
    // Format: YYYY-MM-DD
    // Items with dates in the past (before today) go to archive automatically.

    // Example CURRENT/FUTURE announcement
    /*{
        date: '2026-02-10',
        title_pl: "Zapisy na rok szkolny 2026/2027",
        title_en: "Registration for 2026/2027 School Year",
        content_pl: "Rozpoczynamy zapisy na nowy rok szkolny. Formularze dostępne w biurze.",
        content_en: "Registration for the new school year is open. Forms available in the office."
    }
    ,
    // Example PAST announcement
    {
        date: '2025-12-15',
        title_pl: "Spotkanie Wigilijne",
        title_en: "Christmas Eve Meeting",
        content_pl: "Zapraszamy wszystkich na wspólne kolędowanie i łamanie się opłatkiem.",
        content_en: "We invite everyone for caroling and sharing the Christmas wafer."
    },
    // Example PAST announcement 2
    {
        date: '2025-11-11',
        title_pl: "Święto Niepodległości",
        title_en: "Independence Day",
        content_pl: "Uroczysta akademia z okazji odzyskania niepodległości.",
        content_en: "Ceremonial assembly celebrating independence."
    }*/
];

document.addEventListener('DOMContentLoaded', () => {
    renderAnnouncements();

    // Hook into language toggle
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            // Wait for main.js to update localStorage
            setTimeout(renderAnnouncements, 50);
        });
    }
});

function renderAnnouncements() {
    const lang = localStorage.getItem('site_lang') || 'pl';

    // Containers
    const containerHome = document.getElementById('home-latest-news');
    const containerCurrent = document.getElementById('announcements-current');
    const containerPast = document.getElementById('announcements-past-list');

    // Data Processing
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Sort: Newest first
    const sortedData = [...announcementData].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Split into Active and Past
    const active = [];
    const past = [];

    sortedData.forEach(item => {
        const itemDate = new Date(item.date + "T00:00:00"); // Fix timezone issue
        if (itemDate < today) {
            past.push(item);
        } else {
            active.push(item);
        }
    });

    // --- Home Page Logic ---
    if (containerHome) {
        containerHome.innerHTML = '';

        // Show up to 3 latest active announcements
        // If no active, show a message? Or maybe show the very last past one? 
        // Let's show active ones. If none, show message.
        if (active.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'ann-empty-msg';
            const msgText = (translations[lang] && translations[lang]['ann_no_current']) || "No current announcements";
            emptyMsg.textContent = msgText;
            containerHome.appendChild(emptyMsg);
        } else {
            // Take top 3
            active.slice(0, 3).forEach(item => {
                containerHome.appendChild(createAnnouncementCard(item, lang));
            });
        }
        return;
    }

    // --- Announcements Page Logic ---
    if (containerCurrent && containerPast) {
        containerCurrent.innerHTML = '';
        containerPast.innerHTML = '';

        // Render Active
        if (active.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'ann-empty-msg';
            const msgText = (translations[lang] && translations[lang]['ann_no_current']) || "No current announcements";
            emptyMsg.textContent = msgText;
            containerCurrent.appendChild(emptyMsg);
        } else {
            active.forEach(item => {
                containerCurrent.appendChild(createAnnouncementCard(item, lang));
            });
        }

        // Render Past
        past.forEach(item => {
            containerPast.appendChild(createAnnouncementCard(item, lang));
        });
    }
}

function createAnnouncementCard(item, lang) {
    const card = document.createElement('div');
    card.className = 'announcement-card';

    const title = lang === 'pl' ? item.title_pl : item.title_en;
    const content = lang === 'pl' ? item.content_pl : item.content_en;

    card.innerHTML = `
        <div class="ann-date">${item.date}</div>
        <h3 class="ann-title">${title}</h3>
        <p class="ann-content">${content}</p>
    `;
    return card;
}
