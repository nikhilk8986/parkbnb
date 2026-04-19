import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const BookingSchema=new Schema({
    userId:String,
    parkingLotId:String,
    bookingId:String,
    isOccupied: {type: Boolean, default: true},
    date: {type: Date, default: Date.now}
})

const Booking=mongoose.models.Booking || mongoose.model('Booking',BookingSchema);

export default Booking;