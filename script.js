// Function to fetch the products data
async function fetchProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading products:', error);
    return null;
  }
}

// Function to fetch and render hot deals
async function fetchHotDeals() {
  try {
    const response = await fetch('hot.json');
    if (!response.ok) {
      throw new Error('Failed to fetch hot deals');
    }
    const hotDeals = await response.json();
    const hotDealsContainer = document.getElementById('hot-deals-content');

    if (hotDealsContainer) {
      hotDealsContainer.innerHTML = '';
      hotDeals.forEach(product => {
        const card = renderProductCard(product);
        hotDealsContainer.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Error fetching hot deals:', error);
    const hotDealsSection = document.getElementById('hot-deals');
    if (hotDealsSection) {
      hotDealsSection.style.display = 'none';
    }
  }
}

// Function to fetch the bundles data
async function fetchBundles() {
  try {
    const response = await fetch('bundles.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading bundles:', error);
    return null;
  }
}

// Function to get a random color class for product placeholders
function getRandomColorClass() {
  const colors = [
    'bg-red-100', 'bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-indigo-100',
    'bg-purple-100', 'bg-pink-100', 'bg-orange-100', 'bg-teal-100'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to create section ID from section name
function getSectionId(sectionName) {
  return sectionName.toLowerCase().replace(/\s+/g, '-');
}

// Function to render navigation links
function renderNavigation(sections) {
  const navList = document.getElementById('nav-list');
  navList.innerHTML = '';

  // Add bundles navigation
  const bundleLi = document.createElement('li');
  const bundleA = document.createElement('a');
  bundleA.href = '#bundles';
  bundleA.textContent = '🔥 Bundles (scroll) -►';
  bundleA.className = 'nav-link';
  bundleA.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.getElementById('bundles');
    if (target) {
      const headerHeight = document.querySelector('header').offsetHeight;
      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: 'smooth'
      });

      if (window.innerWidth < 768) {
        document.getElementById('main-nav').classList.remove('active');
      }
    }
  });
  bundleLi.appendChild(bundleA);
  navList.appendChild(bundleLi);

  sections.forEach(section => {
    const sectionId = getSectionId(section.name);
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.href = `#${sectionId}`;
    a.textContent = section.name;
    a.className = 'nav-link';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById(sectionId);
      if (target) {
        // Scroll to section with offset for header
        const headerHeight = document.querySelector('header').offsetHeight;
        window.scrollTo({
          top: target.offsetTop - headerHeight,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        if (window.innerWidth < 768) {
          document.getElementById('main-nav').classList.remove('active');
        }
      }
    });

    li.appendChild(a);
    navList.appendChild(li);
  });
}

// Function to render a bundle card
function renderBundleCard(bundle) {
  const card = document.createElement('div');
  card.className = 'bundle-card';

  // Bundle images section
  const imagesSection = document.createElement('div');
  imagesSection.className = 'bundle-images';

  bundle.items.forEach(item => {
    if (item.image) {
      const imageContainer = document.createElement('div');
      imageContainer.className = 'bundle-item-image';

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.product_name;
      img.className = 'bundle-product-img';
      img.onerror = function () {
        // On image error, replace with placeholder
        this.style.display = 'none';
        imageContainer.classList.add(getRandomColorClass());
        const placeholder = document.createElement('span');
        placeholder.className = 'bundle-product-placeholder';
        placeholder.textContent = item.product_name.charAt(0).toUpperCase();
        imageContainer.appendChild(placeholder);
      };

      // Add quantity indicator if more than 1
      if (item.quantity > 1) {
        const quantityBadge = document.createElement('div');
        quantityBadge.className = 'quantity-badge';
        quantityBadge.textContent = `x${item.quantity}`;
        imageContainer.appendChild(quantityBadge);
      }

      imageContainer.appendChild(img);
      imagesSection.appendChild(imageContainer);
    }
  });

  // Bundle header
  const header = document.createElement('div');
  header.className = 'bundle-header';

  const name = document.createElement('h3');
  name.className = 'bundle-name';
  name.textContent = bundle.name;

  const description = document.createElement('p');
  description.className = 'bundle-description';
  description.textContent = bundle.description;

  header.appendChild(name);
  header.appendChild(description);

  // Bundle items
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'bundle-items';

  const itemsTitle = document.createElement('h4');
  itemsTitle.className = 'bundle-items-title';
  itemsTitle.textContent = 'Includes:';
  itemsContainer.appendChild(itemsTitle);

  const itemsList = document.createElement('ul');
  itemsList.className = 'bundle-items-list';

  let totalNormalPrice = 0;

  bundle.items.forEach(item => {
    const itemElement = document.createElement('li');
    itemElement.className = 'bundle-item';

    const quantity = item.quantity > 1 ? `${item.quantity}x ` : '';
    itemElement.textContent = `${quantity}${item.product_name} ${item.product_description}`;

    totalNormalPrice += item.unit_price * item.quantity;
    itemsList.appendChild(itemElement);
  });

  itemsContainer.appendChild(itemsList);

  // Bundle pricing
  const pricing = document.createElement('div');
  pricing.className = 'bundle-pricing';

  const normalPrice = document.createElement('div');
  normalPrice.className = 'bundle-normal-price';
  normalPrice.textContent = `Regular: €${totalNormalPrice.toFixed(2)}`;

  const bundlePrice = document.createElement('div');
  bundlePrice.className = 'bundle-price';
  bundlePrice.textContent = `Bundle Price: €${bundle.bundle_price.toFixed(2)}`;

  const savings = document.createElement('div');
  savings.className = 'bundle-savings';
  const savedAmount = totalNormalPrice - bundle.bundle_price;
  savings.textContent = `You Save: €${savedAmount.toFixed(2)}`;

  pricing.appendChild(normalPrice);
  pricing.appendChild(bundlePrice);
  pricing.appendChild(savings);

  // Bundle footer with call to action
  // Bundle action buttons
  const footer = document.createElement('div');
  footer.className = 'bundle-footer';

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'bundle-buttons';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '0.5rem';

  const addToCartBtn = document.createElement('button');
  addToCartBtn.className = 'add-to-cart-btn';
  addToCartBtn.textContent = 'Add Bundle to Cart';
  addToCartBtn.addEventListener('click', () => addToCart(bundle, 'bundle'));

  const orderDirectBtn = document.createElement('button');
  orderDirectBtn.className = 'order-direct-btn';
  orderDirectBtn.textContent = 'Order Bundle Now';
  orderDirectBtn.addEventListener('click', () => orderDirect(bundle, 'bundle'));

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
  const bundlesSection = document.getElementById('bundles');

  if (!bundlesSection) {
    console.error('Bundles section not found in HTML');
    return;
  }

  // Clear existing content and add proper structure
  bundlesSection.innerHTML = '';
  bundlesSection.id = 'bundles';

  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = '🔥 Bundles (scroll) -►';


  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'section-content';
  
  if (!bundles || bundles.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No bundles available at the moment.';
    scrollContainer.appendChild(empty);
  } else {
    const bundleGrid = document.createElement('div');
    bundleGrid.className = 'bundle-grid';

    bundles.forEach(bundle => {
      bundleGrid.appendChild(renderBundleCard(bundle));
    });

    scrollContainer.appendChild(bundleGrid);
  }

  bundlesSection.appendChild(title);
  bundlesSection.appendChild(scrollContainer);
}

// Function to render a product card
function renderProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  // Product image or placeholder
  const imageContainer = document.createElement('div');
  const colorClass = getRandomColorClass();
  imageContainer.className = `product-image ${!product.image ? colorClass : ''}`;

  if (product.image) {
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.className = 'product-img';
    img.onerror = function () {
      // On image error, replace with placeholder
      this.style.display = 'none';
      imageContainer.classList.add(colorClass);
      const placeholder = document.createElement('span');
      placeholder.className = 'product-placeholder';
      placeholder.textContent = product.name.charAt(0).toUpperCase();
      imageContainer.appendChild(placeholder);
    };
    imageContainer.appendChild(img);
  } else {
    // No image, use placeholder
    const placeholder = document.createElement('span');
    placeholder.className = 'product-placeholder';
    placeholder.textContent = product.name.charAt(0).toUpperCase();
    imageContainer.appendChild(placeholder);
  }

  // Badges for product status
  if (product.quantity <= 0) {
    const outOfStock = document.createElement('div');
    outOfStock.className = 'out-of-stock';
    outOfStock.textContent = 'OUT OF STOCK FOR TODAY';
    imageContainer.appendChild(outOfStock);
  }

  if (product.most_popular) {
    const popularBadge = document.createElement('div');
    popularBadge.className = 'most-popular-badge';
    popularBadge.textContent = 'MOST POPULAR';
    imageContainer.appendChild(popularBadge);
  }

  if (product.new) {
    const newBadge = document.createElement('div');
    newBadge.className = 'new-badge';
    newBadge.textContent = 'NEW';
    imageContainer.appendChild(newBadge);
  }

  // Product details
  const details = document.createElement('div');
  details.className = 'product-details';

  const name = document.createElement('h3');
  name.className = 'product-name';
  name.textContent = product.name;

  const description = document.createElement('p');
  description.className = 'product-description';
  description.textContent = product.description;

  const quantity = document.createElement('p');
  quantity.className = `product-description ${product.quantity < 2 ? 'low-stock' : ''}`;
  quantity.textContent = `In stock: ${product.quantity}`;

  const meta = document.createElement('div');
  meta.className = 'product-meta';

  const unit = document.createElement('div');
  unit.className = 'product-unit';
  unit.textContent = product.unit;

  const price = document.createElement('div');
  price.className = 'product-price';

  if (product.discount_price && product.discount_price < product.sell_price) {
    const originalPrice = document.createElement('span');
    originalPrice.className = 'original-price';
    originalPrice.textContent = `€${product.sell_price.toFixed(2)}`;

    const discountedPrice = document.createElement('span');
    discountedPrice.className = 'discounted-price';
    discountedPrice.textContent = `€${product.discount_price.toFixed(2)}`;

    price.appendChild(originalPrice);
    price.appendChild(discountedPrice);
  } else {
    price.textContent = `€${product.sell_price.toFixed(2)}`;
  }

  meta.appendChild(unit);
  meta.appendChild(price);

  // Add to cart and order buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'product-buttons';

  const addToCartBtn = document.createElement('button');
  addToCartBtn.className = 'add-to-cart-btn';
  addToCartBtn.textContent = 'Add to Cart';
  addToCartBtn.disabled = product.quantity <= 0;
  addToCartBtn.addEventListener('click', () => addToCart(product, 'product'));

  const orderDirectBtn = document.createElement('button');
  orderDirectBtn.className = 'order-direct-btn';
  orderDirectBtn.textContent = 'Order Now';
  orderDirectBtn.disabled = product.quantity <= 0;
  orderDirectBtn.addEventListener('click', () => orderDirect(product, 'product'));

  buttonContainer.appendChild(addToCartBtn);
  buttonContainer.appendChild(orderDirectBtn);

  details.appendChild(name);
  details.appendChild(description);
  // details.appendChild(quantity);
  details.appendChild(meta);
  details.appendChild(buttonContainer);

  card.appendChild(imageContainer);
  card.appendChild(details);

  return card;
}

