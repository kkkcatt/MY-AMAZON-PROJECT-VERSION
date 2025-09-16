import {cart, removeFromCart, updateDeliveryOption} from"../../data/cart.js"
import {products, getProduct} from"../../data/products.js"
import {formatCurrency} from"../utils/money.js"
import {deliveryOptions, getDeliveryOption} from"../../data/deliveryOptions.js"
import { renderPaymentSummary } from "./paymentSummary.js"
import { renderCheckoutHeader } from "./checkoutHeader.js"

export function renderOrderSummary() {

  let checkoutHtml = ''
  
  cart.forEach((cartItem) => {
      const productId = cartItem.productId

      const matchingProduct = getProduct(productId)

      const deliveryOptionId = cartItem.deliveryOptionId

      const deliveryOption = getDeliveryOption(deliveryOptionId)

      const today = dayjs()
      const deliveryDate = today.add(deliveryOption.deliveryDays,'days')
      const dataString = deliveryDate.format('dddd, MMMM D')
      checkoutHtml += `
  <div class="cart-item-container 
  js-cart-item-container-${matchingProduct.id}">
              <div class="delivery-date js-delivery-date">
                Delivery date: ${dataString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProduct.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                  ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                    ${matchingProduct.getPrice()}
                  </div>
                  <div class="product-quantity">
                    <span>
                      Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                      Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                      Delete 
                    </span>
                  </div>
                </div>
                
                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHTML(matchingProduct,cartItem)}
                </div>
              </div>
            </div>

  `

  })





  function deliveryOptionsHTML(matchingProduct,cartItem) {
    let html = ''
    deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs()
    const deliveryDate = today.add(deliveryOption.deliveryDays,'days')
    const dataString = deliveryDate.format('dddd, MMMM D')
    const priceCents = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption.priceCents)} -`
      const isChecked = cartItem.deliveryOptionId === deliveryOption.id 
      html += ` 
      <div class="delivery-option js-delivery-option"
        data-delivery-option-id="${deliveryOption.id}"
        data-product-id="${matchingProduct.id}">
        <input type="radio" 
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dataString}
          </div>
          <div class="delivery-option-price">
            ${priceCents} Shipping
          </div>
        </div>
      </div>           
      `
    })
    return html
  }

   document.querySelector('.js-order-summary')
    .innerHTML = checkoutHtml;


  document.querySelectorAll('.js-delete-link').forEach(
    (link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId
          removeFromCart(productId)
          const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.remove();
          renderCheckoutHeader()
          renderOrderSummary()
          renderPaymentSummary()
      })
    }
  )

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset
        updateDeliveryOption(productId, deliveryOptionId)
        renderOrderSummary()
        renderPaymentSummary()
      })
    })
}


