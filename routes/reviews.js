const express=require('express');
const router = express.Router({mergeParams:true});
const Campground= require('../models/campground');
const Review=require('../models/review.js');
const WrapAsync = require('../utils/WrapAsync');
const AsyncError=require('../utils/AsyncError');
const {reviewSchema}=require('../schemas.js')


const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
            throw new AsyncError(msg,400)
    }else{
        next();
    }
}

router.post('/',validateReview,WrapAsync(async(req,res)=>{
   console.log(req.params);
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewid',WrapAsync(async(req,res)=>{
    const {id,reviewid}=req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;