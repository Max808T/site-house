let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Загрузка товаров
    fetch('php/load_products.php')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                productList.innerHTML = '';
                data.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    productItem.setAttribute('data-id', product.id);
                    productItem.innerHTML = `
                        <div class="product-card-wrapper">
                            <img src="images/house${product.id}.jpg" alt="${product.name}" class="product-image">
                            <div class="product-content">
                                <h3>${product.name}</h3>
                                <p class="price">${parseFloat(product.price).toLocaleString('ru-RU')} руб.</p>
                                <div class="description-container">
                                    <p class="description">${product.description}</p>
                                </div>
                            </div>
                            <div class="product-actions">
                                <div class="quantity-wrapper">
                                    <div class="quantity-controls">
                                        <button class="quantity-btn decrease">-</button>
                                        <span class="quantity">1</span>
                                        <button class="quantity-btn increase">+</button>
                                    </div>
                                    <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
                                </div>
                            </div>
                        </div>
                        <div class="fullscreen-overlay" id="fullscreen-${product.id}">
                            <div class="fullscreen-content">
                                <span class="close-fullscreen">&times;</span>
                                <img src="images/house${product.id}.jpg" alt="${product.name}">
                                <div class="fullscreen-details">
                                    <h3>${product.name}</h3>
                                    <p class="fullscreen-price">${parseFloat(product.price).toLocaleString('ru-RU')} руб.</p>
                                    <p class="fullscreen-description">${product.description}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    productList.appendChild(productItem);
                });

                initProductInteractions();
                addEventListeners();
            } else {
                productList.innerHTML = '<p class="error">Товары не найдены</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            productList.innerHTML = '<p class="error">Ошибка загрузки товаров</p>';
        });

    function initProductInteractions() {
        document.querySelectorAll('.product-item').forEach(item => {
            const description = item.querySelector('.description');
            const overlay = item.querySelector('.fullscreen-overlay');
            const addToCartBtn = item.querySelector('.add-to-cart');
            const quantityControls = item.querySelector('.quantity-controls');
            
            // Показ описания при наведении
            item.addEventListener('mouseenter', () => {
                description.style.maxHeight = description.scrollHeight + 'px';
                description.style.opacity = '1';
                description.style.padding = '8px 0';
            });
            
            item.addEventListener('mouseleave', () => {
                description.style.maxHeight = '0';
                description.style.opacity = '0';
                description.style.padding = '0';
            });
            
            // Открытие полноэкранного режима по клику на карточку
            item.addEventListener('click', (e) => {
                // Игнорируем клики по кнопкам и элементам управления
                if (e.target.closest('.add-to-cart') || 
                    e.target.closest('.quantity-btn') || 
                    e.target.closest('.quantity')) {
                    return;
                }
                overlay.style.display = 'flex';
                setTimeout(() => {
                    overlay.style.opacity = '1';
                }, 10);
                document.body.style.overflow = 'hidden';
            });
            
            // Закрытие полноэкранного режима
            overlay.querySelector('.close-fullscreen').addEventListener('click', (e) => {
                e.stopPropagation();
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
                document.body.style.overflow = 'auto';
            });
        });
    }

    // ... (остальные функции addEventListeners и updateCart остаются без изменений)
    function addEventListeners() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productItem = this.closest('.product-item');
                const quantityElement = productItem.querySelector('.quantity');
                let quantity = parseInt(quantityElement.textContent);

                if (this.classList.contains('decrease')) {
                    quantity = Math.max(1, quantity - 1);
                } else {
                    quantity += 1;
                }

                quantityElement.textContent = quantity;
            });
        });

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productId = this.getAttribute('data-id');
                const productItem = this.closest('.product-item');
                const productName = productItem.querySelector('h3').textContent;
                const productPrice = parseFloat(productItem.querySelector('.price').textContent.replace(/\s/g, '').replace('руб.', ''));
                const quantity = parseInt(productItem.querySelector('.quantity').textContent);

                const existingItem = cart.find(item => item.id === productId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: quantity
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
        });
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="images/house${item.id}.jpg" alt="${item.name}">
                <div class="cart-item-content">
                    <h3>${item.name}</h3>
                    <p>${item.price.toLocaleString('ru-RU')} руб. × ${item.quantity}</p>
                    <div class="cart-quantity-controls">
                        <button class="cart-quantity-btn decrease" data-id="${item.id}">-</button>
                        <button class="cart-quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-from-cart" data-id="${item.id}">×</button>
                    </div>
                    <p class="cart-item-total">${(item.price * item.quantity).toLocaleString('ru-RU')} руб.</p>
                </div>
            `;
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toLocaleString('ru-RU');

        document.querySelectorAll('.cart-quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const item = cart.find(i => i.id === productId);

                if (this.classList.contains('decrease')) {
                    item.quantity = Math.max(1, item.quantity - 1);
                } else {
                    item.quantity += 1;
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
        });

        document.querySelectorAll('.remove-from-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                cart = cart.filter(i => i.id !== productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
        });
    }

    updateCart();
});