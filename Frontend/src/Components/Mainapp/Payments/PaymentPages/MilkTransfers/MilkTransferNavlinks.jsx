import React from "react";
import { BiTransfer } from "react-icons/bi";
import { GrDocumentTransfer } from "react-icons/gr";
import { MdContentCopy } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import "../../../../../Styles/Mainapp/Payments/MilkCorrection.css";
const MilkTransferNavlinks = ({ isselected, setIsSelected }) => {
  const milkNavlinks = [
    {
      name: "Transfer To Customer",
      icon: <BiTransfer className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Transfer To Date",
      icon: <GrDocumentTransfer className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Transfer To Shift",
      icon: <GrDocumentTransfer className="icon" />,
      index: 2,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Copy Paste ",
      icon: <MdContentCopy className="icon" />,
      index: 3,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Delete Collection",
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
            isselected === button.index ? "active-nav" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
          }}>
          <a>
            {button.icon}
            <span>{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default MilkTransferNavlinks;
