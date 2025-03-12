import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Marathi
import mrTranslation from "./Marathi/Marathi.json";
import commonMr from "./Marathi/Common.json";
import collectionmr from "./Marathi/MilkCollection.json";
import milksalesmr from "./Marathi/MilkSales.json";
import inventorymr from "./Marathi/Inventory.json";
import mastermr from "./Marathi/Masters.json";
import puchasesalemr from "./Marathi/PurchaseSale.json";
import ratechartmr from "./Marathi/Ratechart.json";

// English
import enTranslation from "./English/English.json";
import commonEg from "./English/Common.json";
import collectioneg from "./English/MilkCollection.json";
import milksaleseg from "./English/MilkSales.json";
import inventoryeg from "./English/Inventory.json";
import mastereg from "./English/Masters.json";
import puchasesaleeg from "./English/PurchaseSale.json";
import ratecharteg from "./English/Ratechart.json";

i18n.use(initReactI18next).init({
  resources: {
    mr: {
      translation: mrTranslation,
      common: commonMr,
      milkcollection: collectionmr,
      msales: milksalesmr,
      inventory: inventorymr,
      master: mastermr,
      puchasesale: puchasesalemr,
      ratechart: ratechartmr,
    },
    en: {
      translation: enTranslation,
      common: commonEg,
      milkcollection: collectioneg,
      msales: milksaleseg,
      inventory: inventoryeg,
      master: mastereg,
      puchasesale: puchasesaleeg,
      ratechart: ratecharteg,
    },
  },
  lng: "mr", // Default language
  fallbackLng: "en", // Fallback to English if translation not found in Marathi
  ns: [
    "common",
    "milkcollection",
    "msales",
    "inventory",
    "master",
    "puchasesale",
    "ratechart",
  ], // Defined namespaces
  defaultNS: "translation", // Default namespace to use if none is specified
  interpolation: {
    escapeValue: false, // React already escapes values to prevent XSS
  },
});

export default i18n;
