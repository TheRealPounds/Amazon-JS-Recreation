import { orders } from '../data/orders.js';
import { products, loadProducts, getProduct } from '../data/products.js';
import { addSearchEvents } from '../data/search.js';
import { cartQuantity } from '../data/cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  try {
    await loadProducts();
  } catch (error) {
    console.log(`Unexpected error, please try again later.
      ${error}`);
  };

  loadTracking();
};
loadPage();

function loadTracking() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');
  const variationsId = url.searchParams.get('variationsId');

  let trackingHTML = '<div>Tracking information not found.</div>';
  let deliveryStatus;
  orders.forEach((order) => {
    if (order.id == orderId) {
      order.products.forEach((product) => {
        if (product.productId == productId && (variationsId == '-empty' || product.variation.variationsId == variationsId)) {
          const deliveryDate = dayjs(product.estimatedDeliveryTime);
          const mathcingProduct = getProduct(productId);

          const deliveryDateUnix = deliveryDate.unix();
          const placedDateUnix = dayjs(order.orderTime).unix();
          const todayUnix = dayjs().unix();
          const deliveryProgress = (todayUnix - placedDateUnix) / (deliveryDateUnix - placedDateUnix);
          if (deliveryProgress < 0.5) {
            deliveryStatus = '7%';
          } else if (deliveryProgress < 0.95) {
            deliveryStatus = '50%';
          } else {
            deliveryStatus = '100%';
          }

          let image = mathcingProduct.image;
          let variationsHTML = '';
          if (Object.keys(product.variation).length != 0) {
            image = product.variation.image;

            product.variation.properties.forEach((property) => {
              variationsHTML += `
                <div class="variation-info">${property.name}: ${property.value}</div>
              `;
            });
          }

          trackingHTML = `
          <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
              View all orders
            </a>

            <div class="delivery-date">
              Arriving on ${deliveryDate.format('dddd, MMMM D')}
            </div>

            <div class="product-info">
              ${mathcingProduct.name}
            </div>

            <div>
              ${variationsHTML}
            </div>

            <div class="product-info">
              Quantity: ${product.quantity}
            </div>

            <img class="product-image" src="${image}">

            <div class="progress-labels-container">
              <div class="progress-label${deliveryStatus == '7%' ? ' current-status' : ''}">
                Preparing
              </div>
              <div class="progress-label${deliveryStatus == '50%' ? ' current-status' : ''}">
                Shipped
              </div>
              <div class="progress-label${deliveryStatus == '100%' ? ' current-status' : ''}">
                Delivered
              </div>
            </div>

            <div class="progress-bar-container">
              <div class="js-progress-bar progress-bar"></div>
            </div>
          </div>
        `;
        }
      });
    }
  });

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  
  if (trackingHTML != '<div>Tracking information not found.</div>') {
    setTimeout(() => {
      document.querySelector('.js-progress-bar').style.width = deliveryStatus;
    }, 1);

    addSearchEvents(document.querySelector('.js-search-bar'), document.querySelector('.js-search-button'));
  }
}
