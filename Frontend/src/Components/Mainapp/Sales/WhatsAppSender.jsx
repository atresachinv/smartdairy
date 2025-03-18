import axiosInstance from "../../../App/axiosInstance";
import { saveMessage } from "../../../App/Features/Mainapp/Dairyinfo/smsSlice";
import { store } from "../../../App/Store";
import { toast } from "react-toastify";

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
    const response = await axiosInstance.post("/send-message", requestBody);
    if (response?.data.success) {
      toast.success("WhatsApp message sent successfully...");
      // Save message in database
      const smsData = {
        smsStatus: "Sent",
        mono: to,
        custCode: cName.split("-")[0],
        rNo: rctNo,
        smsText: requestBody,
      };

      store.dispatch(saveMessage(smsData));
    } else if (response.status === 200) {
      toast.error(response.data.message);
    } else {
      toast.error("Don't sent WhatsApp message...");
    }
  } catch (error) {
    toast.error("Error in WhatsApp message sending...");
    console.error("Error sending message:", error);
  }
};
