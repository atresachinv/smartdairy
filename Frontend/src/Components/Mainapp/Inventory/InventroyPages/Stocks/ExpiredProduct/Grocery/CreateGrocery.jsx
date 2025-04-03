import { useEffect, useState } from "react";
import axiosInstance from "../../../../../../../App/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getAllProducts } from "../../../../../../../App/Features/Mainapp/Inventory/inventorySlice";
import { getProductSaleRates } from "../../../../../../../App/Features/Sales/salesSlice";
import "../../../../../../../Styles/Mainapp/Sales/Sales.css";

const CreateGrocery = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection", "puchasesale"]);
  const tDate = useSelector((state) => state.date.toDate);
  const salesRates = useSelector((state) => state.sales.salesRates);
  const productlist = useSelector(
    (state) => state.inventory.allProducts || [],
    shallowEqual
  );
  const [cartItem, setCartItem] = useState([]);
  const [date, setDate] = useState("");
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [selectitemcode, setSelectitemcode] = useState(0);
  const [amt, setAmt] = useState("");
  const [rctno, setRctno] = useState(
    localStorage.getItem("receiptnoexp2") || 1
  );
  const [groupItems, setGroupItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); //p--
  const [userRole, setUserRole] = useState(null);
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const [settings, setSettings] = useState({});

  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  //set user role
  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  //get all products and sale rate
  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getProductSaleRates(1));
  }, [dispatch]);

  // set today date
  useEffect(() => {
    setDate(getTodaysDate());
  }, []);

  // ----------------------------------------------------------------------------->
  // find rate and amount for perticular item ----------------------------------->
  useEffect(() => {
    if (selectitemcode) {
      const salesrate = salesRates.find(
        (rate) => rate.itemcode.toString() === selectitemcode.toString()
      );
      if (salesrate) {
        setRate(salesrate.salerate);
        setAmt(salesrate.salerate * qty);
      }
    }
  }, [selectitemcode, qty]);
  //set amount
  useEffect(() => {
    if (rate) {
      setAmt(rate * qty);
    }
  }, [qty, rate]);

  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleAddToCart = () => {
    if (!selectitemcode) {
      toast.error("Please select a product!");
      return;
    }

    const selectedItem = productlist.find(
      (item) => item.ItemCode === selectitemcode
    );

    if (!selectedItem) {
      toast.error("Invalid product selected!");
      return;
    }

    if (Number(selectitemcode) > 0 && Number(qty) > 0 && Number(rate) > 0) {
      const newCartItem = {
        ReceiptNo: rctno,
        ItemCode: selectedItem.ItemCode,
        ItemName: selectedItem.ItemName,
        BillDate: `${date} 00:00:00`,
        Qty: Number(qty),
        ItemGroupCode: 3,
        Rate: Number(rate),
        Amount: Number(qty) * Number(rate),
        cn: 2,
        center_id: centerId,
      };

      setCartItem((prev) => [...prev, newCartItem]);

      // Reset fields
      setQty(1);
      setRate("");
      setAmt(0); // Set amount to 0 instead of an empty string
      setSelectitemcode("");
    } else {
      toast.error("All fields are required");
    }
  };

  //handle delete
  const handleDeleteItem = async (ItemCode) => {
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
      const updatedCart = cartItem.filter((item, index) => index !== ItemCode);
      setCartItem(updatedCart);
    }
  };
  //reset the field
  const handelClear = () => {
    // setFcode("");
    setCartItem([]);
    setQty(1);
    setRate(0);
    setAmt(0);
    setSelectitemcode(0);
  };

  //handle to save server
  const handleSubmit = async () => {
    if (cartItem.length === 0) {
      toast.warn("Cart is empty!");
      return;
    }

    try {
      const res = await axiosInstance.post("/sale/create", cartItem);

      if (res?.data?.success) {
        handelClear();
        const newReceiptNo = parseInt(rctno) + 1;
        setRctno(newReceiptNo);
        localStorage.setItem("receiptnoexp2", newReceiptNo);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Submission failed!");
      }
    } catch (error) {
      toast.error("Error submitting to server");
    }
  };

  // Filter out items that are already in the cart --------------------------------->
  const handleItemstoShow = () => {
    const items = productlist.filter((item) => item.ItemGroupCode === 3);
    setGroupItems(items);
    const itemsNotInCart = groupItems.filter(
      (item) => !cartItem.some((cart) => cart.ItemCode === item.ItemCode)
    );
    setFilteredItems(itemsNotInCart);
  };
  useEffect(() => {
    handleItemstoShow();
  }, [productlist, cartItem]);

  // Select all the text when input is focused ------------------------------------->
  const handleFocus = (e) => {
    e.target.select();
  };

  // Handle Enter key press to move to the next field ---------------------------------->
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };

  return (
    <div className="add-cattlefeed-sale-container w100 h1 d-flex-col sa">
      <span className="heading p10">{t("c-grocery")}</span>
      <div className="create-cattlefeed-sales-inner-container w100 h1 d-flex sb p10">
        <form
          className="create-sales-form-container w50  bg p10"
          style={{ height: "fit-content" }}
        >
          <div className="sales-details w100  d-flex a-center sb ">
            <div className="col w50 d-flex a-center ">
              <label htmlFor="date" className="info-text w100">
                {t("c-date")} :
              </label>
              <input
                type="date"
                className="data w100"
                name="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={tDate}
              />
            </div>
            <div className="col w30 d-flex a-center">
              <label htmlFor="recieptno" className="info-text w100">
                {t("c-repno")}
              </label>
              <input
                type="number"
                name="number"
                id="recieptno"
                onFocus={handleFocus}
                value={rctno}
                className="data w100"
                onChange={(e) => setRctno(e.target.value.replace(/\D/, ""))}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("code"))
                }
                min="0"
              />
            </div>
          </div>
          <div className="sales-details w100  d-flex a-center sb ">
            <div className="col w80">
              <label htmlFor="items" className="info-text w100">
                {t("c-groce-select")}:
              </label>

              <select
                id="items"
                value={selectitemcode}
                className="data w100"
                onChange={(e) => setSelectitemcode(parseInt(e.target.value))}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("qty"))
                }
              >
                <option value="0">-- {t("c-groce-select")}: --</option>
                {filteredItems.map((item, i) => (
                  <option key={i} value={item.ItemCode}>
                    {item.ItemName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col w20">
              <label htmlFor="qty" className="info-text w100">
                {t("c-qty")}:
              </label>
              <input
                disabled={!selectitemcode}
                type="number"
                id="qty"
                value={qty}
                onFocus={handleFocus}
                className="data w100"
                name="qty"
                min="1"
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("rate"))
                }
              />
            </div>
          </div>
          <div className="sales-details w100  d-flex ">
            <div className="col w30 ">
              <label htmlFor="rate" className="info-text w100">
                {t("c-rate")}:
              </label>
              <input
                type="number"
                name="rate"
                id="rate"
                className="data w70"
                value={rate || ""}
                onFocus={handleFocus}
                onChange={(e) =>
                  setRate(Math.max(0, parseFloat(e.target.value)))
                }
                min="0"
                disabled={!selectitemcode}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("addtocart"))
                }
              />
            </div>
            <div className="col w30">
              <label htmlFor="amt" className="info-text w100">
                {t("c-amt")}:
              </label>
              <input
                type="number"
                id="amt"
                className="data w70"
                name="amount"
                value={amt}
                readOnly
              />
            </div>
          </div>

          <div className="sales-btn-container w100  d-flex j-end my10">
            <button
              type="button"
              className="btn m10"
              id="addtocart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </form>

        <div className="cattlefeed-sales-list-outer-container w45 h1 d-flex-col bg">
          <div className="title-and-button-container w100 d-flex a-center sb">
            <span className="heading w30 p10">
              {" "}
              {t("puchasesale:ps-InvoiceDetails")}
            </span>
          </div>
          <div className="sales-list-conatainer w100 h1 d-flex-col">
            <div className="sales-headings-row w100 h10 d-flex sb a-center t-center sticky-top t-heading-bg">
              <span className="f-label-text w5">{t("c-no")}</span>
              <span className="f-label-text w35">{t("c-name")}</span>
              <span className="f-label-text w10">{t("c-qty")}</span>
              <span className="f-label-text w10">{t("c-rate")}</span>
              <span className="f-label-text w10">{t("c-amt")}</span>
            </div>
            {cartItem.length > 0 ? (
              <>
                {cartItem.map((item, i) => (
                  <div
                    key={i}
                    className="sales-headings-row w100 h10 d-flex a-center sb"
                  >
                    <span className="label-text w10 t-center">{i + 1}</span>
                    <span className="label-text w40 t-start">
                      {item.ItemName}
                    </span>
                    <span className="label-text w10 t-center">{item.Qty}</span>
                    <span className="label-text w10 t-end">{item.Rate}</span>
                    <span className="label-text w10 t-end">{item.Amount}</span>
                    {userRole !== "mobilecollector" ? (
                      <span className="label-text w20 t-center">
                        <MdDeleteOutline
                          size={20}
                          className="table-icon"
                          style={{ color: "red" }}
                          onClick={() => handleDeleteItem(i)}
                        />
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </div>
                ))}
                <div className="sales-total-headings-row w100 h10 d-flex a-center sb">
                  <span className=" w5"></span>
                  <span className=" w35"></span>
                  <span className=" w10"></span>
                  <span className="label-text w10">
                    {t("puchasesale:ps-ttl-amt")} :
                  </span>
                  <span className="label-text w10 t-end">
                    {cartItem.reduce((acc, item) => acc + item.Amount, 0)}
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
            <button type="button" className="w-btn m10" onClick={handelClear}>
              {t("puchasesale:ps-clr")}
            </button>
            <button
              type="button"
              className="w-btn mx10"
              onClick={handleSubmit}
              disabled={cartItem.length == 0}
            >
              {t("milkcollection:m-btn-save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGrocery;
