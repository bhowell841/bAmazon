// Fix too many purchase
// update the db
// return to main after purchase

var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require("chalk");
var Table = require('cli-table');

// look up stopping asynchonous
var choiceArray = [];

// create connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Liam2009",
    database: "bamazon"
});

// 
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id ", connection.threadId);

    startFunction();
    showProducts(function () {
        console.log(" ");
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Purchase", "Exit"]
        }).then(function (answer) {
            if (answer.action === "Purchase") {
                console.log(" ");
                console.log("YEAH, buy some shit!");
                console.log(" ");

                // go to the purchase function
                buyProducts();
            } else {
                console.log(" ");
                console.log("Get the f**** out of here!");
                console.log(" ");
                connection.end();
            }
        })
        // console.log("After Products");
    });
});


// MAKE THIS LOOK SWEET! 
function startFunction() {
    console.log("Welcome to BAMAZON");
    // showProducts()
}


function showProducts(myFunc) {

    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });


    connection.query("select * from products", function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {

            var id = data[i].id,
                productName = data[i].productName,
                departmentName = data[i].departmentName,
                price = data[i].price,
                quantity = data[i].quantity;

            table.push([id, productName, departmentName, price, quantity]);
        }
        console.log(table.toString());
        myFunc();
    });
}



// buy shit function
function buyProducts() {
    inquirer.prompt([{
                name: "buyItem",
                type: "input",
                message: "Enter the ID of the item you would like to purchase?",
            },
            {
                name: "buyQuantity",
                type: "input",
                message: "How many would you like to purchase?"
            }
        ])
        .then(function (answer) {
            connection.query("select productName,  price, quantity from products where id=?", answer.buyItem, function (err, data) {
                if (err) throw err;
                console.log(" ");
                // console.log("answers", answer.buyQuantity); 
                // console.log("database", data[0].quantity);
                let productId = answer.buyItem;
                var itemPurchased = data[0].productName;
                console.log(itemPurchased);
                var price = parseInt(data[0].price);
                console.log(price);
                var orderNum = parseInt(answer.buyQuantity);
                console.log(orderNum);
                var stockNum = data[0].quantity;
                console.log(stockNum);

                inquirer.prompt({
                        name: "confirmOrder",
                        type: "list",
                        message: "Confirm order: \n" +
                            "Item: " + itemPurchased + "\n" +
                            "Quantity: " + orderNum,
                        choices: ["Yes", "No"]
                    })
                    .then(function (answer) {
                        console.log(answer.confirmOrder);

                        if (answer.confirmOrder === "Yes") {
                            console.log("You said yes!");
                            checkAvailability(orderNum, stockNum, price)
                            computePrice(orderNum, price);
                            var newQuantity = stockNum - orderNum;
                            console.log(newQuantity);
                            updateDatabase(newQuantity, productId);
                            
                        } else {
                            console.log("You said no!")
                            showProducts();
                        }
                    });
            })
        })
} // end of buyProducts function


function checkAvailability(orderNum, stockNum, price) {
    if (orderNum <= stockNum) {
        console.log("Processing Order");
        // computePrice(orderNum, price);
        // updateDatabase(newQuantity);
        // append the db
        // showProducts()
    } else {
        console.log("Not enough items in stock.");
        showProducts(myFunc); 
    }
} // end of checkAvailility function


function computePrice(orderNum, price) {
    var totalPrice = orderNum * price;
    console.log("You total price is: " + totalPrice);
} // end of computePrice function

function updateDatabase(newQuantity, productId){
    connection.query(
        'UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, productId], function(err){
            if(err) throw err;
        }
    )
} // end updateDatabase function

