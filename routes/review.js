const express = require('express');
const router = express.Router( {mergeParams: true}); 
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Listing = require('../models/listings.js');
const Review = require('../models/review.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');

  

//review 
//post route
router.post('/',isLoggedIn,validateReview , wrapAsync(reviewController.createReview));

//delete review route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;