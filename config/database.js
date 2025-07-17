const mongoose = require("mongoose");
require("dotenv").config();

function Connect_Database() {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {  
        console.log("DB Connection is Successful");
    })
    .catch((error) => {
        console.log("DB Connection Failed ❌");
        console.error(error); 
        process.exit(1);  
    });
}

module.exports = Connect_Database;
