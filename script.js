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

// Function to fetch the hot products data
async function fetchHotProducts() {
  try {
    const response = await fetch('hot.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading hot products:', error);
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

// Function to toggle collapsible content
function toggleCollapsible(titleElement, contentElement, arrowElement) {
  const isCollapsed = contentElement.classList.contains('collapsed');
  
  if (isCollapsed) {
    // Expand
    contentElement.classList.remove('collapsed');
    arrowElement.classList.remove('rotated');
  } else {
    // Collapse
    contentElement.classList.add('collapsed');
    arrowElement.classList.add('rotated');
  }
}

// Function to initialize collapsible functionality
function initializeCollapsible() {
  const infoToggle = document.getElementById('info-toggle');
  const infoContent = document.getElementById('info-content');
  const collapseArrow = infoToggle.querySelector('.collapse-arrow');
  
  // Set initial collapsed state
  infoContent.classList.add('collapsed');
  collapseArrow.classList.add('rotated');
  
  // Add click event listener
  infoToggle.addEventListener('click', function() {
    toggleCollapsible(infoToggle, infoContent, collapseArrow);
  });
}

// Function to render navigation links
function renderNavigation(sections) {
  const navList = document.getElementById('nav-list');
  navList.innerHTML = '';

  // Add hot navigation
  const hotLi = document.createElement('li');
  const hotA = document.createElement('a');
  hotA.href = '#hot';
  hotA.textContent = '🔥 Hot';
  hotA.className = 'nav-link';
  hotA.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.getElementById('hot');
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
  hotLi.appendChild(hotA);
  navList.appendChild(hotLi);

  // Add bundles navigation
  const bundleLi = document.createElement('li');
  const bundleA = document.createElement('a');
  bundleA.href = '#bundles';
  bundleA.textContent = '🔥 Bundles';
  bundleA.className = 'nav-link';
  bundleA.addEventListener('click', function(e) {
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
    a.addEventListener('click', function(e) {
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
      img.onerror = function() {
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
  title.textContent = '🔥 Bundles --▶';

  const content = document.createElement('div');
  content.className = 'section-content';

  if (!bundles || bundles.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No bundles available at the moment.';
    content.appendChild(empty);
  } else {
    const bundleGrid = document.createElement('div');
    bundleGrid.className = 'bundle-grid';

    bundles.forEach(bundle => {
      bundleGrid.appendChild(renderBundleCard(bundle));
    });

    content.appendChild(bundleGrid);
  }

  bundlesSection.appendChild(title);
  bundlesSection.appendChild(content);
}

// Function to render hot products section
function renderHotProducts(hotProducts) {
  const hotSection = document.getElementById('hot');
  
  if (!hotSection) {
    console.error('Hot section not found in HTML');
    return;
  }

  // Clear existing content and add proper structure
  hotSection.innerHTML = '';
  hotSection.id = 'hot';

  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = '🔥 Hot --▶';

  const content = document.createElement('div');
  content.className = 'section-content';

  if (!hotProducts || hotProducts.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No hot products available at the moment.';
    content.appendChild(empty);
  } else {
    const hotGrid = document.createElement('div');
    hotGrid.className = 'hot-grid';

    hotProducts.forEach(product => {
      hotGrid.appendChild(renderProductCard(product));
    });

    content.appendChild(hotGrid);
  }

  hotSection.appendChild(title);
  hotSection.appendChild(content);
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
    img.onerror = function() {
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
  details.appendChild(quantity);
  details.appendChild(meta);

  card.appendChild(imageContainer);
  card.appendChild(details);
  card.appendChild(buttonContainer);

  return card;
}

// Function to render a product section
function renderSection(section) {
  const sectionElement = document.createElement('div');
  sectionElement.className = 'section';
  sectionElement.id = getSectionId(section.name);

  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = section.name;

  const content = document.createElement('div');
  content.className = 'section-content';

  if (!section.products || section.products.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No products available in this section.';
    content.appendChild(empty);
  } else {
    const productGrid = document.createElement('div');
    productGrid.className = 'product-grid';

    section.products.forEach(product => {
      productGrid.appendChild(renderProductCard(product));
    });

    content.appendChild(productGrid);
  }

  sectionElement.appendChild(title);
  sectionElement.appendChild(content);

  return sectionElement;
}

// Cart management
let cart = [];

// Function to add item to cart
function addToCart(item, type) {
  const existingItemIndex = cart.findIndex(cartItem => 
    cartItem.id === (item.id || `${item.name}-${item.description}`) && cartItem.type === type
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    const cartItem = {
      id: item.id || `${item.name}-${item.description}`,
      name: item.name,
      description: item.description || item.bundle_price ? `Bundle: ${item.description}` : '',
      price: type === 'bundle' ? item.bundle_price : (item.discount_price || item.sell_price),
      quantity: 1,
      type: type,
      image: type === 'bundle' ? item.items[0]?.image : item.image
    };
    cart.push(cartItem);
  }

  updateCartDisplay();
  showCartNotification();
}

// Function to order directly
function orderDirect(item, type) {
  const customCart = [{
    id: item.id || `${item.name}-${item.description}`,
    name: item.name,
    description: item.description || item.bundle_price ? `Bundle: ${item.description}` : '',
    price: type === 'bundle' ? item.bundle_price : (item.discount_price || item.sell_price),
    quantity: 1,
    type: type,
    image: type === 'bundle' ? item.items[0]?.image : item.image
  }];
  
  showOrderModal(customCart);
}

// Function to show cart notification
function showCartNotification() {
  // Remove any existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create new notification
  const notification = document.createElement('div');
  notification.className = 'notification success';
  notification.textContent = 'Item added to cart!';
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Function to update cart display
function updateCartDisplay() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
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
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
      cartItems.appendChild(createCartItemElement(item, index));
    });
  }
  
  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
}

// Function to create cart item element
function createCartItemElement(item, index) {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  
  // Item image
  const imageContainer = document.createElement('div');
  imageContainer.className = 'cart-item-image';
  
  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.className = 'cart-item-img';
    img.onerror = function() {
      this.style.display = 'none';
      imageContainer.classList.add(getRandomColorClass());
      const placeholder = document.createElement('span');
      placeholder.className = 'cart-item-placeholder';
      placeholder.textContent = item.name.charAt(0).toUpperCase();
      imageContainer.appendChild(placeholder);
    };
    imageContainer.appendChild(img);
  } else {
    imageContainer.classList.add(getRandomColorClass());
    const placeholder = document.createElement('span');
    placeholder.className = 'cart-item-placeholder';
    placeholder.textContent = item.name.charAt(0).toUpperCase();
    imageContainer.appendChild(placeholder);
  }
  
  // Item details
  const details = document.createElement('div');
  details.className = 'cart-item-details';
  
  const name = document.createElement('div');
  name.className = 'cart-item-name';
  name.textContent = item.name;
  
  const description = document.createElement('div');
  description.className = 'cart-item-description';
  description.textContent = item.description;
  
  const controls = document.createElement('div');
  controls.className = 'cart-item-controls';
  
  const quantityControls = document.createElement('div');
  quantityControls.className = 'quantity-controls';
  
  const decreaseBtn = document.createElement('button');
  decreaseBtn.className = 'quantity-btn';
  decreaseBtn.textContent = '-';
  decreaseBtn.disabled = item.quantity <= 1;
  decreaseBtn.addEventListener('click', () => updateCartItemQuantity(index, -1));
  
  const quantityDisplay = document.createElement('span');
  quantityDisplay.className = 'quantity-display';
  quantityDisplay.textContent = item.quantity;
  
  const increaseBtn = document.createElement('button');
  increaseBtn.className = 'quantity-btn';
  increaseBtn.textContent = '+';
  increaseBtn.addEventListener('click', () => updateCartItemQuantity(index, 1));
  
  const price = document.createElement('div');
  price.className = 'cart-item-price';
  price.textContent = `€${(item.price * item.quantity).toFixed(2)}`;
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-item';
  removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', () => removeFromCart(index));
  
  quantityControls.appendChild(decreaseBtn);
  quantityControls.appendChild(quantityDisplay);
  quantityControls.appendChild(increaseBtn);
  
  controls.appendChild(quantityControls);
  controls.appendChild(price);
  controls.appendChild(removeBtn);
  
  details.appendChild(name);
  details.appendChild(description);
  details.appendChild(controls);
  
  cartItem.appendChild(imageContainer);
  cartItem.appendChild(details);
  
  return cartItem;
}

// Function to update cart item quantity
function updateCartItemQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCartDisplay();
  }
}

// Function to remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

// Function to clear cart
function clearCart() {
  cart = [];
  updateCartDisplay();
}

// Function to show order modal
function showOrderModal(orderCart = null) {
  const modal = document.getElementById('order-modal');
  const orderText = document.getElementById('order-text');
  
  const itemsToOrder = orderCart || cart;
  
  if (itemsToOrder.length === 0) {
    return;
  }
  
  // Generate order text
  let orderContent = "📋 ORDER DETAILS\n";
  orderContent += "═══════════════════\n\n";
  
  let total = 0;
  itemsToOrder.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    orderContent += `${index + 1}. ${item.name}\n`;
    if (item.description) {
      orderContent += `   ${item.description}\n`;
    }
    orderContent += `   Quantity: ${item.quantity}\n`;
    orderContent += `   Price: €${item.price.toFixed(2)} each\n`;
    orderContent += `   Subtotal: €${itemTotal.toFixed(2)}\n\n`;
  });
  
  orderContent += "═══════════════════\n";
  orderContent += `💰 TOTAL: €${total.toFixed(2)}\n\n`;
  orderContent += "📞 CONTACT INFO:\n";
  orderContent += "WhatsApp: +370 694 35 569\n";
  orderContent += "Telegram: @dorm_cartel_boss\n\n";
  orderContent += "⚡ Delivery in 5 minutes | 🕒 Working 24/7";
  
  orderText.value = orderContent;
  modal.classList.add('open');
}

