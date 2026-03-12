if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app =express();
const path= require('path');
const AsyncError=require('./utils/AsyncError');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');

const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const campgroundRoutes=require('./routes/campgrounds.js');
const reviewRoutes=require('./routes/reviews.js');
const userRoutes=require('./routes/user.js');

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl)
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
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig={
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
   cookie:{
    httpOnly:true,
     expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
   }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes)


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

