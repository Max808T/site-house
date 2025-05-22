document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Переключение между формами входа и регистрации
    authTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab + '-form').classList.add('active');
        });
    });

    // Обработка формы входа
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            fetch('auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'login', email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'account.html';
                } else {
                    document.getElementById('login-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                document.getElementById('login-error').textContent = 'Произошла ошибка при входе';
            });
        });
    }

    // Обработка формы регистрации
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;

            if (password !== confirm) {
                document.getElementById('register-error').textContent = 'Пароли не совпадают';
                return;
            }

            fetch('auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'register', name, email, phone, password, confirm })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'account.html';
                } else {
                    document.getElementById('register-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                document.getElementById('register-error').textContent = 'Произошла ошибка при регистрации';
            });
        });
    }

    // Обработка выхода
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            fetch('auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'logout' })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'auth.html';
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        });
    }

    // Проверка авторизации при загрузке страницы
    fetch('auth.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'check_auth' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.user) {
            showAccountContent(data.user);
        } else {
            document.getElementById('auth-forms').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });

    // Отображение личного кабинета
    function showAccountContent(user) {
        document.getElementById('auth-forms').style.display = 'none';
        const accountContent = document.getElementById('account-content');
        accountContent.style.display = 'block';
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-phone').textContent = user.phone;
        document.getElementById('profile-date').textContent = user.created_at;
    }
});
