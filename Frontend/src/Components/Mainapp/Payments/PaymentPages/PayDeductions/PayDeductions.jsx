import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentsDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";

const PayDeductions = () => {
  const dispatch = useDispatch();
  const deduction = useSelector((state) => state.deduction.alldeductionInfo);
  const [groupedData, setGroupedData] = useState([]);
  const [dnames, setDnames] = useState([]);

  const start = "2024-11-11";
  const end = "2024-11-20";

  useEffect(() => {
    dispatch(
      getPaymentsDeductionInfo({
        fromDate: start,
        toDate: end,
      })
    );
  }, [dispatch, start, end]);

  useEffect(() => {
    if (deduction && deduction.length > 0) {
      const grouped = deduction.reduce((acc, item) => {
        const {
          BillNo,
          AMT,
          dname,
          DeductionId,
          tliters,
          pamt,
          damt,
          namt,
          Code,
        } = item;

        // Initialize Code entry if it doesn't exist
        if (!acc[Code]) {
          acc[Code] = {
            Code,
            tliters: 0,
            pamt: 0,
            damt: 0,
            namt: 0,
            additionalDeductions: {},
          };
        }

        // Aggregate base values
        acc[Code].tliters += tliters;
        acc[Code].pamt += pamt;
        acc[Code].damt += damt;
        acc[Code].namt += namt;

        // Aggregate additional deductions
        if (DeductionId !== 0) {
          if (!acc[Code].additionalDeductions[dname]) {
            acc[Code].additionalDeductions[dname] = 0;
          }
          acc[Code].additionalDeductions[dname] += AMT;
        }

        return acc;
      }, {});
      console.log(grouped);

      // Convert grouped data to an array
      const groupedArray = Object.values(grouped);
      setGroupedData(groupedArray);

      // Extract unique dnames
      const allDnames = new Set();
      groupedArray.forEach((item) => {
        Object.keys(item.additionalDeductions).forEach((dname) => {
          allDnames.add(dname);
        });
      });
      setDnames([...allDnames]);
    }
  }, [deduction]);

  return (
    <div>
      <h2>Grouped Deduction Data by Code</h2>
      {groupedData.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Code</th>
              <th>tliters</th>
              <th>pamt</th>
              <th>damt</th>
              <th>namt</th>
              {dnames.map((dname) => (
                <th key={dname}>{dname}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupedData.map((item) => (
              <tr key={item.Code}>
                <td>{item.Code}</td>
                <td>{item.tliters}</td>
                <td>{item.pamt}</td>
                <td>{item.damt}</td>
                <td>{item.namt}</td>
                {dnames.map((dname) => (
                  <td key={dname}>
                    {item.additionalDeductions[dname]
                      ? item.additionalDeductions[dname]
                      : 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PayDeductions;
