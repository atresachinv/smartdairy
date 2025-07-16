import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../App/axiosInstance";
import "../../../../../Styles/Mainapp/Inventory/InventoryPages/Trncheck.css";

//gett todays date------------>
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
const TrnCheck = () => {
  const [voucherList, setVoucherList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromDate: getTodaysDate(),
    toDate: getTodaysDate(),
    cn: 0,
    itemgrpcode: 1,
    type: 1,
  });
  `  `;
  const centerList = useSelector((state) => state.center.centersList || []);
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const [filter, setFilter] = useState(0);
  const [settings, setSettings] = useState({});
  const autoCenter = useMemo(() => settings?.autoCenter, [settings]);
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);

  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  const handelCheck = async (e) => {
    setLoading(true);
    e.preventDefault();
    setDataList([]);
    setVoucherList([]);
    if (
      !formData.fromDate ||
      !formData.itemgrpcode ||
      !formData.toDate ||
      !formData.type
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const reqData = {
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      cn: formData.cn,
      itemgrpcode: formData.itemgrpcode,
      type: formData.type,
      centerId: centerId === 0 ? Number(filter) : Number(centerId),
    };
    // console.log(reqData);

    try {
      const res = await axiosInstance.get(`trn-check`, {
        params: { ...reqData },
      });
      setDataList(res.data?.dataList || []);
      setVoucherList(res.data?.voucherList || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("server error");
      setDataList([]);
      setVoucherList([]);
    }
  };

  return (
    <div className="trn-check-container w100 h1 d-flex-col sb p10">
      <span className="px10 heading">व्यवहार पडताळणी (TRN) :</span>
      <div className="trn-check-form-container w100 h30 d-flex-col sb bg-light-skyblue br9 p10">
        <div className="center-date-select-container w100 h30 d-flex a-center sb">
          <div className="centerwise-data-selection-div w45 d-flex a-center">
            {centerId > 0 ? (
              <></>
            ) : (
              <div className=" select-centers-div-trn w100 d-flex a-center sb">
                <span className="label-text w30">सेंटर निवडा :</span>
                <select
                  className="data w70 a-center"
                  name="center"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {centerList &&
                    [...centerList]
                      .sort((a, b) => a.center_id - b.center_id)
                      .map((center, index) => (
                        <option key={index} value={center.center_id}>
                          {center.marathi_name || center.center_name}
                        </option>
                      ))}
                </select>
              </div>
            )}
          </div>
          <div className="trn-check-dates-container w50 d-flex a-center sa">
            <div className="trn-cheks-dates-div w45 d-flex a-center sa">
              <span className="label-text w30">पासून :</span>
              <input
                className="data w70"
                type="date"
                value={formData.fromDate}
                onChange={(e) =>
                  setFormData({ ...formData, fromDate: e.target.value })
                }
              />
            </div>
            <div className="trn-cheks-dates-div w45 d-flex a-center sa">
              <span className="label-text w30">पर्यत :</span>
              <input
                className="data w70"
                type="date"
                value={formData.toDate}
                onChange={(e) =>
                  setFormData({ ...formData, toDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="selection-for-trncheck-container w100 h30 d-flex a-center sb">
          <div className="sale-purches-trn-check-div w20 d-flex sa">
            <div className="selection-div w50 d-flex a-center sa">
              <input
                className="w50 h80"
                type="radio"
                name="r1"
                value="1"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: parseInt(e.target.value),
                  })
                }
                checked={Number(formData.type) === 1}
              />
              <span className="label-text w50">विक्री</span>
            </div>
            <div className="selection-div w50 d-flex a-center sa">
              <input
                className="w50 h80"
                type="radio"
                name="r1"
                value="2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: parseInt(e.target.value),
                  })
                }
                checked={Number(formData.type) === 2}
              />
              <span className="label-text w50">खरेदी</span>
            </div>
          </div>
          <div className="pashukhandya-vibhag-trn-check-container w75 d-flex sa">
            <span className="f-heading w15 bg7 p10 br6">विभाग :</span>
            <div className="vibhag-trn-div w20 d-flex a-center sa">
              <input
                className="w50 h50"
                type="radio"
                name="r2"
                value="1"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    itemgrpcode: parseInt(e.target.value),
                  })
                }
                checked={formData.itemgrpcode === 1}
              />
              <span className="label-text w50">पशुखाद्य </span>
            </div>
            <div className="vibhag-trn-div w15 d-flex a-center sa">
              <input
                className="w50 h50"
                type="radio"
                name="r2"
                value="2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    itemgrpcode: parseInt(e.target.value),
                  })
                }
                checked={formData.itemgrpcode === 2}
              />
              <span className="label-text w50">औषधें</span>
            </div>
            <div className="vibhag-trn-div w15 d-flex a-center sa">
              <input
                className="w50 h50"
                type="radio"
                name="r2"
                value="3"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    itemgrpcode: parseInt(e.target.value),
                  })
                }
                checked={formData.itemgrpcode === 3}
              />
              <span className="label-text w50">किराणा</span>
            </div>
            <div className="vibhag-trns-div w30 d-flex a-center sa">
              <input
                className="w50 h50"
                type="radio"
                name="r2"
                value="4"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    itemgrpcode: parseInt(e.target.value),
                  })
                }
                checked={formData.itemgrpcode === 4}
              />
              <span className="label-text w50">साहित्य भांडार</span>
            </div>
          </div>
        </div>
        <div className="bill-header-button-container w100 d-flex h30 sb">
          <div className="selction-opt-div w50 d-flex sb">
            <div className="purches-trn-div w30 d-flex a-center sa">
              <input
                className="w40 h50"
                type="radio"
                name="r3"
                value={0}
                onChange={(e) =>
                  setFormData({ ...formData, cn: parseInt(e.target.value) })
                }
                checked={formData.cn === 0}
              />
              <span className="label-text w60">बिल </span>
            </div>
            <div className="purches-trn-div w30 se d-flex a-center">
              <input
                className="w40 h50"
                type="radio"
                name="r3"
                value={1}
                onChange={(e) =>
                  setFormData({ ...formData, cn: parseInt(e.target.value) })
                }
                checked={formData.cn === 1}
              />
              <span className="label-text w60">परत माल</span>
            </div>
            <div className="purches-trn-div w30 sa d-flex a-center">
              <input
                className="w40 h50"
                type="radio"
                name="r3"
                value={2}
                onChange={(e) =>
                  setFormData({ ...formData, cn: parseInt(e.target.value) })
                }
                checked={formData.cn === 2}
              />
              <span className="label-text w60">घट नाश</span>
            </div>
          </div>
          <button
            className="w15 btn"
            type="button"
            onClick={handelCheck}
            disabled={loading}
          >
            {loading ? "Loading..." : "Check"}
          </button>
        </div>
      </div>

      <div className="trncheck-tables-container w100 h50 d-flex sb">
        {/* BILL HEADER */}
        <div className="trn-check-bill-header-table-container w48 h1 mh100 hidescrollbar d-flex-col bg">
          <span className="label-text px10">खाद्य विक्री :</span>
          <div className="trn-check-table-heading-div w100 d-flex a-center t-center py10 sticky-top bg7 sb">
            <span className="f-label-text w10">ID</span>
            <span className="f-label-text w10">Recipt</span>
            <span className="f-label-text w20">Date</span>
            <span className="f-label-text w45">Cust Name</span>
            <span className="f-label-text w10">Amt</span>
          </div>

          {dataList.length > 0 ? (
            dataList.map((item, i) => (
              <div
                key={i}
                className="trn-check-table-heading-div w100 d-flex a-center p10 sb"
                style={{
                  backgroundColor: i % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="info-text w10">{i + 1}</span>
                <span className="info-text w10">
                  {item.ReceiptNo || item.receiptno}
                </span>
                <span className="info-text w20">
                  {
                    new Date(item.BillDate || item.purchasedate)
                      .toISOString()
                      .split("T")[0]
                  }
                </span>
                <span className="info-text w45">
                  {item.cust_name || item.dealerName}
                </span>
                <span className="info-text w10">
                  {Math.abs(item.Amount || item.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="box d-flex center">
              {loading ? "Loading..." : "Data not available!"}
            </div>
          )}
        </div>

        {/* BILL DETAILS */}
        <div className="trn-check-bill-details-table-container w48 h1 mh100 hidescrollbar d-flex-col bg">
          <span className="label-text px10">TRN बिल :</span>
          <div className="trn-check-table-heading-div w100 d-flex a-center t-center py10 sticky-top bg7 sb">
            <span className="f-label-text w10">ID</span>
            <span className="f-label-text w10">Recipt</span>
            <span className="f-label-text w20">Date</span>
            <span className="f-label-text w40">Cust Name</span>
            <span className="f-label-text w15">Amt</span>
          </div>

          {voucherList.length > 0 ? (
            voucherList.map((item, i) => (
              <div
                key={i}
                className="trn-check-table-heading-div  w100 d-flex a-center t-center py10 sb"
                style={{
                  backgroundColor: i % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="lable-text w10">{i + 1}</span>
                <span className="lable-text w10">{item.VoucherNo}</span>
                <span className="lable-text w20">
                  {new Date(item.VoucherDate).toISOString().split("T")[0]}
                </span>
                <span className="lable-text w40">{item.AccCode}</span>
                <span className="lable-text w15">
                  {Math.abs(item.Amt || item.amt)}
                </span>
              </div>
            ))
          ) : (
            <div className="box d-flex center">
              {loading ? "Loading..." : "Data not available!"}
            </div>
          )}
        </div>
      </div>

      <div className="total-differance-div w100 h10 d-flex a-center sb bg-light-green br9">
        <div className="fisrdt-table-total w40 d-flex a-center ">
          <label className="label-text w50 px10">Total Amt :</label>
          <input
            className="data w30"
            type="text"
            value={dataList.reduce(
              (sum, item) => sum + Math.abs(item.Amount || item.amount),
              0
            )}
            readOnly
          />
        </div>
        <div className="fisrdt-table-total w35 d-flex a-center ">
          <label className="label-text w50 px10">Total Amt :</label>
          <input
            className="data w30"
            type="text"
            value={voucherList.reduce(
              (sum, item) => sum + Math.abs(item.Amt || item.amt),
              0
            )}
            readOnly
          />
        </div>
        <div className="fisrdt-table-total w20 d-flex a-center">
          <label className="label-text w50">फरक :</label>
          <input
            className="data w50"
            type="text"
            value={
              dataList.reduce(
                (sum, item) => sum + Math.abs(item.Amount || item.amount),
                0
              ) -
              voucherList.reduce(
                (sum, item) => sum + Math.abs(item.Amt || item.amt),
                0
              )
            }
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default TrnCheck;
