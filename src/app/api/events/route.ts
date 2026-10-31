import {NextResponse} from "next/server";
import {z} from "zod";
import {getCurrentUser,hasSameOrigin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export const runtime="nodejs";
const schema=z.object({title:z.string().trim().min(3).max(120),description:z.string().trim().min(1).max(2000),location:z.string().trim().min(2).max(200),startsAt:z.string().datetime()});
export async function GET(){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const events=await prisma.event.findMany({where:{startsAt:{gte:new Date()}},take:50,orderBy:{startsAt:"asc"},include:{creator:{select:{id:true,name:true}},_count:{select:{attendees:true}},attendees:{where:{userId:user.id},select:{id:true}}}});return NextResponse.json({events:events.map(({attendees,...e})=>({...e,isAttending:attendees.length>0}))});}
export async function POST(req:Request){if(!hasSameOrigin(req))return NextResponse.json({error:"Invalid request origin."},{status:403});const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const body=await req.json().catch(()=>null);const parsed=schema.safeParse(body);if(!parsed.success||new Date(parsed.data.startsAt)<=new Date())return NextResponse.json({error:"Enter valid event details and a future date."},{status:400});const event=await prisma.event.create({data:{...parsed.data,startsAt:new Date(parsed.data.startsAt),creatorId:user.id}});return NextResponse.json({event},{status:201});}
