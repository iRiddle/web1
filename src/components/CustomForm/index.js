import React from "react";
import { control, button } from "react-validation";
import { Button, TextField } from "@material-ui/core";

// Define own Input component
const Input = ({ error, isChanged, isUsed, ...props }) => {
  return (
    <TextField
      {...props}
      error={Boolean(isUsed && isChanged && error)}
      helperText={isUsed && isChanged ? error : ""}
    />
  );
};

// Define own Button component
const MyButton = ({ hasErrors, ...props }) => {
  console.log(...props);
  return (
    <Button {...props} disabled={hasErrors}>
      {props.children}
    </Button>
  );
};

const CustomInput = control(Input);
const CustomButton = button(MyButton);

export { CustomInput, CustomButton };
