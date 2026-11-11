
/* ОБРАТНЫЙ ОТСЧЁТ */

const weddingDate = new Date(2027, 6, 7, 0, 0, 0).getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference <= 0) {
        document.querySelector(".countdown-section h2").textContent =
            "Сегодня наша свадьба!";

        document.getElementById("days").textContent = "0";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ПОЯВЛЕНИЕ СЕКЦИЙ */

const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    observer.observe(section);
});


/* СКРЫТИЕ КОЛИЧЕСТВА ГОСТЕЙ */

const attendanceSelect = document.getElementById("attendance");
const guestsContainer = document.getElementById("guests-container");
const guestsSelect = document.getElementById("guests");

function updateGuestsVisibility() {
    const cannotAttend =
        attendanceSelect.value === "К сожалению, не смогу";

    guestsContainer.style.display = cannotAttend ? "none" : "block";
    guestsSelect.disabled = cannotAttend;
}

attendanceSelect.addEventListener("change", updateGuestsVisibility);

// Проверяем состояние при загрузке страницы
updateGuestsVisibility();


/* ОТПРАВКА RSVP В TELEGRAM */

const form = document.getElementById("rsvp-form");

// Telegram username получателя без символа @
const telegramUsername = "Grig000jr";

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("guest-name").value.trim();
    const attendance = attendanceSelect.value;
    const guests = guestsSelect.value;
    const wishes = document.getElementById("wishes").value.trim();

    if (!name || !attendance) {
        alert("Пожалуйста, заполните обязательные поля.");
        return;
    }

    let message =
`💍 Свадьба Даниила и Светланы — 07.07.2027

👤 Имя: ${name}
💌 Присутствие: ${attendance}`;

    // Добавляем количество гостей только если человек придёт
    if (attendance !== "К сожалению, не смогу") {
        message += `\n👥 Количество гостей: ${guests}`;
    }

    message += `\n💬 Пожелания: ${wishes || "Нет"}`;

    const telegramUrl =
        "https://t.me/" + telegramUsername +
        "?text=" + encodeURIComponent(message);

    window.open(telegramUrl, "_blank");
});
