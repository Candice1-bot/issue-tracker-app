import { NextRequest, NextResponse } from "next/server"; 
import {z} from 'zod';
import prisma from "@/app/lib/prisma";
import bcrypt from 'bcrypt';
import { registerSchema } from "@/app/validationSchema";

export async function POST(request: NextRequest){
    const body = await request.json()

    const validation = registerSchema.safeParse(body)

    if (!validation.success)
        return NextResponse.json(validation.error.errors, {status: 400});


    const user = await prisma.user.findUnique({where: {email:body.email}})

    if (user)
        return NextResponse.json({error:'User already exists'}, {status: 400})

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const name = body.email.split('@')[0]
    const newUser = await prisma.user.create({data: {
        email: body.email,
        name: name,
        hashedPassword: hashedPassword
    }})

    return NextResponse.json({email: newUser.email})
}