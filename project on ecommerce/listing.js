
//-------------------------------------------------------------------------------------------------//
//Starting taking up data from indexdb and show as a card

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

var db;
var currentEdit = null;

$(document).ready(function () {
    var openReq = indexedDB.open("ProductDB", 1);
    openReq.onupgradeneeded = function (e) {
        db = e.target.result;

        var store = db.createObjectStore("ProductTable", { keyPath: "id", autoIncrement: true });
        console.log(store);
    }

    openReq.onsuccess = function (e) {
        db = e.target.result;
        console.log(db);
        readAll();


    }
    displayCart();
});

function readAll() {
    var tx = db.transaction(["ProductTable"], "readonly");
    var req = tx.objectStore("ProductTable").openCursor();
    req.onsuccess = function (e) {
        var cursor = e.target.result;
        if (!cursor) return;
        $(".middle2").append(

            `<div id="Product-item" class="Product-item">
                <p>${cursor.value.ProductName}</p>
                <img src="Images/${cursor.value.ProductImage}" width="130" height="140" />
                <p>Price : ${cursor.value.Price}tk</p>
                <button id="btncart" data-product-id="${cursor.key}">Add to cart</button>
            </div>`

        )
        cursor.continue();
    }
    req.onerror = function (err) {
        console.log(err);
    }
}
//Ending taking up data from indexdb and show as a card
//-------------------------------------------------------------------------------------------------------//


//-------------------------------------------------------------------------------------------------------//
//Cart button click from nav menu

$(document).on('click', '#cart-box', function (event) {
    $('#cart-option').toggleClass('sidebar-open');
});

//Shopping Cart javascript part start

var shoppingCart = (function () {
    // Private methods and propeties
   
    cart = [];

    // Constructor
    function Item(name, price, imagesrc, count) {
        this.name = name;
        this.price = price;
        this.imagesrc = imagesrc;
        this.count = count;
    }

    // Save cart
    function saveCart() {
        sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Load cart
    function loadCart() {
        cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
        loadCart();
    }


    // Public methods and propeties
    
    var obj = {};

    // Add to cart
    obj.addItemToCart = function (name, price, imagesrc, count) {
        for (var item in cart) {
            if (cart[item].name === name) {
                return;
            }
        }
        var item = new Item(name, price, imagesrc, count);
        cart.push(item);
        saveCart();
    }
    // Set count from item
    obj.setCountForItem = function (name, count) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
    };
    // Remove item from cart
    obj.removeItemFromCart = function (name) {
        for (var item in cart) {
            if (cart[item].name === name) {
                cart[item].count--;
                if (cart[item].count === 0) {
                    cart.splice(item, 1);
                }
                break;
            }
        }
        saveCart();
    }

    // Remove all items from cart
    obj.removeItemFromCartAll = function (name) {
        for (var item in cart) {
            if (cart[item].name === name) {
                cart.splice(item, 1);
                break;
            }
        }
        saveCart();
    }

    // Count cart 
    obj.totalCount = function () {
        var totalCount = 0;
        for (var item in cart) {
            totalCount += cart[item].count;
        }
        return totalCount;
    }

    // List cart
    obj.listCart = function () {
        var cartCopy = [];
        for (i in cart) {
            item = cart[i];
            itemCopy = {};
            for (p in item) {
                itemCopy[p] = item[p];

            }
            itemCopy.total = Number(item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy)
        }
        return cartCopy;
    }
    return obj;
})();


//click into add to cart button

$(document).on('click', '#btncart', function (event) {
    event.preventDefault();
    var productId = $(this).data("product-id");

    var openReq = indexedDB.open("ProductDB", 1);
        openReq.onsuccess = function (e) {
            db = e.target.result;

            var transaction = db.transaction(["ProductTable"], "readwrite");
            var objStore = transaction.objectStore("ProductTable");

            var request = objStore.get(parseInt(productId));

            request.onsuccess = function (event) {
                var result = request.result;
                var name = result.ProductName;
                var price = Number(result.Price);
                var imagesrc = result.ProductImage;
                shoppingCart.addItemToCart(name, price, imagesrc, 1);
                displayCart();
            }
        }
});

//Display Cart (function)
function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for (var i in cartArray) {
        output +=

            `<div class="cart-body">
                <img src="Images/${cartArray[i].imagesrc}" alt="" />
                <p id="p1">${cartArray[i].name}</p>
                <p id="p2">${cartArray[i].price} tk</p>
                <button id="item-delete" class="item-delete" data-name="${cartArray[i].name}">Delete</button>
            </div>`;
    }
    $('#all-cart-body').html(output);
    $('#cart-count').html(shoppingCart.totalCount());
}

/*Delete from shopping cart*/

$(document).on('click', '#item-delete', function (event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
});


//Shopping Cart javascript part end
//-------------------------------------------------------------------------------------------------------//