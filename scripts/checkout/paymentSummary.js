import {cart, cartQuantity, clearCart} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import { deliveryOptions } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder, addOrderVariations } from '../../data/orders.js';

export function renderPaymentSummary() {
  let priceSum = 0;
  let shipping = 0;
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    priceSum += matchingProduct.priceCents * cartItem.quantity;

    shipping += deliveryOptions[cartItem.deliveryOptionId - 1].priceCents;
  });
  const priceWithShipping = priceSum + shipping;
  const tax = priceWithShipping * 0.1;

  let paymentHTML = `
    <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(priceSum)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shipping)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(priceWithShipping)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(tax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(priceWithShipping + tax)}</div>
          </div>

          <button class="${orderButtonEmpty()} place-order-button button-primary">
            Place your order
          </button>
  `;
  document.querySelector('.js-payment-summary').innerHTML = paymentHTML;

  const orderButton = document.querySelector('.js-order-button');
  if (orderButton) {
    const newCart = cart.map((item) => {
      const newItem = Object.assign({}, item);
      delete newItem.variations;
      return newItem;
    });
    console.log(newCart);
    orderButton.addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: newCart
          })
        })
    
        const order = await response.json();
        addOrderVariations(order, cart);
        addOrder(order);
        clearCart();
        window.location.href = 'orders.html';
      } catch (error) {
        console.log(`Unexpected error, please try again later.
          ${error}`);
      }

    });
  }

  function orderButtonEmpty() {
    return cart.length ? 'js-order-button' : 'order-button-empty';
  }
}