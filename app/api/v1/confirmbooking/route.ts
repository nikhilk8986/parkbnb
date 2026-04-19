import auth from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import ParkingLot from "@/models/ParkingLot";
import Booking from "@/models/Booking";
import User from "@/models/User";


export async function POST(req:NextRequest){
    const headersList = await headers();
    const token = headersList.get('token')
    const email=await auth(token);
    if(!email){
        return NextResponse.json(
            {message:"not signed in"},
            {status:404}
    
        )
    }
    const body=await req.json();
    const {parkingId,userId}=body;
    await connectToDatabase();
    const booking=await Booking.create({parkingId,userId});
    await ParkingLot.findByIdAndUpdate(parkingId,{$inc:{availableSlots:-1}});
    await User.findByIdAndUpdate(userId,{$push:{current:booking._id}});
    return NextResponse.json(
        {message:"booking confirmed",bookingId:booking._id},
        {status:200}
    )


}