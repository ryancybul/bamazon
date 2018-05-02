let mysql = require('mysql');
let inquirer = require('inquirer');
require('console.table');

//initialize connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon' 
});

//test connection
connection.connect(function(err){
    if (err) throw err;
    loadProducts();
});

function loadProducts(){
    let query = 'select * from products';
    connection.query(query, function(err, res){
        //show the products
        console.log('\n');
        console.table(res);
        //prompt customer for product
        promptCustomerForItem(res);
    });
}

function promptCustomerForItem(inventory) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'What is the ID of the item you would like to purchase?\n'
    }]).then(function(val){
        let choiceID = parseInt(val.choice);
        // query products to see if there is enough of that product
        let product = checkInventory(choiceID, inventory);
        if (product) {
            promptCustomerForQuantity(product);
        } else {
            console.log('That item is not availible at this moment.\n')
            loadProducts();
        }
    })
}

//This function pulls the entire product from the database based on the id
function checkInventory(choiceID, inventory){
    for(var i = 0; i < inventory.length; i++){
        if (inventory[i].item_id === choiceID){
            return inventory[i];
        }
    }
    return null;
}

function promptCustomerForQuantity(product){
    inquirer.prompt([{
        type: 'input',
        name: 'quantity',
        message:'How many would you like to purchase?\n'
    }]).then(function(val){
        let quantity = val.quantity;
        if (parseInt(quantity) > product.stock_quantity){
            console.log('There is not enough of this product.')
            loadProducts();
        } else{
            makePurchase(product, quantity);
        }
    });
}

function makePurchase(product, quantity){
let newStock = product.stock_quantity - quantity;
let price = product.price * quantity;
    connection.query(
        'UPDATE products SET ? WHERE ?',
        [
            {stock_quantity: newStock}, 
            {item_id: product.item_id}
        ],
        function(err) {
            if (err) throw err;
            console.log('You purchased ' + quantity + ' Your total is $' + price);
        }
    );
    loadProducts();
}