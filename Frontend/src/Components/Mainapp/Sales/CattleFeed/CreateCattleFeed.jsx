import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../App/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "../../../../App/Features/Mainapp/Inventory/inventorySlice";

const CreateCattleFeed = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const [cartItem, setCartItem] = useState([]);
  const [cname, setCname] = useState("");
  const [fcode, setFcode] = useState("");
  const [date, setDate] = useState("");
  const [itemList, setItemList] = useState([]);
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [selectitemcode, setSelectitemcode] = useState(0);
  const [amt, setAmt] = useState(0);
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
  console.log("all products", productlist);

  useEffect(() => {
    dispatch(getAllProducts());
    // const fetchAllItems = async () => {
    //   try {
    //     const { data } = await axiosInstance.get("/item/all?ItemGroupCode=1");
    //     setItemList(data.itemsData || []);
    //   } catch (error) {
    //     console.error("Error fetching items:", error);
    //   }
    // };
    // fetchAllItems();
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

  const handleFindItemName = (id) => {
    const selectedItem = itemList.find((item) => item.ItemCode === id);
    return selectedItem.ItemName;
  };

  const handleAddToCart = () => {
    if (selectitemcode > 0 && qty > 0 && rate > 0) {
      const selectedItem = itemList.find(
        (item) => item.ItemCode === selectitemcode
      );
      const newCartItem = {
        companyid: selectedItem?.companyid,
        ReceiptNo: rctno, // Receipt No
        userid: userid,
        BillNo: billNo,
        ItemCode: selectedItem?.ItemCode,
        BillDate: date + " 00:00:00",
        Qty: qty,
        CustCode: fcode,
        ItemGroupCode: 1, // update Itemgroupcode
        Rate: rate,
        Amount: qty * rate,
      };

      // Update the cart items and log the updated array
      setCartItem((prev) => {
        const updatedCart = [...prev, newCartItem];
        // console.log("Updated Cart:", updatedCart); // Logs the latest state
        return updatedCart;
      });

      // Reset the input values
      setQty(1);
      setRate(0);
      setAmt(0);
      setSelectitemcode(0); // Reset amount to 0 after clearing rate and quantity
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

  const handlePrint = () => {
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

  return (
    <div className="sale-add-container w100 h1 d-flex-col">
      <span className="heading p10">Create Cattle Feed</span>
      <div className="create-sales-outer-container w100 h1 d-flex p10">
        <div className="create-sales-form-container w50 h60 d-flex-col p10 bg">
          <div className="row w100 h20 d-flex a-center sb">
            <div className="col w50 d-flex a-center">
              <label htmlFor="date" className="info-text w30">
                Date :
              </label>
              <input
                type="date"
                className="data w50"
                name="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={date}
              />
            </div>{" "}
            <div className="col w50 d-flex a-center">
              <label htmlFor="recieptno" className="info-text px10">
                Receipt No :
              </label>
              <input
                type="number"
                name="number"
                id="recieptno"
                value={rctno}
                className="data w30"
                onChange={(e) => setRctno(e.target.value.replace(/\D/, ""))}
                min="0"
              />
            </div>
          </div>
          <div className="row w100 h20 d-flex a-center sb">
            <div className="col w30 d-flex a-center">
              <label htmlFor="code" className="info-text w40">
                Code:
              </label>
              <input
                type="number"
                name="code"
                id="code"
                className="data w50"
                value={fcode}
                onChange={(e) => setFcode(e.target.value)}
                min="0"
              />
            </div>
            <div className="col w70 d-flex a-center">
              <label htmlFor="custname" className="info-text w35">
                Customer Name:
              </label>
              <input
                type="text"
                name="fname"
                id="custname"
                className="data w65"
                value={cname}
                readOnly
              />
            </div>
          </div>
          <div className="row w100 h20 d-flex a-center sb">
            <div className="col w45 d-flex a-center">
              <label htmlFor="items" className="info-text w35">
                Select Items:
              </label>
              <select
                disabled={!cname}
                id="items"
                value={selectitemcode}
                className="data w65"
                onChange={(e) => setSelectitemcode(parseInt(e.target.value))}>
                <option value="0">Select Item</option>
                {productlist.map((item, i) => (
                  <option key={i} value={i}>
                    {item.ItemName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col w45 d-flex a-center sb">
              <label htmlFor="qty" className="info-text w30">
                QTY:
              </label>
              <input
                disabled={!selectitemcode}
                type="number"
                id="qty"
                value={qty}
                className="data w70"
                name="qty"
                min="1"
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
              />
            </div>
          </div>
          {userRole !== "mobilecollector" ? (
            <div className="row w100 h20 d-flex a-center sb">
              <div className="col w45 d-flex a-center sb">
                <label htmlFor="rate" className="info-text w35">
                  Rate:
                </label>
                <input
                  type="number"
                  name="rate"
                  id="rate"
                  className="data w65"
                  value={rate}
                  onChange={(e) =>
                    setRate(Math.max(0, parseFloat(e.target.value)))
                  }
                  min="0"
                  disabled={!selectitemcode}
                />
              </div>
              <div className="col w45 d-flex a-center sb">
                <label htmlFor="amt" className="info-text w30">
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
            <button className="w-btn" onClick={handelClear}>
              Clear
            </button>
            <button className="w-btn mx10" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className="w-btn"
              onClick={handleSubmit}
              disabled={cartItem.length == 0}>
              Save
            </button>
          </div>
        </div>
        <div className="sales-list-outer-container w50 h1 d-flex-col p10">
          <span className="label-text t-center px10">-- ITEMS LIST --</span>
          <div className="sales-list-conatainer w100 h1 d-flex-col bg">
            <div className="sales-headings-row w100 h10 d-flex sb a-center t-center sticky-top t-heading-bg">
              <span className="f-label-text w10">Sr.No</span>
              <span className="f-label-text w40">Item Nam</span>
              <span className="f-label-text w10">Qty</span>
              <span className="f-label-text w10">Rate</span>
              <span className="f-label-text w10">Amount</span>
              {userRole !== "mobilecollector" ? (
                <span className="f-label-text w20 t-center">Actions</span>
              ) : (
                <span className="w20"></span>
              )}
            </div>
            {cartItem.lenght > 0 ? (
              <>
                {cartItem.map((item, i) => (
                  <div className="sales-headings-row w100 h10 d-flex a-center sb">
                    <span className="label-text w10 t-center">Sr.No</span>
                    <span className="label-text w40 t-start">Item Nam</span>
                    <span className="label-text w10 t-center">Qty</span>
                    <span className="label-text w10 t-end">Rate</span>
                    <span className="label-text w10 t-end">Amount</span>
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
                <div className="sales-headings-row w100 h10 d-flex a-center sb">
                  <span className=" w10"></span>
                  <span className=" w40"></span>
                  <span className=" w10"></span>
                  <span className="label-text w10">Total :</span>
                  <span className="label-text w10 t-end">0</span>
                  <span className=" w20"></span>
                </div>
              </>
            ) : (
              <div className="box d-flex center">
                <span className="label-text">{t("common:c-no-data-avai")}</span>
              </div>
            )}
          </div>
          <div className="modal-content w100  ">
            {/* <div className="sales-table-container w100">
              <table className="sales-table w100 ">
                <thead className="bg2">
                  <tr>
                    <th>Sr.No</th>
                    <th>Item Name</th>
                    <th>Rate</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItem.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{handleFindItemName(item.ItemCode)}</td>
                      <td>{item.Rate}</td>
                      <td>{item.Qty}</td>
                      <td>{item.Amount}</td>
                      <td>
                        <MdDeleteOutline
                          size={20}
                          className="table-icon"
                          style={{ color: "red" }}
                          onClick={() => handleDeleteItem(i)}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <b>Total</b>
                    </td>
                    <td>
                      {cartItem.reduce((acc, item) => acc + item.Amount, 0)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div> */}

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
                <button className="w-btn">PDF</button>
                <button className="w-btn mx10" onClick={handlePrint}>
                  Print
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCattleFeed;
