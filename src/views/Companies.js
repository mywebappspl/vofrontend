import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Fab } from "@mui/material";
import { getAllCompanies, statusCompany } from "../state/companies";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/system";
import { useNavigate } from "react-router";
import { getSelectedCompany } from "../state/selectedCompany";
import AddIcon from "@mui/icons-material/Add";
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "company_name",
    headerName: "Comapny name",
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

const Companies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companies = useSelector((state) => state.companies.data);
  const [enableModButtons, setEnableModButtons] = React.useState(false);
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
    if (action === "enable") dispatch(statusCompany({ id: id, state: true }));
    else dispatch(statusCompany({ id: id, state: false }));
  };
  React.useEffect(() => {
    if (companies.length === 0) dispatch(getAllCompanies());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div style={{ margin: "0 30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px 0",
        }}
      >
        <Fab
          onClick={() => navigate("/companies/new")}
          size="small"
          color="success"
        >
          <AddIcon />
        </Fab>
      </div>
      <div style={{ margin: "10px 0" }}>
        <Stack direction="row" spacing={2}>
          <Button
            size="small"
            disabled={!enableModButtons}
            color="secondary"
            variant="contained"
            onClick={() => {
              navigate("/companies/" + statusButtonText.id + "/edit");
              dispatch(getSelectedCompany(statusButtonText.id));
            }}
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
        </Stack>
      </div>
      <div style={{ justifyContent: "center" }}>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={companies}
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
export default Companies;