// Function to render a section
function renderSection(section) {
  const sectionId = getSectionId(section.name);

  const sectionElement = document.createElement('section');
  sectionElement.className = 'section';
  sectionElement.id = sectionId;

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = section.name;

  const content = document.createElement('div');
  content.className = 'section-content';

  if (section.products.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'product-grid';

    section.products.forEach(product => {
      grid.appendChild(renderProductCard(product));
    });

    content.appendChild(grid);
  } else {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No products available in this section.';
    content.appendChild(empty);
  }

  sectionElement.appendChild(title);
  sectionElement.appendChild(content);

  return sectionElement;
}

// Function to render all sections
function renderSections(data) {
  const contentElement = document.getElementById('content');
  contentElement.innerHTML = '';

  if (!data || !data.sections || data.sections.length === 0) {
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = 'No product data available.';
    contentElement.appendChild(error);
    return;
  }

  const sectionsContainer = document.createElement('div');
  sectionsContainer.className = 'sections-container';

  data.sections.forEach(section => {
    sectionsContainer.appendChild(renderSection(section));
  });

  contentElement.appendChild(sectionsContainer);
}

// Toggle mobile navigation
function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  // Close navigation on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && nav.classList.contains('active')) {
      nav.classList.remove('active');
    }
  });
}

