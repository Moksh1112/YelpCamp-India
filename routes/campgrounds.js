const express=require('express');
const router = express.Router();
const Campground= require('../models/campground');
const WrapAsync = require('../utils/WrapAsync');
const AsyncError=require('../utils/AsyncError');
const flash=require('connect-flash');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware.js');


router.get('/',WrapAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new', isLoggedIn,(req,res)=>{
   res.render('campgrounds/new');
})

router.post('/',isLoggedIn,validateCampground,WrapAsync(async(req,res,next)=>{
    const campground=new Campground(req.body.campground);
        campground.author=req.user._id;
    await campground.save();
        req.flash('success','Successfully made a new Campground!');
        res.redirect(`/campgrounds/${campground._id}`)
}))


router.get('/:id',WrapAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    console.log(campground);  
    // console.log(campground.reviews);
    if(!campground){
        req.flash('error','Cannot Find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}))

router.get('/:id/edit',isLoggedIn,isAuthor,WrapAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
     if(!campground){
        req.flash('error','Cannot Find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}))

router.put('/:id',isLoggedIn,isAuthor,validateCampground,WrapAsync(async(req,res)=>{
 const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground}, {new:true});
            req.flash('success','Successfully Updated the Campground!');
   res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id',isLoggedIn,WrapAsync(async (req,res)=>{
const {id}=req.params;
await Campground.findByIdAndDelete(id);
            req.flash('success','Successfully Deleted Campground');
res.redirect('/campgrounds');
}))


module.exports=router;