// Function to copy order to clipboard
async function copyOrderToClipboard() {
  const orderText = document.getElementById('order-text');
  try {
    await navigator.clipboard.writeText(orderText.value);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = 'Order copied to clipboard!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// Function to share via WhatsApp
function shareViaWhatsApp() {
  const orderText = document.getElementById('order-text').value;
  const encodedText = encodeURIComponent(orderText);
  const whatsappUrl = `https://wa.me/37069435569?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

// Function to share via Telegram
function shareViaTelegram() {
  const orderText = document.getElementById('order-text').value;
  const encodedText = encodeURIComponent(orderText);
  const telegramUrl = `https://t.me/dorm_cartel_boss?text=${encodedText}`;
  window.open(telegramUrl, '_blank');
}

// Function to initialize search functionality
function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  const clearButton = document.getElementById('clear-search');
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    
    if (searchTerm) {
      clearButton.classList.add('visible');
      filterProducts(searchTerm);
    } else {
      clearButton.classList.remove('visible');
      showAllProducts();
    }
  });
  
  clearButton.addEventListener('click', function() {
    searchInput.value = '';
    clearButton.classList.remove('visible');
    showAllProducts();
    searchInput.focus();
  });
}

// Function to filter products based on search term
function filterProducts(searchTerm) {
  const productCards = document.querySelectorAll('.product-card');
  const sections = document.querySelectorAll('.section');
  
  productCards.forEach(card => {
    const productName = card.querySelector('.product-name').textContent.toLowerCase();
    const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
    
    if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
      card.style.display = '';
      highlightSearchTerm(card, searchTerm);
    } else {
      card.style.display = 'none';
      removeSearchHighlights(card);
    }
  });
  
  // Hide sections that have no visible products
  sections.forEach(section => {
    if (section.id === 'bundles') return; // Skip bundles section
    
    const visibleProducts = section.querySelectorAll('.product-card:not([style*="display: none"])');
    if (visibleProducts.length === 0) {
      section.style.display = 'none';
    } else {
      section.style.display = '';
    }
  });
}

