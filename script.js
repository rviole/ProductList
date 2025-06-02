// Function to fetch the products data
async function fetchProducts() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading products:", error);
    return null;
  }
}

// Function to fetch the bundles data
async function fetchBundles() {
  try {
    const response = await fetch("bundles.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading bundles:", error);
    return null;
  }
}

// Function to fetch the hot deals data
async function fetchHotDeals() {
  try {
    const response = await fetch("hot.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading hot deals:", error);
    return null;
  }
}

// Function to get a random color class for product placeholders
function getRandomColorClass() {
  const colors = [
    "bg-red-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-indigo-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-orange-100",
    "bg-teal-100",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to create section ID from section name
function getSectionId(sectionName) {
  return sectionName.toLowerCase().replace(/\s+/g, "-");
}

// Function to render navigation links
function renderNavigation(sections) {
  const navList = document.getElementById("nav-list");
  navList.innerHTML = "";

  // Add hot deals navigation
  const hotDealsLi = document.createElement("li");
  const hotDealsA = document.createElement("a");
  hotDealsA.href = "#hot-deals";
  hotDealsA.textContent = "🔥 Hot";
  hotDealsA.className = "nav-link";
  hotDealsA.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.getElementById("hot-deals");
    if (target) {
      const headerHeight = document.querySelector("header").offsetHeight;
      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: "smooth",
      });

      if (window.innerWidth < 768) {
        document.getElementById("main-nav").classList.remove("active");
      }
    }
  });
  hotDealsLi.appendChild(hotDealsA);
  navList.appendChild(hotDealsLi);

  // Add bundles navigation
  const bundleLi = document.createElement("li");
  const bundleA = document.createElement("a");
  bundleA.href = "#bundles";
  bundleA.textContent = "🔥 Bundles";
  bundleA.className = "nav-link";
  bundleA.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.getElementById("bundles");
    if (target) {
      const headerHeight = document.querySelector("header").offsetHeight;
      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: "smooth",
      });

      if (window.innerWidth < 768) {
        document.getElementById("main-nav").classList.remove("active");
      }
    }
  });
  bundleLi.appendChild(bundleA);
  navList.appendChild(bundleLi);

  sections.forEach((section) => {
    const sectionId = getSectionId(section.name);
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.href = `#${sectionId}`;
    a.textContent = section.name;
    a.className = "nav-link";
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.getElementById(sectionId);
      if (target) {
        // Scroll to section with offset for header
        const headerHeight = document.querySelector("header").offsetHeight;
        window.scrollTo({
          top: target.offsetTop - headerHeight,
          behavior: "smooth",
        });

        // Close mobile nav if open
        if (window.innerWidth < 768) {
          document.getElementById("main-nav").classList.remove("active");
        }
      }
    });

    li.appendChild(a);
    navList.appendChild(li);
  });
}

