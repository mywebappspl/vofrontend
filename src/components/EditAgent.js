import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAgentRole, setAgentRole, updateAgent } from "../state/agents";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { addSnackbar } from "../state/snackBar";
const MAX_FIRSTNAME_LENGTH = 45;
const MIN_FIRSTNAME_LENGTH = 4;
const MAX_LASTNAME_LENGTH = 45;
const MIN_LASTNAME_LENGTH = 4;

const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { width: 380, margin: "10px 0" },
};
const EditAgent = (props) => {
  const dispatch = useDispatch();
  const [currentRole, setCurrentRole] = useState(false);
  const [firstName, setFirstName] = useState(props.data.firstName || " ");
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

  const [lastName, setLastName] = useState(props.data.lastName || " ");
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

  const [email, setEmail] = useState(props.data.email || " ");
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
  useEffect(() => {
    dispatch(getAgentRole(props.data.id))
      .then((data) => {
        setCurrentRole(data.payload.state);
      })
      .catch(() => {
        dispatch(addSnackbar("Cannot fetch current role.", "red"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = () => {
    const isFirstNameError = firstNameValidate(firstName);
    const isLastNameError = lastNameValidate(firstName);

    const isEmailError = emailValidate(email);
    if (!isFirstNameError && !isLastNameError && !isEmailError) {
      const form = {
        firstName,
        lastName,
        email,
      };

      dispatch(updateAgent({ memberId: props.data.id, form: form }))
        .then(() => {
          props.onClose(true);
        })
        .catch(() => {});
      dispatch(setAgentRole({ memberId: props.data.id, state: currentRole }));
    }
  };

  return (
    <div>
      <Dialog fullScreen open={true}>
        <div style={styles.div}>
          <Typography style={{ marginTop: "5px" }} variant="h5" color="grey">
            Edit agent: {props.data.firstName + " " + props.data.lastName}
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentRole}
                    onChange={() => setCurrentRole(!currentRole)}
                  />
                }
                label="Admin role"
              />
            </FormGroup>
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
export default EditAgent;
