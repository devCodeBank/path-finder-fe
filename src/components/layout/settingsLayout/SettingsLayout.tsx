import React from "react";
import { Outlet } from "react-router-dom";
import SettingsNavigation from "../settingsNavigation";
import PageLayout from "../platformLayout/PageLayout";

export const SettingsLayout: React.FC = () => {
  return (
    <PageLayout sidebar={<SettingsNavigation />}>
      <Outlet />
    </PageLayout>
  );
};

export default SettingsLayout;
