<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// Проверка авторизации
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : '';

if (!$token) {
    http_response_code(401);
    die(json_encode(['success' => false, 'message' => 'Требуется авторизация']));
}

$data = json_decode(file_get_contents('php://input'), true);

// Создаем заказ
$user_id = $data['user_id'];
$total = $data['total'];
$items = $data['items'];

$conn->begin_transaction();

try {
    // Создаем заказ
    $sql = "INSERT INTO orders (user_id, total) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("id", $user_id, $total);
    $stmt->execute();
    $order_id = $stmt->insert_id;
    
    // Добавляем товары в заказ
    foreach ($items as $item) {
        $sql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiid", $order_id, $item['id'], $item['quantity'], $item['price']);
        $stmt->execute();
    }
    
    $conn->commit();
    
    echo json_encode(['success' => true, 'order_id' => $order_id]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка создания заказа: ' . $e->getMessage()]);
}

$conn->close();
?>