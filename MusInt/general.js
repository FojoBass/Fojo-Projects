// Fix nav bar
window.addEventListener('DOMContentLoaded', navFunctions);
// IMPLEMENTATION OF FUNCTIONS
window.addEventListener('DOMContentLoaded', function() {
    productCategoriesSetup();
    cartTotalAmount();
})

// NAV BAR FUCTIONALITIES
// PARAMS
const navBar = document.querySelector('.navBar');
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('ul.nav-links');
const backToTop = document.querySelector('.back-to-top');



// Hamburger click response
hamburger.onclick = (e) => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('show');

    if (navLinksContainer.classList.contains('show') && window.pageYOffset > 500) {
        backToTop.classList.add('hide');
    }

    hamburger.classList.contains('active') ? document.querySelector('body').style.overflowY = 'hidden' : document.querySelector('body').style.overflowY = 'initial';
}

backToTop.onclick = () => {
    window.scrollTo(0, 0);
}

// Functions
function navFunctions() {
    const navHeight = navBar.getBoundingClientRect().height;
    window.onscroll = () => {
        if (window.pageYOffset > navHeight * 2) {
            navBar.classList.add('fixed');
        } else {
            navBar.classList.remove('fixed');
        }

        // for Back to top
        if (window.pageYOffset > 500) {
            backToTop.classList.remove('hide');
        } else {
            backToTop.classList.add('hide');
        }
    }
}

// END OF NAVBAR FUNCTIONALITIES

// OTHER PARAMS
const cartTotalAmountContainer = document.querySelector('span.total-amount');
const categoriesContainer = document.querySelector('.categories-container');

let productCategories = [];
let categories = [];
let cart = [];

// STORAGE FUNCTIONS
class Storage {
    static setProductStorage(products) {
        localStorage.setItem('musIntProducts', JSON.stringify(products));
    }
    static getProductStorage() {
        return localStorage.getItem('musIntProducts') ? JSON.parse(localStorage.getItem('musIntProducts')) : [];
    }
    static setCartStorage(cart) {
        localStorage.setItem('musIntCart', JSON.stringify(cart));
    }
    static getCartStorage() {
        return localStorage.getItem('musIntCart') ? JSON.parse(localStorage.getItem('musIntCart')) : [];
    }
    static setCategoriesStorage(categories) {
        localStorage.setItem('musIntCategories', JSON.stringify(categories));
    }
    static getCategoriesStorage() {
        return localStorage.getItem('musIntCategories') ? JSON.parse(localStorage.getItem('musIntCategories')) : [];
    }
}




// OTHER FUNCTIONS
function cartTotalAmount() {
    cart = Storage.getCartStorage();
    if (cart.length < 1) {
        cartTotalAmountContainer.innerHTML = 0;
    } else {
        let totalAmount = 0;
        cart.forEach(item => {
            totalAmount += item.amount;
        })
        cartTotalAmountContainer.innerHTML = totalAmount;
    }
}

function productCategoriesSetup() {
    const products = Storage.getProductStorage();
    productCategories = products.reduce((categories, product) => {
        const productCategory = product.category.trim();
        if (!categories.includes(productCategory)) {
            categories.push(productCategory);
        }
        return categories;
    }, []);
    categories = productCategories; //to be sent to storage
    // send to screen
    productCategories = productCategories.map(category => {
        return `<li>
            <a href="products.html">${category}</a>
            </li>`;
    });
    productCategories = productCategories.join('');
    categoriesContainer.innerHTML = productCategories;

    // select product categories btns
    const categoryBtns = [...categoriesContainer.querySelectorAll('a')];
    categoryBtns.forEach(btn => {
        btn.onclick = (e) => {
            let categories = Storage.getCategoriesStorage();
            categories.forEach(category => {
                category.clicked = false;
                if (btn.innerHTML === category.category) {
                    category.clicked = true;
                }
            })

            Storage.setCategoriesStorage(categories);
        }
    })
}

// UTILITY FUNCTION
function clickedState(element, items) {
    const elementID = element.getAttribute('id');
    items.forEach(item => {
        item.clicked = false;
        if (item.id === elementID) {
            item.clicked = true;
        }
    })
    Storage.setProductStorage(items);
}