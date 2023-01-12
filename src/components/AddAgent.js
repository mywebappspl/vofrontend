import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveAgent } from "../state/agents";
import { saveMember } from "../state/members";
const MAX_FIRSTNAME_LENGTH = 45;
const MIN_FIRSTNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 45;
const MIN_USERNAME_LENGTH = 4;
const MAX_LASTNAME_LENGTH = 45;
const MIN_LASTNAME_LENGTH = 4;

const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { width: 380, margin: "10px 0" },
};
const AddAgent = (props) => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const userNameValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setUserName(validValue);
    }
    const isError = !validValue || validValue.length < MIN_USERNAME_LENGTH;
    setUserNameError(isError);
    return isError;
  };
  const setValidUserName = (string) => {
    if (string.length < MAX_USERNAME_LENGTH) setUserName(string);
  };

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const firstNameValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setFirstName(validValue);
    }
    const isError = !validValue || validValue.length < MIN_FIRSTNAME_LENGTH;
    setFirstNameError(isError);
    return isError;
  };
  const setValidFirstName = (string) => {
    if (string.length < MAX_FIRSTNAME_LENGTH) setFirstName(string);
  };

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const lastNameValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setLastName(validValue);
    }
    const isError = !validValue || validValue.length < MIN_LASTNAME_LENGTH;
    setLastNameError(isError);
    return isError;
  };
  const setValidLastName = (string) => {
    if (string.length < MAX_LASTNAME_LENGTH) setLastName(string);
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

  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const pwdValidate = (value) => {
    const isError = value.length < 8;
    setPwdError(isError);
    return isError;
  };

  const [pwd2, setPwd2] = useState("");
  const [pwd2Error, setPwd2Error] = useState(false);
  const pwd2Validate = (value) => {
    const isError = pwd !== value;
    setPwd2Error(isError);
    return isError;
  };

  const inputs = [
    {
      label: "Username",
      value: userName,
      onChange: setValidUserName,
      error: userNameError,
      validate: userNameValidate,
      helperText: "Too short, minimum 4 characters",
    },
    {
      label: "Agent first name",
      value: firstName,
      onChange: setValidFirstName,
      error: firstNameError,
      validate: firstNameValidate,
      helperText: "Too short, minimum 4 characters",
    },
    {
      label: "Agent last name",
      value: lastName,
      onChange: setValidLastName,
      error: lastNameError,
      validate: lastNameValidate,
      helperText: "Too short, minimum 4 characters",
    },

    {
      label: "Agent email",
      value: email,
      onChange: setEmail,
      error: emailError,
      validate: emailValidate,
      helperText: "Email address is incorrect",
    },
  ];
  const onSubmit = () => {
    const isFirstNameError = firstNameValidate(firstName);
    const isLastNameError = lastNameValidate(lastName);
    const isEmailError = emailValidate(email);
    const isUserNameError = userNameValidate(userName);
    const isPwdError = pwdValidate(pwd);
    const isPwd2Error = pwd2Validate(pwd);
    if (
      !isUserNameError &&
      !isFirstNameError &&
      !isLastNameError &&
      !isEmailError &&
      !isPwdError &&
      !isPwd2Error
    ) {
      const form = {
        username: userName,
        firstName,
        lastName,
        email,
        password: pwd,
      };
      dispatch(saveAgent({ agent: form }))
        .then(() => {
          props.onClose(true);
        })
        .catch(() => {});
    }
  };

  const submitOnEnter = (evt) => {
    if (evt.key === "Enter") {
      onSubmit();
    }
  };
  return (
    <div>
      <Dialog fullScreen open={true}>
        <div style={{ margin: "30px 30px" }}>
          <Typography style={styles.div} variant="h5" color="grey">
            New agent
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
            <TextField
              value={pwd}
              onChange={(evt) => {
                setPwd(evt.target.value);
                if (pwdError) {
                  pwdValidate(evt.target.value);
                  if (pwd2Error) {
                    setPwd2Error(evt.target.value !== pwd2);
                  }
                }
              }}
              onBlur={() => {
                pwdValidate(pwd);
                if (pwd2Error) {
                  pwd2Validate(pwd2);
                }
              }}
              style={styles.input}
              onKeyPress={submitOnEnter}
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              type="password"
              error={pwdError}
              helperText={pwdError && "Password has to have 8 characters"}
            />
            <TextField
              style={styles.input}
              value={pwd2}
              onChange={(evt) => {
                setPwd2(evt.target.value);
                if (pwd2Error) {
                  pwd2Validate(evt.target.value);
                }
              }}
              onBlur={() => {
                pwd2Validate(pwd2);
              }}
              onKeyPress={submitOnEnter}
              fullWidth
              margin="normal"
              label="Repeat password"
              variant="outlined"
              type="password"
              error={pwd2Error}
              helperText={pwd2Error && "Passwords have to be identical"}
            />

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
export default AddAgent;
