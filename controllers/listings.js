const Listing = require("../models/listing.js");
const axios = require("axios"); 

// 1. Index: Saari listings dikhana
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// 2. New Form: Naya listing banane ka form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// 3. Show: Ek single listing ki details dikhana
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// 4. Create: Naya listing save karna (With Geocoding)
module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    // Address se coordinates nikalne ki logic
    let location = req.body.listing.location;
    let response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    
    let geometry = {
        type: "Point",
        coordinates: [77.2090, 28.6139] // Default coordinates (Delhi) agar API fail ho
    };

    if (response.data && response.data.length > 0) {
        geometry.coordinates = [
            parseFloat(response.data[0].lon), 
            parseFloat(response.data[0].lat)
        ];
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = geometry; // DB mein coordinates save ho rahe hain

    await newListing.save();
    req.flash("success", "Listing created!");
    res.redirect("/listings");
};

// 5. Edit Form: Edit karne ka form dikhana
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// 6. Update: Listing update karna (With Geocoding)
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  
  // Pehle basic details update karein
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Agar location badli hai, toh naye coordinates fetch karein
  if (req.body.listing.location) {
    let response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`);
    if (response.data && response.data.length > 0) {
      listing.geometry = {
        type: "Point",
        coordinates: [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)]
      };
    }
  }

  // Agar nayi image upload hui hai
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  
  await listing.save();
  req.flash("success", "Updated!");
  res.redirect(`/listings/${id}`);
};

// 7. Destroy: Listing delete karna
module.exports.destroyListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Deleted!");
  res.redirect("/listings");
};