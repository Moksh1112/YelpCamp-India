const express=require('express');
const router = express.Router();
const Campground= require('../models/campground');
const WrapAsync = require('../utils/WrapAsync');
const AsyncError=require('../utils/AsyncError');
const flash=require('connect-flash');
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware.js');
const multer=require('multer');
const {storage}=require('../cloudinary/index.js');
const upload=multer({storage});

const campgrounds=require('../controllers/campgrounds.js');

router.route('/')
    .get(WrapAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,WrapAsync(campgrounds.createCampground));
  

router.get('/new', isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
    .get(WrapAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,WrapAsync(campgrounds.editCampground))
    .delete(isLoggedIn,WrapAsync(campgrounds.deleteCampground));

router.get('/:id/edit',isLoggedIn,isAuthor,WrapAsync(campgrounds.renderEditform));

module.exports=router;