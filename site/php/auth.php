<?php
header('Content-Type: application/json');

// Подключение к базе данных
$host = 'localhost';
$dbname = 'turbo_house';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка подключения к базе данных: ' . $e->getMessage()]);
    exit;
}

// Получаем данные из запроса
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Неверный формат данных']);
    exit;
}

$action = $data['action'] ?? '';

// Функция для хеширования пароля
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Функция для проверки пароля
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Обработка входа
if ($action === 'login') {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Заполните все поля']);
        exit;
    }

    // Ищем пользователя в базе
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
        exit;
    }

    // Проверяем пароль
    if (verifyPassword($password, $user['password'])) {
        // Создаем простой "токен"
        $token = md5($user['email'] . time());

        // Возвращаем данные пользователя
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'created_at' => $user['created_at']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Неверный пароль']);
    }
    exit;
}

// Обработка регистрации
if ($action === 'register') {
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $password = $data['password'] ?? '';
    $confirm = $data['confirm'] ?? '';

    // Проверка данных
    $errors = [];
    if (empty($name)) $errors[] = 'Имя обязательно';
    if (empty($email)) $errors[] = 'Email обязателен';
    if (empty($phone)) $errors[] = 'Телефон обязателен';
    if (empty($password)) $errors[] = 'Пароль обязателен';
    if ($password !== $confirm) $errors[] = 'Пароли не совпадают';

    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        exit;
    }

    // Проверяем, есть ли уже такой email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Пользователь с таким email уже существует']);
        exit;
    }

    // Хешируем пароль
    $hashedPassword = hashPassword($password);

    // Добавляем пользователя в базу
    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $email, $phone, $hashedPassword]);

        // Получаем ID нового пользователя
        $userId = $pdo->lastInsertId();

        // Получаем данные пользователя
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Создаем токен
        $token = md5($email . time());

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'created_at' => $user['created_at']
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Неизвестное действие']);
?>
