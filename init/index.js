const mongoose = require('mongoose');
const initdata = require('./data.js'); // Import the data file
const Listing = require('../models/listings.js'); // Import the Listing model
const { init } = require('../models/listings');

main().then(() => {
    console.log("Connected to MongoDB"); 
}
).catch(err => {    
    console.error("Error connecting to MongoDB", err); 
}
);

async function main () {
    await mongoose.connect('mongodb://localhost:27017/wanderlust', {       
    });  }


const initDB = async () => {
    await Listing.deleteMany({}); // Clear the database
    initdata.data = initdata.data.map((obj)=>({ ...obj , owner: '685e9eb03e3805050d28afd4' })); 
    await Listing.insertMany(initdata.data); // Insert the initial data
    console.log("Database seeded with initial data.");
}

initDB();