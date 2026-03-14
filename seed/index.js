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


const images = [
{
  url: 'https://res.cloudinary.com/dql1qulne/image/upload/v1773335277/YelpCamp/v7d6x3i2jom5hnk6x6eq.jpg',
  filename: 'YelpCamp/v7d6x3i2jom5hnk6x6eq'
},
{
  url: 'https://res.cloudinary.com/dql1qulne/image/upload/v1773335274/YelpCamp/exyhu4uydaa8alw5ntfk.jpg',
  filename: 'YelpCamp/exyhu4uydaa8alw5ntfk'
},
{
  url: 'https://res.cloudinary.com/dql1qulne/image/upload/v1773335202/YelpCamp/qfkpfsmrizuywpm0j5fi.jpg',
  filename: 'YelpCamp/qfkpfsmrizuywpm0j5fi'
},
{
  url: 'https://res.cloudinary.com/dql1qulne/image/upload/v1773335199/YelpCamp/yzzsjfob5s4aprukwnsb.jpg',
  filename: 'YelpCamp/yzzsjfob5s4aprukwnsb'
},
{
  url: 'https://res.cloudinary.com/dql1qulne/image/upload/v1773324192/YelpCamp/ypeqdw609bts2ovzyeys.jpg',
  filename: 'YelpCamp/ypeqdw609bts2ovzyeys'
}
];


const seedDB = async () => {
  await Campground.deleteMany({});
console.log(indianCities.length);
  for (let i = 0; i < 300; i++) {
    const randomIndex = Math.floor(Math.random() * indianCities.length);
    const city = indianCities[randomIndex];
    const price = Math.floor(Math.random()*1000)+20;

    const camp = new Campground({
      author:'69aefef01c50577a33817493',
      location: `${city.City}, ${city.State}`,
      title:`${sample(descriptors)} ${sample(places)}`,
       geometry: {
      type: "Point",
      coordinates: [city.Longitude, city.Latitude]
  },
      description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, quod rem sint expedita assumenda dolor voluptatibus eaque accusantium excepturi necessitatibus ex eveniet! Quis quisquam nostrum, nesciunt rerum voluptates soluta nulla!',
      price,
       images: [sample(images), sample(images)]
  })
    await camp.save();
  }
};

seedDB().then(()=>{
    mongoose.connection.close();
})
