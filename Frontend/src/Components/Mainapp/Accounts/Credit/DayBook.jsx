import React, { useEffect, useMemo, useState } from "react";
import "../../../../Styles/Mainapp/Accounts/Daybook.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllVoucher } from "../../../../App/Features/Mainapp/Account/voucherSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";

import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const DayBook = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({});
  const [selectedDate, setSelectedDate] = useState(getTodaysDate());
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const autoCenter = useMemo(() => settings?.autoCenter, [settings]);
  // Correct voucher list
  const voucherList = useSelector((state) => state.voucher.voucherList || []);
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);

  useEffect(() => {
    dispatch(listSubLedger());
  });

  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  useEffect(() => {
    dispatch(listCustomer());
    dispatch(listSubLedger());
  }, [dispatch]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleViewClick = () => {
    if (settings?.autoCenter !== undefined && selectedDate) {
      dispatch(getAllVoucher({ VoucherDate: selectedDate, autoCenter }));
    }
  };
  console.log(voucherList);

  //.......PRINT Function

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const dairyName = settings?.dairyname || "डेअरी नाव";
    const cityName = settings?.city || "शहर";
    const reportDate = selectedDate || "";

    const tableRows = mergedVoucherList
      .map((voucher, index) => {
        const name =
          sledgerlist.find((i) => i.lno === voucher.GLCode)?.marathi_name || "";

        const cashIn = Math.abs(voucher.cashIn);
        const cashOut = Math.abs(voucher.cashOut);
        const amtIn =
          voucher.Vtype === 3 || voucher.Vtype === 4
            ? Math.abs(voucher.Amt)
            : "";
        const amtOut =
          voucher.Vtype === 0 || voucher.Vtype === 1
            ? Math.abs(voucher.Amt)
            : "";

        return `
        <tr>
          <td style="border: 1px solid #000;">${index + 1}</td>
          <td style="border: 1px solid #000;">${name}</td>
          <td style="border: 1px solid #000;">${cashIn}</td>
          <td style="border: 1px solid #000;">${amtIn}</td>
          <td style="border: 1px solid #000;">${cashOut}</td>
          <td style="border: 1px solid #000;">${amtOut}</td>
        </tr>
      `;
      })
      .join("");

    const printContent = `
    <html>
      <head>
        <title>Day Book Report</title>
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; }
          .heading { text-align: center; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px; text-align: center; }
          .subheading th { font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="heading">
          <h2>${dairyName}, ${cityName}</h2>
          <h3>डे बुक अहवाल</h3>
          <p>दिनांक: ${reportDate}</p>
        </div>

        <table border="1">
          <thead>
            <tr>
              <th rowspan="2">#</th>
              <th rowspan="2">रोज कीर्द</th>
              <th colspan="2">जमा</th>
              <th colspan="2">नावे</th>
            </tr>
            <tr class="subheading">
              <th>रोख</th>
              <th>ट्रान्स्फर</th>
              <th>रोख</th>
              <th>ट्रान्स्फर</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div style="margin-top: 30px;">
          <p><strong>अखेर शिल्लक:</strong> __________</p>
          <p><strong>एकूण जमा:</strong> __________ | <strong>एकूण नावे:</strong> __________</p>
        </div>
      </body>
    </html>
  `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  //..print2
  const handlePrint2 = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const dairyName = settings?.dairyname || "डेअरी नाव";
    const cityName = settings?.city || "शहर";
    const reportDate = selectedDate || "";

    const tableRows = mergedVoucherList
      .map((voucher, index) => {
        const deposit =
          Math.abs(voucher.cashIn || 0) +
          (voucher.Vtype === 3 || voucher.Vtype === 4
            ? Math.abs(voucher.Amt || 0)
            : 0);

        const withdrawal =
          Math.abs(voucher.cashOut || 0) +
          (voucher.Vtype === 0 || voucher.Vtype === 1
            ? Math.abs(voucher.Amt || 0)
            : 0);

        return `
        <tr>
          <td>${deposit}</td>
          <td>${withdrawal}</td>
        </tr>
      `;
      })
      .join("");

    const printContent = `
    <html>
      <head>
        <title>Day Book Report</title>
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; }
          .heading { text-align: center; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px; text-align: center; border: 1px solid #000; }
          .subheading th { font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="heading">
          <h2>${dairyName}, ${cityName}</h2>
          <h3>डे बुक अहवाल</h3>
          <p>दिनांक: ${reportDate}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>जमा</th>
              <th>नावे</th>
            </tr>
            <tr class="subheading">
              <th>आरंभिक शिल्लक</th>
              <th>आरंभिक शिल्लक</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div style="margin-top: 30px;">
          <p><strong>एकूण:</strong> __________</p>
          <p><strong>अखेरची शिल्लक:</strong> __________</p>
        </div>
      </body>
    </html>
  `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  console.log("Subledger", sledgerlist);

  const mergedVoucherList = useMemo(() => {
    const temp = [];

    voucherList.forEach((voucher) => {
      const key = `${voucher.GLCode}-${voucher.Vtype}`;
      const existing = temp.find((v) => v.key === key);

      if (existing) {
        existing.cashIn += voucher.cashIn || 0;
        existing.cashOut += voucher.cashOut || 0;
        existing.Amt += voucher.Amt || 0;
        existing.totalOut += voucher.totalOut || 0;
      } else {
        temp.push({
          ...voucher,
          cashIn: voucher.cashIn || 0,
          cashOut: voucher.cashOut || 0,
          Amt: voucher.Amt || 0,
          totalOut: voucher.totalOut || 0,
          key,
        });
      }
    });

    return temp;
  }, [voucherList]);

  const totals = useMemo(() => {
    let jamaCash = 0;
    let jamaTransfer = 0;
    let naveCash = 0;
    let naveTransfer = 0;

    mergedVoucherList.forEach((voucher) => {
      const amt = Math.abs(voucher.Amt);
      switch (voucher.Vtype) {
        case 0:
          naveCash += amt;
          break;
        case 1:
          naveTransfer += amt;
          break;
        case 3:
          jamaCash += amt;
          break;
        case 4:
          jamaTransfer += amt;
          break;
        default:
          break;
      }
    });

    return {
      openingBalance: 0, // use real data if needed
      closingBalance: 0, // calculate as needed
      jamaCash,
      jamaTransfer,
      naveCash,
      naveTransfer,
    };
  }, [mergedVoucherList]);

  //.....

  const handlePreviousDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <div className="Day-Book-container w100  h1 d-flex-col ">
      <span className="heading px10">डे बुक </span>

      <div className="first-day-book-half-div w100 h40 d-flex ">
        <div className="back-front-date-div w30 h1 d-flex-col sa">
          <div className="dates-books-div w100 h30 d-flex a-center">
            <span className="label-text w30 px10">दिनांक</span>
            <input
              className="data"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="front-and-backs-button w100 d-flex a-center h30 sa">
            <button className="w-btn" onClick={handlePreviousDate}>
              मागे
            </button>
            <button className="w-btn" onClick={handleNextDate}>
              पुढे
            </button>
            <button className="w-btn ml-2" onClick={handleViewClick}>
              पाहणे
            </button>
          </div>

          <div className="front-and-backs-button w100 d-flex a-center h30 sa">
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/milk/sangha";
              }}
              className="w-btn "
            >
              दूध विक्री
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/milk/retail/sales";
              }}
              className="w-btn "
            >
              किरकोळ विक्री
            </button>
          </div>
        </div>

        <div className="print-rokh-milk-payment div w35 h1 d-flex-col sa">
          <div className="print-payment-rokh-div w100 d-flex sa h30">
            <button className="w-btn" onClick={handlePrint}>
              प्रिंट1
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/accounts/cash";
              }}
              className="w-btn "
            >
              रोख
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/payment/generate";
              }}
              className="w-btn "
            >
              दूध पेमेंट
            </button>
          </div>
          <div className="print-payment-rokh-div w100 d-flex sa h30">
            <button className="w-btn" onClick={handlePrint2}>
              प्रिंट2
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/accounts/transfer";
              }}
              className="w-btn "
            >
              ट्रान्सफर
            </button>
            <button className="w-btn">ज.लेजर</button>
          </div>
          <div className="print-payment-rokh-div w100 d-flex sa h30">
            <button className="w-btn">दूध पेमेंट चेक </button>
            <button className="w-btn">पेमेंट लॉक अनलॉक</button>
            <button className="w-btn">अकाऊंट स्टेटमेंट</button>
          </div>
        </div>

        <div className="second-print-rokh-milk-payment div w35 h1 d-flex-col sa">
          <div className="secondprint-payment-rokh-div w100 d-flex sa h30">
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/product/sales/cattlefeed";
              }}
              className="w-btn "
            >
              प वि
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/product/sales/grocery";
              }}
              className="w-btn "
            >
              अ.वि
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/product/sales/medicines";
              }}
              className="w-btn "
            >
              अ.वि
            </button>{" "}
          </div>
          <div className="secondprint-payment-rokh-div w100 d-flex sa h30">
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/expired-product";
              }}
              className="w-btn "
            >
              Sale ghu.tpv
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/expired-product/grocery";
              }}
              className="w-btn "
            >
              Sale ghu.GV
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/expired-product/medicines";
              }}
              className="w-btn "
            >
              Sale ghu.tv
            </button>
          </div>
          <div className="secondprint-payment-rokh-div w100 d-flex sa h30">
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/product/purchase/cattlefeed";
              }}
              className="w-btn "
            >
              प ख.
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/product/purchase/grocery";
              }}
              className="w-btn "
            >
              औ ख
            </button>
            <button
              onClick={(e) => {
                window.location.href =
                  "http://localhost:5173/mainapp/inventory/product/purchase/medicines";
              }}
              className="w-btn "
            >
              कि ख.
            </button>
          </div>
          <div className="secondprint-payment-rokh-div w100 d-flex sa h30">
            <button className="w-btn">Pure.Rate PV</button>
            <button className="w-btn">Pure.Rate MV</button>
            <button className="w-btn">Pure.Rate KV</button>
          </div>
        </div>
      </div>

      {/* Table Section */}

      <div className="day-book-table-section w100 h50 d-flex-col bg">
        <div className="scroll-container">
          <div className="heading-tableof-dy-book w100 h15 sa d-flex">
            <span className="label-text w5">खतावणी न</span>
            <span className="label-text w20">खतावणी नाव</span>
            <span className="label-text w10">जमा कॅश</span>
            <span className="label-text w10">जमा ट्रान्सफर</span>
            <span className="label-text w10">एकूण जमा</span>
            <span className="label-text w10">नावे कॅश</span>
            <span className="label-text w10">नावे ट्रान्सफर</span>
            <span className="label-text w10">एकूण नावे</span>
          </div>

          <div className="day-book-table-data-section w100 mx90 hidescrollbar d-flex-col">
            {mergedVoucherList.length > 0 ? (
              mergedVoucherList.map((voucher, index) => (
                <div key={index} className="daybook-data w100 h1 sa d-flex">
                  <span className="label-text w5">{voucher.GLCode}</span>
                  <span className="label-text w20">
                    {sledgerlist.find((i) => i.lno === voucher.GLCode)
                      ?.marathi_name || ""}
                  </span>
                  <span className="label-text w10 highlight-in">
                    {voucher.Vtype === 3 ? Math.abs(voucher.Amt) : ""}
                  </span>
                  <span className="label-text w10 highlight-in">
                    {voucher.Vtype === 4 ? Math.abs(voucher.Amt) : ""}
                  </span>
                  <span className="label-text w10 highlight-in">
                    {voucher.Vtype === 3 || voucher.Vtype === 4
                      ? Math.abs(voucher.Amt)
                      : ""}
                  </span>
                  <span className="label-text w10 highlight-out">
                    {voucher.Vtype === 0 ? Math.abs(voucher.Amt) : ""}
                  </span>
                  <span className="label-text w10 highlight-out">
                    {voucher.Vtype === 1 ? Math.abs(voucher.Amt) : ""}
                  </span>
                  <span className="label-text w10 highlight-out">
                    {voucher.Vtype === 0 || voucher.Vtype === 1
                      ? Math.abs(voucher.Amt)
                      : ""}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 p-4">
                डेटा उपलब्ध नाही
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="arabhichi-remening-qtyall-nameamt-transer w100 h15 d-flex bg3">
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">आरंभीची शिल्लक</span>
          <input
            className="data w60"
            type="text"
            value={totals.openingBalance}
            readOnly
          />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">अखेर शिल्लक</span>
          <input
            className="data w60"
            type="text"
            value={totals.closingBalance}
            readOnly
          />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">एकूण जमा रोख</span>
          <input
            className="data  w60"
            type="text"
            value={totals.jamaCash}
            readOnly
          />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">एकूण जमा ट्रान्सफर</span>
          <input
            className="data w60"
            type="text"
            value={totals.jamaTransfer}
            readOnly
          />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">एकूण नाव रोख</span>
          <input
            className="data w60"
            type="text"
            value={totals.naveCash}
            readOnly
          />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">एकूण ट्रान्सफर नावे</span>
          <input
            className="data w60"
            type="text"
            value={totals.naveTransfer}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default DayBook;
