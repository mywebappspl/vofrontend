import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAgents, statusAgent } from "../state/agents";
import EditAgent from "../components/EditAgent";
import AddAgent from "../components/AddAgent";
import AgentPassword from "../components/AgentPassword";
import { Grid } from "@mui/material";
const styles = {
  div: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { maxWidth: 380, margin: "10px 0" },
  button: { width: 140, margin: "10px 0" },
};
const columns = [
  {
    field: "username",
    headerName: "Username",
    width: 200,
    editable: false,
  },
  {
    field: "enabled",
    headerName: "Status",
    width: 200,
    editable: false,
  },
  {
    field: "firstName",
    headerName: "First name",
    width: 200,
    editable: false,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 200,
    editable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 300,
    editable: false,
  },
];

const Agents = () => {
  const dispatch = useDispatch();
  const [enableModButtons, setEnableModButtons] = React.useState(false);
  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [memberDataForEdit, setMemberDataForEdit] = useState(null);

  const agents = useSelector((state) => state.agents.data);
  const getMemberData = () => {
    setIsEditMemberDialogOpen(true);
    setMemberDataForEdit(
      agents.find((agent) => agent.id === statusButtonText.id)
    );
  };

  const buttonStyle = {
    text: "Change status",
    color: "success",
    action: "enable",
  };
  const [statusButtonText, setStatusButtonText] = useState(buttonStyle);
  const handleClick = (event) => {
    setEnableModButtons(true);
    if (event.row.enabled === "true") {
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
    if (action === "enable") dispatch(statusAgent({ id: id, state: true }));
    else dispatch(statusAgent({ id: id, state: false }));
  };

  useEffect(() => {
    if (agents.length === 0) dispatch(getAllAgents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return (
    <div style={{ margin: "0 30px" }}>
      {isNewMemberDialogOpen && (
        <AddAgent onClose={() => setIsNewMemberDialogOpen(false)} />
      )}
      {isEditMemberDialogOpen && (
        <EditAgent
          onClose={() => setIsEditMemberDialogOpen(false)}
          data={memberDataForEdit}
        />
      )}
      {isPasswordDialogOpen && (
        <AgentPassword
          onClose={() => setIsPasswordDialogOpen(false)}
          memberId={statusButtonText.id}
        />
      )}
      <div style={styles.div}></div>
      <div style={{ margin: "10px 0" }}>
        <Box sx={{ display: "flex", maxWidth: 650 }}>
          <Grid container spacing={0}>
            <Grid item sm={3} xs={12} md={3}>
              <Button
                style={styles.button}
                size="small"
                disabled={!enableModButtons}
                color="secondary"
                variant="contained"
                //       onClick={()=>navigate('/companies/'+statusButtonText.id+'/edit')}
                onClick={() => getMemberData()}
              >
                Edit
              </Button>
            </Grid>
            <Grid item sm={3} xs={12} md={3}>
              <Button
                style={styles.button}
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
            </Grid>
            <Grid item sm={3} xs={12} md={3}>
              <Button
                style={styles.button}
                size="small"
                color="warning"
                disabled={!enableModButtons}
                variant="contained"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                Password reset
              </Button>
            </Grid>
            <Grid item sm={3} xs={12} md={3}>
              <Button
                style={styles.button}
                size="small"
                variant="contained"
                onClick={() => setIsNewMemberDialogOpen(true)}
              >
                Add new agent
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div style={{ justifyContent: "center" }}>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={agents}
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
export default Agents;
