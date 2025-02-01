import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../App/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {toast} from "react-toastify"
import { getAllProducts } from "../../../../App/Features/Mainapp/Inventory/inventorySlice";
import "../../../../Styles/Mainapp/Sales/Sales.css";

const CreateCattleFeed = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const [cartItem, setCartItem] = useState([]);
  const [cname, setCname] = useState("");
  const [fcode, setFcode] = useState("");
  const [date, setDate] = useState("");
  const [itemList, setItemList] = useState([]);
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState("");
  const [selectitemcode, setSelectitemcode] = useState(0);
  const [amt, setAmt] = useState("");
  const [rctno, setRctno] = useState(localStorage.getItem("receiptno") || 1);
  const customerslist = useSelector((state) => state.customer.customerlist);
  const productlist = useSelector((state) => state.inventory.allProducts || []);
  const [userid, setUserid] = useState("");
  const [billNo, setBillNo] = useState("9112");

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  useEffect(() => {
    setDate(getTodaysDate());
  }, []);

  useEffect(() => {
    if (customerslist.length > 0) {
      const customer = customerslist.find(
        (customer) => customer.srno === parseInt(fcode)
      );
      setCname(customer?.cname || "");
      setUserid(customer?.rno || "");
      // console.log(customer);
    } else {
      setCname("");
    }
  }, [fcode, customerslist]);

  useEffect(() => {
    setAmt(rate * qty);
  }, [rate, qty]);

  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleAddToCart = () => {
    if (selectitemcode > 0 && qty > 0 && rate > 0) {
      const selectedItem = productlist.find(
        (item) => item.ItemCode === selectitemcode
      );
      const newCartItem = {
        ReceiptNo: rctno,
        BillNo: billNo,
        ItemCode: selectedItem?.ItemCode,
        ItemName: selectedItem?.ItemName,
        BillDate: date + " 00:00:00",
        Qty: qty,
        CustCode: fcode,
        ItemGroupCode: 1,
        Rate: rate,
        Amount: qty * rate,
      };

      // Update the cart items and log the updated array
      setCartItem((prev) => {
        const updatedCart = [...prev, newCartItem];
        return updatedCart;
      });

      // Reset the input values
      setQty(1);
      setRate("");
      setAmt("");
      setSelectitemcode(""); // Reset amount to 0 after clearing rate and quantity
    }
  };

  useEffect(() => {
    const generateBillNo = () => {
      const timestamp = Date.now(); // Unique value based on current time
      console.log(timestamp);
      setBillNo(`9${timestamp}`);
    };
    generateBillNo();
  }, []);

  const handleDeleteItem = (id) => {
    if (confirm("Are you sure you want to Delete?")) {
      const updatedCart = cartItem.filter((item, index) => index !== id);
      setCartItem(updatedCart);
    }
  };

  const handelClear = () => {
    setFcode("");
    setCartItem([]);
    setQty(1);
    setRate(0);
    setAmt(0);
    setSelectitemcode(0);
  };

  const handleSubmit = async () => {
    if (cartItem.length > 0) {
      try {
        const res = await axiosInstance.post("/sale/create", cartItem);
        if (res?.data?.success) {
          setFcode("");
          setCartItem([]);
          setQty(1);
          setRate(0);
          setAmt(0);
          setRctno(parseInt(rctno) + 1);
          setSelectitemcode(0);
          alert(res.data.message);
          const timestamp = Date.now();
          setBillNo(`9${timestamp}`);
          localStorage.setItem("receiptno", parseInt(rctno) + 1);
        }
      } catch (error) {
        console.error("Error Submitting items:", error);
      }
    }
  };

  // Set customer code (fcode) based on cname
  useEffect(() => {
    if (cname && customerslist.length > 0) {
      const custname = customerslist.find((item) => item.cname === cname);
      if (custname) {
        setFcode(custname.srno ?? "");
      } else {
        setFcode("");
      }
    } else {
      setFcode("");
    }
  }, [cname, customerslist]);

  const handlePrint = () => {
    if (cartItem.length === 0) {
      toast.error("You don't have Item's to Print , please add products!");
      return;
    }
    const printWindow = window.open("", "_blank");
    const printContent = document.getElementById("print-section").innerHTML;
    console.log(printContent);

    if (printWindow) {
      printWindow.document.write(
        `
    <html>
      <head>
        <title>Print</title>
        <style>
          #print-section { width: 100%; display: flex; flex-direction: row; justify-content: space-between; gap: 1cm; padding: 1cm; }
          .invoice { width: 48%; border: 1px solid black; padding: 1cm; box-sizing: border-box; }
          .invoice-table { width: 100%; border-collapse: collapse; }
          .invoice-table th, .invoice-table td { border: 1px solid black; padding: 5px; text-align: left; word-wrap: break-word; }
          body { font-size: 12px; }
        </style>
      </head>
      <body>
        <div id="print-section">${printContent}</div>
      </body>
    </html>
    `
      );
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      alert("Failed to open print window. Check pop-up settings.");
    }
  };

  // Select all the text when input is focused
  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="add-sale-container w100 h1 d-flex sa">
      <div className="create-sales-outer-container w50 h90 d-flex-col p10 bg">
        <span className="heading p10">Create Cattle Feed</span>
        <div className="create-sales-form-container w100 h80 d-flex-col ">
          <div className="sales-details w100 h20 d-flex a-center sb ">
            <div className="col w50 d-flex a-center ">
              <label htmlFor="date" className="info-text w100">
                Date :
              </label>
              <input
                type="date"
                className="data w100"
                name="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={date}
              />
            </div>
            <div className="col w30 d-flex a-center">
              <label htmlFor="recieptno" className="info-text w100">
                Receipt No :
              </label>
              <input
                type="number"
                name="number"
                id="recieptno"
                value={rctno}
                className="data w100"
                onChange={(e) => setRctno(e.target.value.replace(/\D/, ""))}
                min="0"
              />
            </div>
          </div>
          <div className="sale-details w100 h20 d-flex a-center sb ">
            <div className="col w20 ">
              <label htmlFor="code" className="info-text w100">
                Code:
              </label>
              <input
                type="number"
                name="code"
                id="code"
                className="data w100"
                value={fcode}
                onChange={(e) => setFcode(e.target.value)}
                min="0"
              />
            </div>
            <div className="col w80">
              <label htmlFor="custname" className="info-text w100">
                Customer Name:
              </label>
              <input
                type="text"
                name="fname"
                id="custname"
                list="farmer-list"
                className="data w100"
                value={cname}
                onChange={(e) => setCname(e.target.value)}
                onFocus={handleFocus}
              />
              <datalist id="farmer-list">
                {customerslist
                  .filter((customer) =>
                    customer.cname.toLowerCase().includes(cname.toLowerCase())
                  )
                  .map((customer, index) => (
                    <option key={index} value={customer.cname} />
                  ))}
              </datalist>
            </div>
          </div>
          <div className="sales-details w100 h20 d-flex a-center sb ">
            <div className="col w80">
              <label htmlFor="items" className="info-text w100">
                Select Product:
              </label>
              <select
                disabled={!cname}
                id="items"
                value={selectitemcode}
                className="data w100"
                onChange={(e) => setSelectitemcode(parseInt(e.target.value))}>
                <option value="0">-- select product --</option>
                {productlist.map((item, i) => (
                  <option key={i} value={i}>
                    {item.ItemName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col w20">
              <label htmlFor="qty" className="info-text w100">
                QTY:
              </label>
              <input
                disabled={!selectitemcode}
                type="number"
                id="qty"
                value={qty}
                className="data w100"
                name="qty"
                min="1"
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
              />
            </div>
          </div>
          {userRole !== "mobilecollector" ? (
            <div className="sales-details w100 h20 d-flex ">
              <div className="col w30 ">
                <label htmlFor="rate" className="info-text w100">
                  Rate:
                </label>
                <input
                  type="number"
                  name="rate"
                  id="rate"
                  className="data w70"
                  value={rate}
                  onChange={(e) =>
                    setRate(Math.max(0, parseFloat(e.target.value)))
                  }
                  min="0"
                  disabled={!selectitemcode}
                />
              </div>
              <div className="col w30">
                <label htmlFor="amt" className="info-text w100">
                  Amount:
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
          ) : (
            <></>
          )}

          <div className="sales-btn-container w100 h20 d-flex j-end my10">
            <button className="w-btn m10" onClick={handelClear}>
              Clear
            </button>
            <button className="btn m10" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="sales-list-outer-container w45 h90 d-flex-col bg">
        <span className="heading p10">Item List</span>
        <div className="sales-list-conatainer w100 h1 d-flex-col">
          <div className="sales-headings-row w100 h10 d-flex sb a-center t-center sticky-top t-heading-bg">
            <span className="f-label-text w10">No.</span>
            <span className="f-label-text w40">Name</span>
            <span className="f-label-text w10">Qty</span>
            <span className="f-label-text w10">Rate</span>
            <span className="f-label-text w10">Amount</span>
            {userRole !== "mobilecollector" ? (
              <span className="f-label-text w20 t-center">Action</span>
            ) : (
              <span className="w20"></span>
            )}
          </div>
          {cartItem.length > 0 ? (
            <>
              {cartItem.map((item, i) => (
                <div className="sales-headings-row w100 h10 d-flex a-center sb">
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
                    <span className="label-text w20 t-center"></span>
                  )}
                </div>
              ))}
              <div className="sales-total-headings-row w100 h10 d-flex a-center sb">
                <span className=" w10"></span>
                <span className=" w40"></span>
                <span className=" w10"></span>
                <span className="label-text w10">Total :</span>
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
        <div className="modal-content w100">
          <div id="print-section" style={{ display: "none" }}>
            <div className="invoice">
              <h2 className="invoice-header">हरि ओम दूध संकलन केंद्र</h2>
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>SrNo</th>
                    <th>तारीख</th>
                    <th>नरे</th>
                    <th>रेट</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>20/01/2025</td>
                    <td>10</td>
                    <td>50</td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <b>कुल रक्कम:</b>
                    </td>
                    <td>500</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="invoice">
              <h2 className="invoice-header">हरि ओम दूध संकलन केंद्र</h2>
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>SrNo</th>
                    <th>तारीख</th>
                    <th>नरे</th>
                    <th>रेट</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>20/01/2025</td>
                    <td>15</td>
                    <td>75</td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <b>कुल रक्कम:</b>
                    </td>
                    <td>1125</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {userRole === "mobilecollector" ? (
            <div className="w100 d-flex j-end  my10">
              <button className="w-btn">PDF</button>
            </div>
          ) : (
            <div className="w100 d-flex j-end  my10">
              <button className="w-btn mx10">PDF</button>
              <button className="w-btn" onClick={handlePrint}>
                Print
              </button>
              <button
                className="w-btn mx10"
                onClick={handleSubmit}
                disabled={cartItem.length == 0}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCattleFeed;
