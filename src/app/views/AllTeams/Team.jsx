import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SnackbarPrompt from "../../components/SnackbarPrompt";
import SnackbarAlert from "../../components/SnackbarAlert";
import DummyImg from "./images/dummy.jpg";
import { TEAM_MODEL } from "app/utils/constants";
import { deleteData, fetchData } from "./../../services/rest";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import { MenuItem, Menu, Button, Box } from "@mui/material";

const SingleTeam = ({
  item,
  index,
  handleSubscribed,
  subscriptions,
  setData,
  pageOffset,
  totalData,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [ids, setIds] = useState([]);

  const initialDataReqBody = {
    offset: pageOffset,
    fields: ["name", "description"],
    limit: totalData,
    data: {
      _domain: null,
      _domainContext: {
        _model: "com.axelor.team.db.Team",
        _id: null,
      },
      _domains: [],
      operator: "and",
      criteria: [],
    },
  };
  const handleClick = async (event, id, action, i) => {
    event.stopPropagation();
    if (action === "delete") {
      setShowSnackbar(true);
      setAnchorEl(null);
    } else if (action === "edit") {
      setAnchorEl(null);
      ids.length !== 0 &&
        navigate(`./edit-entry/${id}`, {
          state: {
            showSaveBtn: true,
            totalData: totalData,
            index: i + pageOffset,
            readOnly: false,
            ids,
            action,
          },
        });
    } else if (action === "view") {
      setAnchorEl(null);

      ids.length !== 0 &&
        navigate(`./view-entry/${id}`, {
          state: {
            totalData,
            index: i + pageOffset,
            readOnly: true,
            ids,
            action,
          },
        });
    }
  };
  const handleDeleteConfirm = async () => {
    const requestBody = {
      records: [
        {
          id: item.id,
          version: item.version,
        },
      ],
    };
    const response = await deleteData(TEAM_MODEL, requestBody);
    if (response?.status === 0) {
      setData((prev) => prev.filter((dataItem) => dataItem.id !== item.id));
    } else {
      setAlertMessage(
        "The record(s) are referenced by other records. Please remove all the references first."
      );
      setShowAlertSnackbar(true);
    }
    setShowSnackbar(false);
  };
  //function to handle alert confirmation
  const handleAlertConfirm = () => {
    setShowAlertSnackbar(false);
  };

  const handleDeleteCancel = () => {
    setShowSnackbar(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickListItem = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  useEffect(() => {
    const fetchIds = async () => {
      const response = await fetchData(TEAM_MODEL, initialDataReqBody);
      const allIds = response?.data.map((item) => item?.id);
      setIds(allIds);
    };
    fetchIds();
  }, []);
  return (
    <>
      <Box
        sx={{
          width: "400px",
          height: "120px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "15px",
          borderRadius: "4px",
          minWidth: "250px",
          paddingRight: "0.25rem",
          paddingLeft: "0.25rem",
          marginBottom: "0.5rem",
          cursor: "pointer",
          position: "relative",
          boxShadow:
            "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, #d1d5db 0px 0px 0px 1px inset",
        }}
        key={item.id}
        onClick={(e) => handleClick(e, item.id, "view", index)}
      >
        {/* main container */}
        <Box sx={{ display: "flex", minHeight: "72px", p: "20px" }}>
          {/* left container */}
          <Box
            sx={{
              display: "flex",
              width: "30%",
              padding: "10px",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: "0px",
            }}
          >
            <img
              style={{ width: "100%", maxHeight: "100%" }}
              src={DummyImg}
              alt="Axelor"
            />
          </Box>
          {/* right container */}
          <Box
            sx={{
              width: "70%",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ marginBottom: "8px" }}>{item.name}</Box>
            <Box sx={{ marginBottom: "8px" }}>{item.description}</Box>
            {subscriptions[item.id] ? (
              <Button
                color="error"
                variant="contained"
                onClick={(e) => handleSubscribed(e, item.id)}
              >
                Unsubscribe
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => handleSubscribed(e, item.id)}
              >
                Subscribe
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: "block",
              position: "absolute",
              top: "0px",
              right: "0px",
            }}
          >
            <Box onClick={handleClickListItem}>
              <ArrowDropDownIcon sx={{ color: "gray" }} />
            </Box>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={(e) => handleClick(e, item.id, "edit", index)}>
                Edit
              </MenuItem>
              <MenuItem
                onClick={(e) => handleClick(e, item.id, "delete", index)}
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
      {showSnackbar && (
        <SnackbarPrompt
          message="Do you really want to delete the selected record(s)?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {showAlertSnackbar && (
        <SnackbarAlert message={alertMessage} onConfirm={handleAlertConfirm} />
      )}
    </>
  );
};

export default SingleTeam;
