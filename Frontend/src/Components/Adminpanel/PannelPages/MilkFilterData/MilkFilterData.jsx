import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import React from "react";
import "./milkfilterdata.css";
import { toast } from "react-toastify";

const MilkFilterData = () => {
  const [uniqueCenters, setUniqueCenters] = React.useState([]);
  const [structured, setStructured] = React.useState([]);
  const [filteredStructured, setFilteredStructured] = React.useState([]);
  const [progress, setProgress] = React.useState(0);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setProgress(0);
      toast.error("Please upload a file");
      return;
    }

    setProgress(10); // Start progress
    const data = await file.arrayBuffer();
    setProgress(30);

    const workbook = XLSX.read(data, { type: "buffer" });
    setProgress(50);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    setProgress(70);

    let currentCenter = "";
    let tempStructured = [];
    let centerIndex = new Map();
    let centerCount = 0;

    rawData.forEach((row, i) => {
      const rowStr = row.join(" ");
      const centerMatch = rowStr.match(/\*(.*?दुध संकलन केंद्र.*?)\*/);
      if (centerMatch) {
        currentCenter = centerMatch[1].trim();
        if (!centerIndex.has(currentCenter)) {
          centerIndex.set(currentCenter, centerCount++);
        }
      }

      if (rowStr.includes("दुध उत्पादक नाव")) {
        const dateMatch = rowStr.match(
          /दिनांक\s*:\s*\*(सकाळ|सायंकाळ)ः?(\d{1,2}\/\d{1,2}\/\d{4})\*/
        );
        const nameMatch = rowStr.match(/दुध उत्पादक नाव\s*:\*\s*(.*?)\*/);
        const codeMatch = rowStr.match(/दुध उत्पादक कोड:\s*\*(\d+)\*/);
        const literMatch = rowStr.match(/लिटर:\s*\*(\d+(\.\d+)?)\*/);
        const fatMatch = rowStr.match(/Fat:\s*\*(\d+(\.\d+)?)\*/);
        const snfMatch = rowStr.match(/SNF:\s*\*(\d+(\.\d+)?)\*/);
        const rateMatch = rowStr.match(/दर:\s*\*(\d+(\.\d+)?)\*/);
        const amountMatch = rowStr.match(/एकूण रक्कम:\s*\*(\d+(\.\d+)?)\*/);
        const timeType = dateMatch?.[1] ?? "सकाळ";
        const numericType = timeType === "सकाळ" ? 0 : 1;

        tempStructured.push({
          Center: currentCenter,
          CenterIndex: centerIndex.get(currentCenter),
          Date: dateMatch?.[2] ?? "",
          Time: numericType,
          Code: Number(codeMatch?.[1] ?? 0),
          Liters: parseFloat(literMatch?.[1] ?? 0),
          Fat: parseFloat(fatMatch?.[1] ?? 0),
          SNF: parseFloat(snfMatch?.[1] ?? 0),
          Name: nameMatch?.[1] ?? "",
          Rate: parseFloat(rateMatch?.[1] ?? 0),
          Amount: parseFloat(amountMatch?.[1] ?? 0),
          Animal: 0,
        });
      }

      if (i % 50 === 0) {
        setProgress((prev) => Math.min(prev + 5, 90)); // Simulate in steps
      }
    });

    const centers = Array.from(centerIndex.entries()).map(([name, index]) => ({
      name,
      index,
    }));
    setUniqueCenters(centers);
    setStructured(tempStructured);
    setFilteredStructured(tempStructured);
    setProgress(100); // Complete
    setTimeout(() => setProgress(0), 800); // Hide after brief pause
  };

  const handleExport = () => {
    const exportData = filteredStructured.map((item) => ({
      Date: item.Date,
      Time: item.Time,
      Code: item.Code,
      Liters: item.Liters,
      Fat: item.Fat,
      SNF: item.SNF,
      Name: item.Name,
      Rate: item.Rate,
      Amount: item.Amount,
      Animal: item.Animal,
    }));
    // Create new workbook
    const newSheet = XLSX.utils.json_to_sheet(exportData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "CleanedData");

    const excelBuffer = XLSX.write(newWorkbook, {
      type: "array",
      bookType: "xlsx",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "cleaned_milk_data.xlsx");
  };

  const handleCenterChange = (e) => {
    const selectedCenter = e.target.value;
    if (selectedCenter === "") {
      setFilteredStructured(structured);
      return;
    }

    const filteredData = structured.filter(
      (item) => item.Center === selectedCenter
    );
    setFilteredStructured(filteredData.length > 0 ? filteredData : []);
  };

  return (
    <div className="milkfilterdata-hide-scroll">
      {/* Header Section */}
      <div className="w100 my5">
        <div className="w100 d-flex heading j-center">Milk Filtering Page</div>
        <div className="w100 d-flex sa">
          <div className="d-flex h1 a-center">
            <label htmlFor="" className="info-text">
              Select Excel file :
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            {progress > 0 && <progress value={progress} max="100"></progress>}
          </div>

          <select
            className="data w30"
            name=""
            id=""
            onChange={handleCenterChange}
          >
            <option value="">All Centers</option>
            {uniqueCenters.map((center) => (
              <option key={center.index} value={center.name}>
                {center.name}
              </option>
            ))}
          </select>
          <button className="w-btn" onClick={handleExport}>
            Export
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="milkfilterdata-table-container">
        <div className="Scroll-table-milkfilterdata">
          <table>
            <thead>
              <tr>
                <th>Center</th>
                <th>Date</th>
                <th>Time</th>
                <th>Code</th>
                <th>Liters</th>
                <th>Fat</th>
                <th>SNF</th>
                <th>Name</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Animal</th>
              </tr>
            </thead>
            <tbody>
              {filteredStructured.length > 0 ? (
                filteredStructured.map((item, index) => (
                  <tr key={`${item.CenterIndex}-${index}`}>
                    <td>{item.Center}</td>
                    <td>{item.Date}</td>
                    <td>{item.Time}</td>
                    <td>{item.Code}</td>
                    <td>{item.Liters}</td>
                    <td>{item.Fat}</td>
                    <td>{item.SNF}</td>
                    <td>{item.Name}</td>
                    <td>{item.Rate}</td>
                    <td>{item.Amount}</td>
                    <td>{item.Animal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MilkFilterData;
