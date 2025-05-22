document.addEventListener('DOMContentLoaded', function() {
    // Слайдер
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.opacity = 0;
            slide.style.visibility = 'hidden';
            slide.style.transform = 'scale(1.2)';
        });

        slides[index].classList.add('active');
        slides[index].style.opacity = 1;
        slides[index].style.visibility = 'visible';
        slides[index].style.transform = 'scale(1)';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 3000); // Менять слайды каждые 3 секунды
    showSlide(currentSlide); // Показать первый слайд при загрузке

    // Адаптация слайдера при изменении масштаба
    window.addEventListener('resize', function() {
        const slider = document.querySelector('.slider');
        const hero = document.querySelector('.hero');
        const footerHeight = document.querySelector('footer').offsetHeight;
        const windowHeight = window.innerHeight;

        // Устанавливаем высоту слайдера с учетом высоты футера
        slider.style.height = `${windowHeight - footerHeight - hero.offsetHeight}px`;
    });

    // Первоначальная установка высоты слайдера
    window.dispatchEvent(new Event('resize'));

    // Вопросы и ответы
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', function() {
            const isActive = answer.classList.contains('active');
            faqItems.forEach(item => {
                const answer = item.querySelector('.faq-answer');
                answer.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.padding = '0';
            });

            if (!isActive) {
                answer.classList.add('active');
                answer.style.maxHeight = '200px'; // Максимальная высота для ответа
                answer.style.padding = '16px 0'; // 16 пикселей
            }
        });
    });

    // Перенаправление на страницу личного кабинета при нажатии на кнопку "Личный кабинет"
    document.getElementById('loginBtn').addEventListener('click', function() {
        window.location.href = 'personal-cabinet.html';
    });
});
