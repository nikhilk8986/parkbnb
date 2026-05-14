import auth from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import ParkingLot from "@/models/ParkingLot";
import User from "@/models/User";

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
    const body= await req.json();
    const email = decodedData.email;
    const user = await User.findOne({ email });
    if (!user || !user.isOwner) {
        return NextResponse.json(
            {message:"not authorized"},
            {status:403}
        )
    }

    const {latitude,longitude,totalSlots}=body;
    await connectToDatabase();
    
    // Check if owner already has a parking lot
    const existingLot = await ParkingLot.findOne({ ownerID: user._id });
    
    if (existingLot) {
        // Update existing parking lot
        const updatedLot = await ParkingLot.findByIdAndUpdate(
            existingLot._id,
            {
                parkingId: user.email,
                location: { longitude: longitude, latitude: latitude },
                totalSlots: totalSlots
            },
            { new: true }
        );
        return NextResponse.json(
            { message: "parking lot updated", lotId: updatedLot._id },
            { status: 200 }
        );
    } else {
        // Create new parking lot
        const newLot = await ParkingLot.create({
            parkingId: user.email,
            location: { longitude: longitude, latitude: latitude },
            ownerID: user._id,
            totalSlots: totalSlots
        });
        return NextResponse.json(
            { message: "parking lot added", lotId: newLot._id },
            { status: 200 }
        );
    }
}