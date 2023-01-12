import * as React from "react";

import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";

const RangeDatePicker = (props) => {
  //const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={props.label}
        value={props.value}
        type="date"
        disableFuture
        onChange={(newValue) => {
          props.setValue(newValue);
        }}
        renderInput={(params) => (
          <Box
            sx={{
              p: 1,
              m: 1,
            }}
          >
            <TextField style={{ maxWidth: "210px" }} {...params} />
          </Box>
        )}
      />
    </LocalizationProvider>
  );
};
export default RangeDatePicker;
