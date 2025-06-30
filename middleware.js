const Listing = require('./models/listings.js');
const Review = require('./models/review.js');
const { listingSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');
const { reviewSchema } = require('./schema.js');
const { listing } = require('./models/listings.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; 
        req.flash('error', 'You must be logged in to do that');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;  // ✅ FIXED
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the owner of this listing');
        return res.redirect(`/listings/${id}`);
    }
  next();
}

module.exports. validateListing = (req, res, next) => {
       let {error} = listingSchema.validate(req.body); // Validate the request body
       if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', '); // Join error messages
        throw new ExpressError(400, errorMessage);
    } else{
        next(); 
    }
 }

 module.exports. validateReview = (req, res, next) => {
       let {error} = reviewSchema.validate(req.body); // Validate the request body
       if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', '); // Join error messages
        throw new ExpressError(400, errorMessage);
    } else{
        next(); 
    }
 }

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById( reviewId);
    if(!review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the author of this listing');
        return res.redirect(`/listings/${id}`);
    }
  next();
}