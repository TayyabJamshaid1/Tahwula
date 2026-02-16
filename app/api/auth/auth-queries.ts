import { cookies } from "next/headers";
import { cache } from "react";
import {  validateSessionAndGetUser } from "./use-cases/sessions";

export const getCurrentUser=cache(async()=>{
const cookiesData =await cookies();
let session=cookiesData.get("session")?.value;
if (!session) return null;
const user=await validateSessionAndGetUser(session);
return user;
})
