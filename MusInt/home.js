// FOR CONTENTFUL
const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "qv7t3hq4650h",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "iDWuWfXIl-SAuWl42Bg2KYSI20jGAqo18OxeLCkUtKk"
});


// GET PRODUCTS AND SET LOCAL STORAGE
// get products
class Products {
    async getProducts() {
        try {
            const response = await client.getEntries({
                content_type: 'musIntProducts'
            });

            let products = await response.items;

            products = products.map(product => {
                const { category, clicked, generalDetails, manufacturer, name, price, specs, strings } = product.fields;
                // for multiple images
                let images = { main: '', sub1: "", sub2: '' };
                let image = product.fields.images;

                images.main = image[0].fields.file.url;
                images.sub1 = image[1].fields.file.url;
                if (image[2]) {
                    images.sub2 = image[2].fields.file.url;
                }
                // for discount
                let discount = { active: '', percentage: '', price: '' };

                discount.active = product.fields.discount.active;
                discount.percentage = product.fields.discount.percentage;
                discount.price = product.fields.discount.price;


                const { id } = product.sys;
                return { category, clicked, generalDetails, manufacturer, name, price, images, discount, specs, id, strings };
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}


// IMPLEMENTATION OF FUNCTIONS
window.addEventListener('DOMContentLoaded', setupProducts);

function setupProducts() {
    let products = new Products();


    products.getProducts().then(products => {
        Storage.setProductStorage(products);
        cartTotalAmount();
    }).then(() => {
        productCategoriesSetup(); //function defined in general
        // send categories to storage
        categories = categories.map(item => {
            return { category: item, clicked: false };
        })
        Storage.setCategoriesStorage(categories);
        // set discount products up
        setUpDiscounts();
        // set random products
        setUpRandProducts();
    });
}



// CAROUSEL FUNCTIONALITY
// Params
const images = [...document.querySelectorAll('#main-head .container img')];

let counter = 0;

setInterval(() => {
    images.forEach(image => {
        image.classList.remove('bg-show');
    })

    if (counter === images.length) {
        counter = 0;
    }

    images[counter].classList.add('bg-show');
    counter++;

}, 7500);
// END CAROUSEL FUNCTIONALITY


// DISCOUNTS SECTION
// Params
const noDiscountAlert = document.querySelector('#discounts h4');
const discountProductsContainer = document.querySelector('#discounts .items');

function setUpDiscounts() {
    // get products from storage
    const products = Storage.getProductStorage();
    // get categories
    let storedCategories = Storage.getCategoriesStorage();
    // filter discounts from products
    let discounts = products.filter(product => {
        if (product.discount.active == 'true') return product;
    });
    // display discounts
    if (discounts.length < 1) {
        noDiscountAlert.innerHTML = 'none at the moment';
    } else {
        discounts = discounts.map(discount => {
            return `<a href='product.html' class="item block-links" id=${discount.id}>
                <div class="img-wrapper">
                    <img src=${discount.images.main} alt=${discount.name}>
                </div>
                <p class="discount-percent">-${discount.discount.percentage}%</p>
                <p class='item-name'>${discount.name}<br/> <span class='discount-price'>$${discount.price}</span></p>
            </a>`;
        });

        discounts = discounts.join('');
        discountProductsContainer.innerHTML = discounts;

        // click discounts functionality
        const discountsLinks = [...discountProductsContainer.querySelectorAll('.item')];
        discountsLinks.forEach(discount => {
            discount.onclick = (e) => {
                clickedState(discount, products);
                storedCategories.forEach(categ => {
                    categ.clicked = false;
                    if (categ.category === discount.dataset.category) {
                        categ.clicked = true;
                    }
                    Storage.setCategoriesStorage(storedCategories);
                })
            }
        })
    }
}
// END DISCOUNTS SECTION


// RANDOM PRODUCTS
// Params
const randProductsContainer = document.querySelector('#rand-products .products');

function setUpRandProducts() {
    const products = Storage.getProductStorage();
    let randProducts = [];
    while (true) {
        let randIndex = Math.floor((Math.random() * products.length));
        if (!randProducts.includes(products[randIndex])) {
            randProducts.push(products[randIndex]);
        }
        if (randProducts.length === 6) {
            break;
        }
    }
    randProducts = randProducts.map(rand => {
        let shortDetails = rand.generalDetails;
        shortDetails = shortDetails.split(' ');
        shortDetails = shortDetails.splice(0, 20);
        shortDetails = shortDetails.join(' ');
        return `<div class="product" id=${rand.id}>
                <a href='product.html' class="product-top block-links">
                    <div class="product-img-wrapper">
                        <img src=${rand.images.main} alt=${rand.name}>
                    </div>
                    <div class="details">${shortDetails}<span>...Read more</span></div>
                </a>
                <p class="product-name">${rand.name}</p>
            </div>`;
    });
    randProducts = randProducts.join('');
    randProductsContainer.innerHTML = randProducts;
    // set click function

    const randProductLinks = [...randProductsContainer.querySelectorAll('a.product-top')];
    randProductLinks.forEach(link => {
        link.onclick = () => {
            clickedState(link.parentElement, products);
        }
    })
}