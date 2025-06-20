import authOptions from "@/app/auth/authOptions";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";
import { redirect } from "next/navigation";
import { Button, Card, Flex } from "@radix-ui/themes";
import { IssueStatusBadge } from "@/app/components";

const MyIssuePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/api/auth/signin");
  }

  const userEmail = session.user.email;

  const userWithAssignedIssues = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,

      assignedIssues: {
        // You can select specific fields from the issues here if needed
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc", // Example: Order issues by creation date
        },
      },
    },
  });

  if (!userWithAssignedIssues) {
    return <div>User not found or no assigned issues.</div>;
  }

  const assignedIssues = userWithAssignedIssues.assignedIssues;

  return (
    <div>
      <h1>Hello,</h1>
      <h2>Your Assigned Issues:</h2>

      {assignedIssues.length === 0 ? (
        <p>You have no issues assigned to you.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {assignedIssues.map((issue) => (
            <Card key={issue.id}>
              <li key={issue.id}>
                <h3>{issue.title}</h3>
                <IssueStatusBadge status={issue.status} />
                <p>{issue.description}</p>
                <Flex>
                  <div>
                    <small>
                      Created: {new Date(issue.createdAt).toLocaleString()}
                    </small>
                    <br />
                    <small>
                      Last Updated: {new Date(issue.updatedAt).toLocaleString()}
                    </small>
                  </div>
                </Flex>
              </li>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyIssuePage;
