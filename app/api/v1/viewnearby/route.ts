import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import ParkingLot from "@/models/ParkingLot";
import auth from "@/lib/auth";

async function getLots(userLat: number, userLong: number) {
    
    await connectToDatabase();
    const result: string[] = []; 
    
    const lots = await ParkingLot.find();
    
    const dist = 0.009; 

    lots.forEach((lot) => {
        const distance = Math.sqrt(
            Math.pow(lot.latitude - userLat, 2) + Math.pow(lot.longitude - userLong, 2)
        );
        
        if (distance <= dist) {
            result.push(lot);
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
    const Lots=getLots(userLat,userLong);

    return NextResponse.json(
        {Lots:Lots},
        {status:200}
    )

}