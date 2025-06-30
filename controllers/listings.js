const Listing = require('../models/listings.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN; 
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=(async (req, res) => {  
    let alllistings= await  Listing.find({});
    res.render('listings/index', {  alllistings });
 })

 module.exports.renderNewForm= (req, res) => {
     res.render('listings/new');
}

module.exports.showListing =async (req, res) => {
    let{id}= req.params;
   const listing = await Listing.findById(id)

  .populate({
    path: 'reviews',
    populate: { path: 'author' }   // ✅ Populate review author
  })
  .populate('owner');



    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
 
    res.render('listings/show', { listing });
}

module.exports.createListing =async (req, res,next) => {
 let response =  await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()
 

    let url = req.file.path;
    let filename = req.file.filename;
    req.body.listing.image = { url, filename }; // Set the image URL and filename
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id; 
   newListing.image = {url,filename};
   newListing.geometry = response.body.features[0].geometry; // Set the geometry from the form data

    await newListing.save(); 
    req.flash('success', 'Successfully created a new listing!'); 
    res.redirect("/listings"); 
  
}

module.exports.renderEditForm= async (req, res) => {
    let { id } = req.params; 
    const listing = await Listing.findById(id); 
     if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
      let originalImageUrl =  listing.image.url;
     originalImageUrl=  originalImageUrl.replace('/upload', '/upload/w_250/'); 
    res.render('listings/edit', { listing, originalImageUrl }); 
}

module.exports.updateListing =async (req, res) => {
   
    let { id } = req.params;    
    let listing=  await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
    if(typeof req.file!== 'undefined') {
      let url = req.file.path;   
      let filename = req.file.filename;
    listing.image = { url, filename }; 
    await listing.save();
    }
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${id}`); 
}

module.exports.destroyListing =async (req, res) => {
    let { id } = req.params; 
    await Listing.findByIdAndDelete(id); 
    req.flash('success', 'Successfully deleted the listing!'); 
    res.redirect('/listings'); 
}