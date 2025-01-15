const NotificationService = require("../src/Service/NotificationService");

const sendNotification = async (req, res) => {
  const { title, body, deviceToken } = req.body;
  console.log(title, body, deviceToken);

  try {
    const message = `Name: ${body.name} Date: ${body.date}\nFat: ${body.fat}, SNF: ${body.snf}, Liters: ${body.liters}, \nRate: ${body.rate}, Amount: ${body.amount}`;

    const response = await NotificationService.sendNotification(
      deviceToken,
      title,
      message
    );

    console.log("Notification response:", response); // Log Firebase response

    res.status(200).json({
      message: "Notification sent successfully!",
      response,
    });
  } catch (error) {
    console.error("Error in sendNotification:", error); // Log error details
    res.status(500).json({
      message: "Error sending notification",
    });
  }
};

module.exports = sendNotification;
