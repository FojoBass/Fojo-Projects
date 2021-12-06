const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "qv7t3hq4650h",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "iDWuWfXIl-SAuWl42Bg2KYSI20jGAqo18OxeLCkUtKk"
});


// PARAMS
const cartBtn = document.querySelector('.cart-btn');
const cartBtnNumber = document.querySelector('.cart-btn span');
const shopNowBtn = document.querySelector('.shop-btn');
const productsContainer = document.querySelector('.products-center');
const closeCartBtn = document.querySelector('.close-btn');
const cartItemsContainer = document.querySelector('.cart-items');
const clearCartBtn = document.querySelector('.clear-cart');
const totalPriceContainer = document.querySelector('.total-price span');
const cartDOM = document.querySelector('.cart-overlay');
const navBar = document.querySelector('nav');
const productsSuperContianer = document.querySelector('.products')

let cart = [];
let mainBtns = [];

// CLASS TO GET PRODUCTS
class Products {
    async getProducts() {
        try {
            let contentful = await client.getEntries({
                content_type: 'comfyHouseProducts'
            });
            // let result = await fetch('products.json');
            // let data = await result.json();
            let items = contentful.items;
            let newItems = items.map(item => {
                let { title, price } = item.fields;
                let image = item.fields.image.fields.file.url;
                let id = item.sys.id;
                return { title, price, image, id };
            });
            return newItems;
        } catch (err) {
            console.log(err.message);
        }
    }
}
// CLASS TO DISPLAY PRODUCTS
class UI {
    displayProducts(items) {
        items = items.map(item => {
            return ` <div class="product">
                <div class="image-wrapper">
                    <img src=${item.image} alt="${item.title}" />
                    <button class="product-btn" data-id='${item.id}'>
              <i class="fas fa-cart-plus"></i>
              <span>add to cart</span>
             </button>
                </div>
                <div class="product-info">
                    <h3>${item.title}</h3>
                    <p>$${item.price}</p>
                </div>
            </div>`
        });
        items = items.join('');
        productsContainer.innerHTML = items;
        cartBtn.onclick = () => {
            cartDOM.classList.add('show-cart');
        }
    }

    // select all btns in the main products page
    getMainBtns() {
        mainBtns = [...document.querySelectorAll('.product-btn')];
        mainBtns.forEach((mainBtn, index) => {
            let btnId = mainBtn.dataset.id;
            cart.find(cart => {
                if (cart.id === btnId) {
                    this.disableMainBtn(mainBtn)
                }
            });
            mainBtn.addEventListener('click', (e) => {
                let btn = e.currentTarget;
                this.disableMainBtn(btn);
                let products = Local.getProducts();
                let product = products.find(item => btnId === item.id);
                cart.push({...product, amount: 1 });
                this.cartLogic(cart);
                Local.setCart(cart);
                this.displayCart(); //dislays cart in web page
                cartDOM.classList.add('show-cart');
            })
        })
    }

