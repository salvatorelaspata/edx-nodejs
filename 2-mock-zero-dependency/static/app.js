'use strict'

const API = 'http://localhost:3000'

// Function to retrieve the mock data
const populateProducts = async () => {
  const products = document.querySelector('#products')
  products.innerHTML = ''
  const res = await fetch(API)
  const data = await res.json()
  // loop data
  for (const product of data) {
    // create element
    const item = document.createElement('product-item')
    // set attributes
    for (const key of ['name', 'rrp', 'info']) {
      const span = document.createElement('span')
      span.slot = key
      span.textContent = product[key]
      item.appendChild(span)
    }
    // append to DOM
    products.appendChild(item)
  }
}

// Event listener
document.querySelector('#fetch').addEventListener('click', async ()=> await populateProducts())

// Custom element definition for product-item
customElements.define('product-item', class extends HTMLElement {
  constructor() {
    super()
    const itemTmpl = document.querySelector('#item').content
    this.attachShadow({mode: 'open'}).appendChild(itemTmpl.cloneNode(true))
  }
})