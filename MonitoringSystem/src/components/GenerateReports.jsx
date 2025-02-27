import * as XLSX from "xlsx";

function GenerateReport({ requirements }) {
  const exportToExcel = () => {
    // Prepare the data for export
    const exportData = requirements.map((requirement) => ({
      "Compliance List": requirement.complianceList,
      "Department": requirement.department,
      "Entity": requirement.entity,
      "Frequency of Compliance": requirement.frequencyOfCompliance,
      "Type of Compliance": requirement.typeOfCompliance,
      "Date Submitted": requirement.dateSubmitted,
      "Expiration": requirement.expiration,
      "Renewal": requirement.renewal,
      "Person in Charge": requirement.personInCharge,
      "Status": requirement.status,
      "Document Reference": requirement.documentReference,
    }));

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requirements");

    // Generate and download the file
    XLSX.writeFile(wb, "requirements_report.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      className="generate-report-button"
      title="Generate Report"
    >
      <img
        src="/assets/vscode-icons--file-type-excel.svg"
        alt="Generate Report"
        className="icon"
      />
      <span>Generate Report</span>
    </button>
  );
}

export default GenerateReport;