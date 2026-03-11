const Campground= require('../models/campground');
const Review=require('../models/review.js');

module.exports.createReview=async(req,res)=>{
//    console.log(req.params);
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
            req.flash('success','Successfully added a new Review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReviews=async(req,res)=>{
    const {id,reviewid}=req.params;

    await Campground.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
                req.flash('success','Successfully Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}