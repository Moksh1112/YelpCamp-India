const Campground= require('../models/campground');
const {cloudinary}=require('../cloudinary');
const axios = require("axios");

module.exports.index=async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
   res.render('campgrounds/new');
}

module.exports.createCampground=async(req,res,next)=>{
    const campground=new Campground(req.body.campground);
    campground.images=req.files.map(f =>({url: f.path, filename: f.filename}));
    campground.author=req.user._id;

       // Convert location to coordinates using OpenStreetMap
  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
        q: req.body.campground.location,
        format: "json",
        limit: 1
    },
    headers: {
        "User-Agent": "yelpcamp-app"
    }
});

const place = response.data[0];
if (!place || !place.lat || !place.lon) {
    req.flash("error", "Could not find that location. Try a more specific place.");
    return res.redirect("/campgrounds/new");
}

campground.geometry = {
    type: "Point",
    coordinates: [Number(place.lon), Number(place.lat)]
};
    await campground.save();
    console.log(campground);
        req.flash('success','Successfully made a new Campground!');
        res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(campground);  
    // console.log(campground.reviews);
    if(!campground){
        req.flash('error','Cannot Find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}

module.exports.renderEditform=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
     if(!campground){
        req.flash('error','Cannot Find that Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}

module.exports.editCampground = async(req,res)=>{
 const {id}=req.params;

 const campground = await Campground.findByIdAndUpdate(
     id,
     {...req.body.campground},
     {new:true}
 );

 const response = await axios.get(
     "https://nominatim.openstreetmap.org/search",
     {
         params:{
             q: req.body.campground.location,
             format: "json",
             limit: 1
         },
         headers:{
             "User-Agent": "yelpcamp-app"
         }
     }
 );

 const place = response.data[0];

 if(!place){
     req.flash('error','Location not found.');
     return res.redirect(`/campgrounds/${id}/edit`);
 }

 campground.geometry = {
     type: "Point",
     coordinates: [Number(place.lon), Number(place.lat)]
 };

 const imgArray = req.files.map(f =>({url: f.path, filename: f.filename}));
 campground.images.push(...imgArray);

 await campground.save();

 if(req.body.deleteImage){
     for(let filename of req.body.deleteImage){
        await cloudinary.uploader.destroy(filename);
     }

     await campground.updateOne({
         $pull:{images:{filename:{$in:req.body.deleteImage}}}
     });
 }
 req.flash('success','Successfully Updated the Campground!');
 res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground=async(req,res)=>{
const {id}=req.params;
await Campground.findByIdAndDelete(id);
            req.flash('success','Successfully Deleted Campground');
res.redirect('/campgrounds');
}