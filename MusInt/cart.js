// IMPLEMENTATIONS
window.addEventListener('DOMContentLoaded', () => {
    fillCart();
})

// GLOBAL PARAMS
cart = Storage.getCartStorage();
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});


// CART FUNCTIONS
fillCart = () => {
    // Params
    const cartEmpty = document.querySelector('.empty-cart');
    const cartFilled = document.querySelector('.filled-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const clearCart = document.querySelector('.clear-cart');

    // functionality for empty or filled cart
    if (!cart.length) {
        emptyCart(cartEmpty, cartFilled);
    } else {
        let mapCart = cart;
        let subTotals = [];
        let subTotal = 0;

        // set up cart items for appending
        mapCart = mapCart.map(item => {
            let price = '';

            // different price for discounts and non-discounts
            subTotal = subTotalLogic(item, subTotals, subTotal, false);
            if (item.discount.active === 'true') {
                price = `<div class="normal-price strike">${currencyFormatter.format(item.price)}</div>
                                        <div class="discount-price">${currencyFormatter.format(item.discount.price)}</div>`;
            } else {
                price = `<div class="normal-price">${currencyFormatter.format(item.price)}</div>`
            }

            return `<div class="cart-item-container" id=${item.id}>
                    <div class="cart-item">
                        <table>
                            <tr class='head-row'>
                                <th>item</th>
                                <th>quantity</th>
                                <th>unit price</th>
                                <th>subtotal</th>
                            </tr>

                            <tbody>
                                <tr class='body-row'>
                                    <td class='product-info'>
                                        <a href='product.html' class="top block-links">
                                            <div class="img-wrapper">
                                                
                                                <img src='${item.images.main}' alt="${item.name}">
                                            </div>
                                            <h3>${item.name}</h3>
                                        </a>
                                        <div class="remove-btn" id=${item.id}><i class="fas fa-trash"></i><span>remove</span></div>
                                    </td>
                                    <td class='quantity'>
                                        <button class="increase" id=${item.id}><i class="fas fa-angle-up"></i></button>
                                        <div class="qty">${item.amount}</div>
                                        <button class="decrease deactivate" id=${item.id}><i class="fas fa-angle-down"></i></button>
                                    </td>
                                    <td class='price'>
                                        ${price}
                                    </td>
                                    <td class='sub-total' id=${item.id}>
                                        ${currencyFormatter.format(subTotal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>`
        });

        mapCart = mapCart.join('');
        cartItemsContainer.innerHTML = mapCart;

        cartLogic(subTotals);

        // increment and decrement btns
        const increaseBtns = [...cartItemsContainer.querySelectorAll('.increase')];
        const decreaseBtns = [...cartItemsContainer.querySelectorAll('.decrease')];
        cart.forEach(item => {
            activateDBtn(item, decreaseBtns);
        });

        // increase amount
        increaseBtns.forEach(iBtn => {
                iBtn.onclick = () => {
                    cart.forEach(item => {
                        if (item.id === iBtn.id) {
                            item.amount++;
                            activateDBtn(item, decreaseBtns);
                            // reflect amount increase in DOM
                            iBtn.nextElementSibling.textContent = item.amount;
                            subTotal = subTotalLogic(item, subTotals, subTotal, item.id);

                            // select specific subtotal container
                            const subTotalContainers = cartItemsContainer.querySelectorAll('.sub-total');
                            subTotalContainers.forEach(sub => {
                                if (sub.id === iBtn.id) {
                                    sub.textContent = currencyFormatter.format(subTotal);
                                }
                            })

                            // update cart logic
                            cartLogic(subTotals);
                            // set cart local storage
                            Storage.setCartStorage(cart);
                        }
                    })
                }
            })
            // decrease amount
        decreaseBtns.forEach(dBtn => {
            dBtn.onclick = () => {
                cart.forEach(item => {
                    if (item.id === dBtn.id) {
                        item.amount--;
                        if (item.amount < 2) {
                            dBtn.classList.add('deactivate');
                        }
                        // reflect amount increase in DOM
                        dBtn.previousElementSibling.textContent = item.amount;
                        subTotal = subTotalLogic(item, subTotals, subTotal, item.id);

                        // select specific subtotal container
                        const subTotalContainers = cartItemsContainer.querySelectorAll('.sub-total');
                        subTotalContainers.forEach(sub => {
                            if (sub.id === dBtn.id) {
                                sub.textContent = currencyFormatter.format(subTotal);
                            }
                        })

                        // update cart logic
                        cartLogic(subTotals);
                        // set cart local storage
                        Storage.setCartStorage(cart);
                    }
                })
            }
        })

        // Remove item
        const removeBtns = [...cartItemsContainer.querySelectorAll('.remove-btn')];
        const cartItemContainers = [...cartItemsContainer.querySelectorAll('.cart-item-container')];

        removeBtns.forEach(rBtn => {
            rBtn.onclick = () => {
                // remove from cart
                cart.forEach((item, i) => {
                    if (item.id === rBtn.id) {
                        cart.splice(i, 1);
                    }
                });

                // remove from sub totals
                subTotals.forEach((sub, i) => {
                    if (sub.id === rBtn.id) {
                        subTotals.splice(i, 1);
                    }
                });

                // remove from DOM
                cartItemContainers.forEach(container => {
                    if (container.id === rBtn.id) {
                        cartItemsContainer.removeChild(container);
                    }
                });

                if (!cartItemsContainer.children.length) {
                    emptyCart(cartEmpty, cartFilled);
                }

                // implement in DOM and Local Storage
                cartLogic(subTotals);
                Storage.setCartStorage(cart);
            }
        });

        // clear cart
        clearCart.onclick = () => {
            localStorage.removeItem('musIntCart');
            cart = [];
            subTotals = [];

            cartLogic(subTotals);
            cartItemContainers.forEach(container => {
                cartItemsContainer.removeChild(container);
            });
            emptyCart(cartEmpty, cartFilled);

            window.scrollTo(0, 0);
        }

    }
}

function cartLogic(subTotals) {
    // Params
    const totalAmountContainer = document.querySelector('.total-amount');
    const priceTotalContainer = document.querySelector('.total-price span');

    if (!subTotals.length) {
        totalAmountContainer.textContent = 0;
        priceTotalContainer.textContent = 0;
    } else {
        // total price
        const totalPrice = subTotals.reduce((total, sub) => {
            total += sub.subTotal;
            return total;
        }, 0);

        priceTotalContainer.textContent = currencyFormatter.format(totalPrice);

        // total amount
        const totalAmount = cart.reduce((total, item) => {
            total += item.amount;
            return total;
        }, 0);

        totalAmountContainer.textContent = totalAmount;
    }
}

// OTHER FUNCTIONS
function activateDBtn(item, dBtns) {
    if (item.amount > 1) {
        dBtns.forEach(dBtn => {
            if (item.id === dBtn.id) {
                dBtn.classList.remove('deactivate');
            }
        })
    }
}

// Creat a Function that handles sub totals
function subTotalLogic(item, subTotals, subTotal, id) {
    if (!id) {
        if (item.discount.active === 'true') {
            subTotal = item.amount * item.discount.price;
            subTotals.push({ subTotal, id: item.id });
            return subTotal;
        } else {
            subTotal = item.amount * item.price;
            subTotals.push({ subTotal, id: item.id });
            return subTotal;
        }
    } else {
        if (item.discount.active === 'true') {
            subTotal = item.amount * item.discount.price;
            subTotals.forEach(total => {
                if (total.id === id) {
                    total.subTotal = subTotal;
                }
            });
            return subTotal;
        } else {
            subTotal = item.amount * item.price;
            subTotals.forEach(total => {
                if (total.id === id) {
                    total.subTotal = subTotal;
                }
            });
            return subTotal;
        }
    }
}

function emptyCart(cartEmpty, cartFilled) {
    cartEmpty.classList.remove('deactivate');
    cartFilled.classList.add('deactivate');
}