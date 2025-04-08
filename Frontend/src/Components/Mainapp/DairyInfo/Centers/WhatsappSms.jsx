import { useEffect, useState } from "react";
import axiosInstance from "../../../../App/axiosInstance";

const WhatsappSms = () => {
  const [whsms, setWhsms] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both balance and history in parallel
        const [balanceResponse, historyResponse] = await Promise.all([
          axiosInstance.get("/whsms-balance"),
          axiosInstance.get("/whsms-history"),
        ]);

        setBalance(balanceResponse.data?.data || 0);
        setWhsms(historyResponse.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="d-flex-col h1 w100">
      <div className="w100 h10 d-flex heading j-center a-center">
        Whatsapp Messages History
      </div>
      <div className="d-flex j-center a-center">
        <span
          className={`info-text ${balance - whsms.length < 0 ? "req" : ""}`}
        >
          Your Balance : {balance - whsms.length}
        </span>
      </div>
      <div className="bg p10 m10">
        <table>
          <thead>
            <tr>
              <th>SrNo</th>
              <th>Cust Code</th>
              <th>mono</th>
              <th>status</th>
              <th>smsDate</th>
              <th>template</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="d-flex j-center a-center">Loading...</div>
            ) : whsms.length > 0 ? (
              whsms
                .sort((a, b) => new Date(b.smsDate) - new Date(a.smsDate))
                .map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.custCode}</td>
                    <td>{item.mono}</td>
                    <td>{item.smsStatus}</td>
                    <td>{formatDate(item.smsDate)}</td>
                    <td>{JSON.parse(item.smsText).template.name}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className=" text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WhatsappSms;