// Function to show all products
function showAllProducts() {
  const productCards = document.querySelectorAll('.product-card');
  const sections = document.querySelectorAll('.section');
  
  productCards.forEach(card => {
    card.style.display = '';
    removeSearchHighlights(card);
  });
  
  sections.forEach(section => {
    section.style.display = '';
  });
}

// Function to highlight search terms
function highlightSearchTerm(product, searchTerm) {
  const productName = product.querySelector('.product-name');
  const productDescription = product.querySelector('.product-description');
  
  [productName, productDescription].forEach(element => {
    if (element) {
      const text = element.textContent;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
      element.innerHTML = highlightedText;
    }
  });
}

// Function to remove search highlights
function removeSearchHighlights(product) {
  const highlightedElements = product.querySelectorAll('.search-highlight');
  highlightedElements.forEach(element => {
    const parent = element.parentNode;
    parent.replaceChild(document.createTextNode(element.textContent), element);
    parent.normalize();
  });
}

// Main initialization function
async function initializeApp() {
  // Initialize collapsible functionality
  initializeCollapsible();
  
  // Initialize search functionality
  initializeSearch();
  
  // Set up mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  
  navToggle.addEventListener('click', function() {
    mainNav.classList.toggle('active');
  });
  
  // Set up cart functionality
  const cartToggle = document.getElementById('cart-toggle');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCart = document.getElementById('close-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const orderNowBtn = document.getElementById('order-now');
  
  cartToggle.addEventListener('click', function() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
  });
  
  function hideCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
  }
  
  closeCart.addEventListener('click', hideCart);
  cartOverlay.addEventListener('click', hideCart);
  
  clearCartBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  });
  
  orderNowBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    showOrderModal();
    hideCart();
  });
  
  // Set up order modal functionality
  const orderModal = document.getElementById('order-modal');
  const closeModal = document.getElementById('close-modal');
  const copyOrderBtn = document.getElementById('copy-order');
  const shareWhatsAppBtn = document.getElementById('share-whatsapp');
  const shareTelegramBtn = document.getElementById('share-telegram');
  
  function hideOrderModal() {
    orderModal.classList.remove('open');
  }
  
  closeModal.addEventListener('click', hideOrderModal);
  orderModal.addEventListener('click', function(e) {
    if (e.target === orderModal) {
      hideOrderModal();
    }
  });
  
  copyOrderBtn.addEventListener('click', copyOrderToClipboard);
  shareWhatsAppBtn.addEventListener('click', shareViaWhatsApp);
  shareTelegramBtn.addEventListener('click', shareViaTelegram);
  
  // Fetch and render data
  try {
    // Fetch hot products and render them
    const hotProducts = await fetchHotProducts();
    if (hotProducts) {
      renderHotProducts(hotProducts);
    }

    // Fetch bundles and render them
    const bundles = await fetchBundles();
    if (bundles) {
      renderBundles(bundles);
    }
    
    // Fetch products and render them
    const data = await fetchProducts();
    if (data && data.sections) {
      const contentDiv = document.getElementById('content');
      contentDiv.innerHTML = '';
      
      // Render navigation
      renderNavigation(data.sections);
      
      // Render each section
      data.sections.forEach(section => {
        contentDiv.appendChild(renderSection(section));
      });
    } else {
      // Show error message
      const contentDiv = document.getElementById('content');
      contentDiv.innerHTML = `
        <div class="section">
          <div class="section-content">
            <p class="empty">Failed to load products. Please try refreshing the page.</p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
      <div class="section">
        <div class="section-content">
          <p class="empty">An error occurred while loading the catalog. Please try refreshing the page.</p>
        </div>
      </div>
    `;
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);