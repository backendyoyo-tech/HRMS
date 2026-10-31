import { prisma } from "../../lib/prisma.js";

export async function getAllSubmissions(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [submissions, total] = await prisma.$transaction([
    prisma.formSubmission.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        fullName: true,
        designation: true,
        personalEmail: true,
        contactNumber: true,
        highestQualification: true,
        instituteName: true,
        passingYear: true,
        previousCompanyName: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.formSubmission.count(),
  ]);

  return {
    submissions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSubmissionById(id: string) {
  return prisma.formSubmission.findUnique({
    where: { id },
  });
}