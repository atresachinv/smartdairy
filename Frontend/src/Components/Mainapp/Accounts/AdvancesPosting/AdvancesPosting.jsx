import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
import "./AdvancePosting.css";
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getFinancialDate = () => {
  const today = new Date();
  const financialYearStart = new Date(today);
  financialYearStart.setMonth(3); // April is the 4th month (0-indexed)
  financialYearStart.setDate(1);
  return financialYearStart.toISOString().split("T")[0];
};
const AdvancesPosting = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fromDate: getFinancialDate(),
    toDate: getTodaysDate(),
    pDate: getTodaysDate(),
    interestRate: 0,
    GlCode: "",
    pGlCode: "",
    advanceAmount: 0,
    interestAmount: 0,
  });
  const [customerList, setCustomerList] = useState([]);
  const [filter, setFilter] = useState(0);
  const [settings, setSettings] = useState({});
   const centerList = useSelector((state) => state.center.centersList || []);
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );

  const autoCenter = useMemo(() => settings?.autoCenter, [settings]);

  // Set settings based on centerSetting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  // Dispatch actions to fetch data
  useEffect(() => {
    dispatch(listSubLedger());
    dispatch(listCustomer());
  }, [dispatch]);
  const storedCustomerList = localStorage.getItem("customerlist");
  const parsedCustomerList = JSON.parse(storedCustomerList);
  // Load customer list from local storage and filter based on centerId or filter
  useEffect(() => {
    if (storedCustomerList) {
      // Filter customer list based on centerId or filter
      const filteredCustomerList =
        centerId === 0
          ? parsedCustomerList.filter(
              (customer) => Number(customer.centerid) === Number(filter)
            )
          : parsedCustomerList.filter(
              (customer) => Number(customer.centerid) === Number(centerId)
            );
      setCustomerList(filteredCustomerList);
    }
  }, [centerId, filter]);

  return (
    <div className="w100 h1 m5 p5">
      <div className="d-flex  w100  sa  mobile-flex-column-advances-posting">
        <div className="  heading d-flex  center">
          अँडव्हान्स व्याज पोस्टिंग
        </div>
        {centerId > 0 ? null : (
          <div className="  select-center-div d-flex a-center mx10">
            <span className="info-text">सेंटर निवडा :</span>
            <select
              className="data w50 a-center my5 mx5"
              name="center"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setFormData({
                  ...formData,
                  GlCode: "",
                });
              }}
            >
              {centerList &&
                [...centerList]
                  .sort((a, b) => a.center_id - b.center_id)
                  .map((center, index) => (
                    <option key={index} value={center.center_id}>
                      {center.marathi_name}
                    </option>
                  ))}
            </select>
          </div>
        )}
      </div>
      <div className="d-flex w100 h90 sb mobile-flex-column-advances-posting">
        <div className="d-flex-col advanceposting-width m10 sa">
          <div className="d-flex-col w95 bg  p10">
            <div className="info-text w100 d-flex j-center">
              कॅल्क्युलेट व्याज
            </div>
            <div className="d-flex w100 px15 a-center">
              <label htmlFor="" className="info-text">
                खतावणी
              </label>
              <input
                type="text"
                className="data w10 mx10"
                value={formData.GlCode}
                onChange={(e) =>
                  setFormData({ ...formData, GlCode: e.target.value })
                }
              />
              <label htmlFor="" className="info-text ">
                {sledgerlist &&
                  sledgerlist.find(
                    (item) => Number(item.lno) === Number(formData.GlCode)
                  )?.marathi_name}
              </label>
            </div>
            <div className="d-flex w100 px15 my5 a-center">
              <label htmlFor="" className="info-text">
                दिनांक
              </label>
              <input
                type="date"
                className="data w30  mx10"
                value={formData.fromDate}
                onChange={(e) =>
                  setFormData({ ...formData, fromDate: e.target.value })
                }
              />
              <label htmlFor="" className="info-text ">
                ते
              </label>
              <input
                type="date"
                className="data w30  mx10"
                value={formData.toDate}
                onChange={(e) =>
                  setFormData({ ...formData, toDate: e.target.value })
                }
              />
              <button className="w-btn">यादी </button>
            </div>
            <div className="d-flex w100 px15   a-center">
              <label htmlFor="" className="info-text">
                व्याज दर
              </label>
              <input
                type="text"
                className="data w30  mx10"
                value={formData.interestRate}
                onChange={(e) =>
                  setFormData({ ...formData, interestRate: e.target.value })
                }
              />
            </div>
            <div className="d-flex w100 px15  my10 center">
              <button className="w-btn mx10">कॅल्क्युलेट</button>
            </div>
          </div>
          <div className="d-flex-col w95 bg my10  p10">
            <div className="info-text w100 d-flex j-center">व्याज पोस्टिंग</div>
            <div className="d-flex w100 px15 my10 a-center">
              <label htmlFor="" className="info-text">
                खतावणी
              </label>
              <input
                type="text"
                className="data w10 mx10 "
                value={formData.pGlCode}
                onChange={(e) =>
                  setFormData({ ...formData, pGlCode: e.target.value })
                }
              />
              <label htmlFor="" className="info-text ">
                {sledgerlist &&
                  sledgerlist.find(
                    (item) => Number(item.lno) === Number(formData.pGlCode)
                  )?.marathi_name}
              </label>
            </div>
            <div className="d-flex w100 px15 my5 a-center">
              <label htmlFor="" className="info-text">
                दिनांक
              </label>
              <input
                type="date"
                className="data w30  mx10"
                value={formData.pDate}
                onChange={(e) =>
                  setFormData({ ...formData, pDate: e.target.value })
                }
              />
            </div>

            <div className="d-flex w100 px15  my5 center">
              <button className="w-btn mx10">रिसेट</button>
              <button className="w-btn mx10">पोस्टिंग</button>
            </div>
          </div>
        </div>
        <div className="  bg advanceposting-width">
          <div className="d-flex w100 px15 my5 j-end">
            <button className="w-btn mx10">प्रिंट</button>
          </div>
          <table className="w100">
            <thead>
              <tr>
                <th>कोड</th>
                <th>नाव</th>
                <th>रक्कम</th>
                <th>व्याज</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>2</td>
                <td>2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdvancesPosting;
