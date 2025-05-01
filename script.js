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
  
  // Out of stock indicator
  if (product.quantity <= 0) {
    const outOfStock = document.createElement('div');
    outOfStock.className = 'out-of-stock';
    outOfStock.textContent = 'OUT OF STOCK FOR TODAY';
    imageContainer.appendChild(outOfStock);
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
  
  const meta = document.createElement('div');
  meta.className = 'product-meta';
  
  const unit = document.createElement('div');
  unit.className = 'product-unit';
  unit.textContent = product.unit;
  
  const price = document.createElement('div');
  price.className = 'product-price';
  price.textContent = `$${product.sell_price.toFixed(2)}`;
  
  meta.appendChild(unit);
  meta.appendChild(price);
  
  details.appendChild(name);
  details.appendChild(description);
  details.appendChild(meta);
  
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

// Initialize the application
async function init() {
  setupMobileNav();
  
  const data = await fetchProducts();
  if (data) {
    renderNavigation(data.sections);
    renderSections(data);
  } else {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = '';
    
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = 'Failed to load products. Please try again later.';
    contentElement.appendChild(error);
  }
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', init);