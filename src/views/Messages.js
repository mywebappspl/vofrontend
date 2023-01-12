import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CompanySearchBox from "../components/CompanySearchBox";
import BasicDateRangePicker from "../components/DateRangePicker";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getMessagesForCsv, getMessagesPage } from "../state/messages";
import { addSnackbar } from "../state/snackBar";
import moment from "moment";
import { saveAs } from "file-saver";
const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { maxWidth: 380, margin: "10px 0" },
  card: { display: "flex", flexDirection: "column", alignItems: "center" },
};
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "fromName",
    headerName: "Message from",
    width: 200,
    editable: false,
  },
  {
    field: "fromPhone",
    headerName: "Message from phone",
    width: 200,
    editable: false,
  },
  {
    field: "fromEmail",
    headerName: "Message from mail",
    width: 300,
    editable: false,
  },
  {
    field: "content",
    headerName: "Message",
    width: 200,
    editable: false,
  },
  {
    field: "takenOn",
    headerName: "Taken on",
    width: 200,
    editable: false,
  },
];
const Messages = () => {
  const [selectedCompanyError, setSelectedCompanyError] = useState(false);
  const [companyId, setCompanyId] = useState(null);
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
  const companyValidate = () => {
    if (companyId) {
      setSelectedCompanyError(false);
      return true;
    } else {
      setSelectedCompanyError(true);
      return false;
    }
  };
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
        getMessagesPage({
          companyId: companyId,
          page: page,
          itemsPerPage: pageSize,
          startDate: sdate,
          endDate: edate,
        })
      )
        .then((data) => {
          setRows(data.payload.messages);
          setRowsAmount(data.payload.messagesAmount);
          setShowMessages(false);
        })
        .catch(() => {
          dispatch(addSnackbar("Cannot fetch messages.", "red"));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, companyId, showMessages]);

  const byDateOption = (value) => {
    if (!value) {
      setStartDate(null);
      setEndDate(null);
      setEndDateErrorText("");
    }
    setShowByDateOption(value);
  };
  const onSubmit = () => {
    let companyV = companyValidate();
    let dateV = dateValidate();
    if (companyV && dateV) setShowMessages(true);
  };
  const onSubmitExport = () => {
    let companyV = companyValidate();
    let dateV = dateValidate();
    if (companyV && dateV) {
      setSelectedCompanyError(false);
      let sdate =
        startDate !== null ? moment(startDate).format("YYYY-MM-DD") : null;
      let edate =
        endDate !== null ? moment(endDate).format("YYYY-MM-DD") : null;
      dispatch(
        getMessagesForCsv({
          companyId: companyId,
          startDate: sdate,
          endDate: edate,
        })
      ).then((data) => saveAs(data.payload, "file.csv"));
    }
  };
  return (
    <div style={{ margin: "40px" }}>
      <div style={styles.div}>
        <Typography style={{ marginTop: "10px" }} variant="h5" color="grey">
          List of messages
        </Typography>
        <CompanySearchBox
          isError={selectedCompanyError}
          setCompanyId={setCompanyId}
        />
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
        <Button
          style={{ marginRight: "30px" }}
          variant="outlined"
          onClick={onSubmit}
        >
          Show Messages
        </Button>
        <Button variant="outlined" onClick={onSubmitExport}>
          Export to CSV
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
export default Messages;
