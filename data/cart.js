export let cart = JSON.parse(localStorage.getItem('cart'));
export let cartQuantity = JSON.parse(localStorage.getItem('cartQuantity'));
if (!cart) {
  cart = [];
}
if (!cartQuantity) {
  cartQuantity = 0;
}
export const maxPerProduct = 100;

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));
}

export function addToCart(productId, quantity, variations) {
  let inCart = false;
  let returnValue = true;
  cart.forEach((cartProduct) => {
    if(productId == cartProduct.productId) {
      if (matchingVariations(cartProduct, variations)) {
        inCart = true;
        if(cartProduct.quantity + quantity <= maxPerProduct) {
          cartProduct.quantity += quantity;
        } else {
          returnValue = false;
        }
      }
    }
  });

  if (!inCart) {
    cart.push({
      productId,
      quantity,
      variations: Object.assign({}, variations),
      deliveryOptionId: '1'
    });
  }

  if(returnValue) {
    cartQuantity += quantity;
    saveToStorage();
  }
  return returnValue;
}

export function removeFromCart(productId, variationsId) {
  cart.forEach((item, index) => {
    if (item.productId == productId && (variationsId == '-empty' || item.variations.variationsId == variationsId)) {
      cart.splice(index, 1);
      cartQuantity -= item.quantity;
      saveToStorage();
    }
  });
}

export function updateQuantity(productId, quantity, variationsId) {
  cart.forEach((item) => {
    if (item.productId == productId && (variationsId == '-empty' || item.variations.variationsId == variationsId)) {
      cartQuantity -= item.quantity;
      cartQuantity += quantity;
      item.quantity = quantity;
      saveToStorage();
    }
  });
}

export function updateDeliveryOption(productId, variationsId, deliveryOptionId) {
  cart.forEach((item) => {
    if(item.productId == productId && (variationsId == '-empty' || item.variations.variationsId == variationsId)) {
      item.deliveryOptionId = deliveryOptionId;
      saveToStorage();
    }
  });
}

export function clearCart() {
  cart = [];
  cartQuantity = 0;
  saveToStorage();
}

function matchingVariations(cartProduct, variations) {
  let returnValue = true;
  if (Object.keys(cartProduct.variations).length != 0) {
    let propertyNum = 0;
    variations.properties.forEach((property) => {
      if (property.value != cartProduct.variations.properties[propertyNum].value) {
        returnValue = false;
      }
      propertyNum++;
    });
  }
  return returnValue;
}