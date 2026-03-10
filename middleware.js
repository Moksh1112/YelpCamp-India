const {campgroundSchema}=require('./schemas.js');
const AsyncError=require('./utils/AsyncError');
const Campground= require('./models/campground');
const {reviewSchema}=require('./schemas.js');
const Review=require('./models/review.js');


module.exports.isLoggedIn=(req,res,next)=>{
      if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You Must be Signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
//   if(!req.body.campground) throw new AsyncError('Invalid Campground Details',400);
//HERE JOI IS FOR SERVER SIDE VALIDATIONS
const {error}=campgroundSchema.validate(req.body);
if(error){
    const msg=error.details.map(el=>el.message).join(',');
    throw new AsyncError(msg,400) 
}else{
    next();
}
}

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
   const campground=await Campground.findById(id);
   if(!campground.author.equals(req.user._id)){
    req.flash('error','You Do not have permission to make changes!');
   return res.redirect(`/campgrounds/${campground._id}`)
   }
   next();
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
            throw new AsyncError(msg,400)
    }else{
        next();
    }
}


module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewid}=req.params;
   const review=await Review.findById(reviewid);
   if(!review.author.equals(req.user._id)){
    req.flash('error','You Do not have permission to make changes!');
   return res.redirect(`/campgrounds/${id}`);
   }
   next();
}