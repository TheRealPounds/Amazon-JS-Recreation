import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js';
//import '../data/backend-practice.js';

async function loadPage() {
  try {
    await loadProducts();
  } catch (error) {
    console.log(`Unexpected error, please try again later.
      ${error}`);
  };

  renderOrderSummary();
  renderPaymentSummary();
};

loadPage();