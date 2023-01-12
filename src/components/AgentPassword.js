import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { passwordAgent } from "../state/agents";

const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { width: 380, margin: "10px 0" },
};
const AgentPassword = (props) => {
  const dispatch = useDispatch();

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

  const onSubmit = () => {
    const isPwdError = pwdValidate(pwd);
    const isPwd2Error = pwd2Validate(pwd);
    if (!isPwdError && !isPwd2Error) {
      const form = {
        value: pwd,
      };
      dispatch(passwordAgent({ memberId: props.memberId, password: form }))
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
      <Dialog open={true}>
        <div style={{ margin: "30px 30px" }}>
          <Typography style={{ marginTop: "5px" }} variant="h5" color="grey">
            Password reset
          </Typography>
          <div style={styles.div}>
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
export default AgentPassword;
