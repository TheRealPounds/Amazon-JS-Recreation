export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function addOrderVariations(order, cart) {
  let i = 0;
  order.products.forEach((product) => {
    product.variation = Object.assign({}, cart[i].variations);
    i++;
  });
}