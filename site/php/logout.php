<?php
require_once __DIR__ . '/db_connect.php';

session_start();

if (isset($_SESSION['user'])) {
    $userId = $_SESSION['user']['id'];
    $sql = "UPDATE users SET remember_token = NULL WHERE id = $userId";
    $conn->query($sql);
}

// Очищаем сессию
session_unset();
session_destroy();

// Удаляем куки
setcookie('auth_token', '', time() - 3600, '/');

echo json_encode(['success' => true]);
?>