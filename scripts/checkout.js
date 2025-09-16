import {renderOrderSummary} from "./checkout/orderSummary.js"; 
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { products,loadProductFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage() {
  await loadProductFetch()

  await new Promise((resolve) => {
    loadCart(() => {
      resolve()
    })
   })

}
loadPage().then(() => {
  renderCheckoutHeader()
  renderOrderSummary()
  renderPaymentSummary()
})

/*
Promise.all([
  loadProductFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      console.log('finish loading cart')
      resolve()
    })
   })

]).then(() => {
    renderCheckoutHeader()
    renderOrderSummary()
    renderPaymentSummary()
})
*/
/*
new Promise((resolve) => {
  console.log('start promise')
  loadProducts(() => {
    console.log('finish loading products')
    resolve()
  })
}).then(() => {
   return new Promise((resolve) => {
    loadCart(() => {
      console.log('finish loading cart')
      resolve()
    })
   })
}).then(() => {
    renderCheckoutHeader()
    renderOrderSummary()
    renderPaymentSummary()
})
*/