if(process.env.NODE_ENV !== 'production') {
require('dotenv').config()
}


const express = require('express');
const mongoose = require('mongoose');   
const app = express(); 
const path = require('path');
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
const methodOverride = require('method-override'); 
app.use(methodOverride('_method')); 
const ejsMate = require('ejs-mate'); 
app.engine('ejs', ejsMate); 
const expressLayouts = require('express-ejs-layouts');
app.use(express.static(path.join(__dirname, '/public'))); 
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require('./routes/listing.js'); 
const reviewRouter = require('./routes/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js'); 
const userRouter = require('./routes/user.js');

const dbUrl = process.env.ATLASDB_URL ;

main().then(() => {
    console.log("Connected to MongoDB"); 
}
).catch(err => {    
    console.error("Error connecting to MongoDB", err); 
}
);

async function main () {
    await mongoose.connect(dbUrl);
  }




app.set('view engine', 'ejs'); // Set EJS as the view engine    
app.set("views",path.join(__dirname,"views"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
  crypto:{
    secret : process.env.SECRET ,
  },
  touchAfter : 24 * 60 * 60, // 24 hours
});
store.on("error", function(e){
    console.log("Session store error", e);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*1000 * 60 * 60 * 24, 
        maxAge: 7*1000 * 60 * 60 * 24, 
        httpOnly: true, 
    },  
};





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//  app.get('/', (req, res) => {
//      res.send('Hello World!');
//  });
 
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; 
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeuser = new User({
//         username: "delta-student",
//         email: "student@gmail.com",
//     });    
//    let resisteredUser= await User.register(fakeuser, "helloworld");
//    res.send(resisteredUser);
// });

app.use('/listings', listingRouter); 
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);




//  app.get('/testListing', async (req, res) => {
   
//         let sampleListing = new Listing({
//             title: "Beach Villa",
//             description: "Near Beach.",
//             price: 100,
//             location: "Goa",
//             country: "India"
//         });

//         await sampleListing.save(); // Save to database
//         console.log("Sample listing saved to database:" );
//          res.send("Sample listing saved to database:" );
// });

app.get('/', (req, res) => {
    res.redirect('/listings');
});


app.use((err,req, res, next) => { 
    let {statuscode=500, message="something went wrong"} = err; 
    res.status(statuscode).render("error.ejs", { err });
    
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});