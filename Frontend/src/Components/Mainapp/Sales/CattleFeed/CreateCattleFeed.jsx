import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../App/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getAllProducts } from "../../../../App/Features/Mainapp/Inventory/inventorySlice";
import { getProductSaleRates } from "../../../../App/Features/Sales/salesSlice";
import Invoice from "../Invoice";
import "../../../../Styles/Mainapp/Sales/Sales.css";
import { toWords } from "number-to-words";

const CreateCattleFeed = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const tDate = useSelector((state) => state.date.toDate);
  const salesRates = useSelector((state) => state.sales.salesRates);
  const customerslist = useSelector((state) => state.customer.customerlist);
  const productlist = useSelector((state) => state.inventory.allProducts || []);
  const [cartItem, setCartItem] = useState([]);
  const [cname, setCname] = useState("");
  const [fcode, setFcode] = useState("");
  const [date, setDate] = useState("");
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [selectitemcode, setSelectitemcode] = useState(0);
  const [userid, setUserid] = useState("");
  const [amt, setAmt] = useState("");
  const [rctno, setRctno] = useState("");
  const [groupItems, setGroupItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); //p--
  const [purchaseData, setPurchaseData] = useState([]); //p--
  const [userRole, setUserRole] = useState(null);
  const [manualRateChange, setManualRateChange] = useState(false);
  const dairyInfo = useSelector((state) => state.dairy.dairyData.SocietyName);

  useEffect(() => {
    setRctno(localStorage.getItem("receiptno"));
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getProductSaleRates(1));
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
    } else {
      setCname("");
    }
  }, [fcode, customerslist]);

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

  useEffect(() => {
    if (rate) {
      setAmt(rate * qty);
    }
  }, [ qty, rate]);

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

    if (Number(selectitemcode) > 0 && Number(qty) > 0) {
      const newCartItem = {
        ReceiptNo: rctno,
        ItemCode: selectedItem.ItemCode,
        ItemName: selectedItem.ItemName,
        BillDate: `${date} 00:00:00`,
        Qty: Number(qty),
        CustCode: fcode,
        cust_name: cname,
        ItemGroupCode: 1,
        Rate: Number(rate),
        Amount: Number(qty) * Number(rate),
      };

      setCartItem((prev) => [...prev, newCartItem]);

      // Reset fields
      setQty(1);
      setRate("");
      setAmt(0); // Set amount to 0 instead of an empty string
      setSelectitemcode("");
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
          toast.success(res.data.message);
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

  // Function to handle printing the invoice --------------------------------------->
  const handlePrint = () => {
    handleSubmit();
    if (cartItem.length > 0) {
      const printWindow = window.open("", "_blank");
      const printContent = document.getElementById("print-section").innerHTML;

      if (printWindow) {
        printWindow.document.write(
          `
        <html>
          <head>
            <title>Print</title>
            <style>
              @page {
                size: A4 landscape;
                margin: 5mm;
              }
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                margin: 0;
                padding: 0;
              }
              #print-section {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height:100%;
                padding: 10mm;
                box-sizing: border-box;
                flex-wrap: wrap;
              }
              .invoice { 
                width: 46%;
                border: 1px solid black;
                height:100%;
                padding: 1mm;
                box-sizing: border-box;
               display: flex;
              flex-direction: column;
              }
              .invoice-header {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 0;
              }
                 .invoice-sub-header {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
                margin-right: 90px;

              }
              .invoice-info {
                display: flex;
                margin:0 10px;
                justify-content: space-between;
                margin-bottom: 10px;
              }

              .invoice-outstanding-container{
                width: 100%;
                display: flex; 
                justify-content: end;
                margin-bottom:10px;
              }
              .outstanding-conatiner{
                width: 120px;
                height : 50px;
                text-align: center;
                border: 1px solid black;
              }
     

              .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
              }
              .invoice-table th, .invoice-table td {
              font-size: 12px;
                border: 1px solid black;
                padding: 5px;
                text-align: center;
                word-wrap: break-word;
              }
              
            
              .signature-box {
                display: flex;
                justify-content: space-between;
                margin-top: auto;
                font-weight: bold;
              }
              .signature-box span {
                width: 45%;
                text-align: center;
                border-top: 1px solid black;
                padding-top: 10px;
              }
                .footer{
                margin-top:10px;
                display:flex;
                justify-content:center;
                }
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
        toast.error("Failed to open print window. Check pop-up settings.");
      }
    }
  };

  // Function to handle download pdf the invoice --------------------------------------->
  const exportToPDF = () => {
    if (cartItem.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const convertToWords = (num) => {
      const [integerPart, decimalPart] = num.toString().split(".");
      const integerWords = toWords(integerPart);
      const decimalWords = decimalPart ? " point " + toWords(decimalPart) : "";
      return `Rupees ${integerWords}${decimalWords} only`;
    };
    const doc = new jsPDF();

    // Define columns and rows
    const columns = ["Sr No", "Items", "Qty", "Rate", "Amount"];
    const rows = cartItem.map((item, index) => [
      index + 1,
      handleFindItemName(item.ItemCode),
      item.Qty,
      item.Rate,
      item.Amount,
    ]);

    const totalAmount = cartItem.reduce((acc, item) => acc + item.Amount, 0);

    // Page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Define the margin and the height of the box
    const margin = 10;
    const boxHeight = pageHeight - 20; // Adjust as needed

    // Add border for the entire content
    doc.rect(margin, margin, pageWidth - 2 * margin, boxHeight);

    // Add dairy name with border inside the box
    const dairyName = dairyInfo;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(dairyName);
    doc.text(dairyName, (pageWidth - dairyTextWidth) / 2, margin + 15);

    // Add "Sale-Info" heading with border
    doc.setFontSize(14);
    const invoiceInfo = doc.getTextWidth("Sale-Info");
    doc.text("Sale-Info", (pageWidth - invoiceInfo) / 2, margin + 25);

    //

    // Add Bill No and Date (aligned) with border
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const billNoText = `Bill No.: ${rctno || ""}`;
    const dateText = `Date: ${date || ""}`;
    doc.text(billNoText, margin + 5, margin + 40);
    doc.text(
      dateText,
      pageWidth - doc.getTextWidth(dateText) - 15,
      margin + 40
    );

    // Add Customer Code and Customer Name (aligned) with border
    const CustCode = `Cust No.: ${fcode || ""}`;
    const CustName = `Cust. Name: ${cname || ""}`;
    doc.text(CustCode, margin + 5, margin + 50);
    doc.text(
      CustName,
      pageWidth - doc.getTextWidth(CustName) - 15,
      margin + 50
    );

    // Add table for items with borders and centered text
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: margin + 60,
      margin: { top: 10 },
      styles: {
        cellPadding: 2,
        fontSize: 11,
        halign: "center", // Horizontal alignment for cells (centered)
        valign: "middle", // Vertical alignment for cells (centered)
        lineWidth: 0.08, // Line width for the borders
        lineColor: [0, 0, 0], // Black border color
      },
      headStyles: {
        fontSize: 12,
        fontStyle: "bold",
        fillColor: [225, 225, 225], // Light gray background for the header
        textColor: [0, 0, 0], // Black text color for header
      },
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.1, // Border width
    });
    // Add total amount with border
    doc.setFontSize(12);
    const totalAmountTextStr = `${convertToWords(totalAmount)}`;
    const totalAmountLabel = `Total Amount: ${totalAmount}`;

    const totalAmountTextWidth = doc.getTextWidth(totalAmountTextStr);
    const totalAmountLabelWidth = doc.getTextWidth(totalAmountLabel);

    // Add borders for total amount text
    doc.text(totalAmountTextStr, margin + 5, doc.lastAutoTable.finalY + 10);
    doc.text(
      totalAmountLabel,
      pageWidth - totalAmountLabelWidth - 15,
      doc.lastAutoTable.finalY + 10
    );

    // Footer (Signatures) with borders
    doc.text(
      "Signature of the consignee",
      margin + 5,
      doc.lastAutoTable.finalY + 40
    );
    doc.text(
      "Signature of the consignor",
      pageWidth - doc.getTextWidth("Signature of the consignor") - 15,
      doc.lastAutoTable.finalY + 40
    );
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const Info = doc.getTextWidth("Goods received as per the above details.");
    doc.text(
      "Goods received as per the above details.",
      (pageWidth - Info) / 2,
      doc.lastAutoTable.finalY + 50
    );

    //table outstanding
    // Define columns and rows
    const columns1 = ["Current Outstanding"];
    const rows1 = [[`${0}`]];
    const columnWidths = [40];
    doc.autoTable({
      head: [columns1],
      body: rows1,
      startY: margin + 5,
      columnStyles: {
        0: { cellWidth: columnWidths[0] }, // Setting width for the first column (Current Outstanding)
      },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        halign: "center", // Horizontal alignment for cells (centered)
        valign: "middle", // Vertical alignment for cells (centered)
        lineWidth: 0.08, // Line width for the borders
        lineColor: [0, 0, 0], // Black border color
      },
      headStyles: {
        fontSize: 10,
        fillColor: [225, 225, 225], // Light gray background for the header
        textColor: [0, 0, 0], // Black text color for header
      },
      tableLineColor: [0, 0, 0], // Table border color (black)
    });

    // Save the PDF
    doc.save("Invoice.pdf");
  };

  //use set rate in rate field ----------------------------------------------------->
  useEffect(() => {
    if (purchaseData.length > 0) {
      const sortedPurchaseData = [...purchaseData].sort(
        (a, b) => new Date(b.purchaseid) - new Date(a.purchaseid)
      );
      const rateItem = sortedPurchaseData.find(
        (item) => item.itemcode === selectitemcode
      );
      setRate(rateItem?.salerate ?? "");
    }
  }, [selectitemcode]);

  // Filter out items that are already in the cart --------------------------------->
  const handleItemstoShow = () => {
    if (userRole !== "mobilecollector") {
      const items = productlist.filter((item) => item.ItemGroupCode === 1);
      setGroupItems(items);
      const itemsNotInCart = groupItems.filter(
        (item) => !cartItem.some((cart) => cart.ItemCode === item.ItemCode)
      );
      setFilteredItems(itemsNotInCart);
    } else {
      const itemsNotInCart = productlist.filter(
        (item) => !cartItem.some((cart) => cart.ItemCode === item.ItemCode)
      );
      setFilteredItems(itemsNotInCart);
    }
  };

  useEffect(() => {
    handleItemstoShow();
  }, [productlist]);

  //   useEffect(() => {
  //     const items = productlist.filter((item) => item.ItemGroupCode === 1);
  //     setGroupItems(items);
  //   }, [productlist, cartItem]);
  //
  //   useEffect(() => {
  //     const itemsNotInCart = groupItems.filter(
  //       (item) => !cartItem.some((cart) => cart.ItemCode === item.ItemCode)
  //     );
  //     setFilteredItems(itemsNotInCart);
  //   }, [groupItems]);

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

  // Function to find item name based on item code --------------------------------->
  const handleFindItemName = (id) => {
    const selectedItem = productlist.find((item) => item.ItemCode === id);
    return selectedItem.ItemName;
  };

  return (
    <div className="add-sale-container w100 h1 d-flex-col sa">
      <span className="heading p10">Cattle Feeds</span>
      <div className="create-sales-inner-container w100 h1 d-flex sb p10">
        <form className="create-sales-form-container w50 h1 bg p10">
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
                max={tDate}
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
                onFocus={handleFocus}
                value={fcode}
                onChange={(e) => setFcode(e.target.value)}
                min="0"
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("items"))
                }
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
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("items"))
                }
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
              {userRole !== "mobilecollector" ? (
                <select
                  disabled={!cname}
                  id="items"
                  value={selectitemcode}
                  className="data w100"
                  onChange={(e) => setSelectitemcode(parseInt(e.target.value))}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("qty"))
                  }>
                  <option value="0">-- select product --</option>
                  {filteredItems.map((item, i) => (
                    <option key={i} value={item.ItemCode}>
                      {item.ItemName}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  disabled={!cname}
                  id="items"
                  value={selectitemcode}
                  className="data w100"
                  onChange={(e) => setSelectitemcode(parseInt(e.target.value))}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("addtocart"))
                  }>
                  <option value="0">-- select product --</option>
                  {filteredItems.map((item, i) => (
                    <option key={i} value={item.ItemCode}>
                      {item.ItemName}
                    </option>
                  ))}
                </select>
              )}
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
            <button
              type="button"
              className="btn m10"
              id="addtocart"
              onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </form>

        <div className="sales-list-outer-container w45 h1 d-flex-col bg">
          <div className="title-and-button-container w100 d-flex a-center sb">
            <span className="heading w30 p10">Item List</span>
            {userRole === "mobilecollector" ? (
              <div className="w70 d-flex a-center j-end ">
                <div className="w100 d-flex j-end ">
                  <button type="button" className="w-btn">
                    PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="w70 d-flex j-end">
                <button
                  type="button"
                  className="w-btn mx10"
                  onClick={exportToPDF}>
                  PDF
                </button>
                <button type="button" className="w-btn" onClick={handlePrint}>
                  Print
                </button>
              </div>
            )}
          </div>
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
                <span></span>
              )}
            </div>
            {cartItem.length > 0 ? (
              <>
                {cartItem.map((item, i) => (
                  <div
                    key={i}
                    className="sales-headings-row w100 h10 d-flex a-center sb">
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

          <div className="sales-button-container w100 h10 d-flex a-center j-end">
            <button className="w-btn m10" onClick={handelClear}>
              Clear
            </button>
            <button
              className="w-btn mx10"
              onClick={handleSubmit}
              disabled={cartItem.length == 0}>
              Save
            </button>
          </div>
        </div>
        <div id="print-section" style={{ display: "none" }}>
          {/* <!-- First Invoice --> */}
          <Invoice
            cartItem={cartItem}
            handleFindItemName={handleFindItemName}
            cname={cname}
            fcode={fcode}
            rctno={rctno}
            date={date}
            dairyInfo={dairyInfo}
          />

          {/* <!-- Second Invoice (same as the first) --> */}
          <Invoice
            cartItem={cartItem}
            handleFindItemName={handleFindItemName}
            cname={cname}
            fcode={fcode}
            rctno={rctno}
            date={date}
            dairyInfo={dairyInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCattleFeed;
