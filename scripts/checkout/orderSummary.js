import { cart, cartQuantity, removeFromCart, updateQuantity, updateDeliveryOption, maxPerProduct } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { deliveryOptions } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function renderOrderSummary() {
  let summaryHTML = '';

  if (cart.length == 0) {
    summaryHTML =`
      <div class="empty-cart-text">Your cart is empty.</div>
      <div><a class="view-products-button" href="amazon.html">View products</a></div>
    `;
  } else {
    cart.forEach((cartItem) => {
      const itemId = cartItem.productId;
      const variationsId = Object.keys(cartItem.variations).length == 0 ? '-empty': cartItem.variations.variationsId;
      let itemProduct = getProduct(itemId);
  
      const deliveryOptionId = cartItem.deliveryOptionId;
  
      let deliveryOption;
      deliveryOptions.forEach((option) => {
        if (deliveryOptionId == option.id) {
          deliveryOption = option;
        }
      });
  
      const today = dayjs();

      let image = itemProduct.image;
      let variationsHTML = '';
      if (Object.keys(cartItem.variations).length != 0) {
        if (cartItem.variations.image != '') {
          image = cartItem.variations.image;
        }

        cartItem.variations.properties.forEach((property) => {
          variationsHTML += `
            <div class="variation-info">${property.name}: ${property.value}</div>
          `;
        });
      }
  
      summaryHTML += `
      <div class="js-cart-item-container-${itemId}${variationsId} cart-item-container">
                <div class="delivery-date">
                  Delivery date: ${today.add(deliveryOption.deliveryDays, 'day').format('dddd, MMMM D')}
                </div>
  
                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src="${image}">
  
                  <div class="cart-item-details">
                    <div class="product-name">
                      ${itemProduct.name}
                    </div>
                    <div class="product-price">
                      ${itemProduct.getPrice()}
                    </div>

                    ${variationsHTML}
                    
                    <div class="js-quantity-error-${itemId}${variationsId} quantity-error"></div>
                    <div class="product-quantity">
                      <span>
                        Quantity: <span class="js-quantity-${itemId}${variationsId} quantity-label">${cartItem.quantity}</span>
                      </span>
                      <span class="js-update-link update-quantity-link link-primary" data-product-id="${itemId}" data-variations-id="${variationsId}">
                        Update
                      </span>
                      <input class="quantity-input js-quantity-input-${itemId}${variationsId}" type="number" value="1">
                      <span class="js-save-link save-quantity-link link-primary" data-product-id="${itemId}" data-variations-id="${variationsId}">Save</span>
                      
                      <span class="js-delete-link delete-quantity-link link-primary" data-product-id="${itemId}" data-variations-id="${variationsId}">
                        Delete
                      </span>
                    </div>
                  </div>
  
                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(itemId, cartItem, variationsId)}
                  </div>
                </div>
              </div>
      `;
    });
  }
  document.querySelector('.js-order-summary').innerHTML = summaryHTML;

  updateCartQuantity();

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId, variationsId } = link.dataset;
      removeFromCart(productId, variationsId);
      renderPaymentSummary();
      renderOrderSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId, variationsId } = link.dataset;
      document.querySelector(`.js-cart-item-container-${productId}${variationsId}`).classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.js-save-link').forEach((link) => {
    let quantityErrorTimeoutId;
    link.addEventListener('click', () => {
      const { productId, variationsId } = link.dataset;
      const newQuantity = Math.floor(Number(document.querySelector(`.js-quantity-input-${productId}${variationsId}`).value));

      if (newQuantity >= 1 && newQuantity <= maxPerProduct) {
        document.querySelector(`.js-cart-item-container-${productId}${variationsId}`).classList.remove('is-editing-quantity');
        updateQuantity(productId, newQuantity, variationsId);
        document.querySelector(`.js-quantity-${productId}${variationsId}`).innerHTML = newQuantity;
        updateCartQuantity();
        renderPaymentSummary();
      } else {
        const quantityError = document.querySelector(`.js-quantity-error-${productId}${variationsId}`);
        if (newQuantity < 1) {
          quantityError.innerHTML = 'Product quantity must be at least 1';
        } else {
          quantityError.innerHTML = `Product quantity cannot exceed ${maxPerProduct}`;
        }

        quantityError.classList.add('quantity-error-display');
        if (quantityErrorTimeoutId) {
          clearTimeout(quantityErrorTimeoutId);
        }
        const timeoutId = setTimeout(() => quantityError.classList.remove('quantity-error-display'), 2000);
        quantityErrorTimeoutId = timeoutId;
      }
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((option) => {
    option.addEventListener('click', () => {
      const {productId, deliveryOptionId, variationsId} = option.dataset;
      updateDeliveryOption(productId, variationsId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  function updateCartQuantity() {
    document.querySelector('.js-checkout-item-quantity').innerHTML = `${cartQuantity} items`;
  }

  function deliveryOptionsHTML(itemId, cartItem, variationsId) {
    let deliveryHTML = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const priceString = deliveryOption.priceCents == 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`

      const isChecked = deliveryOption.id == cartItem.deliveryOptionId;

      deliveryHTML += `
        <div class="delivery-option js-delivery-option" data-product-id="${itemId}" data-variations-id="${variationsId}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio"
                      ${isChecked ? 'checked' : ''}
                      class="delivery-option-input"
                      name="delivery-option-${itemId}${variationsId}">
                    <div>
                      <div class="delivery-option-date">
                        ${today.add(deliveryOption.deliveryDays, 'day').format('dddd, MMMM D')}
                      </div>
                      <div class="delivery-option-price">
                        ${priceString} Shipping
                      </div>
                    </div>
                  </div>
      `;
    });

    return deliveryHTML;
  }
}