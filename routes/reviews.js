const express=require('express');
const router = express.Router({mergeParams:true});
const Campground= require('../models/campground');
const Review=require('../models/review.js');
const WrapAsync = require('../utils/WrapAsync');
const AsyncError=require('../utils/AsyncError');
const {reviewSchema}=require('../schemas.js');
const { validateReview , isLoggedIn,isReviewAuthor} = require('../middleware.js');


router.post('/',isLoggedIn,validateReview,WrapAsync(async(req,res)=>{
//    console.log(req.params);
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
            req.flash('success','Successfully added a new Review');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewid',isLoggedIn,isReviewAuthor,WrapAsync(async(req,res)=>{
    const {id,reviewid}=req.params;

    await Campground.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
                req.flash('success','Successfully Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;