const express = require('express');
const mongoose = require('mongoose');
const app =express();
const path= require('path');
const Campground= require('./models/campground');
const AsyncError=require('./utils/AsyncError');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const WrapAsync = require('./utils/WrapAsync');
const Joi = require('joi');
const {campgroundSchema}=require('./schemas.js')
const { title } = require('process');

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

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("connection open!!");
})
.catch(err=>{
    console.log("crashed")
    console.log(err) 
})

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campgrounds',WrapAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new', (req,res)=>{
   res.render('campgrounds/new');
})

app.post('/campgrounds',validateCampground,WrapAsync(async(req,res,next)=>{
const campground=new Campground(req.body.campground);
await campground.save();
res.redirect(`/campgrounds/${campground._id}`)
}))


app.get('/campgrounds/:id',WrapAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
}))

app.get('/campgrounds/:id/edit',WrapAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))

app.put('/campgrounds/:id',validateCampground,WrapAsync(async(req,res)=>{
   const {id}=req.params;
   const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground}, {new:true});
 res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id',WrapAsync(async (req,res)=>{
const {id}=req.params;
await Campground.findByIdAndDelete(id);
res.redirect('/campgrounds');
}))

app.all(/(.*)/, (req, res, next)=>{
    next(new AsyncError('Page Not Found!',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message){
        err.message='Something went wrong!';
    }
res.status(statusCode).render('error',{err});

})


app.listen(3000, ()=>{
    console.log('Running On port 3000!');
})

