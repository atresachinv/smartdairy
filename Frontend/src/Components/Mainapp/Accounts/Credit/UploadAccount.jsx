import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import * as XLSX from "xlsx"; // Import xlsx library
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../../../App/axiosInstance";

// Get today's date
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const UploadAccount = () => {
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    GLCode: "",
    VoucherDate: getTodaysDate(),
    BatchNo: "",
    Vtype: "",
    Narration: "तपशील यादी प्रमाणे",
  });

  const [tableData, setTableData] = useState([]); // State to hold table data
  const fileInputRef = useRef(null); // Ref for the file input

  useEffect(() => {
    dispatch(listSubLedger());
  }, [dispatch]);

  // Option lists for Select components
  const slegOptions = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.lno,
  }));
  const slegOptions1 = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  // Function to handle Excel file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("कृपया एक फाइल निवडा.");
      return;
    }

    // Check if the file is an Excel file
    const validExtensions = ["xlsx", "xls"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

      // Extract "Code" and "Amount" columns
      const extractedData = jsonData.map((row) => ({
        code: row["Code"] || row["code"], // Handle case-insensitivity
        amt: row["Amount"] || row["amt"], // Handle case-insensitivity
      }));

      setTableData(extractedData); // Update table data state

      // Clear the file input after processing
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.VoucherDate) {
      toast.error("कृपया व्यवहार दिनांक निवडा.");
      return;
    }
    if (!formData.BatchNo) {
      toast.error("कृपया बॅच नंबर एंटर करा.");
      return;
    }
    if (!formData.GLCode) {
      toast.error("कृपया खतावणी निवडा.");
      return;
    }
    if (!formData.Vtype) {
      toast.error("कृपया व्यवहार प्रकार  निवडा.");
      return;
    }
    if (tableData.length === 0) {
      toast.error("कृपया एक्सेल यादी अपलोड करा.");
      return;
    }

    const formDataToSubmit = tableData.map((row) => ({
      GLCode: formData.GLCode,
      Vtype: formData.Vtype,
      Amt:
        Number(formData.Vtype) === 1
          ? -row.amt
          : Number(formData.Vtype) === 0
          ? -row.amt
          : row.amt,
      VoucherDate: formData.VoucherDate,
      BatchNo: formData.BatchNo,
      Narration: formData.Narration,
      AccCode: row.code,
      VoucherNo: 1,
      ReceiptNo: 1,
      InstrType: 2,
    }));

    console.log("Form Data to Submit:", formDataToSubmit);
    try {
      const response = await axiosInstance.post(
        "/api/credit/upload",
        formDataToSubmit
      );

      if (response.data.success) {
        toast.success("Data uploaded successfully!");
        setFormData({
          GLCode: "",
          VoucherDate: getTodaysDate(),
          BatchNo: "",
          Vtype: "",
          Narration: "तपशील यादी प्रमाणे",
        });
        setTableData([]);
      } else {
        toast.error("Error uploading data.");
      }
    } catch (error) {
      //   console.error("Error:", error);
      toast.error("Error uploading data.");
    }

    // Reset form and table data
  };

  return (
    <div className="Credit-container w100 h1 d-flex-col p10">
      <div className="Credit-container-scroll d-flex-col h1 w100 bg p10">
        <div className="d-flex w100 j-center">
          <div className="d-flex center">
            <span className="info-text w50">व्यवहार दिनांक :</span>
            <input
              type="date"
              className="data"
              value={formData.VoucherDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  VoucherDate: e.target.value,
                })
              }
            />
          </div>
          <div className="w40 d-flex mx10">
            <span className="info-text">बॅच नंबर :</span>
            <input
              type="number"
              className="data w50 mx5"
              value={formData.BatchNo}
              onChange={(e) =>
                setFormData({ ...formData, BatchNo: e.target.value })
              }
            />
          </div>
        </div>
        <div className="d-flex w100 my15 center">
          <span className="info-text">खतावणी नं.</span>
          <Select
            options={slegOptions}
            className="w30 mx5"
            isSearchable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 200,
              }),
            }}
            value={
              formData.GLCode
                ? slegOptions.find((option) => option.value === formData.GLCode)
                : null
            }
            onChange={(e) => {
              setFormData({ ...formData, GLCode: e.value });
            }}
          />

          {/* Second Select */}
          <Select
            options={slegOptions1}
            className="w40 mx5"
            placeholder="खतावणी नाव निवडा"
            isSearchable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 200,
              }),
            }}
            value={
              formData.GLCode
                ? slegOptions1.find(
                    (option) => option.value === formData.GLCode
                  )
                : null
            }
            onChange={(e) => {
              setFormData({ ...formData, GLCode: e.value });
            }}
          />
        </div>
        <div className="d-flex w100 sb">
          <div className="w50 d-flex center">
            <span className="info-text">व्यवहार प्रकार :</span>
            <select
              className="data w30 mx5"
              value={formData.Vtype}
              onChange={(e) =>
                setFormData({ ...formData, Vtype: e.target.value })
              }
            >
              <option value=""> </option>
              <option value="0">नावे रोख</option>
              <option value="1">नावे ट्रान्सफर</option>
              <option value="2">जमा रोख</option>
              <option value="3">जमा ट्रान्सफर</option>
            </select>
          </div>
          <div className="w50 mx10">
            <span className="info-text">तपशील :</span>
            <input
              type="text"
              className="data w40 mx5"
              value={formData.Narration}
              onChange={(e) =>
                setFormData({ ...formData, Narration: e.target.value })
              }
            />
          </div>
        </div>

        <div className="d-flex my10 w100 center">
          <label htmlFor="file-upload" className="btn">
            एक्सेल यादी निवडा
          </label>
          <input
            id="file-upload"
            type="file"
            className="btn mx5"
            style={{ display: "none" }}
            ref={fileInputRef} // Attach ref to the file input
            onChange={handleFileUpload}
          />
          <button className="mx10 w-btn" type="submit" onClick={handleSubmit}>
            save
          </button>
        </div>

        <div className="credit-table d-flex-col m5 p5 h1">
          <div className="creditTable-container">
            <table className="table">
              <thead>
                <tr>
                  <th>कोड</th>
                  <th>रक्कम</th>
                  <th>नाव </th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0
                  ? tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="info-text"> {row.code}</td>
                        <td className="info-text"> {row.amt}</td>
                        <td className="info-text"> </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAccount;
