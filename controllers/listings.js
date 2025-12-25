const Listing = require("../models/listing.js");
const axios = require("axios");

// 1. Index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// 2. New Form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// 3. Show Listing
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

// 4. Create Listing
module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let location = req.body.listing.location;
    
    let response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
        { headers: { "User-Agent": "TripMate-Project" } }
    );
    
    let geometry = { type: "Point", coordinates: [77.2090, 28.6139] };
    if (response.data && response.data.length > 0) {
        geometry.coordinates = [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)];
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; 
    newListing.geometry = geometry; 

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// 5. Edit Form (PREVIEW FIX)
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    
    // Check if image exists before replacing
    let originalImageUrl = listing.image.url;
    if(originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
    }
    
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// 6. Update Listing (IMAGE UPDATE FIX)
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    
    // 1. Pehle basic details update karein (findByIdAndUpdate image replace nahi karega properly)
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Saara data update karein
    Object.assign(listing, req.body.listing);

    // 2. Geocoding update
    if (req.body.listing.location) {
        let response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`,
            { headers: { "User-Agent": "TripMate-Project" } }
        );
        if (response.data && response.data.length > 0) {
            listing.geometry = {
                type: "Point",
                coordinates: [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)]
            };
        }
    }

    // 3. IMAGE UPDATE: Agar nayi file select ki hai
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
    
    await listing.save(); // Ye save image aur geometry ko database mein update karega
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// 7. Destroy
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};