// Search functionality
let allProducts = [];
let allSections = [];

function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const clearButton = document.getElementById('clear-search');

  searchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();

    if (query.length > 0) {
      clearButton.classList.add('visible');
      filterProducts(query);
    } else {
      clearButton.classList.remove('visible');
      showAllProducts();
    }
  });

  clearButton.addEventListener('click', function () {
    searchInput.value = '';
    clearButton.classList.remove('visible');
    showAllProducts();
    searchInput.focus();
  });
}

function filterProducts(query) {
  const filteredSections = allSections.map(section => {
    const filteredProducts = section.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );

    return {
      ...section,
      products: filteredProducts
    };
  }).filter(section => section.products.length > 0);

  const searchData = { sections: filteredSections };
  renderSections(searchData);

  // Hide bundles section during search
  const bundlesSection = document.getElementById('bundles');
  if (bundlesSection) {
    bundlesSection.style.display = 'none';
  }
}

function showAllProducts() {
  const originalData = { sections: allSections };
  renderSections(originalData);

  // Show bundles section when not searching
  const bundlesSection = document.getElementById('bundles');
  if (bundlesSection) {
    bundlesSection.style.display = 'block';
  }
}




// Setup info section interactivity
function setupInfoSection() {
  const infoTitle = document.getElementById('info-section-title');
  const infoContent = document.getElementById('info-section-content');
  
  if (!infoTitle || !infoContent) return;

  infoTitle.addEventListener('click', () => {
    const isOpen = infoContent.classList.toggle('open');
    infoTitle.setAttribute('aria-expanded', isOpen);
    infoContent.setAttribute('aria-hidden', !isOpen);
  });

  infoTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      infoTitle.click();
    }
  });
}

