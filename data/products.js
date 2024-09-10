import {formatCurrency} from '../scripts/utils/money.js';

export function getProduct(productId) {
  let matchingProduct;
  
  products.forEach((product) => {
    if (productId == product.id) {
      matchingProduct = product;
    }
  });
  
  return matchingProduct;
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;
  variations;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords.slice();
    this.variations = Object.assign({}, productDetails.variations);
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  };

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  };

  extraInfoHTML() {
    return '';
  }

  varitionsHTML() {
    let varitionsHTML = '';

    if (Object.keys(this.variations).length != 0) {
      let propertyNum = 0;
      this.variations.properties.forEach((property) => {
        let optionsHTML = '';
        let firstOption = true;

        property.propertyOptions.forEach((option) => {
          let selected = '';
          if (firstOption) {
            selected = ` js-selected-option-${propertyNum}-${this.id} selected-option`;
            firstOption = false;
          }
          optionsHTML += `
            <button 
            class="js-variation-option variation-option${selected}" 
            data-effects-image="${property.propertyEffectsName}" 
            data-variation-value="${option}" 
            data-variation-num="${propertyNum}"
            data-variation-product-id="${this.id}">${option}</button>
          `;
        });

        varitionsHTML += `
          <div class="variation-name">${property.propertyName}</div>
          <div class="variation-options-container">
            ${optionsHTML}
          </div>
        `;
        propertyNum++;
      });
    }

    return varitionsHTML;
  }
}

/*{
  baseImage: 'images/products/variations/plain-hooded-fleece-sweatshirt',
  properties: [{
    propertyName: 'Color',
    propertyOptions: ['Yellow','Teal'],
    propertyEffectsName: true
  }, {
    propertyName: 'Size',
    propertyOptions: ['S','M','L'],
    propertyEffectsName: false
  }]
},*/

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">Size chart</a>
    `;
  }
}

export let products =[];

export function loadProducts() {
  const promise = fetch('https://supersimplebackend.dev/products').then((response) => {
    return response.json();
  }).then((productsData) => {
    addDetails(productsData);
    products = productsData.map((productDetails) => {
      if (productDetails.type == 'clothing') {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });
  }).catch((error) => {
    console.log(`Unexpected error, please try again later.
      ${error}`);
  });

  return promise;
}

const additions = [
  {},{},{},{},{},{},

  {
    baseImage: 'images/products/variations/plain-hooded-fleece-sweatshirt',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Yellow','Teal'],
      propertyEffectsName: true
    }, {
      propertyName: 'Size',
      propertyOptions: ['S','M','L'],
      propertyEffectsName: false
    }]
  },
  
  {
    baseImage: 'images/products/variations/luxury-tower-set',
    properties: [{
      propertyName: 'Set',
      propertyOptions: ['6-Piece','4-Piece'],
      propertyEffectsName: true
    }]
  },

  {
    baseImage: 'images/products/variations/liquid-laundry-detergent',
    properties: [{
      propertyName: 'Style',
      propertyOptions: ['Plain','Lavender'],
      propertyEffectsName: true
    }]
  },

  {
    baseImage: '',
    properties: [{
      propertyName: 'Shoe Size (US)',
      propertyOptions: ['5','6','7','8','9'],
      propertyEffectsName: false
    }]
  },{},

  {
    baseImage: 'images/products/variations/round-sunglasses',
    properties: [{
      propertyName: 'Style',
      propertyOptions: ['Black','Gold'],
      propertyEffectsName: true
    }]
  },

  {
    baseImage: '',
    properties: [{
      propertyName: 'Shoe Size (US)',
      propertyOptions: ['7','8','9'],
      propertyEffectsName: false
    }]
  },{},

  {
    baseImage: 'images/products/variations/men-slim-fit-summer-shorts',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Gray','Black','Beige'],
      propertyEffectsName: true
    }, {
      propertyName: 'Waist Size (inches)',
      propertyOptions: ['30','31','32'],
      propertyEffectsName: false
    }]
  },{},{},{},{},

  {
    baseImage: 'images/products/variations/women-stretch-popover-hoodie',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Black','Gray','Blue'],
      propertyEffectsName: true
    }, {
      propertyName: 'Size',
      propertyOptions: ['XS','S','M','L'],
      propertyEffectsName: false
    }]
  },{},

  {
    baseImage: 'images/products/variations/women-knit-ballet-flat',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Black','Gray'],
      propertyEffectsName: true
    }, {
      propertyName: 'Shoe Size (US)',
      propertyOptions: ['6','7','8'],
      propertyEffectsName: false
    }]
  },

  {
    baseImage: 'images/products/variations/men-golf-polo-t-shirt',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Blue','Black','Red'],
      propertyEffectsName: true
    }, {
      propertyName: 'Size',
      propertyOptions: ['S','M','L'],
      propertyEffectsName: false
    }]
  },

  {
    baseImage: 'images/products/variations/trash-can-with-foot-pedal',
    properties: [{
      propertyName: 'Size (liters tall)',
      propertyOptions: ['30','50'],
      propertyEffectsName: true
    }]
  },

  {
    baseImage: 'images/products/variations/duvet-cover-set',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Blue','Red'],
      propertyEffectsName: true
    }, {
      propertyName: 'Size',
      propertyOptions: ['Twin','Queen'],
      propertyEffectsName: true
    }]
  },{},

  {
    baseImage: 'images/products/variations/men-chino-pants',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Beige','Green','Black'],
      propertyEffectsName: true
    }, {
      propertyName: 'Size',
      propertyOptions: ['30','31','32'],
      propertyEffectsName: false
    }]
  },

  {
    baseImage: 'images/products/variations/men-athletic-shoes',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Green','Black'],
      propertyEffectsName: true
    }, {
      propertyName: 'Size',
      propertyOptions: ['9','10','11','12'],
      propertyEffectsName: false
    }]
  },

  {
    baseImage: 'images/products/variations/men-navigator-sunglasses',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Brown','Silver'],
      propertyEffectsName: true
    }]
  },{},{},

  {
    baseImage: 'images/products/variations/women-french-terry-fleece-jogger',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Camo','Gray'],
      propertyEffectsName: true
    }, {
      propertyName: 'Size',
      propertyOptions: ['S','M','L'],
      propertyEffectsName: false
    }]
  },{},{},{},{},{},

  {
    baseImage: '',
    properties: [{
      propertyName: 'Size',
      propertyOptions: ['6','7','8','9'],
      propertyEffectsName: false
    }]
  },{},{},{},

  {
    baseImage: 'images/products/variations/men-cozy-fleece-zip-up-hoodie',
    properties: [{
      propertyName: 'Color',
      propertyOptions: ['Red','Black'],
      propertyEffectsName: true
    }, {
      propertyName: 'Size',
      propertyOptions: ['M','L','XL'],
      propertyEffectsName: false
    }]
  }
];

function addDetails(productsData) {
  let i = 0;
  additions.forEach((product) => {
    if (Object.keys(product).length != 0) {
      productsData[i].variations = Object.assign({}, product);
    }
    i++;
  });
}