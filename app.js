const express = require('express');
const mongoose = require('mongoose');
const app =express();
const path= require('path');
const AsyncError=require('./utils/AsyncError');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');

const campgrounds=require('./routes/campgrounds.js');
const reviews=require('./routes/reviews.js');


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


app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews)

app.get('/',(req,res)=>{
    res.render('home')
})



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

