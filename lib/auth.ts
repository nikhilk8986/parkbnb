import jwt from "jsonwebtoken"

export default async function auth(token:string | null){
    if(!token){
        return null;
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRECT!);
    return decodedData;
}