const API_URL = 'https://fakestoreapi.com/products';

let cart = [];
const productList = document.getElementById('productList');
const cartButton = document.getElementById('cartButton');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartCheckoutButton = document.getElementById('cartCheckoutButton'); // زر شراء الكارت


async function fetchProducts() {
  const response = await fetch(API_URL);
  const products = await response.json();
  const filteredProducts = products.filter(product => 
    product.category === "women's clothing" || product.category === "jewelery"
  );
  displayProducts(filteredProducts.slice(0, 20)); 
}


function displayProducts(products) {
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'col-md-4';
    productCard.innerHTML = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}" class="img-fluid">
        <h5>${product.title}</h5>
        <p>$${product.price.toFixed(2)}</p>
        <button class="btn btn-pink add-to-cart" data-id="${product.id}" data-name="${product.title}" data-price="${product.price}">Add to Cart</button>
      </div>
    `;
    productList.appendChild(productCard);
  });

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });


  document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', buyNow);
  });
}


function addToCart(event) {
  const button = event.target;
  const id = button.getAttribute('data-id');
  const name = button.getAttribute('data-name');
  const price = parseFloat(button.getAttribute('data-price'));

  const existingProduct = cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  updateCart();
}

function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index > -1) {
    cart.splice(index, 1); 
  }
  updateCart();
}

function increaseQuantity(id) {
  const product = cart.find(item => item.id === id);
  if (product) {
    product.quantity += 1;
  }
  updateCart();
}

function decreaseQuantity(id) {
  const product = cart.find(item => item.id === id);
  if (product && product.quantity > 1) {
    product.quantity -= 1;
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
      <div>
        <button class="btn btn-sm btn-outline-secondary me-2" onclick="increaseQuantity('${item.id}')">+</button>
        <button class="btn btn-sm btn-outline-secondary me-2" onclick="decreaseQuantity('${item.id}')">-</button>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>`;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}


function checkoutCart() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

 
  let cartDetails = cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  alert(`Thank you for your purchase!\n\n${cartDetails}\n\nTotal: $${totalAmount}`);
  
  cart = [];
  updateCart();
}


cartButton.addEventListener('click', () => {
  const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
  cartModal.show();
});
cartCheckoutButton.addEventListener('click', checkoutCart);
fetchProducts();