// Function to render a bundle card
function renderBundleCard(bundle) {
  const card = document.createElement("div");
  card.className = "bundle-card";

  // Bundle images section
  const imagesSection = document.createElement("div");
  imagesSection.className = "bundle-images";

  bundle.items.forEach((item) => {
    if (item.image) {
      const imageContainer = document.createElement("div");
      imageContainer.className = "bundle-item-image";

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.product_name;
      img.className = "bundle-product-img";
      img.onerror = function () {
        // On image error, replace with placeholder
        this.style.display = "none";
        imageContainer.classList.add(getRandomColorClass());
        const placeholder = document.createElement("span");
        placeholder.className = "bundle-product-placeholder";
        placeholder.textContent = item.product_name.charAt(0).toUpperCase();
        imageContainer.appendChild(placeholder);
      };

      // Add quantity indicator if more than 1
      if (item.quantity > 1) {
        const quantityBadge = document.createElement("div");
        quantityBadge.className = "quantity-badge";
        quantityBadge.textContent = `x${item.quantity}`;
        imageContainer.appendChild(quantityBadge);
      }

      imageContainer.appendChild(img);
      imagesSection.appendChild(imageContainer);
    }
  });

  // Bundle header
  const header = document.createElement("div");
  header.className = "bundle-header";

  const name = document.createElement("h3");
  name.className = "bundle-name";
  name.textContent = bundle.name;

  const description = document.createElement("p");
  description.className = "bundle-description";
  description.textContent = bundle.description;

  header.appendChild(name);
  header.appendChild(description);

  // Bundle items
  const itemsContainer = document.createElement("div");
  itemsContainer.className = "bundle-items";

  const itemsTitle = document.createElement("h4");
  itemsTitle.className = "bundle-items-title";
  itemsTitle.textContent = "Includes:";
  itemsContainer.appendChild(itemsTitle);

  const itemsList = document.createElement("ul");
  itemsList.className = "bundle-items-list";

  let totalNormalPrice = 0;

  bundle.items.forEach((item) => {
    const itemElement = document.createElement("li");
    itemElement.className = "bundle-item";

    const quantity = item.quantity > 1 ? `${item.quantity}x ` : "";
    itemElement.textContent = `${quantity}${item.product_name} ${item.product_description}`;

    totalNormalPrice += item.unit_price * item.quantity;
    itemsList.appendChild(itemElement);
  });

  itemsContainer.appendChild(itemsList);

  // Bundle pricing
  const pricing = document.createElement("div");
  pricing.className = "bundle-pricing";

  const normalPrice = document.createElement("div");
  normalPrice.className = "bundle-normal-price";
  normalPrice.textContent = `Regular: €${totalNormalPrice.toFixed(2)}`;

  const bundlePrice = document.createElement("div");
  bundlePrice.className = "bundle-price";
  bundlePrice.textContent = `Bundle Price: €${bundle.bundle_price.toFixed(2)}`;

  const savings = document.createElement("div");
  savings.className = "bundle-savings";
  const savedAmount = totalNormalPrice - bundle.bundle_price;
  savings.textContent = `You Save: €${savedAmount.toFixed(2)}`;

  pricing.appendChild(normalPrice);
  pricing.appendChild(bundlePrice);
  pricing.appendChild(savings);

  // Bundle footer with call to action
  // Bundle action buttons
  const footer = document.createElement("div");
  footer.className = "bundle-footer";

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "bundle-buttons";
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "0.5rem";

  const addToCartBtn = document.createElement("button");
  addToCartBtn.className = "add-to-cart-btn";
  addToCartBtn.textContent = "Add Bundle to Cart";
  addToCartBtn.addEventListener("click", () => addToCart(bundle, "bundle"));

  const orderDirectBtn = document.createElement("button");
  orderDirectBtn.className = "order-direct-btn";
  orderDirectBtn.textContent = "Order Bundle Now";
  orderDirectBtn.addEventListener("click", () => orderDirect(bundle, "bundle"));

  buttonContainer.appendChild(addToCartBtn);
  buttonContainer.appendChild(orderDirectBtn);
  footer.appendChild(buttonContainer);

  card.appendChild(imagesSection);
  card.appendChild(header);
  card.appendChild(itemsContainer);
  card.appendChild(pricing);
  card.appendChild(footer);

  return card;
}

// Function to render bundles section
function renderBundles(bundles) {
  const bundlesSection = document.getElementById("bundles");

  if (!bundlesSection) {
    console.error("Bundles section not found in HTML");
    return;
  }

  // Clear existing content and add proper structure
  bundlesSection.innerHTML = "";
  bundlesSection.id = "bundles";

  const title = document.createElement("div");
  title.className = "section-title";
  title.textContent = "🔥 Bundles";

  const content = document.createElement("div");
  content.className = "section-content";

  if (!bundles || bundles.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No bundles available at the moment.";
    content.appendChild(empty);
  } else {
    const bundleGrid = document.createElement("div");
    bundleGrid.className = "bundle-grid";

    bundles.forEach((bundle) => {
      bundleGrid.appendChild(renderBundleCard(bundle));
    });

    content.appendChild(bundleGrid);
  }

  bundlesSection.appendChild(title);
  bundlesSection.appendChild(content);
}

// Function to render hot deals section
function renderHotDeals(hotDeals) {
  const hotDealsSection = document.getElementById("hot-deals");
  
  if (!hotDealsSection) {
    console.error("Hot deals section not found in HTML");
    return;
  }

  // Clear existing content and add proper structure
  hotDealsSection.innerHTML = "";

  const title = document.createElement("div");
  title.className = "section-title";
  title.textContent = "🔥 Hot";

  const content = document.createElement("div");
  content.className = "section-content";

  if (!hotDeals || hotDeals.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No hot deals available at the moment.";
    content.appendChild(empty);
  } else {
    const hotDealsContainer = document.createElement("div");
    hotDealsContainer.className = "hot-deals-container";

    hotDeals.forEach((product) => {
      hotDealsContainer.appendChild(renderProductCard(product));
    });

    content.appendChild(hotDealsContainer);
  }

  hotDealsSection.appendChild(title);
  hotDealsSection.appendChild(content);
}

