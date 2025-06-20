import { z } from "zod";
import { Status } from "./generated/prisma";

export const issueSchema = z.object({
    title: z.string().min(1, 'Title is required.').max(255),
    description: z.string().min(1, 'Description is required.').max(65535)
});


export const patchIssueSchema = z.object({
    title: z.string().min(1, 'Title is required.').max(255).optional(),
    description: z.string().min(1, 'Description is required.').max(65535).optional(),
    assignedToUserId: z.string().min(1,'AssignedToUserId is required.').max(255).optional().nullable(),
})


export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5)
})


export const changeStatusSchema = z.object({
    status: z.nativeEnum(Status)
})