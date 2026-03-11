const express=require('express');
const router = express.Router({mergeParams:true});
const Campground= require('../models/campground');
const Review=require('../models/review.js');
const WrapAsync = require('../utils/WrapAsync');
const AsyncError=require('../utils/AsyncError');
const {reviewSchema}=require('../schemas.js');
const { validateReview , isLoggedIn,isReviewAuthor} = require('../middleware.js');

const reviews=require('../controllers/reviews.js');

router.post('/',isLoggedIn,validateReview,WrapAsync(reviews.createReview))

router.delete('/:reviewid',isLoggedIn,isReviewAuthor,WrapAsync(reviews.deleteReviews))

module.exports=router;