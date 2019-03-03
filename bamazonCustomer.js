var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Liam2009",
    database: "bamazon"
});

// 
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected as id ", connection.threadId);
    showProducts();

    inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Purchase", "Exit"]
        }
    ).then(function(answer){
        if(answer.action === "Purchase"){
            console.log("YEAH, buy some shit!")
            // go to the purchase function
        }
        else{
            console.log("Get the f**** out of here!")
            connection.end();
        }
    })
});

function showProducts(){
    connection.query("select * from products", function(err, data){
        if(err) throw err;
        for (var i = 0; i < data.length; i++){
            console.log(data[i].id + " ", data[i].productName, " ", data[i].departmentName, " ", data[i].price, " ", data[i].quantity)
        }
        // console.log(data);
    })
}