// Function to render a product card
function renderProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  // Product image or placeholder
  const imageContainer = document.createElement("div");
  const colorClass = getRandomColorClass();
  imageContainer.className = `product-image ${!product.image ? colorClass : ""}`;

  if (product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.className = "product-img";
    img.onerror = function () {
      // On image error, replace with placeholder
      this.style.display = "none";
      imageContainer.classList.add(colorClass);
      const placeholder = document.createElement("span");
      placeholder.className = "product-placeholder";
      placeholder.textContent = product.name.charAt(0).toUpperCase();
      imageContainer.appendChild(placeholder);
    };
    imageContainer.appendChild(img);
  } else {
    // No image, use placeholder
    const placeholder = document.createElement("span");
    placeholder.className = "product-placeholder";
    placeholder.textContent = product.name.charAt(0).toUpperCase();
    imageContainer.appendChild(placeholder);
  }

  // Badges for product status
  if (product.quantity <= 0) {
    const outOfStock = document.createElement("div");
    outOfStock.className = "out-of-stock";
    outOfStock.textContent = "OUT OF STOCK FOR TODAY";
    imageContainer.appendChild(outOfStock);
  }

  if (product.most_popular) {
    const popularBadge = document.createElement("div");
    popularBadge.className = "most-popular-badge";
    popularBadge.textContent = "MOST POPULAR";
    imageContainer.appendChild(popularBadge);
  }

  if (product.new) {
    const newBadge = document.createElement("div");
    newBadge.className = "new-badge";
    newBadge.textContent = "NEW";
    imageContainer.appendChild(newBadge);
  }

  // Product details
  const details = document.createElement("div");
  details.className = "product-details";

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const quantity = document.createElement("p");
  quantity.className = "product-quantity";
  quantity.textContent = `Available: ${product.quantity}`;

  const unit = document.createElement("p");
  unit.className = "product-unit";
  unit.textContent = product.unit;

  // Product pricing
  const pricing = document.createElement("div");
  pricing.className = "product-pricing";

  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = `€${product.discount_price.toFixed(2)}`;

  // Show original price if different from discount price
  if (product.sell_price !== product.discount_price) {
    const originalPrice = document.createElement("span");
    originalPrice.className = "product-original-price";
    originalPrice.textContent = `€${product.sell_price.toFixed(2)}`;
    pricing.appendChild(originalPrice);
  }

  pricing.appendChild(price);

  // Product actions
  const actions = document.createElement("div");
  actions.className = "product-actions";

  const addToCartBtn = document.createElement("button");
  addToCartBtn.className = "btn btn-secondary";
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.disabled = product.quantity <= 0;
  addToCartBtn.addEventListener("click", () => addToCart(product, "product"));

  const orderDirectBtn = document.createElement("button");
  orderDirectBtn.className = "btn btn-primary";
  orderDirectBtn.textContent = "Order Now";
  orderDirectBtn.disabled = product.quantity <= 0;
  orderDirectBtn.addEventListener("click", () => orderDirect(product, "product"));

  actions.appendChild(addToCartBtn);
  actions.appendChild(orderDirectBtn);

  details.appendChild(name);
  details.appendChild(description);
  details.appendChild(unit);
  details.appendChild(quantity);
  details.appendChild(pricing);
  details.appendChild(actions);

  card.appendChild(imageContainer);
  card.appendChild(details);

  return card;
}

// Function to render a product section
function renderProductSection(section) {
  const sectionContainer = document.createElement("div");
  sectionContainer.className = "section";
  sectionContainer.id = getSectionId(section.name);

  const title = document.createElement("div");
  title.className = "section-title";
  title.textContent = section.name;

  const content = document.createElement("div");
  content.className = "section-content";

  if (!section.products || section.products.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No products available in this section.";
    content.appendChild(empty);
  } else {
    const productGrid = document.createElement("div");
    productGrid.className = "product-grid";

    section.products.forEach((product) => {
      productGrid.appendChild(renderProductCard(product));
    });

    content.appendChild(productGrid);
  }

  sectionContainer.appendChild(title);
  sectionContainer.appendChild(content);

  return sectionContainer;
}

