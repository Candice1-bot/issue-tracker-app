import { Status } from "@/app/generated/prisma/client";
import prisma from "@/app/lib/prisma";
import IssueActions from "./IssueActions";

import Pagination from "@/app/components/Pagination";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<IssueQuery>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const { status: unvalidateStatus } = await searchParams;

  const aliasOfSearchParams = await searchParams;

  //validation
  const statuses = Object.values(Status);
  const status = statuses.includes(unvalidateStatus)
    ? unvalidateStatus
    : undefined;

  const where = { status };

  const orderBy = columnNames.includes(aliasOfSearchParams.orderBy)
    ? { [aliasOfSearchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(aliasOfSearchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchPrams={aliasOfSearchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      ></Pagination>
    </Flex>
  );
};
export const dynamic = "force-dynamic";

// export const revalidate = 0;

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};
export default IssuesPage;
