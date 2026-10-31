import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getCurrentUser, hasSameOrigin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
const schema = z.object({ name:z.string().trim().min(2).max(80), description:z.string().trim().min(1).max(1000), privacy:z.enum(["PUBLIC","PRIVATE"]).default("PUBLIC") });
export async function GET(){ const user=await getCurrentUser(); if(!user)return NextResponse.json({error:"Authentication required."},{status:401}); const groups=await prisma.group.findMany({take:50,orderBy:{createdAt:"desc"},include:{_count:{select:{members:true}},members:{where:{userId:user.id},select:{id:true}}}}); return NextResponse.json({groups:groups.map(({members,...g})=>({...g,isMember:members.length>0}))}); }
export async function POST(req:Request){ if(!hasSameOrigin(req))return NextResponse.json({error:"Invalid request origin."},{status:403}); const user=await getCurrentUser(); if(!user)return NextResponse.json({error:"Authentication required."},{status:401}); const body=await req.json().catch(()=>null); const parsed=schema.safeParse(body); if(!parsed.success)return NextResponse.json({error:"Invalid group details."},{status:400}); const slug=parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55)+"-"+randomBytes(3).toString("hex"); const group=await prisma.group.create({data:{...parsed.data,slug,creatorId:user.id,members:{create:{userId:user.id,role:"OWNER"}}},include:{_count:{select:{members:true}}}}); return NextResponse.json({group},{status:201}); }
