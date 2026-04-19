import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const UserSchema=new Schema({
    email:{type :String,unique:true},
    name:String,
    password:String,
    location:{latitude:String, longitude:String},
    phone:String,
    isOwner:{type:Boolean,default:false},
    pastBooking:[
        {bookingId:String}
    ],
    currentBooking:String
 
})

const User=mongoose.models.User || mongoose.model('User',UserSchema);

export default User;