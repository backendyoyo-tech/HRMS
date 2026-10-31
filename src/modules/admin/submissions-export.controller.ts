import type { RequestHandler } from "express";
import ExcelJS from "exceljs";
import { prisma } from "../../lib/prisma.js";

function safeExcelText(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  // Prevent user-entered text from being interpreted as an Excel formula.
  if (/^[=+\-@]/.test(value)) {
    return `'${value}`;
  }

  return value;
}

export const exportSubmissionsExcelController: RequestHandler = async (
  _req,
  res,
) => {
  try {
    const submissions = await prisma.formSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "YOYO HRMS";
    workbook.created = new Date();
    workbook.subject = "HR Form Submissions";
    workbook.title = "HRMS Submissions";

    const worksheet = workbook.addWorksheet("HR Submissions");

    worksheet.columns = [
    //   { header: "Submission ID", key: "id", width: 38 },
    //   { header: "Status", key: "status", width: 18 },
    //   { header: "Submitted At", key: "createdAt", width: 24 },

      { header: "Full Name", key: "fullName", width: 28 },
      { header: "Designation", key: "designation", width: 24 },
      { header: "Personal Email", key: "personalEmail", width: 32 },
      { header: "Contact Number", key: "contactNumber", width: 20 },

      { header: "Aadhaar Number", key: "aadhaarNumber", width: 22 },
      { header: "PAN Number", key: "panNumber", width: 18 },
      { header: "Marital Status", key: "maritalStatus", width: 18 },

      { header: "Aadhaar Address", key: "aadhaarAddress", width: 45 },
      { header: "Current Address", key: "currentAddress", width: 45 },

      {
        header: "Emergency Contact 1 Number",
        key: "emergencyContact1Number",
        width: 26,
      },
      {
        header: "Emergency Contact 1 Relation",
        key: "emergencyContact1Relation",
        width: 26,
      },
      {
        header: "Emergency Contact 2 Number",
        key: "emergencyContact2Number",
        width: 26,
      },
      {
        header: "Emergency Contact 2 Relation",
        key: "emergencyContact2Relation",
        width: 26,
      },

      {
        header: "Highest Qualification",
        key: "highestQualification",
        width: 28,
      },
      { header: "Institute Name", key: "instituteName", width: 32 },
      { header: "Passing Year", key: "passingYear", width: 16 },

      {
        header: "Previous Company Name",
        key: "previousCompanyName",
        width: 30,
      },
      {
        header: "Previous Company Designation",
        key: "previousCompanyDesignation",
        width: 30,
      },
      {
        header: "Employment Duration",
        key: "employmentDuration",
        width: 24,
      },
      { header: "Previous HR Name", key: "previousHRName", width: 26 },
      { header: "Previous HR Email", key: "previousHREmail", width: 32 },
      {
        header: "Previous HR Contact Number",
        key: "previousHRContactNumber",
        width: 28,
      },

      { header: "Account Holder Name", key: "accountHolderName", width: 30 },
      { header: "Account Number", key: "accountNumber", width: 26 },
      { header: "IFSC Code", key: "ifscCode", width: 18 },
      { header: "Bank Name", key: "bankName", width: 28 },

    //   { header: "Last Updated At", key: "updatedAt", width: 24 },
    ];

    for (const submission of submissions) {
      worksheet.addRow({
        id: submission.id,
        status: submission.status,
        createdAt: submission.createdAt.toISOString(),

        fullName: safeExcelText(submission.fullName),
        designation: safeExcelText(submission.designation),
        personalEmail: safeExcelText(submission.personalEmail),
        contactNumber: safeExcelText(submission.contactNumber),

        // Preserve long identity/account numbers as text.
        aadhaarNumber: safeExcelText(submission.aadhaarNumber),
        panNumber: safeExcelText(submission.panNumber),
        maritalStatus: safeExcelText(submission.maritalStatus),

        aadhaarAddress: safeExcelText(submission.aadhaarAddress),
        currentAddress: safeExcelText(submission.currentAddress),

        emergencyContact1Number: safeExcelText(
          submission.emergencyContact1Number,
        ),
        emergencyContact1Relation: safeExcelText(
          submission.emergencyContact1Relation,
        ),
        emergencyContact2Number: safeExcelText(
          submission.emergencyContact2Number,
        ),
        emergencyContact2Relation: safeExcelText(
          submission.emergencyContact2Relation,
        ),

        highestQualification: safeExcelText(
          submission.highestQualification,
        ),
        instituteName: safeExcelText(submission.instituteName),
        passingYear: submission.passingYear,

        previousCompanyName: safeExcelText(
          submission.previousCompanyName,
        ),
        previousCompanyDesignation: safeExcelText(
          submission.previousCompanyDesignation,
        ),
        employmentDuration: safeExcelText(
          submission.employmentDuration,
        ),
        previousHRName: safeExcelText(submission.previousHRName),
        previousHREmail: safeExcelText(submission.previousHREmail),
        previousHRContactNumber: safeExcelText(
          submission.previousHRContactNumber,
        ),

        accountHolderName: safeExcelText(submission.accountHolderName),
        accountNumber: safeExcelText(submission.accountNumber),
        ifscCode: safeExcelText(submission.ifscCode),
        bankName: safeExcelText(submission.bankName),

        updatedAt: submission.updatedAt.toISOString(),
      });
    }

    // Style the header row.
    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD2252B" },
    };

    headerRow.alignment = {
      vertical: "middle",
      wrapText: true,
    };

    headerRow.height = 30;

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    // Make addresses readable when the file is opened.
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = {
          vertical: "top",
          wrapText: true,
        };
      }
    });

    const filename = `hrms-submissions-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );

    res.setHeader("Cache-Control", "no-store");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export submissions Excel error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Unable to export submissions",
      });
    }
  }
};