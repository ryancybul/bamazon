let mysql = require('mysql');
let inquirer = require('inquirer');
require('console.table');

// initialize connection
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
    menuOptions();
});

//Displays options for manager
function  menuOptions(){
    console.log('\n');
    inquirer.prompt([{
        type: 'list',
        name: 'menu',
        message: 'Select an option:',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function(val){
        if (val.menu === 'View Products for Sale'){
            console.log('\n');
            productsForSale();
        }
        else if (val.menu === 'View Low Inventory'){
            console.log('\n');
            viewLowInventory();
        }
        else if(val.menu === 'Add to Inventory'){
            console.log('\n');
            addToInventory();
        }
        else if(val.menu === 'Add New Product'){
            console.log('\n');
            addNewProduct();
        }
    })
};

function productsForSale(){
    console.log('---------------------  Products for Sale  ----------------------')
    let query = 'select * from products';
    connection.query(query, function(err, res){
    //show the products
    console.table(res);
    returnToMenu();
    });
}

function viewLowInventory(){
    console.log('----------------------  Low Inventory  ----------------------')
    let query = 'select * from products WHERE stock_quantity <= 5';
    connection.query(query, function(err, res){
    //show products with stock qty less than 5
    console.table(res);
    returnToMenu();
    });
}

function addToInventory(){
    console.log('----------------------  Add to Inventory  ----------------------')
    let query = 'select * from products';
    connection.query(query, function(err, res){
    //show the products
    console.table(res);
    
    inquirer.prompt([
        {
            type: 'input',
            name: 'itemID',
            message: 'What is the ID of the item you like to add to?'
        },
        {
            type: 'input',
            name: 'qty',
            message: 'How many more would you like to add to inventory?'
        }]).then(function(val){
            let choiceID = parseInt(val.itemID);
            let qty = parseInt(val.qty);
            let product = grabProduct(choiceID, res);

            if (product) {
                //Adds quantity of manager addition to stock_quantity
                let newStock = qty + product.stock_quantity;
        
                let query = 'UPDATE products SET ? WHERE ?'
                connection.query(query, 
                    [
                        {stock_quantity: newStock},
                        {item_id: product.item_id}
                    ],
                    function(err) {
                        if (err) throw err;
                        console.log('You added ' + qty + ' of ' + product.product_name + ' to inventory.\n');
                        returnToMenu();
                })
            }
        })
    });
}

//Selects the product to update from the database
function grabProduct(choiceID, res){
    for(var i =0; i < res.length; i++){
        if(res[i].item_id === choiceID){
            return res[i];
        }
    }
    return null;
}

function addNewProduct(){
    returnToMenu();
}

//Prompts user to continue using the application or exit. 
function returnToMenu(){
    inquirer.prompt({
        type: 'list',
        name: 'toMenu',
        choices: ['Return to Menu', 'Exit Application'],
        message: 'Select an option.'
    }).then(function(val){
        if (val.toMenu === 'Return to Menu'){
            menuOptions();
        } else {
            connection.end();
        }
    })
}

