import auth from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/mongodb";  
import ParkingLot from "@/models/ParkingLot";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function POST(req:NextRequest){
    await connectToDatabase();
    const headersList = await headers();
    const token = headersList.get('token')
    const decodedData=await auth(token);
    if(!decodedData){
        return NextResponse.json(
            {message:"not signed in"},
            {status:404}
        )
    }
    const email = decodedData.email;
    const user = await User.findOne({ email });
    if (!user || !user.isOwner) {
        return NextResponse.json(
            {message:"not authorized"},
            {status:403}
        )
    }
    const parkingLot = await ParkingLot.findOne({ ownerID: user._id });
    if (!parkingLot) {
        return NextResponse.json(
            {message:"no parking lot found"},
            {status:404}
        )
    }
    const bookings = await Booking.find({ parkingLotId: parkingLot._id });
    return NextResponse.json(
        {message:"parking lot details",bookings:bookings,totalSlots:parkingLot.totalSlots,availableSlots:parkingLot.totalSlots - parkingLot.bookedSlots},
        {status:200}
    )


}