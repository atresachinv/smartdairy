import React from "react";
import { BsDatabaseAdd } from "react-icons/bs";

const PaymentNavlinks = ({ isselected, setIsSelected }) => {
  const paymentnavlinks = [
    {
      name: `कपात रिपोर्ट`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: `पेमेंट रजिस्टर`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: `पेमेंट समरी`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 2,
      role: ["super_admin", "admin", "manager"],
    },
  ];
  return (
    <>
      {paymentnavlinks.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
          }}
        >
          <a className="f-label-text">
            <span>{button.icon}</span>
            {button.name}
          </a>
        </li>
      ))}
    </>
  );
};

export default PaymentNavlinks;
