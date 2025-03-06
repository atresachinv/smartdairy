import axiosInstance from "../../../App/axiosInstance";

export const sendMessage = async ({
  to,
  dName,
  cName,
  date,
  rctNo,
  amount,
  products,
  mono,
}) => {
  const requestBody = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `91${to}`,
    type: "template",
    template: {
      name: "cattlefeed_sale_sms",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: dName },
            { type: "text", text: cName },
            { type: "text", text: date },
            { type: "text", text: rctNo },
            { type: "text", text: amount },
            { type: "text", text: products },
            { type: "text", text: mono },
          ],
        },
      ],
    },
  };

  try {
    // console.log(requestBody);
    const response = await axiosInstance.post("/send-message", requestBody); // ✅ Remove JSON.stringify()
    toast.success("Whatsapp message send successfully...");
    // console.log("Response:", response.data);
  } catch (error) {
    toast.error("Error in whatsapp message sending...");
    console.error("Error sending message:", error);
  }
};
