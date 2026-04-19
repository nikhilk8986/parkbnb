import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const BookingSchema=new Schema({
    userId:String,
    parkingLotId:String,
    bookingId:String
})

const Booking=mongoose.models.Booking || mongoose.model('User',BookingSchema);

export default Booking;