var mysql = require("mysql");
var inquirer = require("inquirer");

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
    showProducts();

    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["Purchase", "Exit"]
    }).then(function (answer) {
        if (answer.action === "Purchase") {
            console.log("YEAH, buy some shit!");
            // go to the purchase function
            buyProducts();
        } else {
            console.log("Get the f**** out of here!");
            connection.end();
        }
    })
});

// make this look nice
function showProducts() {
    connection.query("select * from products", function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].id + " ", data[i].productName, " ", data[i].departmentName, " ", data[i].price, " ", data[i].quantity);
        }
        // console.log(data);
    })
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
        message: "How many would you like t0 purchase?"
    }])
    .then(function(data){
        connection.query("select * from products where id=?", data.buyItem, function(err, data){
            console.log(data);
        })
    })
} // end og buyProducts function