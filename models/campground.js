const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
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
