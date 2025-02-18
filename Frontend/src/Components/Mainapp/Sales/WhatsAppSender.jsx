import axiosInstance from "../../../App/axiosInstance";

export const sendMessage = async ({ to, dName, cName }) => {
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
            { type: "text", text: "1/23/2025" },
            { type: "text", text: "002" },
            { type: "text", text: "1000" },
            { type: "text", text: "deatails of product" },
            { type: "text", text: "9112904855" },
          ],
        },
      ],
    },
  };

  try {
    const response = await axiosInstance.post("/send-message", requestBody); // ✅ Remove JSON.stringify()
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
