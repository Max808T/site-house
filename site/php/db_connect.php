<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "turbo_house";

// Создаем соединение
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем соединение
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Устанавливаем кодировку
$conn->set_charset("utf8mb4");

// Стартуем сессию
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>