import { cart, cartQuantity, addToCart } from '../data/cart.js';
import { products, loadProducts, getProduct } from '../data/products.js';
import { addSearchEvents } from '../data/search.js';

loadProducts().then(() => {
  renderProductsGrid();
});

function renderProductsGrid() {
  const searchValue = new URL(window.location.href).searchParams.get('search');
  let filter = [];

  let productsHTML = '';
  products.forEach((product) => {
    if (matchSearch(product, searchValue ? searchValue.toLocaleLowerCase() : null)) {
      productsHTML += `
        <div class="product-container">
          <div class="product-image-container js-image-container-${product.id}">
            <img class="js-product-image-${product.id} product-image" data-image="${product.image}"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-select-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.varitionsHTML()}

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;
    }
  })

  document.querySelector('.js-products-grid').innerHTML = productsHTML == '' ? '<div style="margin: 10px">No products matched your search.</div>' : productsHTML;

  updateCartQuantity();

  document.querySelector('.js-search-bar').value = searchValue;

  document.querySelectorAll('.js-add-cart').forEach((button) => {
    let addedTimeoutId;
    button.addEventListener('click', () => {
      const { productId } = button.dataset;
      const quantity = Number(document.querySelector(`.js-quantity-select-${productId}`).value);
      const variations = {};

      const product = getProduct(productId);
      if (Object.keys(product.variations).length != 0) {
        variations.image = document.querySelector(`.js-product-image-${productId}`).dataset.image;
        variations.properties = [];

        let propertyNum = 0;
        let variationsId = '';
        product.variations.properties.forEach((property) => {
          const value = document.querySelector(`.js-selected-option-${propertyNum}-${productId}`).dataset.variationValue;
          variations.properties.push({
            name: property.propertyName,
            value: value
          });
          variationsId += `-${value.toLowerCase()}`;
          propertyNum++;
        });
        variations.variationsId = variationsId;
      }

      const addSuccess = addToCart(productId, quantity, variations);

      updateCartQuantity();

      const addedElement = document.querySelector(`.js-added-${productId}`);
      const addedClasslist = addedElement.classList;
      if (addSuccess) {
        addedElement.innerHTML = `
        <img src="images/icons/checkmark.png">
        Added
      `;
        addedClasslist.remove('added-fail');
      } else {
        addedElement.innerHTML = `
        <img src="images/icons/x-icon.png">
        Couldn't add
      `;
        addedClasslist.add('added-fail');
      }

      addedClasslist.add('addedVisable');

      if (addedTimeoutId) {
        clearTimeout(addedTimeoutId);
      }
      const timeoutId = setTimeout(() => addedClasslist.remove('addedVisable'), 2000);
      addedTimeoutId = timeoutId;
    })
  });

  document.querySelectorAll('.js-variation-option').forEach((option) => {
    option.addEventListener('click', () => {
      const { effectsImage, variationValue, variationNum, variationProductId } = option.dataset;
      const selected = document.querySelector(`.js-selected-option-${variationNum}-${variationProductId}`);
      selected.classList.remove(`js-selected-option-${variationNum}-${variationProductId}`);
      selected.classList.remove('selected-option');
      option.classList.add(`js-selected-option-${variationNum}-${variationProductId}`);
      option.classList.add('selected-option');

      if (effectsImage == 'true') {
        const product = getProduct(variationProductId);
        let imageSuffix = '';
        let propertyNum = 0;

        product.variations.properties.forEach((property) => {
          if (property.propertyEffectsName) {
            imageSuffix += `-${document.querySelector(`.js-selected-option-${propertyNum}-${variationProductId}`).dataset.variationValue.toLowerCase()}`;
          }
          propertyNum++;
        });
        imageSuffix += '.jpg';

        document.querySelector(`.js-image-container-${variationProductId}`).innerHTML = `
          <img class="js-product-image-${variationProductId} product-image" data-image="${product.variations.baseImage}${imageSuffix}"
              src="${product.variations.baseImage}${imageSuffix}">
        `;
      }
    });
  });

  function updateCartQuantity() {
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  function matchSearch(product, searchValue) {
    let returnValue = true;
    if (searchValue && !product.name.toLocaleLowerCase().includes(searchValue)) {
      returnValue = false;
      product.keywords.forEach((word) => {
        if (word.toLocaleLowerCase().includes(searchValue)) {
          returnValue = true;
        }
      });
    }
    return returnValue;
  }
}

addSearchEvents(document.querySelector('.js-search-bar'), document.querySelector('.js-search-button'));
