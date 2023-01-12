import { TextField, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import React from "react";
import EmployeesList from "../components/EmployeesList";
import CompanySearchBox from "../components/CompanySearchBox";
import { useDispatch } from "react-redux";
import { saveMessage } from "../state/messages";

const MAX_NAME_FROM_LENGTH = 45;
const MIN_NAME_FROM_LENGTH = 3;
const MAX_PHONE_FROM_LENGTH = 15;
const MIN_PHONE_FROM_LENGTH = 3;
const MAX_EMAIL_FROM_LENGTH = 40;
const MIN_CONTENT_LENGTH = 5;
const MAX_CONTENT_LENGTH = 200;

const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { maxWidth: 380, margin: "10px 0" },
  card: { display: "flex", flexDirection: "column", alignItems: "center" },
};
const Home = (props) => {
  const [selectedCompanyError, setSelectedCompanyError] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [membersToSend, setMembersToSend] = useState([]);
  const [membersError, setMembersError] = useState(false);
  const dispatch = useDispatch();

  const [nameFrom, setNameFrom] = useState("");
  const [nameFromError, setNameFromError] = useState(false);
  const nameFromValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setNameFrom(validValue);
    }
    const isError = !validValue || validValue.length < MIN_NAME_FROM_LENGTH;
    setNameFromError(isError);
    return isError;
  };
  const setValidNameFrom = (string) => {
    if (string.length < MAX_NAME_FROM_LENGTH) setNameFrom(string);
  };

  const [phoneFrom, setPhoneFrom] = useState("");
  const [phoneFromError, setPhoneFromError] = useState(false);
  const phoneFromValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setPhoneFrom(validValue);
    }
    const isError = !validValue || validValue.length < MIN_PHONE_FROM_LENGTH;
    setPhoneFromError(isError);
    return isError;
  };
  const setValidPhoneFrom = (string) => {
    if (string.length < MAX_PHONE_FROM_LENGTH) setPhoneFrom(string);
  };
  const [emailFrom, setEmailFrom] = useState("");
  const [emailFromError, setEmailFromError] = useState(false);
  const emailFromValidate = (value) => {
    const isError = !value.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (value !== "" && isError) {
      setEmailFromError(true);
      return true;
    } else {
      setEmailFromError(false);
      return false;
    }
  };
  const setValidEmailFrom = (string) => {
    if (string.length < MAX_EMAIL_FROM_LENGTH) setEmailFrom(string);
  };

  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState(false);
  const contentValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, " ");
    if (value !== validValue) {
      setContent(validValue);
    }
    const isError = !validValue || validValue.length < MIN_CONTENT_LENGTH;
    setContentError(isError);
    return isError;
  };
  const setValidContent = (string) => {
    if (string.length < MAX_CONTENT_LENGTH) setContent(string);
  };
  const companyIdValidate = (companyId) => {
    if (companyId === null) {
      setSelectedCompanyError(true);
      return false;
    } else {
      setSelectedCompanyError(false);
      return true;
    }
  };
  const memberValidate = (members) => {
    if (members.length > 0) {
      setMembersError(false);
      return true;
    } else {
      setMembersError(true);
      return false;
    }
  };
  const onSubmit = () => {
    const isNameError = nameFromValidate(nameFrom);
    const isContentError = contentValidate(content);
    const isPhoneFromError = phoneFromValidate(phoneFrom);
    const isEmailFromError = emailFromValidate(emailFrom);
    const isCompanyIdError = companyIdValidate(companyId);
    const isMemberError = memberValidate(membersToSend);

    if (
      !isNameError &&
      !isContentError &&
      !isPhoneFromError &&
      !isEmailFromError &&
      isCompanyIdError &&
      isMemberError
    ) {
      const form = {
        fromName: nameFrom,
        fromEmail: emailFrom,
        fromPhone: phoneFrom,
        content,
        members: membersToSend,
        companyId: companyId,
      };

      dispatch(saveMessage(form))
        .then(() => {
          setNameFrom("");
          setEmailFrom("");
          setPhoneFrom("");
          setMembersToSend([]);
          setContent("");
          setCompanyId("");
        })
        .catch(() => {});
    }
  };

  const inputs = [
    {
      label: "Message from",
      value: nameFrom,
      onChange: setValidNameFrom,
      error: nameFromError,
      validate: nameFromValidate,
      helperText: "Name is too short (min 3 characters required",
    },
    {
      label: "Message from phone number",
      value: phoneFrom,
      onChange: setValidPhoneFrom,
      error: phoneFromError,
      validate: phoneFromValidate,
      helperText: "Number is too short (min 7 characters required",
    },
    {
      label: "Message from email (optional)",
      value: emailFrom,
      onChange: setValidEmailFrom,
      error: emailFromError,
      validate: emailFromValidate,
      helperText: "Email is not valid",
    },
    {
      label: "Message",
      value: content,
      onChange: setValidContent,
      error: contentError,
      validate: contentValidate,
      helperText: "Message is too short",
      multiline: true,
    },
  ];

  return (
    <Grid container spacing={0}>
      <Grid item sm={12} xs={12} md={12}>
        <div style={styles.div}>
          <Typography style={{ marginTop: "10px" }} variant="h5" color="grey">
            Take new message
          </Typography>
          <CompanySearchBox
            isError={selectedCompanyError}
            setCompanyId={setCompanyId}
          />
        </div>
      </Grid>
      <Grid item sm={3} xs={12} md={3} />
      <Grid item sm={6} xs={12} md={6}>
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
        </div>
      </Grid>

      <Grid item sm={3} xs={12} md={3}>
        <div style={styles.card}>
          {companyId && (
            <EmployeesList
              isError={membersError}
              membersToSend={membersToSend}
              setMembersToSend={setMembersToSend}
            />
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={12}>
        <div style={styles.div}>
          <Button color="primary" variant="contained" onClick={onSubmit}>
            Send Message
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};
export default Home;
