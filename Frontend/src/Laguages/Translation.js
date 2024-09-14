import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import mrTranslation from "./Marathi/Marathi.json";
import enTranslation from "./English/English.json";

i18n.use(initReactI18next).init({
  resources: {
    mr: { translation: mrTranslation },
    en: { translation: enTranslation },
  },
  lng: "mr", // Default language
  fallbackLng: "en", // Fallback language if key is missing in selected language
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
