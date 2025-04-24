import { toast } from "react-toastify";
import axiosInstance from "../../../../App/axiosInstance";
import Select from "react-select";
import {
  getCenterList,
  getDairyList,
} from "../../../../App/Features/Admin/SuperAdmin/accessSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";

const UploadMilkEntrys = () => {
  const { dairyList, centerList } = useSelector((state) => state.access);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    dairy_id: "",
    center_id: "",
  });
  const [progress, setProgress] = useState(0);
  const [filterCenter, setFilterCenter] = useState([]);
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    dispatch(getDairyList());
    dispatch(getCenterList());
  }, [dispatch]);

  const dairyOptions = dairyList.map((item) => ({
    value: item.SocietyCode,
    label: `${item.SocietyName}`,
  }));
  const dairyOptions1 = dairyList.map((item) => ({
    value: item.SocietyCode,
    label: `${item.SocietyCode}`,
  }));
  const centerOptions = filterCenter.map((item) => ({
    value: item.center_id,
    label: `${item.center_name}`,
  }));
  const centerOptions1 = filterCenter.map((item) => ({
    value: item.center_id,
    label: `${item.center_id}`,
  }));

  useEffect(() => {
    if (dairyList.length > 0 && formData.dairy_id) {
      setFilterCenter(
        centerList.filter((item) => item.orgid === formData.dairy_id)
      );
    }
  }, [dairyList, centerList, formData.dairy_id]);

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setProgress(20); // File reading started
        const data = new Uint8Array(e.target.result);
        setProgress(40); // File read complete, starting Excel processing
        const workbook = XLSX.read(data, { type: "array" });
        setProgress(60); // Excel file parsed
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        setProgress(80); // Data converted to JSON

        const processedData = jsonData
          .map((row) => {
            try {
              return {
                ReceiptDate: row.Date,
                ME: row.Time,
                CB: row.Animal,
                Litres: row.Liters,
                fat: row.Fat,
                snf: row.SNF,
                Amt: row.Amount,
                rate: row.Rate,
                cname: row.Name,
                rno: row.Code,
              };
            } catch (error) {
              console.error("Error processing row:", row);
              return null;
            }
          })
          .filter((item) => item !== null);

        setProgress(100); // Data processing complete
        setExcelData(processedData);
        toast.success(`Successfully loaded ${processedData.length} records`);
      } catch (error) {
        console.error("Error processing Excel file:", error);
        toast.error("Error processing Excel file");
        setProgress(0);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
      setProgress(0);
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 20);
        setProgress(progress);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // handle submit
  const handleSubmit = async () => {
    if (
      formData.dairy_id === "" ||
      formData.center_id === "" ||
      excelData.length === 0
    ) {
      toast.error("All fields are required and Excel data must be loaded");
      return;
    }
    const milkColl = excelData.map((item) => ({
      ...item,
      center_id: Number(formData.center_id),
      dairy_id: Number(formData.dairy_id),
      rctype: 0,
      GLCode: "28",
      Digree: 0,
    }));
    try {
      const response = await axiosInstance.post("/save/milk/collection", {
        milkColl: milkColl,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setFormData({ dairy_id: "", center_id: "" });
        setExcelData([]);
        setProgress(0);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to save milk collection"
      );
    }
  };

  // handle reset
  const handleReset = () => {
    setFormData({ dairy_id: "", center_id: "" });
    setExcelData([]);
    setProgress(0);
  };

  return (
    <div className="d-flex-col w100 h1">
      <div className="heading w100 d-flex center">Upload Milk Entrys </div>
      <div>
        <div className=" d-flex-col m10 bg w100 recharge-whsms-container">
          <div className="d-flex a-center w100">
            <div className="info-text">Select Dairy :-</div>
            <Select
              options={dairyOptions1}
              className="mx5 w20"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={
                formData.dairy_id
                  ? dairyOptions1.find(
                      (option) => option.value === Number(formData.dairy_id)
                    )
                  : null
              }
              onChange={(selectedOption) => {
                setFormData({ ...formData, dairy_id: selectedOption.value });
              }}
            />
            <Select
              options={dairyOptions}
              className=" mx5 w50"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={
                formData.dairy_id
                  ? dairyOptions.find(
                      (option) => option.value === Number(formData.dairy_id)
                    )
                  : null
              }
              onChange={(selectedOption) => {
                setFormData({ ...formData, dairy_id: selectedOption.value });
              }}
            />
          </div>
          <div className="d-flex a-center my15">
            <div className="info-text">Select Center :-</div>
            <Select
              options={centerOptions1}
              className="  w20"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={
                formData.center_id !== ""
                  ? centerOptions1.find(
                      (option) => option.value === Number(formData.center_id)
                    )
                  : null
              }
              onChange={(selectedOption) => {
                setFormData({ ...formData, center_id: selectedOption.value });
              }}
            />
            <Select
              options={centerOptions}
              className=" mx5 w50"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={
                formData.center_id !== ""
                  ? centerOptions.find(
                      (option) => option.value === Number(formData.center_id)
                    )
                  : null
              }
              onChange={(selectedOption) => {
                setFormData({ ...formData, center_id: selectedOption.value });
              }}
            />
          </div>
          <div className="d-flex a-center my5">
            <div className="info-text">Upload Excel File :-</div>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="data mx10 w30"
              onChange={handleFileUpload}
            />
            {progress > 0 ||
              (progress < 100 && (
                <progress value={progress} max="100"></progress>
              ))}
          </div>
          {excelData.length > 0 && (
            <div className="d-flex a-center my5">
              <div className="info-text">
                Loaded Records: {excelData.length}
              </div>
            </div>
          )}
          <div className="d-flex j-end mx10 ">
            <button className="w-btn" type="submit" onClick={handleReset}>
              Reset
            </button>
            <button className="w-btn mx10" type="submit" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMilkEntrys;
