import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveMember } from "../state/members";
const MAX_NAME_LENGTH = 45;
const MIN_NAME_LENGTH = 4;
const MAX_PHONE_LENGTH = 20;
const MIN_PHONE_LENGTH = 5;
const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { width: 380, margin: "10px 0" },
};
const AddMember = (props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const nameValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setName(validValue);
    }
    const isError = !validValue || validValue.length < MIN_NAME_LENGTH;
    setNameError(isError);
    return isError;
  };
  const setValidName = (string) => {
    if (string.length < MAX_NAME_LENGTH) setName(string);
  };

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const phoneValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setPhone(validValue);
    }
    const isError = !validValue || validValue.length < MIN_PHONE_LENGTH;
    setPhoneError(isError);
    return isError;
  };
  const setValidPhone = (string) => {
    if (string.length < MAX_PHONE_LENGTH) setPhone(string);
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
  const inputs = [
    {
      label: "Company name",
      value: name,
      onChange: setValidName,
      error: nameError,
      validate: nameValidate,
      helperText: "Too short, minimum 4 characters",
    },
    {
      label: "Company phone",
      value: phone,
      onChange: setValidPhone,
      error: phoneError,
      validate: phoneValidate,
      helperText: "Too short phone number, minimum 5 characters",
    },
    {
      label: "Company email",
      value: email,
      onChange: setEmail,
      error: emailError,
      validate: emailValidate,
      helperText: "Email address is incorrect",
    },
  ];
  const onSubmit = () => {
    const isNameError = nameValidate(name);
    const isPhoneError = phoneValidate(phone);
    const isEmailError = emailValidate(email);
    if (!isNameError && !isPhoneError && !isEmailError) {
      const form = {
        name,
        phone,
        email,
      };
      dispatch(saveMember({ id: props.companyId, employee: form }))
        .then(() => {
          props.onClose(true);
        })
        .catch(() => {});
    }
  };
  return (
    <div>
      <Dialog fullScreen open={true}>
        <div style={{ margin: "30px 30px" }}>
          <Typography style={styles.div} variant="h5" color="grey">
            New employee
          </Typography>
          <div style={styles.div}>
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
                onBlur={() => input.validate(input.value)}
                multiline={input.multiline}
                type={input.type || "text"}
                InputProps={input.InpputProps}
                placeholder={input.placeholder}
              />
            ))}

            <Stack direction="row" spacing={2} style={{ marginTop: "10px" }}>
              <Button color="primary" variant="contained" onClick={onSubmit}>
                Save
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={props.onClose}
              >
                Cancel
              </Button>
            </Stack>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default AddMember;
