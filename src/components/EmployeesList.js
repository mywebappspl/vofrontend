import * as React from "react";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";

const styles = {
  paper: { maxWidth: 380, margin: "10px 10px" },
};

const EmployeesList = (props) => {
  const company = useSelector((state) => state.selectedCompany.data);
  const [members, setMembers] = React.useState([]);
  //const [membersToSend,setMembersToSend]=React.useState([])
  let error = false;
  const handleChange = (event) => {
    const isExist = props.membersToSend.findIndex(
      (membersToSend) => membersToSend === parseInt(event.target.value)
    );

    if (isExist === -1) {
      props.setMembersToSend([
        ...props.membersToSend,
        parseInt(event.target.value),
      ]);
    } else if (isExist > -1) {
      props.setMembersToSend(
        props.membersToSend.filter(
          (member) => member !== parseInt(event.target.value)
        )
      );
    }
  };
  if (!props.isError || props.membersToSend.length !== 0) error = false;
  else error = true;

  React.useEffect(() => {
    if (company.members) {
      setMembers(company.members);
      props.setMembersToSend([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company.members]);
  console.log("error k" + error);
  return (
    <Paper style={styles.paper}>
      <FormControl
        required
        error
        component="fieldset"
        sx={{ m: 3 }}
        variant="outlined"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: 190,
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          <FormLabel component="legend">Pick employees</FormLabel>
          <FormGroup style={{ display: "flex", alignItems: "flex-start" }}>
            {members.length > 0 &&
              company.members.map((member) => (
                <div key={member.name}>
                  <FormControlLabel
                    key={member.name}
                    control={
                      <Checkbox
                        key={member.name}
                        onChange={handleChange}
                        value={member.id}
                      />
                    }
                    label={member.name}
                  />
                </div>
              ))}
          </FormGroup>
        </Box>
        {error && (
          <FormHelperText>
            At least one employee needs to be selected
          </FormHelperText>
        )}
      </FormControl>
    </Paper>
  );
};
export default EmployeesList;
