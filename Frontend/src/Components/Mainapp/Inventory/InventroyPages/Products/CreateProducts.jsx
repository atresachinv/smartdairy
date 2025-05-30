import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../App/axiosInstance";
import { toast } from "react-toastify";
import "./Product.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { centersLists } from "../../../../../App/Features/Dairy/Center/centerSlice";

const CreateProducts = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [formData, setFormData] = useState({
    ItemCode: "",
    ItemName: "",
    marname: "",
    ItemGroupCode: "",
    UnitCode: "",
    ItemDesc: "",
    ManufacturerName: "",
  });
  const [itemlist, setItemList] = useState([]);
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const [settings, setSettings] = useState({});
  const autoCenter = settings?.autoCenter;
  const [formData1, setFormData1] = useState({
    ItemGroupCode: 1,
    GhatnashakNo: "",
    VikriYeneNo: "",
    kharediDeneNo: "",
    kharediKharchNo: "",
    vikriUtpannaNo: "",
  });
  const [selectedCenter, setSelectedCenter] = useState(0);
  const centerList = useSelector((state) => state.center.centersList || []);
  const dispatch = useDispatch();
  const SubLedgers = useSelector((state) => state.ledger.sledgerlist);
  const [GlData1, setGlData1] = useState([]);
  const [GlData, setGlData] = useState([]);

  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  //hanlde on change data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle submit to create product
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    if (
      !formData.ItemName ||
      !formData.marname ||
      !formData.ItemGroupCode ||
      !formData.UnitCode
    ) {
      toast.error("Please fill all required filled to save new Product!");
      return;
    }
    if (
      formData.ItemName &&
      formData.marname &&
      formData.ItemGroupCode &&
      formData.UnitCode
    ) {
      if (itemlist) {
        const FoundItem = itemlist.filter(
          (item) =>
            item.ItemName.toLowerCase().trim() ===
              formData.ItemName.toLowerCase().trim() ||
            item.marname.toLowerCase().trim() ===
              formData.marname.toLowerCase().trim()
        );
        if (FoundItem.length > 0) {
          toast.error("Product Name already exist!");
          return;
        }
      }
      try {
        // console.log("Product Data Submitted: ", formData);
        const res = await axiosInstance.post("/item/new", formData);
        if (res?.data?.success) {
          toast.success("Product Created Successfully!");
          setFormData({
            ItemCode: formData.ItemCode + 1,
            ItemName: "",
            marname: "",
            ItemGroupCode: "",
            UnitCode: "",
            ItemDesc: "",
            ManufacturerName: "",
          });
          fetchAllItems();
        }
      } catch (error) {
        // console.error("Error creating product: ", error);
        toast.error("There was an error server creating the product.");
      }
    }
  };
  //handle to down on enter key
  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formElements = Array.from(document.querySelectorAll(".form-field"));
      const currentIndex = formElements.findIndex(
        (el) => el.name === fieldName
      );
      if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus();
      }
    }
  };

  //handle to clear
  const handleClear = () => {
    setFormData({
      ItemName: "",
      marname: "",
      ItemGroupCode: "",
      UnitCode: "",
      ItemDesc: "",
      ManufacturerName: "",
    });
  };

  //get max Itemcode and get all item
  useEffect(() => {
    const fetchMaxItemCode = async () => {
      try {
        const res = await axiosInstance.get(
          `/item/maxcode?autoCenter=${autoCenter}`
        );

        if (res.data.success) {
          setFormData({
            ...formData,
            ItemCode: parseInt(res.data.maxItemCode) + 1,
          });
        }
      } catch (error) {
        console.error("Failed to fetch max item code:", error);
      }
    };
    if (settings?.autoCenter !== undefined) {
      fetchAllItems();
      fetchMaxItemCode();
    }
  }, [settings]);

  const fetchAllItems = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/item/all?autoCenter=${autoCenter}`
      );
      setItemList(data.itemsData || []);
    } catch (error) {
      console.error("Failed to fetch items.", error);
    }
  };

  //get all gl data-------------------------------------->
  useEffect(() => {
    dispatch(listSubLedger());
    dispatch(centersLists());
  }, [dispatch]);

  //fetch all itemGroupMaster
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/grpitem/all?autoCenter=${autoCenter}`
        );
        setGlData1(response.data?.itemsData || []);
      } catch (error) {
        console.error("Error fetching group items:", error);
      }
    };
    if (settings?.autoCenter !== undefined) {
      fetchData();
    }
  }, [settings]);

  useEffect(() => {
    if (GlData.length) {
      const selectedGlData = GlData.find(
        (item) => item.ItemGroupCode === Number(formData1.ItemGroupCode)
      );
      if (selectedGlData) {
        setFormData1((prevState) => ({
          ...prevState,
          GhatnashakNo: selectedGlData.GhatnashakNo,
          VikriYeneNo: selectedGlData.VikriYeneNo,
          kharediDeneNo: selectedGlData.kharediDeneNo,
          kharediKharchNo: selectedGlData.kharediKharchNo,
          vikriUtpannaNo: selectedGlData.vikriUtpannaNo,
        }));
      } else {
        setFormData1((prevState) => ({
          ...prevState,
          GhatnashakNo: "",
          VikriYeneNo: "",
          kharediDeneNo: "",
          kharediKharchNo: "",
          vikriUtpannaNo: "",
        }));
      }
    } else {
      setFormData1((prevState) => ({
        ...prevState,
        GhatnashakNo: "",
        VikriYeneNo: "",
        kharediDeneNo: "",
        kharediKharchNo: "",
        vikriUtpannaNo: "",
      }));
    }
  }, [GlData, selectedCenter]);

  useEffect(() => {
    const filteredGlData = GlData1.filter(
      (item) =>
        Number(item.center_id) ===
        Number(
          autoCenter === 1 ? centerId : centerId > 0 ? centerId : selectedCenter
        )
    );
    setGlData(filteredGlData || []);
  }, [selectedCenter, centerId, GlData1]);

  const handleOngrop = (e) => {
    const newGroupCode = e.target.value;
    setFormData1((prevState) => ({
      ...prevState,
      ItemGroupCode: newGroupCode,
    }));

    const selectedGlData = GlData.find(
      (item) => item.ItemGroupCode === Number(newGroupCode)
    );
    if (selectedGlData) {
      setFormData1((prevState) => ({
        ...prevState,
        GhatnashakNo: selectedGlData.GhatnashakNo,
        VikriYeneNo: selectedGlData.VikriYeneNo,
        kharediDeneNo: selectedGlData.kharediDeneNo,
        kharediKharchNo: selectedGlData.kharediKharchNo,
        vikriUtpannaNo: selectedGlData.vikriUtpannaNo,
      }));
    } else {
      setFormData1((prevState) => ({
        ...prevState,
        GhatnashakNo: "",
        VikriYeneNo: "",
        kharediDeneNo: "",
        kharediKharchNo: "",
        vikriUtpannaNo: "",
      }));
    }
  };

  return (
    <div className="w100 h1 d-flex-col p10 ">
      <span className="heading">{t("ps-nv-pro-add")}</span>
      <div className="createProductContainer w100 h1 d-flex center sb">
        <form
          onSubmit={handleSubmit}
          className="createProductContainer-item m10 w50 h90 d-flex-col p10 bg"
        >
          <div className="  d-flex my5">
            <div className="col">
              <label className="info-text px10">
                {t("ps-code")}
                <span className="req">*</span>
              </label>
              <input
                type="number"
                name="ItemCode"
                value={formData.ItemCode}
                onFocus={(e) => e.target.select()}
                className={`data form-field  `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemCode")}
                placeholder="Item Code"
                required
                disabled
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                {t("ps-itm-name")} <span className="req">*</span>
              </label>
              <input
                type="text"
                name="ItemName"
                value={formData.ItemName}
                onFocus={(e) => e.target.select()}
                className={`data form-field `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemName")}
                placeholder="Item Name"
                required
              />
            </div>
          </div>
          <div className="  d-flex my5">
            <div className="col">
              <label className="info-text px10">
                {t("ps-mar-name")}
                <span className="req">*</span>
              </label>
              <input
                type="text"
                name="marname"
                onFocus={(e) => e.target.select()}
                value={formData.marname}
                className={`data form-field `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "marname")}
                placeholder="Item Marathi Name"
                required
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                {t("ps-sel-grp")} <span className="req">*</span>
              </label>
              <select
                name="ItemGroupCode"
                value={formData.ItemGroupCode}
                className={`data form-field `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemGroupCode")}
                required
              >
                <option value="">------ Select ------- </option>
                {[
                  { value: 1, label: `${t("ps-nv-cattlefeed")}` },
                  { value: 2, label: `${t("ps-nv-medicines")}` },
                  { value: 3, label: `${t("ps-nv-grocery")}` },
                  { value: 4, label: `${t("ps-nv-other")}` },
                ].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="  d-flex my5">
            <div className="col">
              <label className="info-text px10">
                Unit Code: <span className="req">*</span>
              </label>
              <select
                name="UnitCode"
                value={formData.UnitCode}
                className={`data form-field `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "UnitCode")}
                required
              >
                <option value="">-----Select Unit-----</option>
                {[
                  { value: "KG", label: "KG" },
                  { value: "QTY", label: "QTY" },
                  { value: "Others", label: "Others" },
                ].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="info-text px10">{t("ps-desc")}</label>
              <input
                type="text"
                name="ItemDesc"
                value={formData.ItemDesc}
                onFocus={(e) => e.target.select()}
                className={`data form-field`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemDesc")}
                placeholder="Item Description"
              />
            </div>
          </div>
          <div className="row d-flex my5">
            <div className="col">
              <label className="info-text px10">{t("ps-manuf")}</label>
              <input
                type="text"
                name="ManufacturerName"
                value={formData.ManufacturerName}
                onFocus={(e) => e.target.select()}
                className={`data form-field`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ManufacturerName")}
                placeholder="ManufacturerName"
              />
            </div>
          </div>
          <div className="  d-flex a-center  j-end my10">
            <button className="w-btn" type="button" onClick={handleClear}>
              {t("ps-cancel")}
            </button>
            <button className="w-btn mx10" type="submit">
              {t("ps-smt")}
            </button>
          </div>
        </form>
        <div className="createProductContainer-item w50 m10  h90 d-flex-col p10 bg">
          <div className=" w100  d-flex a-center my10  j-center">
            {centerId > 0 ? null : (
              <div className="d-flex  center">
                <span className="info-text w50">सेंटर निवडा :</span>
                <select
                  className="data  my5"
                  name="center"
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  value={selectedCenter}
                >
                  {centerList &&
                    [...centerList]
                      .sort((a, b) => a.center_id - b.center_id)
                      .map((center) => (
                        <option key={center.center_id} value={center.center_id}>
                          {center.center_name}
                        </option>
                      ))}
                </select>
              </div>
            )}
          </div>
          <div className=" w100  d-flex a-center  j-center">
            <span className="info-text">ग्रुपचे नाव :</span>
            <select
              name="ItemGroupCode"
              className="data form-field w30"
              value={formData1.ItemGroupCode}
              onChange={handleOngrop}
            >
              {[
                { value: 1, label: `${t("ps-nv-cattlefeed")}` },
                { value: 2, label: `${t("ps-nv-medicines")}` },
                { value: 3, label: `${t("ps-nv-grocery")}` },
                { value: 4, label: `${t("ps-nv-other")}` },
              ].map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w100 d-flex center my10">
            <span className="info-text w70">खरेदी देणे ख. नं . : </span>
            <input
              type="text"
              name="kharediDeneNo"
              value={formData1.kharediKharchNo}
              className={`data mx5 w30`}
              disabled
            />
            <input
              type="text"
              name="kharediDeneNo"
              value={
                formData1.kharediDeneNo
                  ? SubLedgers.find(
                      (item) => item.lno === formData1.kharediKharchNo
                    )?.marathi_name
                  : ""
              }
              className={`data  `}
              disabled
            />
          </div>
          <div className="w100 d-flex center ">
            <span className="info-text w70">विक्री येणे खतावणी नं. : </span>
            <input
              type="text"
              name="kharediDeneNo"
              value={formData1.vikriUtpannaNo}
              className={`data mx5 w30`}
              disabled
            />
            <input
              type="text"
              name="kharediDeneNo"
              value={
                formData1.vikriUtpannaNo
                  ? SubLedgers.find(
                      (item) => item.lno === formData1.vikriUtpannaNo
                    )?.marathi_name
                  : ""
              }
              className={`data  `}
              disabled
            />
          </div>
          <div className="w100 d-flex center my10">
            <span className="info-text w70">खरेदी खर्च ख. नं. : </span>
            <input
              type="text"
              name="kharediDeneNo"
              value={formData1.kharediDeneNo}
              className={`data mx5 w30`}
              disabled
            />
            <input
              type="text"
              name="kharediDeneNo"
              value={
                formData1.kharediDeneNo
                  ? SubLedgers.find(
                      (item) => item.lno === formData1.kharediDeneNo
                    )?.marathi_name
                  : ""
              }
              className={`data  `}
              disabled
            />
          </div>
          <div className="w100 d-flex center ">
            <span className="info-text w70">विक्री उत्पत्र ख. नं. : </span>
            <input
              type="text"
              name="kharediDeneNo"
              value={formData1.VikriYeneNo}
              className={`data mx5 w30`}
              disabled
            />
            <input
              type="text"
              name="kharediDeneNo"
              value={
                formData1.VikriYeneNo
                  ? SubLedgers.find(
                      (item) => item.lno === formData1.VikriYeneNo
                    )?.marathi_name
                  : ""
              }
              className={`data  `}
              disabled
            />
          </div>
          <div className="w100 d-flex center my10">
            <span className="info-text w70">घटनाश ख. नं. : </span>
            <input
              type="text"
              name="kharediDeneNo"
              value={formData1.GhatnashakNo}
              className={`data mx5 w30`}
              disabled
            />
            <input
              type="text"
              name="kharediDeneNo"
              value={
                formData1.kharediDeneNo
                  ? SubLedgers.find(
                      (item) => item.lno === formData1.GhatnashakNo
                    )?.marathi_name
                  : ""
              }
              className={`data  `}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProducts;
