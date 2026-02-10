// Calendar Widget Logic
// Note: This relies on translations.js being loaded BEFORE this file.

const calendarData = {
    // === EDIT EVENTS HERE ===
    // format: 'YYYY-MM-DD'
    // title: Event Name
    // type: 'class' (blue), 'mass' (green), 'holiday' (red)
    events: [
        { date: '2026-02-06', title: 'Polska Szkoła', type: 'class' },
        { date: '2026-02-08', title: 'Msza Święta', type: 'mass' },
        { date: '2026-02-14', title: 'Walentynki', type: 'holiday' },
        { date: '2026-02-13', title: 'Polska Szkoła-Zabawa Olimpiada', type: 'special' },
        { date: '2026-02-20', title: 'Polska Szkoła', type: 'class' },
        { date: '2026-02-22', title: 'Msza Święta', type: 'mass' },
        { date: '2026-02-27', title: 'Polska Szkoła', type: 'class' },
        // Sample future events
        { date: '2026-03-01', title: 'Narodowy Dzień Pamięci', type: 'holiday' },
    ]
};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentMonth, currentYear);

    // Event Listeners for Buttons
    document.getElementById('cal-prev').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('cal-next').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Hook into Language Toggle to refresh calendar
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            // Wait slightly for translation state to update
            setTimeout(() => renderCalendar(currentMonth, currentYear), 50);
        });
    }
});

function renderCalendar(month, year) {
    const lang = localStorage.getItem('site_lang') || 'pl';
    const monthName = translations[lang][`cal_month_${month}`];

    // Update Header
    document.getElementById('cal-month-year').textContent = `${monthName} ${year}`;
    document.getElementById('cal-prev').textContent = '<'; // Simple arrow or use translation
    document.getElementById('cal-next').textContent = '>';

    // Update Days of Week Header
    const daysHeader = document.getElementById('cal-days-header');
    daysHeader.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('cal-day-name');
        dayDiv.textContent = translations[lang][`cal_day_${i}`];
        daysHeader.appendChild(dayDiv);
    }

    // Grid Logic
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('cal-day', 'empty');
        grid.appendChild(emptyCell);
    }

    // Days with events
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.classList.add('cal-day');

        const dateNum = document.createElement('div');
        dateNum.classList.add('cal-date-num');
        dateNum.textContent = day;
        cell.appendChild(dateNum);

        // Check for events
        // Format: YYYY-MM-DD (pad single digits)
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const dayEvents = calendarData.events.filter(e => e.date === dateStr);
        dayEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('cal-event', event.type);
            eventDiv.textContent = event.title;
            // Simplified mobile view logic could go here
            cell.appendChild(eventDiv);
        });

        // Highlight today
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        grid.appendChild(cell);
    }
}
