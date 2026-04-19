import auth from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import ParkingLot from "@/models/ParkingLot";
import User from "@/models/User";
import Booking from "@/models/Booking";


export async function POST(req:NextRequest){
    try {
        const headersList = await headers();
        const token = headersList.get('token');
        const decodedData = await auth(token);
        
        if(!decodedData){
            return NextResponse.json(
                {message:"not signed in"},
                {status:401}
            );
        }
        
        const body = await req.json();
        const {parkingId} = body;
        
        if(!parkingId){
            return NextResponse.json(
                {message:"parkingId is required"},
                {status:400}
            );
        }
        
        await connectToDatabase();
        const booking = await Booking.create({
            parkingLotId: parkingId,
            userId: decodedData.email
        });
        
        await ParkingLot.updateOne(
            {parkingId: parkingId},
            {$inc:{bookedSlots:1}}
        );
        await User.updateOne(
            {email: decodedData.email},
            {currentBooking: booking._id}
        );
        
        return NextResponse.json(
            {message:"booking confirmed",bookingId:booking._id},
            {status:200}
        );
    } catch(error) {
        console.error('Booking error:', error);
        return NextResponse.json(
            {message:"Failed to confirm booking"},
            {status:500}
        );
    }
}