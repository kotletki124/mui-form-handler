import { styled } from "@mui/material/styles";

export const FormContainer = styled("form")({
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  width: 300,
});

export const handleSubmit = async (e, data) => {
  await new Promise((r) => setTimeout(() => r(null), 1000));
  let dataStr = "";
  for (const [key, value] of data.entries()) {
    dataStr += key + ": " + value + "\n";
  }
  console.log("form submitted\n", dataStr);
  alert("form submitted\n" + dataStr);
};
