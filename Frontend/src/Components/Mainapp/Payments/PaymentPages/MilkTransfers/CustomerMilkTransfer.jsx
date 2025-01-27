import React from "react";
import { useTranslation } from "react-i18next";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import "../../../../../Styles/Mainapp/Payments/MilkTransfer.css";

const CustomerMilkTransfer = () => {
  const { t } = useTranslation(["common", "milkcollection"]);
  return (
    <div className="customer-milk-transfer-container w100 h1 d-flex-col sb">
      <span className="heading h10 d-flex a-center px10">
        Customer Milk Transfer
      </span>
      <div className="view-milk-collection-container w100 h90 d-flex-col sb">
        <div className="customer-details-container w100 h20 d-flex sb">
          <from className="cutsomer-1-details w45 h1 d-flex-col">
            <div className="customer-details-container w100 h50 d-flex a-center sb">
              <span className="label-text px10">Customer</span>
              <input
                className="data w20 t-center mx10"
                type="text"
                value=""
                name="code"
                placeholder="code"
              />
              <input
                className="data w60 "
                type="text"
                name=""
                id=""
                value=""
                readOnly
                placeholder="Customer Name"
              />
            </div>
            <div className="date-container w100 h50 d-flex a-center sb">
              <span className="label-text px10">Dates</span>
              <input
                className="data w30 mx10"
                type="date"
                value=""
                name="code"
                placeholder="code"
              />
              <span className="label-text">TO</span>
              <input
                className="data w30 mx10"
                type="date"
                name=""
                id=""
                value=""
              />
              <button type="button" className="w-btn">
                SHOW
              </button>
            </div>
          </from>
          <div className="cutsomer-1-details w45 h1 d-flex-col ">
            <div className="customer-details-container w100 h50 d-flex a-center sb">
              <span className="label-text ">Customer</span>
              <input
                className="data w20 t-center mx10"
                type="text"
                value=""
                name="code"
                placeholder="code"
              />
              <input
                className="data w60 mx10"
                type="text"
                name=""
                id=""
                value=""
                readOnly
                placeholder="Customer Name"
              />
            </div>
          </div>
        </div>
        <div className="milk-collection-data-container w100 h80 d-flex se">
          <div className="morning-milk-collection-data w45 h1 mh100 hidescrollbar d-flex-col bg">
            <div className="collection-heading-container w100 h10 d-flex a-center bg7 sticky-top sa">
              <span className="f-info-text w10">Edit</span>
              <span className="f-info-text w20">Date</span>
              <span className="f-info-text w10">Liters</span>
              <span className="f-info-text w10">Fat</span>
              <span className="f-info-text w10">Deg</span>
              <span className="f-info-text w10">Snf</span>
              <span className="f-info-text w10">Rate</span>
              <span className="f-info-text w15">Amount</span>
            </div>
            {/* {morningData.length > 0 ? (
                    morningData.map((milk, index) => (
                      <div
                        key={index}
                        className={`collection-data-container w100 h10 d-flex a-center t-center sb`}
                        style={{
                          backgroundColor:
                            selectedMorningItems.includes(milk.id) ||
                            editmrgIndex === index
                              ? "#f7bb79"
                              : index % 2 === 0
                              ? "#faefe3"
                              : "#fff",
                        }}
                        onClick={() => handleSelectItem("morning", milk.id)}>
                        <span className="text w10 t-center d-flex a-center sa">
                          {editmrgIndex === index ? (
                            <FaSave
                              className="color-icon"
                              onClick={() => handleSaveData(milk)}
                            />
                          ) : (
                            <FaEdit
                              className="color-icon"
                              onClick={() => handleEditMrgClick(index, milk)}
                            />
                          )}
                        </span>
                        <span className="text w20 t-start">
                          {milk.ReceiptDate.slice(0, 10)}
                        </span>
                        {editmrgIndex === index ? (
                          <>
                            <span className="text w10 d-flex center">
                              <input
                                className="data w100 t-center"
                                type="text"
                                value={editedData.liters}
                                onChange={(e) =>
                                  handleEditedDataChange("liters", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">
                              <input
                                className="data w100 d-flex center t-center"
                                type="text"
                                value={editedData.fat}
                                onChange={(e) =>
                                  handleEditedDataChange("fat", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">{milk.degree || 0}</span>
                            <span className="text w10">
                              <input
                                className="data w100 h1 d-flex center t-center"
                                type="text"
                                value={editedData.snf}
                                onChange={(e) =>
                                  handleEditedDataChange("snf", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">{editedData.rate}</span>
                            <span className="text w15">{editedData.amt}</span>
                          </>
                        ) : (
                          <>
                            <span className="text w10">{milk.Litres}</span>
                            <span className="text w10">{milk.fat}</span>
                            <span className="text w10">{milk.degree || 0}</span>
                            <span className="text w10">{milk.snf}</span>
                            <span className="text w10">{milk.rate}</span>
                            <span className="text w15">{milk.Amt}</span>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-records w100 h1 d-flex center">
                      <span className="label-text">{t("common:c-no-data-avai")}</span>
                    </div>
                  )} */}
          </div>
          <div className="transfer-logos-container w5 h1 d-flex-col center">
            <FaArrowCircleRight className="transfer-icons my10" />
            <FaArrowCircleLeft className="transfer-icons my10" />
          </div>
          <div className="evening-milk-collection-data w45 h1 mh100 hidescrollbar d-flex-col bg">
            <div className="collection-heading-container w100 h10 d-flex a-center bg7 sticky-top  sa">
              <span className="f-info-text w10">Edit</span>
              <span className="f-info-text w20">Date</span>
              <span className="f-info-text w10">Liters</span>
              <span className="f-info-text w10">Fat</span>
              <span className="f-info-text w10">Deg</span>
              <span className="f-info-text w10">Snf</span>
              <span className="f-info-text w10">Rate</span>
              <span className="f-info-text w15">Amount</span>
            </div>
            {/* {eveningData.length > 0 ? (
                    eveningData.map((milk, index) => (
                      <div
                        key={index}
                        className={`collection-data-container w100 h10 d-flex a-center t-center sb ${
                          index % 2 === 0 ? "bg-light" : "bg-dark"
                        }`}
                        style={{
                          backgroundColor:
                            selectedEveningItems.includes(milk.id) ||
                            editeveIndex === index
                              ? "#f7bb79"
                              : index % 2 === 0
                              ? "#faefe3"
                              : "#fff",
                        }}
                        onClick={() => handleSelectItem("evening", milk.id)}>
                        <span className="text w10 t-center d-flex a-center sa">
                          {editeveIndex === index ? (
                            <FaSave
                              className="color-icon"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                handleSaveData(milk);
                              }}
                            />
                          ) : (
                            <FaEdit
                              className="color-icon"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                handleEditEveClick(index, milk);
                              }}
                            />
                          )}
                        </span>
                        <span className="text w20 t-start">
                          {milk.ReceiptDate.slice(0, 10)}
                        </span>
                        {editeveIndex === index ? (
                          <>
                            <span className="text w10 d-flex center">
                              <input
                                className="data w100 t-center"
                                type="text"
                                value={editedData.liters}
                                onClick={(e) => e.stopPropagation()} // Prevent row click event
                                onChange={(e) =>
                                  handleEditedDataChange("liters", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">
                              <input
                                className="data w100 d-flex center t-center"
                                type="text"
                                value={editedData.fat}
                                onClick={(e) => e.stopPropagation()} // Prevent row click event
                                onChange={(e) =>
                                  handleEditedDataChange("fat", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">{milk.degree || 0}</span>
                            <span className="text w10">
                              <input
                                className="data w100 h1 d-flex center t-center"
                                type="text"
                                value={editedData.snf}
                                onClick={(e) => e.stopPropagation()} // Prevent row click event
                                onChange={(e) =>
                                  handleEditedDataChange("snf", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">{editedData.rate}</span>
                            <span className="text w15">{editedData.amt}</span>
                          </>
                        ) : (
                          <>
                            <span className="text w10">{milk.Litres}</span>
                            <span className="text w10">{milk.fat}</span>
                            <span className="text w10">{milk.degree || 0}</span>
                            <span className="text w10">{milk.snf}</span>
                            <span className="text w10">{milk.rate}</span>
                            <span className="text w15">{milk.Amt}</span>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-records w100 h1 d-flex center">
                      <span className="label-text">{t("common:c-no-data-avai")}</span>
                    </div>
                  )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMilkTransfer;
