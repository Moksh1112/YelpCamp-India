const mongoose = require('mongoose');
const indianCities = require('./indianCities');
const {places, descriptors}=require('./seedhelpers');
const Campground= require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("connection open!!");
})
.catch(err=>{
    console.log("crashed")
    console.log(err) 
})



const sample=array=>array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
console.log(indianCities.length);
  for (let i = 0; i < 50; i++) {
    const randomIndex = Math.floor(Math.random() * indianCities.length);
    const city = indianCities[randomIndex];
    const price = Math.floor(Math.random()*1000)+20;

    const camp = new Campground({
      author:'69aefef01c50577a33817493',
      location: `${city.City}, ${city.State}`,
      title:`${sample(descriptors)} ${sample(places)}`,
     image: `https://picsum.photos/400?random=${Math.random()}`,
      description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, quod rem sint expedita assumenda dolor voluptatibus eaque accusantium excepturi necessitatibus ex eveniet! Quis quisquam nostrum, nesciunt rerum voluptates soluta nulla!',
      price
    })


    await camp.save();
  }
};

seedDB().then(()=>{
    mongoose.connection.close();
})