// Cart functionality
let cart = [];

function addToCart(item, type) {
  const cartItem = {
    id: type === "bundle" ? `bundle-${item.id}` : `product-${item.name}-${item.description}`,
    name: item.name,
    description: type === "bundle" ? item.description : item.description,
    price: type === "bundle" ? item.bundle_price : item.discount_price,
    quantity: 1,
    type: type,
    image: type === "bundle" ? (item.items && item.items[0] ? item.items[0].image : "") : item.image,
    original_item: item
  };

  const existingItem = cart.find(cartItem => cartItem.id === cartItem.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(cartItem);
  }

  updateCartUI();
  showNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartUI();
}

function updateCartQuantity(itemId, change) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartUI();
    }
  }
}

function clearCart() {
  cart = [];
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <p>Add some products to get started!</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-image ${!item.image ? getRandomColorClass() : ""}">
          ${item.image ? 
            `<img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.style.display='none'; this.parentElement.classList.add('${getRandomColorClass()}'); this.parentElement.innerHTML += '<span class=cart-item-placeholder>${item.name.charAt(0).toUpperCase()}</span>';">` :
            `<span class="cart-item-placeholder">${item.name.charAt(0).toUpperCase()}</span>`
          }
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-description">${item.description}</div>
          <div class="cart-item-price">€${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
          <button class="remove-item" onclick="removeFromCart('${item.id}')">✕</button>
        </div>
      </div>
    `).join("");
  }

  // Update cart total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
}

function orderDirect(item, type) {
  const tempCart = [{
    id: type === "bundle" ? `bundle-${item.id}` : `product-${item.name}-${item.description}`,
    name: item.name,
    description: type === "bundle" ? item.description : item.description,
    price: type === "bundle" ? item.bundle_price : item.discount_price,
    quantity: 1,
    type: type
  }];
  
  generateOrderText(tempCart);
}

function orderNow() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!");
    return;
  }
  generateOrderText(cart);
}

function generateOrderText(orderItems) {
  const orderText = document.getElementById("order-text");
  const modal = document.getElementById("order-modal");
  
  let text = "🛒 ORDER DETAILS\n";
  text += "================\n\n";
  
  let total = 0;
  orderItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    text += `${item.quantity}x ${item.name}\n`;
    text += `   ${item.description}\n`;
    text += `   €${item.price.toFixed(2)} each = €${itemTotal.toFixed(2)}\n\n`;
  });
  
  text += "================\n";
  text += `TOTAL: €${total.toFixed(2)}\n\n`;
  text += "📞 Contact:\n";
  text += "WhatsApp: +370 694 35 569\n";
  text += "Telegram: @dorm_cartel_boss\n\n";
  text += "⚡ Delivery in 5 minutes | 🕒 Working 24/7";
  
  orderText.value = text;
  modal.classList.add("open");
}

function copyOrderText() {
  const orderText = document.getElementById("order-text");
  orderText.select();
  document.execCommand("copy");
  showNotification("Order copied to clipboard!");
}

function shareWhatsApp() {
  const orderText = document.getElementById("order-text").value;
  const encodedText = encodeURIComponent(orderText);
  const whatsappUrl = `https://wa.me/37069435569?text=${encodedText}`;
  window.open(whatsappUrl, "_blank");
}

function shareTelegram() {
  const orderText = document.getElementById("order-text").value;
  const encodedText = encodeURIComponent(orderText);
  const telegramUrl = `https://t.me/dorm_cartel_boss?text=${encodedText}`;
  window.open(telegramUrl, "_blank");
}

function showNotification(message) {
  // Simple notification - you can enhance this
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--main-theme-color);
    color: white;
    padding: 1rem;
    border-radius: 0.375rem;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Search functionality
function setupSearch(allProducts) {
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  
  searchInput.addEventListener("input", function(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length > 0) {
      clearSearchBtn.classList.add("visible");
      filterProducts(query, allProducts);
    } else {
      clearSearchBtn.classList.remove("visible");
      showAllProducts(allProducts);
    }
  });
  
  clearSearchBtn.addEventListener("click", function() {
    searchInput.value = "";
    clearSearchBtn.classList.remove("visible");
    showAllProducts(allProducts);
  });
}

