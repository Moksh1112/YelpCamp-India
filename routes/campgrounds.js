const express=require('express');
const router = express.Router();
const Campground= require('../models/campground');
const WrapAsync = require('../utils/WrapAsync');
const AsyncError=require('../utils/AsyncError');
const {campgroundSchema}=require('../schemas.js')



const validateCampground=(req,res,next)=>{
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

router.get('/',WrapAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new', (req,res)=>{
   res.render('campgrounds/new');
})

router.post('/',validateCampground,WrapAsync(async(req,res,next)=>{
    const campground=new Campground(req.body.campground);
        await campground.save();
        req.flash('success','Successfully made a new Campground!');
        res.redirect(`/campgrounds/${campground._id}`)
}))


router.get('/:id',WrapAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate('reviews');
       if(!campground){
        req.flash('error','Cannot Find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}))

router.get('/:id/edit',WrapAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
     if(!campground){
        req.flash('error','Cannot Find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}))

router.put('/:id',validateCampground,WrapAsync(async(req,res)=>{
   const {id}=req.params;
   const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground}, {new:true});
            req.flash('success','Successfully Updated the Campground!');
   res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id',WrapAsync(async (req,res)=>{
const {id}=req.params;
await Campground.findByIdAndDelete(id);
            req.flash('success','Successfully Deleted Campground');
res.redirect('/campgrounds');
}))


module.exports=router;