import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const ParkingSchema=new Schema({
    parkingId:String,
    location:{longitude:String,latitude:String},
    ownerID:String,
    totalSlots:{type:Number,default:0},
    bookedSlots:{type:Number,default:0}
})

const ParkingLot=mongoose.models.ParkingLot || mongoose.model('ParkingLot',ParkingSchema);

export default ParkingLot;