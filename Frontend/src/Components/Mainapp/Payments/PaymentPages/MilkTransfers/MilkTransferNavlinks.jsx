import React from "react";
import { BiTransfer } from "react-icons/bi";
import { GrDocumentTransfer } from "react-icons/gr";
import { MdContentCopy } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import "../../../../../Styles/Mainapp/Payments/MilkCorrection.css";
import { NavLink } from "react-router-dom";
const MilkTransferNavlinks = ({ isselected, setIsSelected }) => {
  const milkNavlinks = [
    {
      name: "Transfer To Customer",
      path: "to-customer",
      icon: <BiTransfer className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Transfer To Date",
      path: "to-date",
      icon: <GrDocumentTransfer className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Transfer To Shift",
      path: "to-shift",
      icon: <GrDocumentTransfer className="icon" />,
      index: 2,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Copy Paste ",
      path: "copy-paste",
      icon: <MdContentCopy className="icon" />,
      index: 3,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Delete Collection",
      path: "delete-collection",
      icon: <RiDeleteBin6Line className="icon" />,
      index: 4,
      role: ["super_admin", "admin", "manager"],
    },
  ];

  return (
    <>
      {milkNavlinks.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.path ? "active-nav" : ""
          }`}
          onClick={() => {
            setIsSelected(button.path);
          }}
        >
          <NavLink to={button.path} className={"sub-navlinks f-label-text"}>
            {button.icon}
            <span>{button.name}</span>
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default MilkTransferNavlinks;
