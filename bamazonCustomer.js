
const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const Table = require('cli-table');

// require("dotenv").config();
// var keys = require("./keys.js");

// create connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Liam2009",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id ", connection.threadId);

    startFunction();
    showProducts(inquirerPrompt);
})

function inquirerPrompt() {
    console.log(" ");
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["Make A Purchase", "Exit"]
    }).then(function (answer) {
        if (answer.action === "Make A Purchase") {
            console.log(" ");
            console.log(chalk.blue("Yes, Let's Spend Some Money"));
            console.log(" ");

            // go to the purchase function
            buyProducts();
        } else {
            console.log(" ");
            console.log(chalk.red("----------------------------------------"));
            console.log(chalk.red("          Come Back Real Soon!          "));
            console.log(chalk.red("----------------------------------------"));
            console.log(" ");
            connection.end();
        }
    })
    // console.log("After Products");
};



function startFunction() {
    console.log(chalk.yellow("----------------------------------------"));
    console.log(chalk.yellow("-----------")+chalk.blue("Welcome to %s"), chalk.bold("BAMAZON")+chalk.yellow("-----------"));
    console.log(chalk.yellow("-----")+chalk.green("Enjoy Your shopping experience")+chalk.yellow("-----"));
    console.log(chalk.yellow("----------------------------------------"));
    // showProducts()
}


function showProducts() {    //(myFunc) {

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
        inquirerPrompt();
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
                
                // Set the product ID in a variable
                let productId = answer.buyItem;

                // Set the name of the item in a variable
                var itemPurchased = data[0].productName;
                // console.log(itemPurchased);

                //  Set the price in a variable
                var price = parseFloat(data[0].price);
                // console.log(price);

                // Set the amount ordered in a variable
                var orderNum = parseInt(answer.buyQuantity);
                // console.log(orderNum);

                // Set the amount in stock in a variable
                var stockNum = data[0].quantity;
                // console.log(stockNum);


                inquirer.prompt({
                        name: "confirmOrder",
                        type: "list",
                        message: "Confirm order: \n" +
                            "Item: " + itemPurchased + "\n" +
                            "Quantity: " + orderNum,
                        choices: ["Yes", "No"]
                    })
                    .then(function(answer) {
                        // console.log(answer.confirmOrder);

                        if (answer.confirmOrder === "Yes") {
                            console.log(" ");
                            console.log(chalk.green("       Your Order Has Been Confirmed    "));
                            console.log(" ");

                            // Check product availability
                            checkAvailability(orderNum, stockNum, price, productId)

                            
                            // Update the database with the new quantity
                            // updateDatabase(newQuantity, productId);


                            // console.log(chalk.green("----------------------------------------"));
                            // console.log(chalk.green("--------Your order is on its way--------"));
                            // console.log(chalk.green("----------------------------------------"));
                            // console.log(" ");

                            // Go back the the start 
                            // showProducts();
                        } else {
                            console.log(chalk.red("-----------------------------------------"));
                            console.log(chalk.red("      Your Order Has Been Cancelled      "));
                            console.log(chalk.red("-----------------------------------------"));
                            console.log(" ");
                            // Go back to the start
                            showProducts();
                        }
                    });
            })
        })
} // end of buyProducts function


function checkAvailability(orderNum, stockNum, price, productId) {
    if (orderNum <= stockNum) {
        console.log(chalk.yellow("              Processing Order"));
        // Compute the new quanitity of the item
        var newQuantity = stockNum - orderNum;
        //console.log(newQuantity);
        computePrice(orderNum, price, newQuantity, productId);

    } else {
        console.log(chalk.red("----------------------------------------"));
        console.log(chalk.red("We Are Sorry, Not Enough Items In Stock."));
        console.log(chalk.red("      Your Order Has Been Cancelled.    "));
        console.log(chalk.red("----------------------------------------"));
        showProducts(); 
    }
} // end of checkAvailility function


function computePrice(orderNum, price, newQuantity, productId) {
    var totalPrice = orderNum * price;
    console.log(chalk.green("        You total price is: $" + totalPrice));
    console.log(" ")
    console.log(chalk.green("----------------------------------------"));
    console.log(chalk.green("--------Your order is on its way--------"));
    console.log(chalk.green("----------------------------------------"));
    console.log(" ");

    // Go back the the start 
    //showProducts();
    updateDatabase(newQuantity, productId);
} // end of computePrice function

function updateDatabase(newQuantity, productId) {
    connection.query(
        'UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, productId],
        function (err) {
            if (err) throw err;
        }
    )
    showProducts()
} // end updateDatabase function