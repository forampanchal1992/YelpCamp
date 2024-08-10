const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//https://res.cloudinary.com/dgyxm0wqs/image/upload/v1715366858/YelpCamp/g1cv1qinfcbifvcbvtzo.jpg


ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})
const CampgroundSchema = new Schema({
    title: String,
    images:[ImageSchema],
    price: Number,
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    console.log("Deletedddddd")
    if (doc) {
        await Review.deleteMany({
            
            _id: {
                $in: doc.reviews
            }
        })
       // console.log(_id)

    }
})
module.exports = mongoose.model('CampGround',CampgroundSchema);
