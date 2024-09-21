import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import mrTranslation from "./Marathi/Marathi.json";
import commonMr from "./Marathi/Common.json";
import enTranslation from "./English/English.json";
import commonEg from "./English/Common.json";

i18n.use(initReactI18next).init({
  resources: {
    mr: {
      translation: mrTranslation,
      common: commonMr,
    },
    en: {
      translation: enTranslation,
      common: commonEg,
    },
  },
  lng: "mr", // Default language
  fallbackLng: "en", // Fallback to English if translation not found in Marathi
  ns: ["common", "translation"], // Defined namespaces
  defaultNS: "translation", // Default namespace to use if none is specified
  interpolation: {
    escapeValue: false, // React already escapes values to prevent XSS
  },
});

export default i18n;
