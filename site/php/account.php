<?php
require_once __DIR__ . '/php/db_connect.php';
session_start();

// Проверка авторизации
if (!isset($_SESSION['user'])) {
    if (isset($_COOKIE['auth_token'])) {
        // Проверка токена из куки
        $token = $_COOKIE['auth_token'];
        $sql = "SELECT * FROM users WHERE remember_token = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $_SESSION['user'] = $result->fetch_assoc();
        } else {
            header('Location: /site/auth.html');
            exit;
        }
    } else {
        header('Location: /site/auth.html');
        exit;
    }
}

$user = $_SESSION['user'];
$cart = $_SESSION['cart'] ?? [];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личный кабинет | Turbo House</title>
    <base href="/site/">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/account.css">
</head>
<body>
    <!-- Шапка и навигация -->
    <header>
        <nav>
            <ul>
                <li><a href="index.html">Главная</a></li>
                <li><a href="products.html">Каталог домов</a></li>
                <li><a href="account.php" class="active">Личный кабинет</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="account-container">
            <!-- Основное содержимое личного кабинета -->
            <div class="account-header">
                <div class="user-greeting">
                    <h2>Добро пожаловать, <?= htmlspecialchars($user['name']) ?>!</h2>
                    <p>Email: <?= htmlspecialchars($user['email']) ?></p>
                </div>
                <button class="logout-btn" id="logout-btn">Выйти</button>
            </div>
            
            <div class="account-sections">
                <!-- Навигация по разделам -->
                <div class="account-nav">
                    <ul>
                        <li><a href="#" class="active" data-section="profile">Профиль</a></li>
                        <li><a href="#" data-section="orders">Мои заказы</a></li>
                        <li><a href="#" data-section="cart">Корзина</a></li>
                    </ul>
                </div>
                
                <!-- Содержимое разделов -->
                <div class="account-content">
                    <div class="account-section active" id="profile-section">
                        <h3 class="section-title">Личные данные</h3>
                        <div class="user-info">
                            <p><strong>Имя:</strong> <?= htmlspecialchars($user['name']) ?></p>
                            <p><strong>Email:</strong> <?= htmlspecialchars($user['email']) ?></p>
                            <p><strong>Телефон:</strong> <?= htmlspecialchars($user['phone']) ?></p>
                        </div>
                    </div>
                    
                    <div class="account-section" id="orders-section">
                        <h3 class="section-title">История заказов</h3>
                        <div class="order-list" id="order-list">
                            <?php include 'php/load_orders.php'; ?>
                        </div>
                    </div>
                    
                    <div class="account-section" id="cart-section">
                        <h3 class="section-title">Корзина</h3>
                        <div class="cart-items" id="account-cart-items">
                            <?php include 'php/load_cart.php'; ?>
                        </div>
                        <div class="cart-total">
                            <p><strong>Итого:</strong> <span id="account-cart-total">
                                <?= number_format(array_reduce($cart, function($sum, $item) {
                                    return $sum + ($item['price'] * $item['quantity']);
                                }, 0, '', ' ') ?>
                            </span> руб.</p>
                            <button class="btn-primary" id="checkout-btn">Оформить заказ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 Turbo House. Все права защищены.</p>
    </footer>

    <script src="js/account.js"></script>
</body>
</html>