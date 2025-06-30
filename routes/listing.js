const express= require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('../schema.js');
const Listing = require('../models/listings.js');
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer')

const { storage } = require('../cloudConfig.js'); // Import cloudinary storage configuration
const upload = multer({ storage })


router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing ,wrapAsync(listingController.createListing) );


//new route
router.get('/new',isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]') ,validateListing,wrapAsync (listingController.updateListing));



// Edit route
router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


//delete route
router.delete('/:id', isLoggedIn,isOwner,wrapAsync (listingController.destroyListing));  

module.exports = router;