import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";
import icon from "./Images/icons8-person-48.png";

import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { MenuItem, Menu } from "@mui/material";

import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import { deleteData } from "app/services/rest";
import { OPPORTUNITIES_MODEL } from "app/utils/constants";
import { useNavigate } from "react-router-dom";
import SnackbarPrompt from "../../components/SnackbarPrompt";
import SnackbarAlert from "../../components/SnackbarAlert";

const OpportunityCard = ({ item, i, setData }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleClickListItem = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  // function for handling edit , delete and view opportunity
  const handleClick = async (event, id, version, action, i) => {
    event.stopPropagation();
    if (action === "delete") {
      setShowSnackbar(true);
      setAnchorEl(null);
    } else if (action === "edit") {
      setAnchorEl(null);
      navigate(`./edit-opportunity/${id}` , {state:{editable:true}});
    } else if (action === "view") {
      setAnchorEl(null);

      navigate(`./view-opportunity/${id}` , {state:{editable:false}} );
    }
  };
  const handleDeleteConfirm = async () => {
    console.log(item?.id);
    console.log(item?.version);
    const deleteRequestBody = {
      records: [{ id: item?.id, version: item?.version }],
    };
    const response = await deleteData(OPPORTUNITIES_MODEL, deleteRequestBody);
    console.log(response);
    if (response?.status === 0) {
      setData((prevData) => {
        return {
          ...prevData,
          newData: prevData?.newData?.filter(
            (dataItem) => dataItem.id !== item?.id
          ),
          qualificationData: prevData?.qualificationData?.filter(
            (dataItem) => dataItem.id !== item?.id
          ),
          propositionData: prevData?.propositionData?.filter(
            (dataItem) => dataItem.id !== item?.id
          ),
          NegotiationData: prevData?.NegotiationData?.filter(
            (dataItem) => dataItem.id !== item?.id
          ),
          closedWonData: prevData?.closedWonData?.filter(
            (dataItem) => dataItem.id !== item?.id
          ),
          closedLostData: prevData?.closedLostData?.filter(
            (dataItem) => dataItem.id !== item?.id
          ),
        };
      });
    } else {
      setShowAlertSnackbar(true);
    }
  };

  const handleDeleteCancel = () => {
    setShowSnackbar(false);
  };

  const handleAlertConfirm = () => {
    setShowAlertSnackbar(false);
  };
  return (
    <>
      <Grid item key={item.id}>
        <Paper
          sx={{
            backgroundColor: "white",
            border: "1px solid gray",
            marginBottom: "5px",
            borderLeft: "2px solid red",
            color: "#111827",
          }}
          onClick={(e) => handleClick(e, item.id, item.version, "view")}
        >
          <Box sx={{ float: "right" }}>
            <div>
              <div onClick={handleClickListItem}>
                <ArrowDropDownIcon />
              </div>
            </div>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem
                onClick={(e) =>
                  handleClick(e, item.id, item.version, "edit", i)
                }
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={(e) =>
                  handleClick(e, item.id, item.version, "delete", i)
                }
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
          <Box margin="10px">
            <Typography fontWeight="bold">{item.opportunitySeq}</Typography>
            <Typography fontWeight="bold">{item.name}</Typography>
          </Box>
          <Box margin="10px">
            <Typography fontWeight="bold">Customer</Typography>
            <Typography>{item["partner.name"]}</Typography>
          </Box>
          <Box margin="10px">
            <Typography fontWeight="bold">Amount</Typography>
            <Typography>
              {item["currency.symbol"]}
              {item.amount}
            </Typography>
          </Box>
          <Box margin="10px">
            <Typography fontWeight="bold">Probability</Typography>
            <Typography>{item.probability}</Typography>
          </Box>
          <Box margin="10px">
            <Typography
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap="5px"
            >
              <AccessTimeIcon /> {item.expectedCloseDate}
            </Typography>
            <Typography fontWeight="bold">Score</Typography>
            <Typography>{item.opportunityRating}</Typography>
            <Typography
              variant="div"
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <img src={icon} width="30px" height="30px" />
            </Typography>
          </Box>
        </Paper>
        {showSnackbar && (
          <SnackbarPrompt
            message="Do you really want to delete the selected record(s)?"
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}

        {showAlertSnackbar && (
          <SnackbarAlert
            message="The record(s) are referenced by other records. Please remove all the references first."
            onConfirm={handleAlertConfirm}
          />
        )}
      </Grid>
    </>
  );
};

export default OpportunityCard;
