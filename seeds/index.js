
const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//await mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open", () => {
    console.log("Database Connection")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const random100 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
       const camp = new Campground({
            author:'6619a94fccd543fc4ac69e99',
            location:`${cities[random100].city} ${cities[random100].state}`,
            title: `${sample(descriptors)}  ${sample(places)}`,
            image: 'https://source.unsplash.com/random/?camping',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis quis culpa, possimus quidem, mollitia aliquid odio ab sit numquam blanditiis, dignissimos iusto placeat repellat? Nisi, maxime praesentium? Voluptate, iusto neque.",
            price,
            images:   [
                {
                  url: 'https://res.cloudinary.com/dgyxm0wqs/image/upload/v1715362270/YelpCamp/ksk1hvwbc1apsltve2tc.jpg',
                  filename: 'YelpCamp/ksk1hvwbc1apsltve2tc'
                },
                {
                  url: 'https://res.cloudinary.com/dgyxm0wqs/image/upload/v1715362270/YelpCamp/lzfie7hntibmqgz6xj4l.jpg',
                  filename: 'YelpCamp/lzfie7hntibmqgz6xj4l'
                },
                {
                  url: 'https://res.cloudinary.com/dgyxm0wqs/image/upload/v1715362270/YelpCamp/fyf3glhqwkifwh87xvid.jpg',
                  filename: 'YelpCamp/fyf3glhqwkifwh87xvid'
                }
              ]
        })
        await camp.save();                                                                                                                                                                                                                          
    }
    //const c = new Campground({title: 'Testing',location: 'London', description: 'Creating project'});
    //await c.save();

}

//seedDB().save;
seedDB().then(() => {
    mongoose.connection.close();
});