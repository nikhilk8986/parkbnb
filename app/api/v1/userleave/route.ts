import auth from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { headers } from "next/headers";
import Booking from "@/models/Booking";
import ParkingLot from "@/models/ParkingLot";


export async function POST(req: NextRequest) {
    await connectToDatabase();
    const headerList= await headers();
    const token = headerList.get('token');
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
            {message:"user not found"},
            {status:404}
        )
    }
    try{
        const body= await req.json();
        const bookingId = body.bookingId;
        const booking = await Booking.findByIdAndUpdate(bookingId, { isOccupied: false });
        const parkingLotId = booking?.parkingLotId;
        const userId = booking?.userId;

        const parkingLot = await ParkingLot.findOneAndUpdate({ parkingId: parkingLotId }, { $inc: { bookedSlots: -1 } });
        const customer = await User.findOneAndUpdate({ userId: userId }, { $push: { pastBooking: { bookingId } }, $set: { currentBooking: null } });
        
        return NextResponse.json(
            {message:"customer left the parking lot successfully"},
            {status:200}
        )}catch(error){
            console.log(error);
            return NextResponse.json(
                {message:"an error occurred while processing the request"},
                {status:500}
            )
    }
}