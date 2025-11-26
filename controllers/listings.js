const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

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

  module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

     const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url, filename};
     await newListing.save();
  
      req.flash("success", "Listing created!");
      res.redirect("/listings");
    };

    module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit.ejs", { listing });
  };

  module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Updated!");
    res.redirect(`/listings/${id}`);
  };
  module.exports.destroyListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Deleted!");
    res.redirect("/listings");
  };