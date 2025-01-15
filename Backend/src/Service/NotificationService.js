const admin = require("../utils/firebaseAdmin");

class NotificationService {
  static async sendNotification(deviceToken, title, body) {
    const message = {
      notification: {
        title,
        body,
      },
      token: deviceToken,
    };
    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw new Error("Failed to send notification.");
    }
  }
}

module.exports = NotificationService;

// const admin = require("../utils/firebaseAdmin");
// // const admin = require("firebase-admin");
//
// class NotificationService {
//   static async sendNotification(deviceToken, title, body) {
//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       token: deviceToken,
//     };
//     try {
//       const response = await admin.messaging().send(message);
//       return response;
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       throw new Error("Failed to send notification.");
//     }
//   }
// }
//
// module.exports = NotificationService;

// // Load environment variables
// const dotenv = require("dotenv");
// dotenv.config({ path: ".env" });
//
// // Correct import for Firebase Admin
// const admin = require("firebase-admin");
//
// // Firebase Admin SDK initialization
// const serviceAccount = {
//   type: "service_account",
//   project_id: "smartdairy-flash-notifi",
//   private_key_id: process.env.FCMPRIVATE_KEY_ID,
//   private_key: process.env.FCMPRIVATE_KEY.replace(/\\n/g, "\n"), // Replace \n with actual newlines
//   client_email: process.env.FCMCLIENT_MAIL,
//   client_id: process.env.FCMCLIENT_ID,
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url: process.env.CLIENT_CERT_URL,
// };
//
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
//
// class NotificationService {
//   static async sendNotification(deviceToken, title, body) {
//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       token: deviceToken,
//     };
//     try {
//       const response = await admin.messaging().send(message);
//       return response;
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       throw new Error("Failed to send notification.");
//     }
//   }
// }
//
// module.exports = NotificationService;
