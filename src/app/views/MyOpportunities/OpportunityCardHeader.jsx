import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Add as AddIcon,
  Edit as EditIcon,
  SaveAs as SaveAsIcon,
  ArrowBack as ArrowBackIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AutoFixHigh as AutoFixHighIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  GridView as GridViewIcon,
  ListAlt as ListAltIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  ViewKanban as ViewKanbanIcon,
} from "@mui/icons-material";

import { Box, Tooltip, Typography } from "@mui/material";
import { fetchInitialData } from "app/services/rest";
import { initialDataReqBody } from "./constants";

const OpportunityCardHeader = ({ flag, isEditable, handleSave, id }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [isToolDropdownOpen, setToolDropdownOpen] = useState(false);

  const handleEditClick = () => {
    isEditable = true;
    navigate(`./../../edit-opportunity/${id}`, { state: { editable: true } });
  };
  const handleGridView = async () => {
    flag === "create"
      ? navigate("./../grid-view")
      : navigate("./../../grid-view");
  };

  const handleAdd = async () => {
    const response = await fetchInitialData(initialDataReqBody);
    flag === "create"
      ? navigate("./../create-entry")
      : navigate("./../../create-entry");
  };

  const handleKanbanViewClick = () => {
    flag === "create" ? navigate("./../") : navigate("./../../");
  };
  return (
    <>
      <Box
        sx={{
          position: "sticky",
          marginBottom: "80px",
          top: "60px",
          zIndex: "1000",
          display: "flex",
          marginBottom: "80px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "white",
          border: "1px solid rgb(221, 220, 220)",
          "@media (370px < width <= 530px)": {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          },
          "@media (360px < width <= 370px)": {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            top: "105px",
            marginBottom: "120px",
          },
          "@media (150px <=width <= 360px)": {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            top: "150px",
            marginBottom: "160px",
          },
          "@media (370px <=width<= 442px)": {
            top: "100px",
            marginBottom: "120px",
          },
        }}
      >
        {/* left */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "@media (150px<=width<= 360px)": {
              width: "70%",
              justifyContent: "space-around",
            },
          }}
        >
          <Tooltip title="Add">
            <AddIcon
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={handleAdd}
            />
          </Tooltip>
          <Tooltip title={isEditable ? "Save" : "Edit"}>
            {isEditable ? (
              <SaveAsIcon
                sx={{ color: "gray", cursor: "pointer" }}
                onClick={handleSave}
              />
            ) : (
              <EditIcon
                sx={{ color: "gray", cursor: "pointer" }}
                onClick={handleEditClick}
              />
            )}
          </Tooltip>
          <ArrowBackIcon
            sx={{ color: "gray", cursor: "pointer" }}
            onClick={() => navigate("./../../../my-opportunities")}
          />
          <ArrowDropDownIcon
            sx={{ color: "gray", cursor: "pointer" }}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <Box
              sx={{
                position: "absolute",
                width: "150px",
                top: "120px",
                left: "100px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "8px",
                zIndex: "1",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  color: "gray",
                  ":hover": {
                    backgroundColor: "rgb(231, 231, 231)",
                  },
                }}
              >
                Refresh
              </Box>
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  color: "gray",
                  ":hover": {
                    backgroundColor: "rgb(231, 231, 231)",
                  },
                }}
              >
                Delete
              </Box>
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  color: "gray",
                  ":hover": {
                    backgroundColor: "rgb(231, 231, 231)",
                  },
                }}
              >
                Duplicate
              </Box>
            </Box>
          )}
          <AutoFixHighIcon sx={{ color: "gray", cursor: "pointer" }} />
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "5px",
              color: "gray",
              cursor: "pointer",
            }}
            onClick={() => setToolDropdownOpen(!isToolDropdownOpen)}
          >
            <BuildIcon />
            Tools
            <ArrowDropDownIcon />
          </Typography>
          {isToolDropdownOpen && (
            <Box
              sx={{
                position: "absolute",
                width: "180px",
                top: "120px",
                left: "150px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "8px",
                zIndex: "1",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  color: "gray",
                  ":hover": {
                    backgroundColor: "rgb(231, 231, 231)",
                  },
                }}
              >
                Create a quotation
              </Box>
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  color: "gray",
                  ":hover": {
                    backgroundColor: "rgb(231, 231, 231)",
                  },
                }}
              >
                Schedule Event
              </Box>
            </Box>
          )}
        </Box>
        {/* right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "@media (150px<=width<= 360px)": {
              width: "70%",
              justifyContent: "space-around",
            },
          }}
        >
          <ArrowLeftIcon sx={{ color: "gray", cursor: "pointer" }} />
          <ArrowRightIcon sx={{ color: "gray", cursor: "pointer" }} />
          <Tooltip
            title="Kanban"
            sx={{ color: "gray", cursor: "pointer" }}
            onClick={handleKanbanViewClick}
          >
            <ViewKanbanIcon />
          </Tooltip>
          <Tooltip title="Grid">
            <GridViewIcon
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={handleGridView}
            />
          </Tooltip>
          <Tooltip title="Form">
            <ListAltIcon
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={handleAdd}
            />
          </Tooltip>
          <SettingsIcon
            sx={{ color: "gray", cursor: "pointer" }}
            onClick={() => setSettingsDropdownOpen(!isSettingsDropdownOpen)}
          />
          {isSettingsDropdownOpen && (
            <Box
              sx={{
                position: "absolute",
                width: "150px",
                top: "120px",
                right: "0px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "8px",
                zIndex: "1",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  color: "gray",
                  ":hover": {
                    backgroundColor: "rgb(231, 231, 231)",
                  },
                }}
              >
                View...
              </Box>
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  color: "gray",
                  ":hover": {
                    backgroundColor: "rgb(231, 231, 231)",
                  },
                }}
              >
                Model...
              </Box>
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  color: "gray",
                  ":hover": {
                    backgroundColor: "rgb(231, 231, 231)",
                  },
                }}
              >
                Action...
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default OpportunityCardHeader;
