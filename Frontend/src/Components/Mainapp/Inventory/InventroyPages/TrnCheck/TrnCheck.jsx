import { useEffect, useMemo, useState } from "react";
import "../../../../../Styles/Trn-check/Trncheck.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../App/axiosInstance";

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
  });`  `
  const centerList = useSelector(
    (state) => state.center.centersList || []
  );
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
    <div className="Trncheck-container w100 h1 d-flex-col  ">
      <span className="px10 heading">TRN Check</span>
      <div className="trn-first-half-div w100 h40 d-flex-col  sa ">
        <div className="centerwise-data-selection-div w100 d-flex a-center h15">
          {centerId > 0 ? (
            <></>
          ) : (
            <div className=" select-centers-div-trn flex a-center w100 mx10">
              <span className="info-text">सेंटर निवडा :</span>
              <select
                className="data w30 a-center  my5 mx5"
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
        <div className="from-to-date-andradio-button w100 h50 d-flex">
          <div className="from-to-date-trn-date w50 d-flex h1  ">
            <div className="from-to-datetrn-check w70 d-flex-col sa   ">
              <div className="from-date-trn-cheks-div w100 d-flex a-center">
                <span className="px10 label-text w30">पासून</span>
                <input
                  className="data w40"
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) =>
                    setFormData({ ...formData, fromDate: e.target.value })
                  }
                />
              </div>
              <div className="To-date-trn-cheks-div w100 d-flex a-center">
                <span className="px10 label-text w30">पर्येंत </span>
                <input
                  className="data w40"
                  type="date"
                  value={formData.toDate}
                  onChange={(e) =>
                    setFormData({ ...formData, toDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="sale-and-purches-trn-div w30 d-flex-col sa   ">
              <div className="saleing-trn-div w70  d-flex se">
                <input
                  className="w10"
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
                <span className="label-text">विक्री</span>
              </div>
              <div className="purches-trn-div w70 se  d-flex">
                <input
                  className="w10"
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
                <span className="label-text">खरेदी</span>
              </div>
            </div>
          </div>
          <div className="pashukhandya-radio-btn-trn-div w50 d-flex a-center sa   ">
            <div className="first-radio-and-span-inputbtn w50 d-flex-col a-center sa ">
              <div className="saleing-trn-div w100 a-center  d-flex se">
                <input
                  className="w10"
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
                <span className="label-text  ">पशुखाद्य </span>
              </div>
              <div className="purches-trn-div w100 se a-center  d-flex">
                <input
                  className="w10"
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
                <span className="label-text w20">औषधें</span>
              </div>
              <div className="purches-trn-div w100 se  d-flex a-center">
                <input
                  className="w10"
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
                <span className="label-text w20">किराणा</span>
              </div>
              <div className="purches-trn-div w100 se  d-flex a-center">
                <input
                  className="w10"
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
                <span className="label-text w20">साहित्य भांडार</span>
              </div>
            </div>
            <div className="radio-buttons-second-div w50 d-flex-col ">
              <div className="purches-trn-div w100 se d-flex a-center">
                <input
                  className="w10"
                  type="radio"
                  name="r3"
                  value={0}
                  onChange={(e) =>
                    setFormData({ ...formData, cn: parseInt(e.target.value) })
                  }
                  checked={formData.cn === 0}
                />
                <span className="label-text w30">बिल </span>
              </div>
              <div className="purches-trn-div w100 se d-flex a-center">
                <input
                  className="w10"
                  type="radio"
                  name="r3"
                  value={1}
                  onChange={(e) =>
                    setFormData({ ...formData, cn: parseInt(e.target.value) })
                  }
                  checked={formData.cn === 1}
                />
                <span className="label-text w30">परत माल</span>
              </div>
              <div className="purches-trn-div w100 se d-flex a-center">
                <input
                  className="w10"
                  type="radio"
                  name="r3"
                  value={2}
                  onChange={(e) =>
                    setFormData({ ...formData, cn: parseInt(e.target.value) })
                  }
                  checked={formData.cn === 2}
                />
                <span className="label-text w30">घट नाश</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bill-header-bill-details w100 d-flex h20">
          <div className="button-cheks-trn w10 d-flex px10">
            <button
              className="w-btn"
              type="button"
              onClick={handelCheck}
              disabled={loading}
            >
              {loading ? "Loading..." : "Check"}
            </button>
          </div>
        </div>
      </div>

      <div className="Trn-table-container w100 d-flex h50 sa">
        {/* BILL HEADER */}
        <div className="first-table-trndiv w45 h1 d-flex-col bg3">
          <span className="">BILL HEADER</span>
          <div className="table-heading-trn w100 d-flex sa">
            <span className="label-text w10">ID</span>
            <span className="label-text w20">Recipt</span>
            <span className="label-text w20">Date</span>
            <span className="label-text w20">Cust Name</span>
            <span className="label-text w10">Amt</span>
          </div>

          <div className="first-table-scroll-area">
            {dataList.length > 0 ? (
              dataList.map((item, i) => (
                <div key={i} className="trn-first-table-data w100 d-flex sa">
                  <span className="lable-text w10">{i + 1}</span>
                  <span className="lable-text w10">
                    {item.ReceiptNo || item.receiptno}
                  </span>
                  <span className="lable-text w20">
                    {
                      new Date(item.BillDate || item.purchasedate)
                        .toISOString()
                        .split("T")[0]
                    }
                  </span>
                  <span className="lable-text w30">
                    {item.cust_name || item.dealerName}
                  </span>
                  <span className="lable-text w10">
                    {Math.abs(item.Amount || item.amount)}
                  </span>
                </div>
              ))
            ) : (
              <>{loading ? "Loading..." : "No Data"}</>
            )}
          </div>
        </div>

        {/* BILL DETAILS */}
        <div className="second-table-trndiv w45 h1 d-flex-col bg3">
          <span className="">BILL DETAILS</span>
          <div className="second-table-heading-trn w100 d-flex sa">
            <span className="label-text w10">ID</span>
            <span className="label-text w20">Recipt</span>

            <span className="label-text w20">Date</span>
            <span className="label-text w20">Cust Name</span>

            <span className="label-text w10">Amt</span>
          </div>

          <div className="second-table-scroll-area">
            {voucherList.length > 0 ? (
              voucherList.map((item, i) => (
                <div key={i} className="trn-second-table-data w100 d-flex sa">
                  <span className="lable-text w10">{i + 1}</span>
                  <span className="lable-text w10">{item.VoucherNo}</span>
                  <span className="lable-text w20">
                    {new Date(item.VoucherDate).toISOString().split("T")[0]}
                  </span>
                  <span className="lable-text w10">{item.AccCode}</span>
                  <span className="lable-text w10">
                    {Math.abs(item.Amt || item.amt)}
                  </span>
                </div>
              ))
            ) : (
              <>{loading ? "Loading..." : "No data"}</>
            )}
          </div>
        </div>
      </div>

      <div className="Total-anddifferance-div w100 h10 d-flex">
        <div className="fisrdt-table-total w50 d-flex a-center ">
          <span className="label-text w30 px10">TotalAmt</span>
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
        <div className="fisrdt-table-total w30 d-flex a-center ">
          <span className="label-text w30">TotalAmt</span>

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
        <div className="deffrance-price-div w20 d-flex a-center">
          <span className="label-text w30">फारक</span>
          <input
            className="data w40"
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
