import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { getAllCompanies } from "../state/companies";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSelectedCompany } from "../state/selectedCompany";
import { Typography } from "@mui/material";

const CompanySearchBox = (props) => {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.data);
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  let isError = false;

  if (!props.isError || selectedCompany !== null) isError = false;
  else isError = true;
  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);
  const onCompanySelect = (companyId, companyName) => {
    setSelectedCompany("Message for " + companyName);
    props.setCompanyId(companyId);
    dispatch(getSelectedCompany(companyId));
  };

  return (
    <div>
      <Autocomplete
        disablePortal
        id="organisation-select"
        options={companies}
        getOptionLabel={(companies) => companies.company_name}
        sx={{ minWidth: 380, padding: "20px 0" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select organisation"
            error={isError}
            helperText={isError && "Company is not selected"}
          />
        )}
        onChange={(event, value, reason) => {
          if (value !== null) onCompanySelect(value.id, value.company_name);
        }}
      />

      <Typography variant="body1" color="grey.600">
        {selectedCompany}
      </Typography>
    </div>
  );
};
export default CompanySearchBox;
