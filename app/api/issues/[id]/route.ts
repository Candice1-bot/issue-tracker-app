import authOptions from "@/app/auth/authOptions";
import prisma from "@/app/lib/prisma";
import { patchIssueSchema } from "@/app/validationSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
interface Props {
    params: Promise<{id: string}>
}
export async function PATCH (request: NextRequest, {params}: Props){
 // 0. authorization guard.
 const session = await getServerSession(authOptions)
 if (!session) return NextResponse.json({}, {status: 401});

 // 1. Basic validation for issueId from the URL params
 const {id} = await params;
 const issueId = parseInt(id);
 if (isNaN(issueId)) {
    return NextResponse.json({ error: 'Invalid Issue ID' }, { status: 400 });
  }

  // 2.validate issueId from database
const issue = await prisma.issue.findUnique({where: {id: issueId}})
if (!issue){
   return NextResponse.json({ error: 'Invalid issue' }, { status: 400 })
}

 // 3. validate request body
 const body = await request.json()
 const validation = patchIssueSchema.safeParse(body);
 if (!validation.success)
    return NextResponse.json(validation.error.format(), {status: 400})

// 4. validate assignedToUserId
 const {assignedToUserId, title, description} = validation.data
 if(assignedToUserId) {
   const user = await prisma.user.findUnique({where: {id: assignedToUserId } })
   if (!user) return NextResponse.json({error: 'Invalid user.'}, {status: 400})
 }

// operate
try {
   const updatedIssue = await prisma.issue.update({
    where: {id: issue.id}, 
    data: { title, description, assignedToUserId },
 });
 return NextResponse.json(updatedIssue)
} catch (error) {
   console.error('Error updating issue status:', error);
   return NextResponse.json({ error: 'Failed to update issue status due to a server error.' }, { status: 500 });
}
}


export async function DELETE(request: NextRequest, {params}: Props){
   // 0. authorization guard.
   const session = await getServerSession(authOptions)
   if (!session) return NextResponse.json({}, {status: 401});
    
   // 1. Basic validation for issueId from the URL params
   const {id} = await params;
   const issueId = parseInt(id);
   if (isNaN(issueId)) {
    return NextResponse.json({ error: 'Invalid Issue ID' }, { status: 400 });
   }

  // 2.validate issueId from database
   const issue = await prisma.issue.findUnique({where: {id: parseInt(id)}})
   if (!issue)
      return NextResponse.json({error: 'Invalid issue'}, {status: 404})

   // operae
   try {
      await prisma.issue.delete({ where:{id: issue.id}})
      return NextResponse.json({})
   } catch (error) {
      return NextResponse.json({ error: 'Failed to delete issue due to a server error.' }, { status: 500 });
   }
   
}
