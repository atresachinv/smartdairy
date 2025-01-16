import React from 'react';
import { NavLink } from 'react-router-dom';

const PaymentsNavlinks = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/payments/overview" activeClassName="active">
            Overview
          </NavLink>
        </li>
        <li>
          <NavLink to="/payments/history" activeClassName="active">
            History
          </NavLink>
        </li>
        <li>
          <NavLink to="/payments/settings" activeClassName="active">
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default PaymentsNavlinks;