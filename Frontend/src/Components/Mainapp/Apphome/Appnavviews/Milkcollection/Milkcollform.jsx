import React, { useEffect, useRef, useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrevMilkdata,
  getRegCustomers,
  saveMilkOneEntry,
  setEntries,
} from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { toast } from "react-toastify";
import { fetchFCMTokens } from "../../../../../App/Features/Notifications/notificationSlice";
import { useTranslation } from "react-i18next";
import { getRateCharts } from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import axiosInstance from "../../../../../App/axiosInstance";
import { useParams } from "react-router-dom";
import { listCustomer } from "../../../../../App/Features/Mainapp/Masters/custMasterSlice";
import { saveMessage } from "../../../../../App/Features/Mainapp/Dairyinfo/smsSlice";
import CollSettings from "./CollSettings";
import { selectPaymasters } from "../../../../../App/Features/Payments/paymentSelectors";
import { getPayMasters } from "../../../../../App/Features/Payments/paymentSlice";

const MilkColleform = ({ times }) => {
  const { t } = useTranslation(["milkcollection", "common", "master"]);
  const dispatch = useDispatch();
  const { time } = useParams();
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.marathiName || state.dairy.dairyData.center_name
  );
  const dairyphone = useSelector(
    (state) => state.dairy.dairyData.PhoneNo || state.dairy.dairyData.mobile
  );
  const dairyid = useSelector(
    (state) => state.dairy.dairyData.SocietyCode || state.dairy.dairyData.orgid
  );
  const centerid = useSelector(
    (state) =>
      state.dairy.dairyData.center_id || state.dairy.dairyData.center_id
  );
  const tDate = useSelector((state) => state.date.toDate);
  const customerlist = useSelector(
    (state) => state.customers.customerlist || []
  );
  const milkcollRatechart = useSelector((state) => state.ratechart.rateChart);
  const regCustList = useSelector(
    (state) => state.milkCollection.regularCustomers || []
  );
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting //center settings
  );
  const collunit = useSelector(
    (state) => state.dairySetting.centerSetting[0]?.collUnit //center settings
  );
  const prevdata = useSelector(
    (state) => state.milkCollection.prevMilkData || [] //prev milk data fat, snf ,degree
  );
  const payMasters = useSelector(selectPaymasters); // is payment lock

  const [settings, setSettings] = useState({}); //center settings
  const [customerList, setCustomerList] = useState([]);
  const [custList, setCustList] = useState([]); // to check remainning customer list
  const [milkRateChart, setMilkRatechart] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changedDate, setChangedDate] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [slotCount, setSlotCount] = useState(0); //To rerive local stored milk entries
  const [userRole, setUserRole] = useState(null);
  const [isLocked, setIsLocked] = useState(false); // is payment master lock

  const codeInputRef = useRef(null);
  const litersRef = useRef(null);
  const fatRef = useRef(null);
  const snfRef = useRef(null);
  const kgRef = useRef(null);
  const submitbtn = useRef(null);
  const initialValues = {
    date: changedDate || tDate,
    code: "",
    shift: "",
    animal: 0,
    liters: "",
    kg: "",
    fat: "",
    snf: "",
    amt: "",
    degree: 0,
    rate: "",
    cname: "",
    acccode: "",
    rcName: "",
    mobile: "",
    allow: false,
  };

  const [values, setValues] = useState(initialValues);
  //---------------------------------------------------------------------------------------------->
  // Milk Collection list ------------------------------------------------------------------------>
  const milkColl = useSelector((state) => state.milkCollection.entries || [])
    .slice()
    .reverse();
  const [custLists, setCustomersList] = useState({}); // to check remainning customer list
  const [milkData, setMilkData] = useState([]); // to check remainning customer list
  const [isRCust, setIsRCust] = useState(false); // to show remainning customer list

  //get user role -------------------------------------------------------------------------------->

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole.toLowerCase());
  }, []);

  //set settings --------------------------------------------------------------------------------->
  const prevShiftDate = useRef({ date: "", shift: "" });

  useEffect(() => {
    const previnfo = centerSetting?.[0]?.previnfo;
    if (
      previnfo &&
      (values.date !== prevShiftDate.current.date ||
        values.shift !== prevShiftDate.current.shift)
    ) {
      dispatch(getPrevMilkdata({ date: values.date, shift: values.shift }));
      prevShiftDate.current = { date: values.date, shift: values.shift };
    }
  }, [centerSetting, values.date, values.shift]);

  // ----------------------------------------------------------------------->
  // check if payment is lock or not ------------------------------------->
  useEffect(() => {
    if (!payMasters || payMasters.length === 0) {
      dispatch(getPayMasters());
    }
  }, [dispatch, payMasters]);

  // check date is between locked payment masters and update isLocked to true ---------------------->
  useEffect(() => {
    if (values.date) {
      const currentDate = new Date(values.date);

      const foundLocked = payMasters.some((master) => {
        const fromDate = new Date(master.FromDate);
        const toDate = new Date(master.ToDate);

        return (
          currentDate >= fromDate &&
          currentDate <= toDate &&
          master.islock === 1
        );
      });

      setIsLocked(foundLocked);
    } else {
      setIsLocked(false);
    }
  }, [values.date, payMasters]);

  // taost error message when date between locked master ----------------------------------------->
  useEffect(() => {
    if (isLocked && values.date !== tDate) {
      toast.error("Payment is locked for this date, cannot save entry!");
      setValues((prevData) => ({ ...prevData, date: tDate }));
    }
  }, [isLocked]);

  // liter to kg convert and save ---------------------------------------------------------------->

  useEffect(() => {
    if (centerSetting.length > 0) {
      let unit;
      if (centerSetting[0].KgLitres === 0 || centerSetting[0].KgLitres === null) {
        unit = 0.97;
      } else {
        unit = centerSetting[0].KgLitres;
      }
      if (collunit === 0 && values.liters > 0 && unit !== 0) {
        const kgValue = (values.liters * unit).toFixed(2);
        setValues((prevData) => ({ ...prevData, kg: kgValue }));
      } else if (collunit === 1 && values.kg > 0 && unit !== 0) {
        const literValue = (values.kg / unit).toFixed(2);
        setValues((prevData) => ({ ...prevData, liters: literValue }));
      }
    }
  }, [collunit, values.liters, values.kg, centerSetting]);

  // dynamic shift time set in time And allow is updated from state ---------------------------->
  useEffect(() => {
    setValues((prevData) => ({
      ...prevData,
      shift: times === "morning" ? 0 : time === "morning" ? 0 : 1,
      allow: settings.duplicateEntry === 0 ? false : true,
    }));
  }, [time, times, values.shift, settings]);

  //center settings ---------------------------------------------------------------------------->

  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  // Effect to get rate chart from backend ----------------------------------------------------->
  useEffect(() => {
    dispatch(getRateCharts());
    dispatch(listCustomer());
  }, [dispatch]);

  // effect to set rate chart ----------------------------------------------------------------->
  useEffect(() => {
    setMilkRatechart(milkcollRatechart);
  }, [milkcollRatechart]);

  //  handle input fields ---------------------------------------------------------------------->
  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setChangedDate(value);
      if (value > tDate) {
        // Set an error for the date field
        setErrors((prevErrors) => ({
          ...prevErrors,
        }));

        return; // Prevent updating the state if the date is invalid
      } else {
        // Clear the error if the date is valid
        setErrors((prevErrors) => {
          const { date, ...rest } = prevErrors;
          return rest; // Remove date error if valid
        });
      }

      // Update the values state
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }

    setValues({ ...values, [name]: value });

    // Validate field and update errors state
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name];
      return updatedErrors;
    });
  };

  // used for decimal input correction --------------------------------------------------------->
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate and allow only numeric input with an optional single decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear previous errors if the input is valid
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest; // Remove the specific error for this field
      });
    } else {
      // Set an error for invalid input
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]:
          "Invalid input. Only numbers and one decimal point are allowed.",
      }));
      return; // Stop further processing if input is invalid
    }

    // Normalize the value only when it's a valid integer and greater than 9
    if (/^\d+$/.test(value) && value.length > 1) {
      const normalizedValue = (parseInt(value, 10) / 10).toFixed(1);
      setValues((prev) => ({
        ...prev,
        [name]: normalizedValue,
      }));
    }
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name];
      return updatedErrors;
    });
  };
  // // Effect to load customer list from local storage ---------------------------------------->
  useEffect(() => {
    const custLists = customerlist.filter(
      (customer) => customer.centerid === centerid
    );
    setCustomerList(custLists);
  }, [customerlist]);

  // morning evening --------------------------------------------------------------------------->
  const handleTime = () => {
    setTime((prev) => !prev);
    setValues((prevData) => ({
      ...prevData,
      time: !time ? 0 : 1,
    }));
  };

  // finding rate and calculating amount and degree

  const calculateRateAndAmount = async () => {
    try {
      const { fat, snf, liters, rcName } = values;

      const parsedFat = parseFloat(fat);
      const parsedSnf = parseFloat(snf);
      const parsedLiters = parseFloat(liters);
      const degree = (parsedFat * parsedSnf).toFixed(2);
      const rateEntry = milkRateChart.find(
        (entry) =>
          entry.fat === parsedFat &&
          entry.snf === parsedSnf &&
          entry.rctypename === rcName
      );

      if (rateEntry) {
        const rate = parseFloat(rateEntry.rate);
        const amount = rate * parsedLiters;

        setValues((prev) => ({
          ...prev,
          rate: rate.toFixed(2),
          amt: amount.toFixed(2),
          degree: 0,
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          rate: 0,
          amt: 0,
          degree: 0,
        }));
      }
    } catch (error) {
      console.error("Error calculating rate and amount:", error);
    }
  };

  // Trigger calculation whenever liters, fat, or snf change
  useEffect(() => {
    if (values.liters && values.fat && values.snf) {
      calculateRateAndAmount();
    }
  }, [values.liters, values.fat, values.snf]);

  const getToken = () => {
    dispatch(fetchFCMTokens({ cust_no: values.code }));
  };

  // Effect to search for customer when code changes
  useEffect(() => {
    if (values.code.trim().length > 0) {
      const handler = setTimeout(() => {
        // Ensure `code` has valid content before making API calls
        findCustomerByCode(values.code.trim());
        getToken();
      }, 500);

      return () => clearTimeout(handler);
    }
  }, [values.code, dispatch]);

  //finding customer name
  const findCustomerByCode = (code) => {
    if (!code) {
      setValues((prev) => ({ ...prev, cname: "" }));
      return;
    }
    // Ensure the code is a string for comparison
    const customer = customerList.find(
      (customer) => customer.srno.toString() === code
    );
    if (customer) {
      setValues((prev) => ({
        ...prev,
        cname: customer.cname,
        acccode: customer.cid,
        rcName: customer.rcName,
        mobile: customer.Phone || customer.mobile,
      }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
    }
  };

  // console.log(customerlist);

  //calulate slots on the basis of customer no
  // useEffect(() => {
  //   const customerCount = customerList.length;
  //   const fSlots = Math.floor(customerCount / 20);
  //   const remaining = customerCount % 20;
  //   setFullSlots(fSlots);
  // }, [customerList]);

  //store the milk collection entry untile 20 entries and send a collection entry to customer
  //   const saveMilkCollectionDB = async () => {
  //     if (fullSlots !== 0) {
  //       // dispatch milk collection function (slot wise)
  //       if (milkColl.length > 0) {
  //         console.log(milkColl);
  //
  //         await dispatch(saveMilkCollection(milkColl));
  //       }
  //       setFullSlots(fullSlots - 1);
  //     }
  //   };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "code":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Customer code.";
        } else {
          delete errors[name];
        }
        break;

      // case "cname":
      //   if (!/^[\u0900-\u097Fa-zA-Z0-9\s.,_-()]+$/.test(value)) {
      //     errors[name] = "Invalid Customer Name.";
      //   } else {
      //     delete errors[name];
      //   }
      //   break;

      case "liters":
        if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
          error[name] = "Invalid liters.";
        } else {
          delete errors[name];
        }
        break;

      case "kg":
        if (!/^\d+(\.\d{1,4})?$/.test(value.toString())) {
          error[name] = "Invalid kg.";
        } else {
          delete errors[name];
        }
        break;

      case "fat":
      case "snf":
        if (!/^\d+(\.\d{1,1})?$/.test(value.toString())) {
          error[name] = `Invalid ${[name]}.`;
        } else {
          delete errors[name];
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = [
      "code",
      "cname",
      "liters",
      "fat",
      "snf",
      "rate",
      "amt",
    ];

    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, values[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });

    setErrors(validationErrors);
    return validationErrors;
  };
  // retriving milk entry from localstorage to display
  useEffect(() => {
    dispatch(fetchEntries());
  }, [custList]);

  //Handling Collection Notification

  //   const sendNotifications = () => {
  //     const title = "Milk Collection Receipt";
  //     const body = {
  //       name: values.cname,
  //       date: values.date,
  //       fat: values.fat,
  //       snf: values.snf,
  //       liters: values.liters,
  //       rate: values.rate,
  //       amount: values.amt,
  //     };
  //
  //     // Ensure token is available before dispatching
  //     if (!token) {
  //       toast.error("Device token is missing");
  //       return;
  //     }
  //     // Dispatch with a single payload object
  //     dispatch(
  //       sendNewNotification({
  //         title, // Notification title
  //         body, // Notification body details
  //         deviceToken: token, // Device token for the notification
  //       })
  //     );
  //     toast.success(`Notification sent successfully!`);
  //   };

  // const sendNotifications = async () => {
  //   const title = "Milk Collection Receipt";
  //   const body = {
  //     name: values.cname,
  //     date: values.date,
  //     fat: values.fat,
  //     snf: values.snf,
  //     liters: values.liters,
  //     rate: values.rate,
  //     amount: values.amt,
  //   };

  //   // Check if the token exists before proceeding
  //   if (!token) {
  //     toast.error("Device token is missing");
  //     return;
  //   }

  //   try {
  //     // Show toast indicating the notification is being sent
  //     toast.info("Sending notification...");

  //     // Try sending the notification using the token
  //     dispatch(
  //       sendNewNotification({
  //         title, // Notification title
  //         body, // Notification body details
  //         deviceToken: token, // Device token for the notification
  //       })
  //     );

  //     // On success, show a success toast
  //     toast.success(`Notification sent successfully!`);
  //   } catch (error) {
  //     // Handle different token errors
  //     if (error.message.includes("token")) {
  //       // If token is expired or invalid, attempt to refresh or notify the user
  //       toast.error(
  //         "Notification token expired or invalid. Attempting to refresh..."
  //       );

  //       try {
  //         // Refresh token here (ensure you have a function to handle this)
  //         const refreshedToken = await requestForToken();

  //         if (refreshedToken) {
  //           // Update state with new token
  //           setToken(refreshedToken);

  //           // Retry sending the notification with the new token
  //           await dispatch(
  //             sendNewNotification({
  //               title,
  //               body,
  //               deviceToken: refreshedToken,
  //             })
  //           );

  //           toast.success(
  //             "Notification sent successfully with the refreshed token!"
  //           );
  //         } else {
  //           toast.error("Failed to refresh token. Please try again later.");
  //         }
  //       } catch (refreshError) {
  //         toast.error("Error refreshing token: " + refreshError.message);
  //       }
  //     } else {
  //       // If it's another kind of error, display the general error
  //       toast.error(`Error sending notification: ${error.message}`);
  //     }
  //   }
  // };

  // Remove customer from custList

  useEffect(() => {
    const storedRCust = localStorage.getItem("rcustlist");
    if (storedRCust) {
      setCustList(JSON.parse(storedRCust));
    } else {
      setCustList(regCustList);
      localStorage.setItem("rcustlist", JSON.stringify(regCustList));
    }
  }, [regCustList]);

  const removeCustomer = () => {
    const updatedList = custList.filter(
      (customer) => customer.rno.toString() !== values.code.toString()
    );

    setCustList(updatedList);
    localStorage.setItem("rcustlist", JSON.stringify(updatedList));
    return updatedList;
  };

  // ------------------------------------------------------------------------------------->
  // Send Milk Collection Whatsapp Message ------------------------------------------------>

  const datetime = `${values.date}_${values.shift === 0 ? "सकाळ" : "सायंकाळ"}`;

  const sendMessage = async () => {
    const requestBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${values.mobile}`,
      type: "template",
      template: {
        name: "milk_collection_marathi",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: dairyname },
              { type: "text", text: values.cname },
              { type: "text", text: values.code },
              { type: "text", text: values.liters },
              { type: "text", text: values.fat },
              { type: "text", text: values.snf },
              { type: "text", text: values.rate },
              { type: "text", text: values.amt },
              { type: "text", text: "--" },
              { type: "text", text: dairyphone },
              { type: "text", text: datetime },
            ],
          },
        ],
      },
    };
    try {
      const response = await axiosInstance.post("/send-message", requestBody);
      if (response?.data.success) {
        toast.success("Whatsapp message send successfully...");
        const smsData = {
          smsStatus: "Sent",
          mono: values.mobile,
          custCode: values.code,
          rNo: "8600",
          smsText: requestBody,
        };

        dispatch(saveMessage(smsData));
      }
    } catch (error) {
      toast.error("Error in whatsapp message sending...");
      console.error("Error sending message:", error);
    }
  };

  const sendNoRateMessage = async () => {
    const requestBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${values.mobile}`,
      type: "template",
      template: {
        name: "milk_collection_marathi_norate",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: dairyname },
              { type: "text", text: values.cname },
              { type: "text", text: values.code },
              { type: "text", text: values.liters },
              { type: "text", text: values.fat },
              { type: "text", text: values.snf },
              { type: "text", text: 0 },
              { type: "text", text: 0 },
              { type: "text", text: "--" },
              { type: "text", text: dairyphone },
              { type: "text", text: datetime },
            ],
          },
        ],
      },
    };
    try {
      const response = await axiosInstance.post("/send-message", requestBody);
      if (response?.data.success) {
        toast.success("Whatsapp message send successfully...");
        const smsData = {
          smsStatus: "Sent",
          mono: values.mobile,
          custCode: values.code,
          rNo: "8600",
          smsText: requestBody,
        };

        dispatch(saveMessage(smsData));
      }
    } catch (error) {
      toast.error("Error in whatsapp message sending...");
      console.error("Error sending message:", error);
    }
  };

  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  // Handle reset button ------------------------------------------------------------------------------------------>

  const handleResetButton = (e) => {
    e.preventDefault();
    setValues(initialValues);
  };

  //Handling Milk Collection  ------------------------------------------------------------------------------------->

  // const handleCollection = async (e) => {
  //   e.preventDefault();

  //   // Validate fields before submission
  //   const validationErrors = validateFields();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   const result = await dispatch(saveMilkOneEntry(values)).unwrap();
  //   console.log("result", result);
  //   if (result.status === 200) {
  //     const allEntries = JSON.parse(localStorage.getItem("milkentries")) || [];
  //     const existingEntries =
  //       JSON.parse(localStorage.getItem("milkentries")) || [];

  //     await existingEntries.push(values);
  //     localStorage.setItem("milkentries", JSON.stringify(existingEntries));
  //     setValues(initialValues); // Reset form to initial values
  //     setErrors({}); // Reset errors

  //     // sendNotifications();

  //     // toast.success(`Milk Collection of ${values.cname} saved successfully!`);
  //     toast.success(result.message);

  //     // Remove customer from custList
  //     // setCustList((prevList) =>
  //     //   prevList.filter((customer) => customer.srno.toString() !== values.code)
  //     // );
  //     removeCustomer();
  //     if (
  //       settings?.whsms !== undefined &&
  //       settings?.millcoll !== undefined &&
  //       settings.whsms === 1 &&
  //       settings.millcoll === 1
  //     ) {
  //       sendMessage();
  //     }
  //     codeInputRef.current.focus();
  //   } else {
  //     toast.error(result.message);
  //   }

  //   //     if (slotCount === 20) {
  //   //       try {
  //   //         const allEntries =
  //   //           JSON.parse(localStorage.getItem("milkentries")) || [];
  //   //         console.log(allEntries);
  //   //
  //   //         // Send entries to backend (use an API call here)
  //   //         await setmilkEntry(allEntries);
  //   //         await saveMilkCollectionDB();
  //   //
  //   //         // Clear the entries from localStorage after sending to backend
  //   //         await localStorage.removeItem("milkentries");
  //   //
  //   //         // Reset slot count
  //   //         setSlotCount(0);
  //   //
  //   //         // Remove customer from custList
  //   //         await setCustList((prevList) =>
  //   //           prevList.filter((customer) => customer.srno !== values.code)
  //   //         );
  //   //       } catch (error) {
  //   //         console.error("Error sending milk entries to backend:", error);
  //   //       }
  //   //     }
  //   //
  //   //     if (fullSlots > 0) {
  //   //       // If all validations pass, proceed with saving to localStorage
  //   //       const existingEntries =
  //   //         JSON.parse(localStorage.getItem("milkentries")) || [];
  //   //
  //   //       existingEntries.push(values);
  //   //       localStorage.setItem("milkentries", JSON.stringify(existingEntries));
  //   //       console.log("saved entries", existingEntries);
  //   //
  //   //       setMilkCollEntry(existingEntries);
  //   //
  //   //       // // Remove customer from custList after saving entry to localStorage
  //   //       // const updatedList = custList.filter(
  //   //       //   (customer) => customer.srno !== values.code
  //   //       // );
  //   //       // console.log("custList");
  //   //       // setCustList(updatedList);
  //   //       removeCustomerFromList();
  //   //
  //   //       toast.success(`Milk Collection of ${values.cname} saved successfully!`);
  //   //
  //   //       // Increment the slot count
  //   //       setSlotCount(slotCount + 1);
  //   //     }
  //   //
  //   //     if (fullSlots === 0) {
  //   //       await dispatch(saveMilkOneEntry(values));
  //   //       await localStorage.removeItem("milkentries");
  //   //
  //   //       toast.success(`Milk Collection of ${values.cname} saved successfully!`);
  //   //
  //   //       // Remove customer from custList after saving the entry
  //   //       setCustList((prevList) =>
  //   //         prevList.filter((customer) => customer.srno !== values.code)
  //   //       );
  //   //     }
  // };

  const fetchEntries = () => (dispatch) => {
    const allEntries =
      JSON.parse(localStorage.getItem(`milk_${dairyid}_${centerid}`)) || [];
    dispatch(setEntries(allEntries));
  };

  const handleCollection = async (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (values.cname === "") {
      return toast.error("तुम्ही टाकलेल्या कोडसाठी उत्पादक बनवलेला नाही!");
    }

    setLoading(true);
    try {
      const result = await dispatch(saveMilkOneEntry(values)).unwrap();
      if (result?.status === 200) {
        setValues(initialValues);
        const existingEntries =
          JSON.parse(localStorage.getItem(`milk_${dairyid}_${centerid}`)) || [];
        existingEntries.push(values);
        localStorage.setItem(
          `milk_${dairyid}_${centerid}`,
          JSON.stringify(existingEntries)
        );
        fetchEntries();
        setErrors({});
        toast.success(result.message || "Milk Collection saved successfully!");
        // if (settings.printmilKcoll === 1) {
        //   printMilkReceipt(values);
        // }
        dispatch(getRegCustomers({ collDate: values.date, ME: values.shift }));

        if (
          settings?.whsms !== undefined &&
          settings?.millcoll !== undefined &&
          settings.whsms === 1 &&
          settings.millcoll === 1
        ) {
          if (values.mobile.length === 10 && values.mobile !== "0000000000") {
            if (settings.noRatesms !== 0) {
              sendNoRateMessage();
            } else {
              sendMessage();
            }
          } else {
            toast.warn("Mobile number is not valid, message not sent!");
          }
        }
        codeInputRef.current.focus();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const errorMessage = error?.message || "Failed to save milk collection!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------------------------------->
  // -------------------------------------------------------------------------------------------------->
  // Milk Collection list
  // -------------------------------------------------------------------------------------------------->

  useEffect(() => {
    if (!milkColl || milkColl.length === 0) return; // Ensure milkColl is not empty
    const ME = times === "morning" ? 0 : time === "morning" ? 0 : 1; // Determine ME based on time
    const MilkEntries = milkColl.filter(
      (entry) => entry.shift.toString() === ME.toString()
    ); // Only update state if filtered data has changed
    setMilkData((prevMilkData) => {
      return JSON.stringify(prevMilkData) !== JSON.stringify(MilkEntries)
        ? MilkEntries
        : prevMilkData;
    });
  }, [milkColl, time]);

  useEffect(() => {
    const storedCustList = localStorage.getItem("rcustlist");
    if (storedCustList) {
      setCustomersList(JSON.parse(storedCustList));
    } else {
      setCustomersList([]);
    }
  }, []);

  const handleRemainingCustomers = async (e) => {
    e.preventDefault();
    setIsRCust(!isRCust);
  };

  // ---------------------------------------------------------------------------->
  // print milk collection ------------------------------------------------------>
  // function printMilkReceipt(data) {
  //   const html = `
  //     <div class="receipt thermal-58">
  //       <div class="center bold">${dairyname}</div>
  //       <div class="flex-row space-between">
  //         <span>${data.date}</span>
  //         <span>${data.shift === 0 ? "सकाळ" : "सायंकाळ"}</span>
  //       </div>
  //       <div class="flex-row space-between">
  //         <span>${data.code}</span><span> ${data.cname}</span>
  //       </div>
  //       <hr>
  //       <table class="receipt-table">
  //         <tr><td class="flex"><span>लिटर :</span><span> ${
  //           data.liters
  //         }</span></td></tr>
  //         <tr><td class="flex"><span>फॅट :</span><span>${
  //           data.fat
  //         }</span></td><td class="center">एकूण दुध</td></tr>
  //         <tr><td class="flex"><span>डिग्री :</span><span>${
  //           data.degree
  //         }</span> </td><td class="center">${data.amt}</td></tr>
  //         <tr><td class="flex"><span>SNF :</span><span>${
  //           data.snf
  //         }</span></td><td class="center">एकूण रक्कम</td></tr>
  //         <tr><td class="flex"><span>दर :</span><span> ${
  //           data.rate
  //         }</span></td><td class="center">${data.amt}</td></tr>
  //         <tr><td class="bold flex"><span>रक्कम :</span><span> ${
  //           data.amt
  //         }</span></td></tr>
  //       </table>
  //       <div class="text center"><p>स्मार्ट डेअरी - ${dairyphone}</p></div>
  //     </div>
  //   `;

  //   const printWindow = window.open("", "", "width=300,height=600");
  //   printWindow.document.write("<html><head><title>Print</title>");
  //   printWindow.document.write(`<style>
  //     body { font-family: 'Devanagari', sans-serif; font-size: 12px; margin: 0; }

  //     .receipt.thermal-58 {
  //       width: 58mm;
  //       padding: 5px;
  //       border: 1px solid #000;
  //       border-radius: 5px;
  //     }

  //     .center { text-align: center; }
  //     .text { font-size: 8px; }
  //     .bold { font-weight: bold; }

  //     .flex-row { display: flex; justify-content: space-between; }
  //     .flex { width: auto; display: flex; justify-content: space-between;}
  //     .space-between { margin: 2px 0; }

  //     table.receipt-table {
  //       width: 100%;
  //       border-collapse: collapse;
  //       margin-top: 5px;
  //       border: 1px solid #000;
  //       overflow: hidden;
  //     }

  //     table.receipt-table td {
  //       padding: 2px 4px;
  //       font-size: 12px;
  //       border-right: 1px solid #000;
  //     }

  //     table.receipt-table tr {
  //       padding: 2px 4px;
  //       font-size: 12px;
  //       border-bottom: 1px solid #000;
  //     }

  //     hr {
  //       border: none;
  //       border-top: 1px dashed #000;
  //       margin: 5px 0;
  //     }
  //   </style>`);
  //   printWindow.document.write("</head><body>");
  //   printWindow.document.write(html);
  //   printWindow.document.write("</body></html>");
  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.close();
  // }

  return (
    <div className="milk-collection-outer-main-container w100 h1 d-flex sb p10">
      <form
        onSubmit={handleCollection}
        className="milk-col-form w60 h1 d-flex-col bg p10"
      >
        <span className="heading w100 t-center py10">
          {values.shift === 0 ? `${t("common:c-mrg")}` : `${t("common:c-eve")}`}{" "}
          {t("m-milkcoll")}
        </span>
        <div className="form-setting w100 h10 d-flex a-center sb ">
          <div className="w60 d-flex a-center px10">
            <label htmlFor="date" className="info-text w30">
              {t("common:c-date")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data w50 ${errors.date ? "input-error" : ""}`}
              type="date"
              required
              placeholder="0000"
              name="date"
              id="date"
              onChange={handleInputs}
              value={values.date || ""}
              max={tDate}
            />
          </div>
          <div className="setting-btn-switch w20 j-center d-flex">
            <button
              type="button"
              className={`sakalan-time text ${
                values.shift === 0 ? "on" : "off"
              }`}
              aria-pressed={time}
            >
              {values.shift === 0
                ? `${t("common:c-mrg")}`
                : `${t("common:c-eve")}`}
            </button>
          </div>
          {userRole === "admin" ? (
            <BsGearFill
              type="button"
              className="color-icon w10"
              onClick={() => {
                setModalOpen(true);
              }}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="user-details w100 h20 d-flex">
          <div className="form-div w50 px10">
            <label htmlFor="code" className="info-text">
              {t("m-cust-code")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.code ? "input-error" : ""}`}
              type="number"
              required
              placeholder="0000"
              name="code"
              id="code"
              value={values.code}
              onChange={handleInputs}
              ref={codeInputRef}
              onKeyDown={(e) => handleKeyDown(e, litersRef)}
            />
          </div>
          <div className="form-div w50 px10">
            <label htmlFor="cname" className="info-text">
              {t("m-cust-name")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.cname ? "input-error" : ""}`}
              type="text"
              required
              placeholder={`${t("m-cust-name")}`}
              name="cname"
              id="cname"
              value={values.cname}
              readOnly
            />
          </div>
        </div>
        <div className="milk-details-div w100 h70 d-flex">
          <div className="milk-info w50 h1 d-flex-col">
            {collunit === 0 ? (
              <div className="form-div px10">
                <label htmlFor="liters" className="info-text">
                  {t("common:c-liters")} <span className="req">*</span>{" "}
                </label>
                <input
                  className={`data ${errors.liters ? "input-error" : ""}`}
                  type="number"
                  required
                  placeholder="00.0"
                  name="liters"
                  id="liters"
                  step="any"
                  onChange={handleInputs}
                  disabled={!values.code}
                  value={values.liters}
                  onKeyDown={(e) => handleKeyDown(e, fatRef)}
                  ref={litersRef}
                />
              </div>
            ) : (
              <div className="form-div px10">
                <label htmlFor="kg" className="info-text">
                  {t("किलो")} <span className="req">*</span>{" "}
                </label>
                <input
                  className={`data ${errors.kg ? "input-error" : ""}`}
                  type="number"
                  required
                  placeholder="00.0"
                  name="kg"
                  id="kg"
                  step="any"
                  onChange={handleInputs}
                  disabled={!values.code}
                  value={values.kg}
                  onKeyDown={(e) => handleKeyDown(e, fatRef)}
                  ref={kgRef}
                />
              </div>
            )}

            <div className="form-div  px10">
              <label htmlFor="fat" className="info-text">
                {t("common:c-fat")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.fat ? "input-error" : ""}`}
                type="number"
                required
                placeholder="0.0"
                name="fat"
                id="fat"
                step="any"
                onChange={handleInputChange}
                value={values.fat}
                disabled={!values.code}
                onKeyDown={(e) => handleKeyDown(e, snfRef)}
                ref={fatRef}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="snf" className="info-text">
                {t("common:c-snf")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.snf ? "input-error" : ""}`}
                type="number"
                required
                placeholder="00.0"
                name="snf"
                id="snf"
                step="any"
                onChange={handleInputChange}
                value={values.snf}
                disabled={!values.fat || !values.code}
                onKeyDown={(e) => handleKeyDown(e, submitbtn)}
                ref={snfRef}
              />
            </div>
          </div>
          <div className="milk-info w50 h1 d-flex-col">
            <div className="form-div px10">
              <label htmlFor="degree" className="info-text">
                {t("common:c-deg")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.degree ? "input-error" : ""}`}
                type="number"
                required
                disabled
                placeholder="00.0"
                name="degree"
                id="degree"
                value={values.degree}
                onChange={handleInputs}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="rate" className="info-text">
                {t("common:c-rate")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.rate ? "input-error" : ""}`}
                type="number"
                required
                readOnly
                placeholder="00.0"
                name="rate"
                id="rate"
                value={values.rate}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="amt" className="info-text">
                {t("common:c-amt")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.amt ? "input-error" : ""}`}
                type="number"
                required
                readOnly
                placeholder="00.0"
                name="amt"
                id="amt"
                value={values.amt}
              />
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="form-btns w100 h10 d-flex a-center j-end">
          <button
            className="w-btn label-text"
            type="reset"
            onClick={handleResetButton}
          >
            {t("m-btn-cancel")}
          </button>
          <button
            className="w-btn label-text mx10"
            type="submit"
            ref={submitbtn}
            disabled={loading || isLocked}
          >
            {loading ? "saving..." : `${t("m-btn-save")}`}
          </button>
        </div>
      </form>

      {/* ------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------ */}

      <div className="milk-collection-list w38 h1 d-flex-col bg">
        <div className="title-container w100 h10 d-flex a-center sb p10">
          <h2 className="heading">
            {isRCust ? t("master:m-custlist") : t("m-coll-list")}
          </h2>
          <button className="btn info-text" onClick={handleRemainingCustomers}>
            {isRCust ? t("m-coll-list") : t("master:m-custlist")}
          </button>
        </div>

        {!isRCust ? (
          <div className="collection-list-container w100 h90 d-flex-col hidescrollbar p10">
            {milkData.length > 0 ? (
              milkData.map((entry, i) => (
                <div
                  key={i}
                  className="collection-details w100 d-flex-col bg3 br6"
                >
                  <div className="col-user-info w100 h40 d-flex a-center sa p10">
                    <span className="text w20">{entry.code}</span>
                    <span className="text w70">{entry.cname}</span>
                  </div>
                  <div className="line"></div>
                  <div className="col-milk-info w100 h60 d-flex-col">
                    <div className="info-title w100 h50 d-flex sa">
                      <span className="text w15 d-flex center">
                        {t("common:c-liters")}
                      </span>
                      <span className="text w15 d-flex center">
                        {t("common:c-fat")}
                      </span>
                      <span className="text w15 d-flex center">
                        {t("common:c-snf")}
                      </span>
                      <span className="text w20 d-flex center">
                        {t("common:c-rate")}
                      </span>
                      <span className="text w20 d-flex center">
                        {t("common:c-amt")}
                      </span>
                    </div>
                    <div className="info-value w100 h50 d-flex sa">
                      <span className="text w15 d-flex center">
                        {entry.liters || "00.0"}
                      </span>
                      <span className="text w15 d-flex center">
                        {entry.fat || "00.0"}
                      </span>
                      <span className="text w15 d-flex center">
                        {entry.snf || "00.0"}
                      </span>
                      <span className="text w20 d-flex center">
                        {entry.rate || "00.0"}
                      </span>
                      <span className="text w20 d-flex center">
                        {entry.amt || "00.0"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-records w100 h1 d-flex center">
                <span className="label-text">{t("common:c-no-data-avai")}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="remaing-customer-list-container w100 h90 mh90 d-flex-col hidescrollbar">
            <div className="customer-details-heading-container w100 p10 d-flex a-center t-center sb sticky-top bg1">
              <span className="f-info-text w15">{t("master:m-ccode")}</span>
              <span className="f-info-text w50">{t("master:m-cname")}</span>
              <span className="f-info-text w30">{t("master:m-mobile")}</span>
            </div>
            {regCustList.length > 0 ? (
              regCustList.map((customer, index) => (
                <div
                  key={index}
                  className={`customer-details-data-container w100 h10 d-flex a-center sb ${
                    index % 2 === 0 ? "bg-light" : "bg-dark"
                  }`}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  }}
                >
                  <span className="info-text w15 t-center">{customer.rno}</span>
                  <span className="info-text w50">{customer.cname}</span>
                  <span className="info-text w30 t-start">
                    {customer.Phone}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-records w100 h1 d-flex center">
                <span className="label-text">{t("common:c-no-data-avai")}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="model-container w100 d-flex center">
          <CollSettings clsebtn={setModalOpen} isModalOpen={isModalOpen} />
        </div>
      )}
    </div>
  );
};

export default MilkColleform;