function filterProducts(query, allProducts) {
  const content = document.getElementById("content");
  content.innerHTML = "";
  
  let hasResults = false;
  
  allProducts.sections.forEach(section => {
    const filteredProducts = section.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
    
    if (filteredProducts.length > 0) {
      hasResults = true;
      const filteredSection = {
        name: section.name,
        products: filteredProducts
      };
      content.appendChild(renderProductSection(filteredSection));
    }
  });
  
  if (!hasResults) {
    const noResults = document.createElement("div");
    noResults.className = "section";
    noResults.innerHTML = `
      <div class="section-title">Search Results</div>
      <div class="section-content">
        <p class="empty">No products found for "${query}"</p>
      </div>
    `;
    content.appendChild(noResults);
  }
}

function showAllProducts(allProducts) {
  const content = document.getElementById("content");
  content.innerHTML = "";
  
  allProducts.sections.forEach(section => {
    content.appendChild(renderProductSection(section));
  });
}

// Initialize the application
async function init() {
  try {
    // Fetch all data
    const [productsData, bundlesData, hotDealsData] = await Promise.all([
      fetchProducts(),
      fetchBundles(),
      fetchHotDeals()
    ]);

    if (productsData) {
      // Render navigation
      renderNavigation(productsData.sections);
      
      // Render all product sections
      showAllProducts(productsData);
      
      // Setup search
      setupSearch(productsData);
    } else {
      document.getElementById("content").innerHTML = `
        <div class="section">
          <div class="section-title">Error</div>
          <div class="section-content">
            <p class="empty">Failed to load products. Please refresh the page.</p>
          </div>
        </div>
      `;
    }

    // Render hot deals
    if (hotDealsData) {
      renderHotDeals(hotDealsData);
    } else {
      const hotDealsSection = document.getElementById("hot-deals");
      if (hotDealsSection) {
        hotDealsSection.querySelector(".section-content").innerHTML = `
          <p class="empty">Failed to load hot deals.</p>
        `;
      }
    }

    // Render bundles
    if (bundlesData) {
      renderBundles(bundlesData);
    } else {
      const bundlesSection = document.getElementById("bundles");
      if (bundlesSection) {
        bundlesSection.querySelector(".section-content").innerHTML = `
          <p class="empty">Failed to load bundles.</p>
        `;
      }
    }

  } catch (error) {
    console.error("Error initializing app:", error);
    document.getElementById("content").innerHTML = `
      <div class="section">
        <div class="section-title">Error</div>
        <div class="section-content">
          <p class="empty">An error occurred while loading the application. Please refresh the page.</p>
        </div>
      </div>
    `;
  }
}

// Event listeners for UI interactions
document.addEventListener("DOMContentLoaded", function() {
  // Initialize the app
  init();
  
  // Mobile navigation toggle
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  
  navToggle.addEventListener("click", function() {
    nav.classList.toggle("active");
  });
  
  // Cart sidebar toggle
  const cartToggle = document.getElementById("cart-toggle");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCart = document.getElementById("close-cart");
  
  cartToggle.addEventListener("click", function() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
  });
  
  closeCart.addEventListener("click", function() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
  });
  
  cartOverlay.addEventListener("click", function() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
  });
  
  // Cart actions
  document.getElementById("clear-cart").addEventListener("click", clearCart);
  document.getElementById("order-now").addEventListener("click", orderNow);
  
  // Order modal
  const orderModal = document.getElementById("order-modal");
  const closeModal = document.getElementById("close-modal");
  
  closeModal.addEventListener("click", function() {
    orderModal.classList.remove("open");
  });
  
  // Order modal actions
  document.getElementById("copy-order").addEventListener("click", copyOrderText);
  document.getElementById("share-whatsapp").addEventListener("click", shareWhatsApp);
  document.getElementById("share-telegram").addEventListener("click", shareTelegram);
  
  // Info section toggle
  const infoToggle = document.getElementById("info-toggle");
  const infoContent = document.getElementById("info-content");
  const toggleIcon = infoToggle.querySelector(".toggle-icon");
  
  infoToggle.addEventListener("click", function() {
    infoContent.classList.toggle("collapsed");
    toggleIcon.classList.toggle("rotated");
  });
  
  // Close modal when clicking outside
  orderModal.addEventListener("click", function(e) {
    if (e.target === orderModal) {
      orderModal.classList.remove("open");
    }
  });
});
