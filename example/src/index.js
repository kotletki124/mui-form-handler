import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import AsyncValidationForm from "./asyncValidation";
import BasicForm from "./basic";
import DependentFieldsForm from "./dependentFields";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ExampleApp() {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Basic" />
        <Tab label="Async" />
        <Tab label="Dependent Fields" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <BasicForm />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <AsyncValidationForm />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <DependentFieldsForm />
      </TabPanel>
    </>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<ExampleApp />);
