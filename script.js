document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('age-calculator');
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const resultSection = document.getElementById('result');
    
    const dayError = document.getElementById('day-error');
    const monthError = document.getElementById('month-error');
    const yearError = document.getElementById('year-error');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateAge();
    });
    
    function calculateAge() {
        resetErrors();
        
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        
        let isValid = true;
        
        if (isNaN(year) || year < 1900 || year > currentYear) {
            showError(yearError, `Please enter a year between 1900 and ${currentYear}`);
            isValid = false;
        }
        
        if (isNaN(month) || month < 1 || month > 12) {
            showError(monthError, 'Please enter a month between 1 and 12');
            isValid = false;
        }
        
        if (isNaN(day) || day < 1 || day > 31) {
            showError(dayError, 'Please enter a day between 1 and 31');
            isValid = false;
        }
        
        if (isValid) {
            if ([4, 6, 9, 11].includes(month) && day > 30) {
                showError(dayError, 'This month only has 30 days');
                isValid = false;
            }
            
            if (month === 2) {
                const isLeapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
                const maxDays = isLeapYear ? 29 : 28;
                
                if (day > maxDays) {
                    showError(dayError, `February has ${maxDays} days in ${year}`);
                    isValid = false;
                }
            }
            
            const birthDate = new Date(year, month - 1, day);
            if (birthDate > currentDate) {
                showError(yearError, 'Birth date cannot be in the future');
                isValid = false;
            }
        }
        
        if (!isValid) {
            resultSection.style.display = 'none';
            return;
        }
        
        displayAge(calculateAgeFromDate(new Date(year, month - 1, day)));
    }
    
    function calculateAgeFromDate(birthDate) {
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
        
        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return { years, months, days };
    }
    
    function displayAge(age) {
        resultSection.style.display = 'flex';
        document.getElementById('years').textContent = age.years;
        document.getElementById('months').textContent = age.months;
        document.getElementById('days').textContent = age.days;
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }
    
    function resetErrors() {
        [dayError, monthError, yearError].forEach(error => {
            error.style.display = 'none';
            error.textContent = '';
        });
    }
});

// Starfield Animation for #space-bg
const canvas = document.getElementById('space-bg');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2 + 0.2,
            speed: Math.random() * 0.3 + 0.05,
            alpha: Math.random(),
            blink: Math.random() * 0.05 + 0.01
        });
    }
}
createStars(150);

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let star of stars) {
        // Blinking
        star.alpha += star.blink;
        if (star.alpha <= 0.1 || star.alpha >= 1) star.blink = -star.blink;

        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Scrolling (move down)
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateStars);
}
animateStars();