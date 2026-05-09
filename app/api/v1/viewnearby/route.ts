import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import ParkingLot from "@/models/ParkingLot";
import auth from "@/lib/auth";

type ParkingLotData = {
    id: string;
    latitude: number;
    longitude: number;
    totalSlots: number;
    bookedSlots: number;
}

async function getLots(userLat: number, userLong: number): Promise<ParkingLotData[]> {
    
    await connectToDatabase();
    const result: ParkingLotData[] = []; 
    
    const lots = await ParkingLot.find();
    
    const dist = 0.009; 

    lots.forEach((lot) => {
        const distance = Math.sqrt(
            Math.pow(lot.location.latitude - userLat, 2) + Math.pow(lot.location.longitude - userLong, 2)
        );
        
        if (distance <= dist) {
            result.push({
                id: lot._id,
                latitude: lot.location.latitude,
                longitude: lot.location.longitude,
                totalSlots: lot.totalSlots,
                bookedSlots: lot.bookedSlots
            });
        }
    });

    return result;
}

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
    
    const body= await req.json();
    const {userLat,userLong}=body;
    const Lots=await getLots(userLat,userLong);

    return NextResponse.json(
        Lots,
        {status:200}
    )
}