// Handle product data loading and rendering
async function initializeProducts() {
  const contentElement = document.getElementById('content');
  
  try {
    const [productsData, bundlesData] = await Promise.all([
      fetchProducts(),
      fetchBundles()
    ]);

    if (productsData?.sections) {
      allSections = productsData.sections;
      allProducts = productsData.sections.flatMap(section => section.products);
      renderNavigation(productsData.sections);
      renderSections(productsData);
    } else {
      throw new Error('Invalid products data structure');
    }

    if (bundlesData) {
      renderBundles(bundlesData);
    }

  } catch (error) {
    console.error('Error initializing products:', error);
    contentElement.innerHTML = `
      <div class="error">
        Failed to load products. Please try again later.
      </div>
    `;
  }
}

// Initialize the application
async function init() {
  try {
    // Setup UI components
    setupMobileNav();
    setupSearch();
    setupCartFunctionality();
    setupInfoSection();

    // Initialize content
    await Promise.all([
      initializeProducts(),
      fetchHotDeals()
    ]);
  } catch (error) {
    console.error('Application initialization failed:', error);
  }
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(item, type) {
  const cartItem = {
    id: type === 'bundle' ? item.id : `${item.name}-${item.description}`,
    name: item.name,
    description: type === 'bundle' ? item.description : item.description,
    price: type === 'bundle' ? item.bundle_price : (item.discount_price || item.sell_price),
    image: type === 'bundle' ? (item.items[0]?.image || '') : item.image,
    type: type,
    quantity: 1,
    originalItem: item
  };

  const existingIndex = cart.findIndex(existingItem => existingItem.id === cartItem.id);
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  updateCart();
  showCartNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCart();
}

function updateQuantity(itemId, change) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCart();
    }
  }
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalItems;
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><p>Add some products to get started!</p></div>';
    cartTotal.textContent = '0.00';
    return;
  }

  const itemsHTML = cart.map(item => {
    const escapedId = item.id.replace(/'/g, "\\'");
    return `
      <div class="cart-item">
        <div class="cart-item-image">
          ${item.image ?
        `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <span class="cart-item-placeholder" style="display:none;">${item.name.charAt(0)}</span>` :
        `<span class="cart-item-placeholder">${item.name.charAt(0)}</span>`
      }
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">€${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="updateQuantity('${escapedId}', -1)">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity('${escapedId}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  cartItems.innerHTML = itemsHTML;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
}

function clearCart() {
  cart = [];
  updateCart();
}

function showCartNotification(message) {
  // Simple notification - you could enhance this with a toast/notification system
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4ade80;
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    z-index: 1001;
    font-weight: 600;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function orderDirect(item, type) {
  const tempCart = [{
    id: type === 'bundle' ? item.id : `${item.name}-${item.description}`,
    name: item.name,
    description: type === 'bundle' ? item.description : item.description,
    price: type === 'bundle' ? item.bundle_price : (item.discount_price || item.sell_price),
    type: type,
    quantity: 1,
    originalItem: item
  }];

  showOrderModal(tempCart);
}

function generateOrderText(cartItems = cart) {
  const timestamp = new Date().toLocaleString();
  let orderText = `🛒 NEW ORDER - ${timestamp}\n`;
  orderText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  let total = 0;
  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    orderText += `📦 ${item.quantity}x ${item.name}\n`;
    if (item.description) {
      orderText += `   ${item.description}\n`;
    }
    orderText += `   €${item.price.toFixed(2)} each = €${itemTotal.toFixed(2)}\n\n`;
  });

  orderText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  orderText += `💰 TOTAL: €${total.toFixed(2)}\n\n`;
  orderText += `📞 Contact: +370 694 35 569\n`;
  orderText += `⚡ Delivery in 5 minutes!`;

  return orderText;
}

function showOrderModal(customCart = null) {
  const modal = document.getElementById('order-modal');
  const orderText = document.getElementById('order-text');

  orderText.value = generateOrderText(customCart || cart);
  modal.classList.add('active');
}

function hideOrderModal() {
  document.getElementById('order-modal').classList.remove('active');
}

function copyOrderToClipboard() {
  const orderText = document.getElementById('order-text');
  orderText.select();
  document.execCommand('copy');
  showCartNotification('Order copied to clipboard!');
}

function shareViaWhatsApp() {
  const orderText = document.getElementById('order-text').value;
  const phoneNumber = '37069435569'; // Your WhatsApp number
  const encodedText = encodeURIComponent(orderText);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

function shareViaTelegram() {
  const orderText = document.getElementById('order-text').value;
  const encodedText = encodeURIComponent(orderText);
  const telegramUrl = `https://t.me/dorm_cartel_boss?text=${encodedText}`;
  window.open(telegramUrl, '_blank');
}

function setupCartFunctionality() {
  const cartToggle = document.getElementById('cart-toggle');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCart = document.getElementById('close-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const orderNowBtn = document.getElementById('order-now');
  const closeModal = document.getElementById('close-modal');
  const copyOrder = document.getElementById('copy-order');
  const shareWhatsApp = document.getElementById('share-whatsapp');
  const shareTelegram = document.getElementById('share-telegram');

  cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
  });

  function hideCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  closeCart.addEventListener('click', hideCart);
  cartOverlay.addEventListener('click', hideCart);

  clearCartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  });

  orderNowBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    showOrderModal();
    hideCart();
  });

  closeModal.addEventListener('click', hideOrderModal);
  copyOrder.addEventListener('click', copyOrderToClipboard);
  shareWhatsApp.addEventListener('click', shareViaWhatsApp);
  shareTelegram.addEventListener('click', shareViaTelegram);

  // Initialize cart display
  updateCart();
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', init);
