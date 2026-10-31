import {NextResponse} from "next/server";
import {getCurrentUser,hasSameOrigin} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
export const runtime="nodejs";
export async function POST(req:Request,ctx:{params:Promise<{pageId:string}>}){if(!hasSameOrigin(req))return NextResponse.json({error:"Invalid request origin."},{status:403});const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const {pageId}=await ctx.params;const page=await prisma.page.findUnique({where:{id:pageId},select:{id:true}});if(!page)return NextResponse.json({error:"Page not found."},{status:404});const key={pageId_userId:{pageId,userId:user.id}};const existing=await prisma.pageFollower.findUnique({where:key});if(existing){await prisma.pageFollower.delete({where:{id:existing.id}});return NextResponse.json({following:false});}await prisma.pageFollower.create({data:{pageId,userId:user.id}});return NextResponse.json({following:true});}
