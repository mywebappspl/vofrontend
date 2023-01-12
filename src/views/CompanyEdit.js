import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateCompany } from "../state/companies";
import { statusMember } from "../state/members";
import AddMember from "../components/AddMember";
import EditMember from "../components/EditMember";

const MAX_NAME_LENGTH = 45;
const MIN_NAME_LENGTH = 4;
const MAX_PHONE_LENGTH = 20;
const MIN_PHONE_LENGTH = 5;
const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { maxWidth: 380, margin: "10px 0" },
};
const CompanyEdit = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [enableModButtons, setEnableModButtons] = React.useState(false);
  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [memberDataForEdit, setMemberDataForEdit] = useState(null);
  const [members, setMembers] = React.useState([]);

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
  const getMemberData = () => {
    setIsEditMemberDialogOpen(true);
    setMemberDataForEdit(
      members.find((member) => member.id === statusButtonText.id)
    );
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
  const company = useSelector((state) => {
    if (!state.selectedCompany.loading) {
      return state.selectedCompany.data;
    }
  });

  const buttonStyle = {
    text: "Change status",
    color: "success",
    action: "enable",
  };
  const [statusButtonText, setStatusButtonText] = React.useState(buttonStyle);
  const handleClick = (event) => {
    setEnableModButtons(true);
    if (event.row.active) {
      buttonStyle.text = "Deactivate";
      buttonStyle.color = "error";
      buttonStyle.action = "disable";
      buttonStyle.id = event.row.id;
      setStatusButtonText(buttonStyle);
    } else {
      buttonStyle.text = "Activate";
      buttonStyle.color = "success";
      buttonStyle.action = "enable";
      buttonStyle.id = event.row.id;
      setStatusButtonText(buttonStyle);
    }
  };
  const statusChange = (action, id) => {
    if (action === "enable")
      dispatch(
        statusMember({ id: id, state: true, companyId: params.companyId })
      );
    else
      dispatch(
        statusMember({ id: id, state: false, companyId: params.companyId })
      );
  };

  useEffect(() => {
    if (company) {
      setName(company.company_name);
      setMembers(company.members);
      setEmail(company.email);
      setPhone(company.phone);
    }
  }, [company]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Employee name",
      width: 350,
      editable: false,
    },
    {
      field: "active",
      headerName: "Status",
      width: 200,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      editable: false,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 200,
      editable: false,
    },
  ];
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
        company_name: name,
        phone,
        email,
      };

      dispatch(updateCompany({ id: params.companyId, form: form }));
    }
  };
  return (
    <div style={{ margin: "0 30px" }}>
      {isNewMemberDialogOpen && (
        <AddMember
          onClose={() => setIsNewMemberDialogOpen(false)}
          companyId={params.companyId}
        />
      )}
      {isEditMemberDialogOpen && (
        <EditMember
          onClose={() => setIsEditMemberDialogOpen(false)}
          data={memberDataForEdit}
          companyId={params.companyId}
        />
      )}
      <Typography style={{ marginTop: "5px" }} variant="h5" color="grey">
        Edit company
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
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Stack>
      </div>
      <div style={{ margin: "10px 0" }}>
        <Stack direction="row" spacing={2}>
          <Button
            size="small"
            disabled={!enableModButtons}
            color="secondary"
            variant="contained"
            //       onClick={()=>navigate('/companies/'+statusButtonText.id+'/edit')}
            onClick={() => getMemberData()}
          >
            Edit
          </Button>
          <Button
            size="small"
            color={statusButtonText.color}
            disabled={!enableModButtons}
            variant="contained"
            onClick={() =>
              statusChange(statusButtonText.action, statusButtonText.id)
            }
          >
            {statusButtonText.text}
          </Button>

          <Button
            size="small"
            variant="contained"
            onClick={() => setIsNewMemberDialogOpen(true)}
          >
            Add
          </Button>
        </Stack>
      </div>
      <div style={{ justifyContent: "center" }}>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={members}
            columns={columns}
            onRowClick={(event) => handleClick(event)}
            disableMultipleSelection
            hideFooterPagination
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </div>
    </div>
  );
};
export default CompanyEdit;
