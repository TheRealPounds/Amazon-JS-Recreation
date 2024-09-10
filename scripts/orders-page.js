import { orders } from '../data/orders.js';
import { products, loadProducts, getProduct } from '../data/products.js';
import { cartQuantity, addToCart } from '../data/cart.js';
import { addSearchEvents } from '../data/search.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  try {
    await loadProducts();
  } catch (error) {
    console.log(`Unexpected error, please try again later.
      ${error}`);
  };

  loadOrders();
};
loadPage();

document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

function loadOrders() {
  let ordersHTML = '';

  if (orders.length == 0) {
    ordersHTML = `
      <div>You haven't made any orders!</div>
      ${cartQuantity ? `<div>You still have some items left in your <a href="checkout.html">cart!</a></div>` : ''}
      <div><a class="view-products-button" href="amazon.html">View products</a></div>
    `;
  } else {
    orders.forEach((order) => {
      let productsHTML = '';
      const placedDate = dayjs(order.orderTime);

      order.products.forEach((productData) => {
        productsHTML += generateProductHTML(productData, order.id);
      });

      ordersHTML += `
        <div class="order-container">
            
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                  <div>${placedDate.format('MMMM D')}</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>$${formatCurrency(order.totalCostCents)}</div>
                </div>
              </div>
  
              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
              </div>
            </div>
  
            <div class="order-details-grid">
              ${productsHTML}
            </div>
          </div>
      `;
    });
  }
  document.querySelector('.js-order-grid').innerHTML = ordersHTML;

  document.querySelectorAll('.js-buy-again-button').forEach((button) => {
    let addedTimeoutId;
    button.addEventListener('click', () => {
      const { orderId, productId, variationsId } = button.dataset;
      let variations = {};
      orders.forEach((order) => {
        if (order.id == orderId) {
          order.products.forEach((product) => {
            if (product.productId == productId && (variationsId == '-empty' || product.variation.variationsId == variationsId)) {
              variations = product.variation;
            }
          });
        }
      });
      const addSuccess = addToCart(productId, 1, variations);
      document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
      

      if (addSuccess) {
        button.classList.add('added-success');
        button.classList.remove('added-fail');
      } else {
        button.classList.remove('added-success');
        button.classList.add('added-fail');
      }

      button.classList.add('added-to-cart');

      if (addedTimeoutId) {
        clearTimeout(addedTimeoutId);
      }
      const timeoutId = setTimeout(() => {
        button.classList.remove('added-to-cart');
        button.classList.remove('added-success');
        button.classList.remove('added-fail');
      }, 2000);
      addedTimeoutId = timeoutId;
    });
  });

  addSearchEvents(document.querySelector('.js-search-bar'), document.querySelector('.js-search-button'));
};

function generateProductHTML(productData, orderId) {
  const product = getProduct(productData.productId);
  const deliveryDate = dayjs(productData.estimatedDeliveryTime);

  let image = product.image;
  let variationsHTML = '';
  let variationsId = '-empty';
  if (Object.keys(productData.variation).length != 0) {
    image = productData.variation.image;
    variationsId = productData.variation.variationsId;
    
    productData.variation.properties.forEach((property) => {
      variationsHTML += `
        <div class="variation-info">${property.name}: ${property.value}</div>
      `;
    });
  }

  return `
    <div class="product-image-container">
              <img src="${image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${product.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${deliveryDate.format('MMMM D')}
              </div>

              ${variationsHTML}

              <div class="product-quantity">
                Quantity: ${productData.quantity}
              </div>
              <button class="js-buy-again-button buy-again-button button-primary" data-order-id="${orderId}" data-product-id="${productData.productId}" data-variations-id="${variationsId}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
                <span class="buy-again-success">&#10003 Added</span>
                <span class="buy-again-fail">&#10005 Couldn\'t add</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${orderId}&productId=${productData.productId}&variationsId=${variationsId}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>

  `;
}