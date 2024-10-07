const cartIcon = document.querySelector(".cart-icon");
const cartItemsContainer = document.querySelector(".cart-items-container");
const searchIcon = document.querySelector(".search-icon");
const searchForm = document.querySelector(".search-form");
let cartItems = [];
let total = 0;

cartIcon.addEventListener("click", () => {
  cartItemsContainer.classList.toggle("active");
  searchForm.classList.remove("active");
});

searchIcon.addEventListener("click", () => {
  searchForm.classList.toggle("active");
  cartItemsContainer.classList.remove("active");
});

document.querySelectorAll(".btn").forEach((addToCartBtn) => {
  addToCartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const itemCard = e.target.closest(".cake-card");
    const itemName = itemCard.querySelector("h3").innerText;
    const itemPrice = parseFloat(
      itemCard.querySelector(".price").innerText.replace("$", "")
    );
    const itemImage = itemCard.querySelector("img").src;

    addItemToCart(itemName, itemPrice, itemImage);
    updateCartTotal();
    updateCartCount(); // Update cart count when item is added
  });
});

function addItemToCart(name, price, image) {
  const existingItem = Array.from(document.querySelectorAll(".cart-item")).find(
    (item) => item.querySelector("h3").innerText === name
  );

  if (existingItem) {
    const quantityInput = existingItem.querySelector(".item-quantity");
    quantityInput.value = parseInt(quantityInput.value) + 1;
  } else {
    const cartItemHTML = `
          <div class="cart-item">
              <span class="fas fa-times" onclick="removeItem(this)"></span>
              <img src="${image}" alt="${name}" />
              <div class="content">
                  <h3>${name}</h3>
                  <div class="price">$${price.toFixed(2)}/-</div>
                  <div class="quantity">
                      <button class="minus" onclick="updateQuantity(this, -1)">-</button>
                      <input type="number" value="1" class="item-quantity" readonly>
                      <button class="plus" onclick="updateQuantity(this, 1)">+</button>
                  </div>
              </div>
          </div>`;
    cartItemsContainer.insertAdjacentHTML("afterbegin", cartItemHTML);
  }
  updateCartCount();
}
function updateCartCount() {
  const cartItems = document.querySelectorAll(".cart-item");
  let totalItems = 0;

  cartItems.forEach((item) => {
    const quantity = parseInt(item.querySelector(".item-quantity").value);
    totalItems += quantity;
  });

  const cartCount = document.getElementById("cart-count");
  cartCount.innerText = totalItems;
  cartCount.style.display = totalItems > 0 ? "block" : "none"; // Hide badge if no items
}
function updateQuantity(button, change) {
  const quantityInput = button.parentElement.querySelector(".item-quantity");
  let quantity = parseInt(quantityInput.value);
  quantity = Math.max(1, quantity + change);
  quantityInput.value = quantity;

  updateCartTotal();
  updateCartCount();
}

function removeItem(button) {
  button.closest(".cart-item").remove();
  updateCartTotal();
  updateCartCount();
}
function updateCartTotal() {
  let total = 0;
  document.querySelectorAll(".cart-item").forEach((item) => {
    const price = parseFloat(
      item.querySelector(".price").innerText.replace("$", "")
    );
    const quantity = parseInt(item.querySelector(".item-quantity").value);
    total += price * quantity;
  });
  document.getElementById("total-price").innerText = `$${total.toFixed(2)}`;
}

document
  .querySelector(".search-form label")
  .addEventListener("click", function () {
    performSearch();
  });

document
  .getElementById("search-box")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });
function performSearch() {
  const searchQuery = document.getElementById("search-box").value.toLowerCase();
  const allItems = document.querySelectorAll(".cake-card h3");

  let found = false;
  allItems.forEach((item) => {
    if (item.innerText.toLowerCase().includes(searchQuery)) {
      const section = item.closest("section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        found = true;
      }
    }
  });

  if (!found) {
    alert("Item not found.");
  }
}

document.getElementById("generate-receipt").addEventListener("click", () => {
  const modal = document.getElementById("receipt-modal");
  const receiptContent = document.getElementById("receipt-content");
  const receiptTotal = document.getElementById("receipt-total");
  receiptContent.innerHTML = "";

  const items = [...document.querySelectorAll(".cart-item")]
    .map((item) => {
      const name = item.querySelector("h3").innerText;
      const price = item.querySelector(".price").innerText;
      const quantity = item.querySelector(".item-quantity").value;
      return `<p>${name} (${quantity}x) - ${price}</p>`;
    })
    .join("");

  const totalPrice = document.getElementById("total-price").innerText;
  receiptContent.innerHTML = items;
  receiptTotal.innerText = totalPrice;

  modal.style.display = "flex";
});

document.getElementById("confirm-order").addEventListener("click", () => {
  document.getElementById("receipt-modal").style.display = "none";
});

window.addEventListener("click", function (event) {
  const modal = document.getElementById("receipt-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
