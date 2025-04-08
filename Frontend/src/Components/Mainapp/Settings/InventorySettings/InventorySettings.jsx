import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import Select from "react-select";
import { centersLists } from "../../../../App/Features/Dairy/Center/centerSlice";
// import "./InventorySetting.css";

const InventorySettings = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const SubLedgers = useSelector((state) => state.ledger.sledgerlist);
  const dispatch = useDispatch();
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const [selectedCenter, setSelectedCenter] = useState(0);
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails
  );
  const [formData, setFormData] = useState({
    ItemGroupCode: 1,
    SaleGl: "",
    SaleRecivableGl: "",
  });

  const sglOptions = SubLedgers.map((i) => ({
    value: i.lno,
    label: i.lno,
  }));

  const sglOptions1 = SubLedgers.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  useEffect(() => {
    dispatch(listSubLedger());
    dispatch(centersLists());
  }, []);

  const handleSubmit = async () => {
    const data = {
      ItemGroupCode: formData.ItemGroupCode,
      SaleGl: formData.SaleGl,
      SaleRecivableGl: formData.SaleRecivableGl,
    };
    console.log("data", data);
  };

  return (
    <div className="  m10 p10 center ">
      <div className="heading">खतावणी सेटअप </div>
      <div className="d-flex-col m10 p10 bg">
        {centerId > 0 ? (
          <></>
        ) : (
          <div className="d-flex my10 center ">
            <span className="info-text">सेंटर निवडा :</span>
            <select
              className="data w40 my5"
              name="center"
              id=""
              onChange={(e) => {
                setSelectedCenter(e.target.value);
              }}
              value={selectedCenter}
            >
              {centerList &&
                [...centerList]
                  .sort((a, b) => a.center_id - b.center_id)
                  .map((center, index) => (
                    <option key={index} value={center.center_id}>
                      {center.center_name}
                    </option>
                  ))}
            </select>
          </div>
        )}

        <div className="d-flex my10 center ">
          <span className="info-text">ग्रुपचे नाव :</span>
          <select
            name="ItemGroupCode"
            // value={formData.ItemGroupCode}
            className="data form-field w30"
            onChange={
              (e) => setFormData({ ...formData, ItemGroupCode: e.target.value })
              // onKeyDown={(e) => handleKeyDown(e, "ItemGroupCode")}
            }
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
        <div className=" m10 ">
          <div className="d-flex   khatavaniSetup ">
            <span className="info-text">खरेदी देणे खतावणी नं . : </span>
            <Select
              id="saleincome"
              options={sglOptions}
              className="  "
              isSearchable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 200 }),
              }}
              value={
                formData.SaleGl
                  ? sglOptions.find(
                      (option) =>
                        Number(option.value) === Number(formData.SaleGl)
                    )
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  SaleGl: selectedOption.value,
                })
              }
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("roundoff"))
              }
            />

            <Select
              id="saleincome"
              options={sglOptions1}
              className="   mx5"
              isSearchable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 200 }),
              }}
              value={
                formData.SaleGl
                  ? sglOptions1.find(
                      (option) =>
                        Number(option.value) === Number(formData.SaleGl)
                    )
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  SaleGl: selectedOption.value,
                })
              }
            />
          </div>
          <div className="my10 d-flex center khatavaniSetup">
            <span className="info-text">विक्री येणे खतावणी नं. :</span>
            <Select
              id="saleincome"
              options={sglOptions}
              className="  "
              isSearchable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 200 }),
              }}
              value={
                formData.SaleGl
                  ? sglOptions.find(
                      (option) =>
                        Number(option.value) === Number(formData.SaleGl)
                    )
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  SaleGl: selectedOption.value,
                })
              }
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("roundoff"))
              }
            />

            <Select
              id="saleincome"
              options={sglOptions1}
              className="   mx5"
              isSearchable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 200 }),
              }}
              value={
                formData.SaleGl
                  ? sglOptions1.find(
                      (option) =>
                        Number(option.value) === Number(formData.SaleGl)
                    )
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  SaleGl: selectedOption.value,
                })
              }
            />
          </div>
          <div className=" d-flex center khatavaniSetup">
            <span className="info-text">खरेदी खर्च खतावणी नं. : </span>
            <Select
              id="saleincome"
              options={sglOptions}
              className="  "
              isSearchable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 200 }),
              }}
              value={
                formData.SaleGl
                  ? sglOptions.find(
                      (option) =>
                        Number(option.value) === Number(formData.SaleGl)
                    )
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  SaleGl: selectedOption.value,
                })
              }
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("roundoff"))
              }
            />

            <Select
              id="saleincome"
              options={sglOptions1}
              className="   mx5"
              isSearchable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 200 }),
              }}
              value={
                formData.SaleGl
                  ? sglOptions1.find(
                      (option) =>
                        Number(option.value) === Number(formData.SaleGl)
                    )
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  SaleGl: selectedOption.value,
                })
              }
            />
          </div>
          <div className="w100 my10  d-flex center khatavaniSetup">
            <span className="info-text  ">विक्री उत्पत्र खतावणी नं. : </span>

            <Select
              id="saleincome"
              options={sglOptions}
              isSearchable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 200 }),
              }}
              value={
                formData.SaleGl
                  ? sglOptions.find(
                      (option) =>
                        Number(option.value) === Number(formData.SaleGl)
                    )
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  SaleGl: selectedOption.value,
                })
              }
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("roundoff"))
              }
            />

            <Select
              id="saleincome"
              options={sglOptions1}
              className=" mx5 "
              isSearchable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 200 }),
              }}
              value={
                formData.SaleGl
                  ? sglOptions1.find(
                      (option) =>
                        Number(option.value) === Number(formData.SaleGl)
                    )
                  : null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  SaleGl: selectedOption.value,
                })
              }
            />
          </div>

          <div className=" d-flex center m10 ">
            <button
              className="w-btn my10"
              type="submit"
              onClick={() => handleSubmit()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySettings;
