import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BasicDateRangePicker from "../components/DateRangePicker";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { addSnackbar } from "../state/snackBar";
import moment from "moment";
import { getQueuePage } from "../state/queue";
const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { maxWidth: 380, margin: "10px 0" },
  card: { display: "flex", flexDirection: "column", alignItems: "center" },
};
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "message_id",
    headerName: "Message id",
    width: 100,
    editable: false,
  },
  {
    field: "company_id",
    headerName: "Company id",
    width: 100,
    editable: false,
  },
  {
    field: "queued_on",
    headerName: "Queued on",
    width: 200,
    editable: false,
  },
  {
    field: "msg_status",
    headerName: "Status",
    width: 100,
    editable: false,
  },
  {
    field: "fromName",
    headerName: "From",
    width: 200,
    editable: false,
  },
  {
    field: "name",
    headerName: "For",
    width: 200,
    editable: false,
  },
  {
    field: "email",
    headerName: "From email",
    width: 200,
    editable: false,
  },
];
const Queue = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endDateError, setEndDateError] = useState(false);
  const [endDateErrorText, setEndDateErrorText] = useState("");

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsAmount, setRowsAmount] = useState(0);
  const [selectionModel, setSelectcionModel] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [showByDateOption, setShowByDateOption] = useState(false);
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.message);
  const dateValidate = () => {
    if (showByDateOption) {
      if (!startDate || !endDate) {
        setEndDateError(true);
        setEndDateErrorText("Date cannot be empty");
        return false;
      } else if (startDate > endDate) {
        setEndDateError(true);
        setEndDateErrorText("End date is lower than start date");
        return false;
      } else {
        setEndDateError(false);
        setEndDateErrorText("");
        return true;
      }
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (showMessages) {
      let sdate =
        startDate !== null ? moment(startDate).format("YYYY-MM-DD") : null;
      let edate =
        endDate !== null ? moment(endDate).format("YYYY-MM-DD") : null;
      dispatch(
        getQueuePage({
          page: page,
          itemsPerPage: pageSize,
          startDate: sdate,
          endDate: edate,
        })
      )
        .then((data) => {
          setRows(data.payload.content);
          setRowsAmount(data.payload.totalElements);
          setShowMessages(false);
        })
        .catch(() => {
          setShowMessages(false);
          dispatch(addSnackbar("Cannot fetch queue.", "red"));
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, showMessages]);
  const onSubmit = () => {
    if (dateValidate()) {
      setShowMessages(true);
    }
  };

  const byDateOption = (value) => {
    if (!value) {
      setStartDate(null);
      setEndDate(null);
      setEndDateErrorText("");
    }
    setShowByDateOption(value);
  };
  return (
    <div style={{ margin: "40px" }}>
      <div style={styles.div}>
        <Typography style={{ marginTop: "10px" }} variant="h5" color="grey">
          Messages in queue
        </Typography>
        <div style={{ margin: "10px" }}>
          <FormControlLabel
            control={
              <Checkbox onChange={() => byDateOption(!showByDateOption)} />
            }
            label="select by date range"
          />
        </div>
      </div>
      {showByDateOption && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <BasicDateRangePicker
              value={startDate}
              setValue={setStartDate}
              label={"Start date"}
            />
            <BasicDateRangePicker
              value={endDate}
              setValue={setEndDate}
              label={"End date"}
            />
          </Box>

          <div style={{ marginBottom: "20px" }}>
            <Typography variant="caption" color="error">
              {endDateError && endDateErrorText}
            </Typography>
          </div>
        </>
      )}
      <div style={{ marginBottom: "20px" }}>
        <Button variant="outlined" onClick={onSubmit}>
          Show Queue
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          disableMultipleSelection
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setShowMessages(true);
          }}
          rowsPerPageOptions={[5, 10, 20]}
          rowCount={rowsAmount}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPage(newPage);
            setShowMessages(true);
          }}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectcionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
          loading={loading.loading}
          keepNonExistentRowsSelected
        />
      </div>
    </div>
  );
};
export default Queue;
