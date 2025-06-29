document.addEventListener("DOMContentLoaded", () => {
    const cartProductsContainer = document.querySelector(".cart__products");
    const cart = document.querySelector(".cart");
    
    // Переменная для хранения таймера устранения дребезга
    let debounceTimer;
    
    // Функция для устранения дребезга
    function debounce(func, delay) {
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Функция для обновления видимости корзины: показываем её только при наличии товаров
    function updateCartVisibility() {
        const hasItems = cartProductsContainer.children.length > 0;
        if (hasItems) {
            cart.classList.add('visible');
            cart.style.display = 'block';
        } else {
            cart.classList.remove('visible');
            // Даём время на анимацию исчезновения перед скрытием
            setTimeout(() => {
                if (cartProductsContainer.children.length === 0) {
                    cart.style.display = 'none';
                }
            }, 300);
        }
    }

    // Функция для сохранения текущего состояния корзины в localStorage
    function saveCartToLocalStorage() {
        const cartItems = Array.from(cartProductsContainer.children).map(cartProduct => ({
            id: cartProduct.dataset.id,
            imageSrc: cartProduct.querySelector(".cart__product-image").src,
            count: parseInt(cartProduct.querySelector(".cart__product-count").textContent)
        }));
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    // Функция для удаления товара из корзины с анимацией
    function removeCartItem(cartProduct) {
        cartProduct.classList.add('removing');
        // Удаляем элемент из DOM после завершения анимации
        cartProduct.addEventListener('animationend', () => {
            cartProduct.remove();
            saveCartToLocalStorage();
            updateCartVisibility();
        }, { once: true });
    }

    // Функция для загрузки корзины из localStorage при открытии страницы
    function loadCartFromLocalStorage() {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Очищаем текущую корзину перед загрузкой
        cartProductsContainer.innerHTML = '';

        if (savedCart.length > 0) {
            savedCart.forEach(item => {
                // Создаем HTML-разметку для товара в корзине с помощью шаблонных строк
                const cartProductHTML = `
                    <div class="cart__product" data-id="${item.id}">
                        <img class="cart__product-image" src="${item.imageSrc}" alt="Товар">
                        <div class="cart__product-count">${item.count}</div>
                        <div class="cart__product-remove">Удалить</div>
                    </div>
                `;
                
                // Создаем элемент из HTML-строки
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cartProductHTML.trim();
                const cartProduct = tempDiv.firstChild;
                
                // Находим кнопку удаления и добавляем обработчик
                const removeButton = cartProduct.querySelector('.cart__product-remove');
                removeButton.addEventListener('click', () => {
                    removeCartItem(cartProduct);
                });
                
                // Добавляем товар в корзину
                cartProductsContainer.appendChild(cartProduct);
            });
        }
        
        updateCartVisibility();
    }

    // Функция анимации перемещения товара в корзину с оптимизацией
    function animateProductToCart(product, cartProduct) {
        const productImage = product.querySelector(".product__image");
        const cartImage = cartProduct.querySelector(".cart__product-image");
        
        // Используем requestAnimationFrame для плавной анимации
        requestAnimationFrame(() => {
            const cartImagePosition = cartImage.getBoundingClientRect();
            const productImagePosition = productImage.getBoundingClientRect();
            
            // Создаем клонированное изображение для анимации
            const flyingImage = productImage.cloneNode();
            
            // Устанавливаем стили для анимации с учетом производительности
            Object.assign(flyingImage.style, {
                position: 'fixed',
                width: `${productImage.offsetWidth}px`,
                height: `${productImage.offsetHeight}px`,
                top: `${productImagePosition.top}px`,
                left: `${productImagePosition.left}px`,
                margin: 0,
                padding: 0,
                zIndex: 1000,
                pointerEvents: 'none',
                willChange: 'transform, opacity',
                transform: 'translateZ(0)', // Аппаратное ускорение
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
                opacity: '0.8'
            });

            document.body.appendChild(flyingImage);
            
            // Даем браузеру время на отрисовку
            requestAnimationFrame(() => {
                // Вычисляем разницу в координатах
                const deltaX = cartImagePosition.left - productImagePosition.left;
                const deltaY = cartImagePosition.top - productImagePosition.top;
                const scaleX = cartImagePosition.width / productImagePosition.width;
                const scaleY = cartImagePosition.height / productImagePosition.height;
                
                // Применяем анимацию через transform для лучшей производительности
                flyingImage.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
                flyingImage.style.opacity = '0';
                
                // Удаляем элемент после завершения анимации
                const onAnimationEnd = () => {
                    flyingImage.remove();
                    flyingImage.removeEventListener('transitionend', onAnimationEnd);
                };
                
                flyingImage.addEventListener('transitionend', onAnimationEnd, { once: true });
            });
        });
    }

    // Установка событий для изменения количества товаров и добавления их в корзину    
    document.querySelectorAll(".product").forEach((product) => {
        const quantityValue = product.querySelector(".product__quantity-value");
        const quantityControls = product.querySelector(".product__quantity-controls");

        // Обработчики для кнопок изменения количества
        const decBtn = quantityControls.querySelector('.product__quantity-control_dec');
        const incBtn = quantityControls.querySelector('.product__quantity-control_inc');
        
        // Обработчик уменьшения количества
        decBtn.addEventListener('click', (e) => {
            e.preventDefault();
            quantityValue.textContent = Math.max(1, parseInt(quantityValue.textContent) - 1);
        });
        
        // Обработчик увеличения количества
        incBtn.addEventListener('click', (e) => {
            e.preventDefault();
            quantityValue.textContent = parseInt(quantityValue.textContent) + 1;
        });

        // Обработчик добавления товара в корзину
        const addToCartHandler = (e) => {
            // Добавляем визуальный отклик при нажатии
            const button = e.currentTarget;
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
            
            // Запускаем анимацию добавления в корзину
            requestAnimationFrame(() => {
                const productId = product.dataset.id;
                const productImageSrc = product.querySelector(".product__image").src;
                const productQuantity = parseInt(quantityValue.textContent);

                // Проверка, есть ли уже такой товар в корзине
                let cartProduct = cartProductsContainer.querySelector(`.cart__product[data-id="${productId}"]`);

                // Если товар уже есть, увеличиваем его количество. Если товара нет в корзине, создаем новый элемент
                if (cartProduct) {
                    const cartProductCount = cartProduct.querySelector(".cart__product-count");
                    cartProductCount.textContent = parseInt(cartProductCount.textContent) + productQuantity;
                } else {
                    // Создаем HTML-разметку для нового товара в корзине с помощью шаблонных строк
                    const cartProductHTML = `
                        <div class="cart__product" data-id="${productId}">
                            <img class="cart__product-image" src="${productImageSrc}" alt="Товар">
                            <div class="cart__product-count">${productQuantity}</div>
                            <div class="cart__product-remove">Удалить</div>
                        </div>
                    `;
                    
                    // Создаем элемент из HTML-строки
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = cartProductHTML.trim();
                    cartProduct = tempDiv.firstChild;
                    
                    // Находим кнопку удаления и добавляем обработчик
                    const removeButton = cartProduct.querySelector('.cart__product-remove');
                    removeButton.addEventListener('click', () => {
                        removeCartItem(cartProduct);
                    });
                    
                    // Добавляем товар в корзину
                    cartProductsContainer.appendChild(cartProduct);
                }

                // Сохранение корзины после добавления товара. Обновление видимости корзины
                saveCartToLocalStorage();
                updateCartVisibility();

                // Добавляем класс подсветки к товару
                product.classList.add('highlight');
                // Удаляем класс подсветки после завершения анимации
                setTimeout(() => {
                    product.classList.remove('highlight');
                }, 1500);
                
                // Запуск анимации добавления товара в корзину
                animateProductToCart(product, cartProduct);
            });
        };
        
        product.querySelector(".product__add").addEventListener("click", addToCartHandler);
    });

    // Загружаем сохранённые товары в корзину при загрузке страницы
    loadCartFromLocalStorage();
});