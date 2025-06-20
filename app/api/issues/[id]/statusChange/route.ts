import authOptions from '@/app/auth/authOptions';
import prisma from '@/app/lib/prisma';
import { changeStatusSchema } from '@/app/validationSchema';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';



interface Props {
    params: Promise<{id: string}>
}

export async function PATCH(request: NextRequest, { params }: Props) {
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
    return NextResponse.json({ error: 'Not Found' }, { status: 400 })
  }

  // 3. validate request body
  const body = await request.json();
  const validation = changeStatusSchema.safeParse(body);
  if (!validation.success){
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const {status} = validation.data

  // 4. if the status is not different from the previous value:
    if (issue.status === status) {
    return NextResponse.json(issue, { status: 200 });
  }

  // operate
  try {
    await prisma.issue.update({
        where: {id: issueId}, 
        data: {status: status}
    })
    revalidatePath('/issues');
    revalidatePath(`/issues/${issueId}`);
    return NextResponse.json({})
  }catch(error){
    return NextResponse.json({ error: 'Failed to update issue status due to a server error.' }, { status: 500 });
  }
}