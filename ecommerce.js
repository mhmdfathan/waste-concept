document.addEventListener('DOMContentLoaded', () => {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter =
        document.querySelector('.fa-shopping-cart').parentElement;

    function updateCartCount() {
        cartCounter.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cart.length})`;
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const product = {
                id: Date.now(),
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.price').textContent,
                image: card.querySelector('img').src,
            };

            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            // Visual feedback
            button.textContent = 'Added to Cart!';
            setTimeout(() => {
                button.innerHTML =
                    '<i class="fas fa-cart-plus"></i> Add to Cart';
            }, 2000);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.filters input');
    const categorySelect = document.querySelector('.filters select');
    const products = document.querySelectorAll('.product-card');

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value.toLowerCase();

        products.forEach((product) => {
            const title = product.querySelector('h3').textContent.toLowerCase();
            const description = product
                .querySelector('.description')
                .textContent.toLowerCase();
            const matchesSearch =
                title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory =
                !category || product.dataset.category === category;

            product.style.display =
                matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);

    // Initialize cart count
    updateCartCount();
});
