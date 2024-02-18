let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let cakeItemsHTML = document.querySelector('.cakeItems');
let listcartHTML = document.querySelector('.listcart');
let iconCartSpan = document.querySelector('.icon-cart span');

let cakeItems = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    cakeItemsHTML.innerHTML = '';
    if (cakeItems.length > 0) {
        cakeItems.forEach(item => {
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.id;
            newItem.innerHTML = `<img src="${item.image}" alt="">
            <h2>${item.name}</h2>
            <div class="price">$${item.price}</div>
            <button class="addcart">Add To Cart</button>`;
            cakeItemsHTML.appendChild(newItem);
        });
    }
}

cakeItemsHTML.addEventListener('click', (event)=>{
    let positionClick = event.target;
    if(positionClick.classList.contains('addcart')){
        let item_id = positionClick.parentElement.dataset.id;
        addToCart(item_id);
    }
});

const addToCart = (item_id) => {
    let positionThisItemInCart = carts.findIndex((value) => value.item_id == item_id);
    if(carts.length <= 0){
        carts = [{
            item_id: item_id,
            quantity: 1
        }];
    } else if(positionThisItemInCart < 0){
        carts.push({
            item_id: item_id,
            quantity: 1
        });
    } else {
        carts[positionThisItemInCart].quantity += 1;
    }

    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory =() =>
{
    localStorage.setItem('cart',JSON.stringify(carts));
}
const addCartToHTML = () => {
    listcartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.item_id;
            let positionItem = cakeItems.findIndex((value) => value.id == cart.item_id);
            let info = cakeItems[positionItem];
            newCart.innerHTML = `<div class="image">
                <img src="${info.image}" alt="">
            </div>
            <div class="name">${info.name}</div>
            <div class="totalprice">$${info.price * cart.quantity}</div>
            <div class="quantity">
                <span class="minus">-</span>
                <span>${cart.quantity}</span>
                <span class="plus">+</span>
            </div>`;
            listcartHTML.appendChild(newCart);
        });
    }
    iconCartSpan.innerText = totalQuantity;
}

listcartHTML.addEventListener('click',(event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus') ){
        let item_id = positionClick.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantity(item_id, type);
    }
})

const changeQuantity =(item_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.item_id == item_id);
    if(positionItemInCart >= 0){
        switch(type){
            case 'plus':
                carts[positionItemInCart].quantity += 1;
                break;
            case 'minus':
                carts[positionItemInCart].quantity -= 1;
                if(carts[positionItemInCart].quantity <= 0){
                    carts.splice(positionItemInCart, 1);
                }
                break;
            default:
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}


const initApp = () => {
    fetch('cakeitems.json')
        .then(response => response.json())
        .then(data => {
            cakeItems = data;
            addDataToHTML();

            if(localStorage.getItem('cart')){
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
}

initApp();