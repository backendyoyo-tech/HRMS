import type { RequestHandler } from "express";
import { prisma } from "../../lib/prisma.js";

export const deleteSubmissionController: RequestHandler = async (
    req,
    res,
    next,
) => {
    try {
        const  id  = req.params.id;

        if (typeof id !== "string" || !id) {
            res.status(400).json({
                success: false,
                message: "A valid submission ID is required",
            });
            return;
        }

        const submission = await prisma.formSubmission.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!submission) {
            res.status(404).json({
                success: false,
                message: "Submission not found",
            });
            return;
        }

        await prisma.formSubmission.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: "Submission deleted successfully",
            data: {
                id: submission.id,
            },
        });
    } catch (error) {
        next(error);
    }
};