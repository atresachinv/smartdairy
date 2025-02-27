import React from "react";
import { useTranslation } from "react-i18next";

const MilksalesReport = () => {
  const { t } = useTranslation(["common", "milkcollection"]);
  return (
    <div>
      <span>{t("milkcollection:m-retail-ms-report")}</span>
    </div>
  );
};

export default MilksalesReport;
