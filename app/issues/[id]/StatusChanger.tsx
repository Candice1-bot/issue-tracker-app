"use client";

import { Select } from "@radix-ui/themes";
import { useState } from "react";

import { Issue, Status } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const statusValues: Status[] = Object.values(Status) as Status[];

const StatusChanger = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<Status>(issue.status);

  const [isUpdating, setIsUpdating] = useState(false);

  const statusChange = async (newStatusValue: string) => {
    const newStatus = newStatusValue as Status;

    if (newStatus === currentStatus) return;

    setIsUpdating(true);

    try {
      await axios.patch(`/api/issues/${issue.id}/statusChange`, {
        status: newStatus,
      });

      setCurrentStatus(newStatus);
      toast.success("Status updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast.error("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Select.Root
        defaultValue={currentStatus}
        onValueChange={statusChange}
        disabled={isUpdating}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>

            {statusValues.map((status) => (
              <Select.Item value={status} key={status}>
                {status.replace(/_/g, " ").toLowerCase()}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </>
  );
};

export default StatusChanger;