    disableMainBtn(btn) {
            btn.innerHTML = 'in cart';
            btn.disabled = true;
        }
        // Cart Logic to handle all cart calculations
    cartLogic(cart) {
            // cart number display and total price
            let totalAmount = 0;
            let totalPrice = 0;
            cart.forEach(cartItem => {
                totalAmount += cartItem.amount;
                totalPrice += cartItem.amount * cartItem.price;
            })
            cartBtnNumber.innerHTML = totalAmount;
            totalPriceContainer.innerHTML = totalPrice.toFixed(2);

        }
        // Handles Cart Btns
    cartBtns() {
            let increaseBtns = [...document.querySelectorAll('.increase-btn')];
            let removeBtns = [...document.querySelectorAll('.remove-btn')];
            let decreaseBtns = [...document.querySelectorAll('.decrease-btn')];
            // close cart
            closeCartBtn.onclick = () => {
                    cartDOM.classList.remove('show-cart');
                }
                // clear cart
            clearCartBtn.onclick = () => {
                    while (cartItemsContainer.children.length) {
                        cartItemsContainer.removeChild(cartItemsContainer.firstChild);
                    }
                    cart = [];
                    localStorage.removeItem('cart2');
                    this.cartLogic(cart);
                    removeBtns.forEach(remove => {
                        this.resetBtns(remove.dataset.id);
                    })
                    cartDOM.classList.remove('show-cart');
                }
                // remove single item
            removeBtns.forEach(remove => {
                    remove.onclick = () => {
                        const id = remove.dataset.id;
                        cart.forEach((cartItem, index) => {
                            if (cartItem.id === id) {
                                this.removeCartItem(cart, remove, index)
                            }
                        })
                        this.resetBtns(id);
                    }
                })
                // increase amount
            increaseBtns.forEach(increase => {
                    let id = increase.dataset.id;
                    increase.onclick = () => {
                        cart.forEach(cartItem => {
                            if (cartItem.id === id) {
                                cartItem.amount++;
                                Local.setCart(cart);
                                this.cartLogic(cart);
                                increase.nextElementSibling.innerHTML = cartItem.amount;
                            }
                        })
                    }
                })
                // decrease amount
            decreaseBtns.forEach(decrease => {
                let id = decrease.dataset.id;
                decrease.onclick = () => {
                    cart.forEach((cartItem, index) => {
                        if (cartItem.id === id) {
                            cartItem.amount--;
                            if (cartItem.amount > 0) {
                                Local.setCart(cart);
                                this.cartLogic(cart);
                                decrease.previousElementSibling.innerHTML = cartItem.amount;
                            } else {
                                this.resetBtns(id);
                                this.removeCartItem(cart, decrease, index)
                                    // disable button
                            }
                        }
                    })
                }
            })
        }
        // Display cart in DOM
    displayCart() {
            let items = '';
            cart.forEach(cartItem => {
                items += `<div class="cart-item">
                    <div class="image-wrapper">
                        <img src=${cartItem.image} alt="${cartItem.title}">
                    </div>
                    <div class="item-info">
                        <p>${cartItem.title}</p>
                        <p>$${cartItem.price}</p>
                        <button class="remove-btn" data-id='${cartItem.id}'>remove</button>
                    </div>
                    <div class="item-logic">
                        <i class="fas fa-chevron-up increase-btn" data-id='${cartItem.id}'></i>
                        <span>${cartItem.amount}</span>
                        <i class="fas fa-chevron-down decrease-btn" data-id='${cartItem.id}'></i>
                    </div>
                </div>`
            });
            cartItemsContainer.innerHTML = items;
            this.cartBtns();
        }
        // Reset removed Btns
    resetBtns(id) {
        mainBtns.forEach(btn => {
            if (btn.dataset.id === id) {
                btn.innerHTML = `<i class="fas fa-cart-plus"></i>
                                 <span>add to cart</span>`;
                btn.disabled = false;
            }
        })
    }

    setupCart() {
        cart = Local.getCart();
        this.cartLogic(cart);
        this.displayCart();
    }

    removeCartItem(cart, element, index) {
        cart.splice(index, 1);
        Local.setCart(cart);
        this.cartLogic(cart);
        cartItemsContainer.removeChild(element.parentElement.parentElement);
    }

}

// LOCAL STORAGE CLASS
class Local {
    static setProducts = (items) => {
        localStorage.setItem('products2', JSON.stringify(items));
    }

    static getProducts = () => {
        return localStorage.getItem('products2') ? JSON.parse(localStorage.getItem('products2')) : [];
    }
    static setCart(cartItems) {
        localStorage.setItem('cart2', JSON.stringify(cartItems));
    }
    static getCart() {
        return localStorage.getItem('cart2') ? JSON.parse(localStorage.getItem('cart2')) : [];
    }
}

window.addEventListener('DOMContentLoaded', () => {
    shopNowBtn.onclick = () => {
        let destination = productsSuperContianer.getBoundingClientRect().y - navBar.getBoundingClientRect().height;
        window.scrollTo(0, destination);
    }

    let [products, ui] = [new Products(), new UI()];
    ui.setupCart();
    products.getProducts().then(items => {
        ui.displayProducts(items);
        Local.setProducts(items);
    }).then(() => {
        ui.getMainBtns();
        ui.cartBtns();
    })
})