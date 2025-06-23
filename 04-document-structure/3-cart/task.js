document.addEventListener("DOMContentLoaded", () => {
    const cartProductsContainer = document.querySelector(".cart__products");
    const cart = document.querySelector(".cart");

    // Функция для обновления видимости корзины: показываем её только при наличии товаров
    function updateCartVisibility() {
        cart.style.display = cartProductsContainer.children.length > 0 ? 'block' : 'none';
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

    // Функция для загрузки корзины из localStorage при открытии страницы
    function loadCartFromLocalStorage() {
        const savedCart = JSON.parse(localStorage.getItem("cart"));

        if (savedCart) {
            savedCart.forEach(item => {
                // Воссоздание каждого элемента корзины из сохранённых данных
                const cartProduct = document.createElement("div");
                cartProduct.className = "cart__product";
                cartProduct.dataset.id = item.id;

                const cartProductImage = document.createElement("img");
                cartProductImage.className = "cart__product-image";
                cartProductImage.src = item.imageSrc;

                const cartProductCount = document.createElement("div");
                cartProductCount.className = "cart__product-count";
                cartProductCount.textContent = item.count;

                const removeButton = document.createElement("div");
                removeButton.className = "cart__product-remove";
                removeButton.textContent = "Удалить";

                // Добавляем событие для удаления товара из корзины при нажатии на "Удалить"
                removeButton.addEventListener("click", () => {
                    cartProduct.remove();
                    saveCartToLocalStorage();
                    updateCartVisibility();
                });

                cartProduct.appendChild(cartProductImage);
                cartProduct.appendChild(cartProductCount);
                cartProduct.appendChild(removeButton);
                cartProductsContainer.appendChild(cartProduct);
            });
        }
        
        updateCartVisibility();
    }

    // Функция анимации перемещения товара в корзину
    function animateProductToCart(product, cartProduct) {
        const productImage = product.querySelector(".product__image");
        const cartImagePosition = cartProduct.querySelector(".cart__product-image").getBoundingClientRect();
        const productImagePosition = productImage.getBoundingClientRect();
        const flyingImage = productImage.cloneNode();

        flyingImage.style.position = 'absolute';
        flyingImage.style.width = productImage.offsetWidth + 'px';
        flyingImage.style.height = productImage.offsetHeight + 'px';
        flyingImage.style.top = productImagePosition.top + 'px';
        flyingImage.style.left = productImagePosition.left + 'px';
        flyingImage.style.transition = 'all 0.5s ease';

        document.body.appendChild(flyingImage);

        // Запускаем перемещение клонированного изображения от товара к корзине
        setTimeout(() => {
            flyingImage.style.top = cartImagePosition.top + 'px';
            flyingImage.style.left = cartImagePosition.left + 'px';
            flyingImage.style.width = cartImagePosition.width + 'px';
            flyingImage.style.height = cartImagePosition.height + 'px';
            flyingImage.style.opacity = '0';
        }, 10);

        // Удаляем анимированное изображение после завершения анимации
        flyingImage.addEventListener('transitionend', () => {
            flyingImage.remove();
        });
    }

    // Установка событий для изменения количества товаров и добавления их в корзину    
    document.querySelectorAll(".product").forEach((product) => {
        const quantityValue = product.querySelector(".product__quantity-value");
        const quantityControls = product.querySelector(".product__quantity-controls");

        // Изменение количества товара по клику на имеющиеся кнопки
        quantityControls.addEventListener("click", (e) => {
            if (e.target.classList.contains("product__quantity-control_dec")) {
                quantityValue.textContent = Math.max(1, parseInt(quantityValue.textContent) - 1);
            } else if (e.target.classList.contains("product__quantity-control_inc")) {
                quantityValue.textContent = parseInt(quantityValue.textContent) + 1;
            }
        });

        // Обработчик добавления товара в корзину
        product.querySelector(".product__add").addEventListener("click", () => {
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
                cartProduct = document.createElement("div");
                cartProduct.className = "cart__product";
                cartProduct.dataset.id = productId;

                const cartProductImage = document.createElement("img");
                cartProductImage.className = "cart__product-image";
                cartProductImage.src = productImageSrc;

                const cartProductCount = document.createElement("div");
                cartProductCount.className = "cart__product-count";
                cartProductCount.textContent = productQuantity;

                const removeButton = document.createElement("div");
                removeButton.className = "cart__product-remove";
                removeButton.textContent = "Удалить";
                
                removeButton.addEventListener("click", () => {
                    cartProduct.remove();
                    saveCartToLocalStorage();
                    updateCartVisibility();
                });

                cartProduct.appendChild(cartProductImage);
                cartProduct.appendChild(cartProductCount);
                cartProduct.appendChild(removeButton);
                cartProductsContainer.appendChild(cartProduct);
            }

            // Сохранение корзины после добавления товара. Обновление видимости корзины
            saveCartToLocalStorage();
            updateCartVisibility();

            // Запуск анимации добавления товара в корзину
            animateProductToCart(product, cartProduct);
        });
    });

    // Загружаем сохранённые товары в корзину при загрузке страницы
    loadCartFromLocalStorage();
});