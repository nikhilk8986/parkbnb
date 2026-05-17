import connectToDatabase from "@/lib/mongodb";
import auth from "@/lib/auth";
import { headers } from "next/headers";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

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
    if (!user || user.isOwner) {
        return NextResponse.json(
            {message:"not authorized"},
            {status:403}
        )
    }
    return NextResponse.json(
        {message:"user details",name:user.name,email:user.email,location:user.location,currentBooking:user.currentBooking,pastBooking:user.pastBooking},
        {status:200}
    )
}