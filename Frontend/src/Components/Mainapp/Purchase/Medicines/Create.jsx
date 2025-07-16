import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../../../App/axiosInstance";
import "../../../../Styles/Mainapp/Purchase/Purchase.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "../../../../Styles/Mainapp/Purchase/Purchase.css";
import { useSelector } from "react-redux";
const Create = () => {
  const { t } = useTranslation(["puchasesale", "milkcollection", "common"]);
  const [cartItem, setCartItem] = useState([]);
  const [cname, setCname] = useState("");
  const [fcode, setFcode] = useState("");
  const [date, setDate] = useState("");
  const [itemList, setItemList] = useState([]);
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [selectitemcode, setSelectitemcode] = useState(0);
  const [amt, setAmt] = useState(0);
  const [rctno, setRctno] = useState(
    localStorage.getItem("receiptpurno2") || 1
  );
  const [dealerList, setDealerList] = useState([]);
  // const [billNo, setBillNo] = useState("9112");
  const [sellrate, setSellrate] = useState(0);
  const [errors, setErrors] = useState({});
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const [filter, setFilter] = useState(0);
  const centerList = useSelector(
    (state) => state.center.centersList || []
  );
  const [userRole, setUserRole] = useState(null);

  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const [settings, setSettings] = useState({});
  const autoCenter = settings?.autoCenter;

  //set user role
  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);
  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  // Fetch all items from API GRP wise
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/item/all?ItemGroupCode=2&autoCenter=${autoCenter}`
        );
        setItemList(data.itemsData || []);
      } catch (error) {
        toast.error("Failed to fetch items. Please try again.");
      }
    };
    if (settings?.autoCenter !== undefined) {
      fetchAllItems();
    }
  }, [settings, autoCenter]);

  // Fetch all dealer from API
  useEffect(() => {
    const fetchDealerList = async () => {
      try {
        const response = await axiosInstance.post(
          `/dealer?autoCenter=${autoCenter}`
        );
        let customers = response?.data?.customerList || [];
        customers.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
        setDealerList(customers);
      } catch (error) {
        toast.error("Failed to fetch Dealer. Please try again.");
      }
    };
    if (settings?.autoCenter !== undefined) {
      fetchDealerList();
    }
  }, [settings, autoCenter]);

  // Set today's date
  useEffect(() => {
    setDate(getTodaysDate());
  }, []);

  // Set customer name on the dealer code
  useEffect(() => {
    if (fcode) {
      const dealer = dealerList.find(
        (customer) => customer.srno === parseInt(fcode)
      );
      if (dealer) {
        setCname(dealer.cname);
      } else {
        setCname(""); // Reset if code doesn't match
      }
    } else {
      setCname("");
    }
  }, [fcode, dealerList]);

  // Set dealer code on the dealer name
  useEffect(() => {
    if (cname) {
      const dealer = dealerList.find((customer) => customer.cname === cname);
      if (dealer) {
        setFcode(dealer.srno.toString());
      } else {
        setFcode(""); // Reset if name doesn't match
      }
    }
  }, [cname, dealerList]);

  // Update the amount whenever rate or quantity changes
  useEffect(() => {
    setAmt(rate * qty);
  }, [rate, qty]);

  // Function to get the current date
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const validateForm = () => {
    const newErrors = {};

    if (!date) newErrors.date = "date is required";
    if (!rctno) newErrors.rctno = "Receipt No is required";
    if (!fcode) newErrors.fcode = "Dealer code is required";
    if (!cname) newErrors.cname = "Dealer name is required";
    if (!selectitemcode) newErrors.selectitemcode = "Item is required";
    if (qty <= 0) newErrors.qty = "Quantity must be greater than 0";
    if (rate <= 0) newErrors.rate = "Rate must be greater than 0";
    if (sellrate < rate)
      newErrors.sellrate = "Sale rate must be greater than Purchase Rate";
    return newErrors;
  };

  // Add item to the cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      if (selectitemcode > 0 && qty > 0 && rate > 0) {
        const selectedItem = itemList.find(
          (item) => item.id === selectitemcode
        );
        const newCartItem = {
          receiptno: rctno, // Receipt No
          dealerCode: fcode,
          dealerName: cname,
          // billno: billNo,
          itemcode: selectedItem?.id,
          itemname: selectedItem?.ItemName,
          purchasedate: date + " 00:00:00",
          qty: qty,
          itemgroupcode: 2, // update Itemgroupcode
          rate: rate,
          amount: qty * rate,
          salerate: parseInt(sellrate),
          cn: 0,
          center_id: !autoCenter
            ? centerId === 0
              ? filter
              : centerId
            : centerId,
        };

        // Update the cart items
        setCartItem((prev) => [...prev, newCartItem]);

        // Reset input values
        setQty(1);
        setRate(0);
        setAmt(0);
        setSelectitemcode(0);
        setSellrate(0);
      } else {
        toast.error("Please select item and enter quantity and rate");
      }
    }
  };

  // Generate a new bill number using the current timestamp
  // useEffect(() => {
  //   const generateBillNo = () => {
  //     const timestamp = Date.now();
  //     setBillNo(`9${timestamp}`);
  //   };
  //   generateBillNo();
  // }, [rctno]);

  // Delete an item from the cart
  const handleDeleteItem = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const updatedCart = cartItem.filter((item, index) => index !== id);
      setCartItem(updatedCart);
    }
  };

  // Clear all form fields and the cart
  const handelClear = () => {
    setFcode("");
    setCartItem([]);
    setQty(1);
    setRate(0);
    setAmt(0);
    setSelectitemcode(0);
    setSellrate(0);
    setErrors([]);
  };

  // Handle form submission and send cart data to the server
  const handleSubmit = async () => {
    if (cartItem.length > 0) {
      try {
        const res = await axiosInstance.post("/purchase/new", cartItem);
        if (res?.data?.success) {
          handelClear();
          setRctno(parseInt(rctno) + 1);
          toast.success(res.data.message);
          localStorage.setItem("receiptpurno2", parseInt(rctno) + 1);
        }
      } catch (error) {
        console.error("Error Submitting items:", error);
        toast.error("Submitting items Error");
      }

      // console.log("Submit data: ", cartItem);
    } else {
      toast.error("Please add items to the cart.");
    }
  };
  const handleFocus = (e) => {
    e.target.select();
  };

  // Handle Enter key press to move to the next field
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };

  // Filter out items that are already in the cart
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const itemsNotInCart = itemList.filter(
      (item) => !cartItem.some((cart) => cart.itemcode === item.ItemCode)
    );
    setFilteredItems(itemsNotInCart);
  }, [itemList, cartItem]);

  // Handle center change
  const handleCenterChange = (value) => {
    setFilter(value);
    setFcode("");
    setCname("");
    setSelectitemcode(0);
    setQty(1);
    setRate("");
    setAmt("");
    setCartItem([]);
  };

  return (
    <div className="purchase-products-container w100 h1 d-flex-col sb p10">
      <div className="page-title-center-select-container w100 h15 d-flex a-center">
        <span className="heading w20 px10"> {t("ps-nv-add-medicines")}</span>
        {userRole === "admin" ? (
          centerId > 0 ? (
            <></>
          ) : (
            <div className="center-selection-container w48 d-flex a-center sb">
              <span className="label-text w50">सेंटर निवडा :</span>
              <select
                className="data   a-center  my5 mx5"
                name="center"
                value={filter}
                onChange={(e) => handleCenterChange(e.target.value)}
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
          )
        ) : (
          <></>
        )}
      </div>
      <div className="purchase-new-prod-container w100 h90 d-flex sb">
        <form className="purchase-new-prod-form-container w50 h1 bg p10">
          <div className="purchase-details-container w100 h20 d-flex a-center sb">
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10"> {t("ps-date")}:</label>
              <input
                type="date"
                id="date"
                className={`data ${errors.date ? "input-error" : ""}`}
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={date}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("rctno"))
                }
              />
            </div>
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10">{t("ps-rect-no")}:</label>
              <input
                type="number"
                id="rctno"
                name="number"
                value={rctno}
                onFocus={handleFocus}
                className={`data ${errors.rctno ? "input-error" : ""}`}
                onChange={(e) => setRctno(e.target.value.replace(/\D/, ""))}
                min="0"
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("fcode"))
                }
              />
            </div>
          </div>
          <div className="purchase-details-container w100 h20 d-flex a-center sb">
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10">{t("ps-dealer-no")}:</label>
              <input
                type="number"
                id="fcode"
                name="code"
                className={`data ${errors.fcode ? "input-error" : ""}`}
                value={fcode}
                onChange={(e) => setFcode(e.target.value.replace(/\D/, ""))}
                min="0"
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("cname"))
                }
              />
            </div>
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10">{t("ps-dealer-name")}:</label>
              <select
                id="cname"
                value={cname}
                className={`data ${errors.cname ? "input-error" : ""}`}
                onChange={(e) => setCname(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("selectitemcode"))
                }
              >
                <option value="">Select Dealer</option>
                {dealerList &&
                  dealerList.map((item, i) => (
                    <option key={i} value={item.cname}>
                      {item.cname}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="purchase-details-container w100 h20 d-flex a-center sb">
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10">Select Items:</label>
              <select
                id="selectitemcode"
                disabled={!cname}
                value={selectitemcode}
                className={`data ${errors.selectitemcode ? "input-error" : ""}`}
                onChange={(e) => setSelectitemcode(parseInt(e.target.value))}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("qty"))
                }
              >
                <option value="0">Select Item</option>
                {itemList.length > 0 &&
                  filteredItems.map((item, i) => (
                    <option key={i} value={item.id}>
                      {item.ItemName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10"> {t("ps-qty")}:</label>
              <input
                id="qty"
                disabled={!selectitemcode}
                type="number"
                value={qty}
                className={`data ${errors.qty ? "input-error" : ""}`}
                name="qty"
                min="1"
                onFocus={handleFocus}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("rate"))
                }
              />
            </div>
          </div>
          <div className="purchase-details-container w100 h20 d-flex a-center sb">
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10">{t("खरेदी दर ")}:</label>
              <input
                id="rate"
                type="number"
                name="rate"
                className={`data ${errors.rate ? "input-error" : ""}`}
                value={rate}
                onFocus={handleFocus}
                onChange={(e) =>
                  setRate(Math.max(0, parseFloat(e.target.value)))
                }
                min="0"
                disabled={!selectitemcode}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("sellrate"))
                }
              />
            </div>
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10">{t("ps-sale-rate")}:</label>
              <input
                id="sellrate"
                type="number"
                name="salerate"
                onFocus={handleFocus}
                className={`data ${errors.sellrate ? "input-error" : ""}`}
                value={sellrate}
                onChange={(e) => setSellrate(e.target.value)}
                disabled={!selectitemcode}
              />
            </div>
          </div>
          <div className="purchase-details-container w100 h20 d-flex a-center sb">
            <div className="purchase-input-container w48 d-flex-col sb">
              <label className="info-text px10">{t("ps-amt")}:</label>
              <input
                id="amt"
                type="number"
                className={`data ${errors.amt ? "input-error" : ""}`}
                name="amount"
                value={amt}
                readOnly
              />
            </div>
            <div className="button-container w48 h1 d-flex a-center j-end">
              <button
                className="w50 btn"
                style={{ marginTop: "auto" }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </form>
        <div className="purchased-products-list-outer-container w48 h1 d-flex-col bg">
          <span className="heading w50 p10">{t("ps-pur-list")} :</span>
          <div className="purchased-products-list-conatainer w100 h90 mh90 hidescrollbar d-flex-col">
            <div className="purchased-products-data-div w100 py10 d-flex a-center t-center sticky-top bg7 sb">
              <span className="f-label-text w10"> {t("ps-srNo")}</span>
              <span className="f-label-text w40">{t("ps-itm-name")}</span>
              <span className="f-label-text w10"> {t("ps-qty")}</span>
              <span className="f-label-text w10"> {t("ps-rate")}</span>
              <span className="f-label-text w10"> {t("ps-amt")}</span>
              <span className="f-label-text w15 t-center">Action</span>
            </div>
            {cartItem.length > 0 ? (
              <>
                {cartItem.map((item, i) => (
                  <div
                    key={i}
                    className="purchased-products-data-div w100 p10 d-flex a-center sb"
                    style={{
                      backgroundColor: i % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    <span className="label-text w10 t-center">{i + 1}</span>
                    <span className="label-text w40 t-start">
                      {item.itemname}
                    </span>
                    <span className="label-text w10 t-center">{item.qty}</span>
                    <span className="label-text w10 t-end">{item.rate}</span>
                    <span className="label-text w10 t-end">{item.amount}</span>
                    <span className="label-text w15 t-center">
                      <MdDeleteOutline
                        size={20}
                        className="table-icon"
                        style={{ color: "red" }}
                        onClick={() => handleDeleteItem(i)}
                      />
                    </span>
                  </div>
                ))}
                <div className="sales-total-headings-row w100 h10 d-flex a-center sb">
                  <span className=" w10"></span>
                  <span className=" w40"></span>
                  <span className=" w10"></span>
                  <span className="label-text w10"> {t("ps-ttl-amt")} </span>
                  <span className="label-text w10 t-end">
                    {cartItem.reduce((acc, item) => acc + item.amount, 0)}
                  </span>
                  <span className=" w20"></span>
                </div>
              </>
            ) : (
              <div className="box d-flex center">
                <span className="label-text">{t("common:c-no-data-avai")}</span>
              </div>
            )}
          </div>
          <div className="sales-button-container w100 h10 d-flex a-center j-end">
            <button className="w-btn m10" onClick={handelClear}>
              {t("ps-clr")}
            </button>
            <button
              className="w-btn mx10"
              onClick={handleSubmit}
              disabled={cartItem.length == 0}
            >
              {t("ps-smt")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
