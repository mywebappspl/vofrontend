import { Fab, TextField, Typography, IconButton, Box } from "@mui/material";
import React, { useState } from "react";
//import Fab from '@mui/material/Fab';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
const MAX_LENGTH = 30;
const MIN_LENGTH = 3;
const styles = {
  container: { maxWidth: 400 },
  inputsDiv: { display: "flex", justifyContent: "center", margin: "10px" },
  inputDivGroup: { flexDirection: "column" },
  inputsDivDouble: { justifyContent: "flex-start" },
  inputsDivSingle: { justifyContent: "flex-start" },
  input: { maxWidth: 140, margin: "10px 20px 10px 0" },
  inputSingle: { maxWidth: 300, margin: "10px 20px 10px 0" },
  addButton: { marginTop: 55 },
  paper: { maxWidth: 380, padding: 10, marginTop: 10, marginBottom: 10 },
  singleEmployee: { display: "flex" },
  singleEmployeeTypography: { flexGrow: 1 },
  singleEmployeeRemoveButton: { width: 30, height: 30, alignSelf: "center" },
};

const Ingredients = (props) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const nameValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setName(validValue);
    }
    const isError = !validValue || validValue.length < MIN_LENGTH;
    setNameError(isError);
    return isError;
  };
  const setValidName = (string) => {
    if (string.length < MAX_LENGTH) {
      setName(string);
    }
  };
  const focusTo = React.useRef(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const phoneValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setPhone(validValue);
    }
    const isError = !validValue;
    setPhoneError(isError);
    return isError;
  };
  const setValidPhone = (string) => {
    if (string.length < MAX_LENGTH) {
      setPhone(string);
    }
  };
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const emailValidate = (value) => {
    const isError = !value.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    setEmailError(isError);
    return isError;
  };
  const onSubmit = () => {
    const isNameError = nameValidate(name);
    const isPhoneError = phoneValidate(phone);
    const isEmailError = emailValidate(email);
    if (!isNameError && !isPhoneError && !isEmailError) {
      props.setEmployee([
        ...props.employee,
        {
          name: name.toLocaleLowerCase(),
          phone,
          email,
        },
      ]);
      setName("");
      setPhone("");
      setEmail("");
      focusTo.current.focus();
    }
  };
  const submitOnEnter = (evt) => {
    if (evt.key === "Enter") {
      onSubmit();
    }
  };
  const removeEmployee = (index) => {
    props.setEmployee(props.employee.filter((el, i) => index !== i));
  };
  const inputs = [
    {
      label: "Name",
      value: name,
      error: nameError,
      helperText: "Min 3 characters",
      onChange: setValidName,
      validate: nameValidate,
      inputRef: focusTo,
    },
    {
      label: "Phone",
      value: phone,
      error: phoneError,
      helperText: "Podaj ilosc",
      onChange: setValidPhone,
      validate: phoneValidate,
    },
  ];
  const emailField = {
    label: "Email",
    value: email,
    error: emailError,
    helperText: "Invalid email address",
    onChange: setEmail,
    validate: emailValidate,
  };
  return (
    <div style={styles.container}>
      <Box sx={{ border: 1, borderRadius: "7px", borderColor: "grey.500" }}>
        <Typography
          style={{ marginTop: "5px" }}
          variant="body1"
          color="grey.600"
        >
          Add employee
        </Typography>
        <div style={styles.inputsDiv}>
          <div style={styles.inputsDivGroup}>
            <div style={styles.inputsDivDouble}>
              {inputs.map((input) => (
                <TextField
                  key={input.label}
                  style={styles.input}
                  variant="outlined"
                  fullWidth
                  label={input.label}
                  value={input.value}
                  error={input.error}
                  helperText={input.error && input.helperText}
                  onChange={(evt) => {
                    input.onChange(evt.target.value);
                    if (input.error) {
                      input.validate(evt.target.value);
                    }
                  }}
                  onKeyPress={submitOnEnter}
                  inputRef={input.inputRef}
                />
              ))}
            </div>
            <div style={styles.inputsDivSingle}>
              <TextField
                key={emailField.label}
                style={styles.inputSingle}
                variant="outlined"
                fullWidth
                label={emailField.label}
                value={emailField.value}
                error={emailField.error}
                helperText={emailField.error && emailField.helperText}
                onChange={(evt) => {
                  emailField.onChange(evt.target.value);
                  if (emailField.error) {
                    emailField.validate(evt.target.value);
                  }
                }}
                onKeyPress={submitOnEnter}
                inputRef={emailField.inputRef}
              />
            </div>
          </div>
          <Fab
            style={styles.addButton}
            size="small"
            color="success"
            onClick={onSubmit}
          >
            <AddIcon />
          </Fab>
        </div>
      </Box>
      {props.employee.length > 0 && (
        <Paper style={styles.paper}>
          <Typography align="center">Employees:</Typography>
          {props.employee.map((empl, index) => (
            <div
              style={styles.singleEmployee}
              key={empl.name + empl.phone + index}
            >
              <Typography style={styles.singleEmployeeTypography}>
                {index + 1}. {empl.name} - {empl.phone} - {empl.email}
              </Typography>
              <IconButton
                style={styles.singleEmployeeRemoveButton}
                size="small"
                onClick={() => removeEmployee(index)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </Paper>
      )}
    </div>
  );
};
export default Ingredients;
