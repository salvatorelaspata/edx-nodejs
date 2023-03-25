'use strict'

// Function to retrieve the mock data
const populateProducts = async () => {
  const products = document.querySelector('#products')
  products.innerHTML = ''
  // mock data
  const data = [
    {id: 'A1', name: 'Vacuum Cleaner', rrp: '99.99', info: 'The suckiest vacuum in the world.'},
    {id: 'A2', name: 'Leaf Blower', rrp: '303.33', info: 'This product will blow your socks off.'},
    {id: 'B1', name: 'Chocolate Bar', rrp: '22.40', info: 'Delicious overpriced chocolate.'}
  ]
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