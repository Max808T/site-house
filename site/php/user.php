<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// Простая проверка токена (в реальном проекте нужна полноценная валидация)
$token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = str_replace('Bearer ', '', $token);

if (empty($token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Не авторизован']);
    exit;
}

// Для примера возвращаем первого пользователя (в реальном проекте ищем по токену)
$sql = "SELECT id, name, email, phone, created_at FROM users LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'user' => $user
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Пользователь не найден'
    ]);
}

$conn->close();
?>