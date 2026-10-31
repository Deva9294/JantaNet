import {NextResponse} from "next/server";
import {randomBytes} from "node:crypto";
import {z} from "zod";
import {getCurrentUser,hasSameOrigin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export const runtime="nodejs";
const schema=z.object({name:z.string().trim().min(2).max(80),description:z.string().trim().min(1).max(1000),category:z.string().trim().min(2).max(40)});
export async function GET(){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const pages=await prisma.page.findMany({take:50,orderBy:{createdAt:"desc"},include:{_count:{select:{followers:true}},followers:{where:{userId:user.id},select:{id:true}}}});return NextResponse.json({pages:pages.map(({followers,...p})=>({...p,isFollowing:followers.length>0}))});}
export async function POST(req:Request){if(!hasSameOrigin(req))return NextResponse.json({error:"Invalid request origin."},{status:403});const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const body=await req.json().catch(()=>null);const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Invalid page details."},{status:400});const slug=parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55)+"-"+randomBytes(3).toString("hex");const page=await prisma.page.create({data:{...parsed.data,slug,creatorId:user.id},include:{_count:{select:{followers:true}}}});return NextResponse.json({page},{status:201});}
