import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, Typography, Box } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  SaveAs as SaveAsIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AutoFixHigh as AutoFixHighIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  GridView as GridViewIcon,
  ListAlt as ListAltIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const ViewEditHeader = ({
  isEditable,
  setIsEditable,
  handleSave,
  totalData,
  selectedIndex,
  id,
  setDataId,
  flag,
  pageOffset,
  ids,
  action,
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [index, setIndex] = useState(selectedIndex);

  const handlePagination = (val) => {
    const readOnlyValue = action === "edit" ? false : true;
    if (val === "inc" && index < totalData - 1) {
      setDataId(ids[index + 1]);
      setIndex(index + 1);
      navigate(`./../../${action}-entry/${ids[index + 1]}`, {
        state: {
          totalData,
          index: index + pageOffset,
          readOnly: readOnlyValue,
          ids,
          action,
        },
      });
    } else if (val === "dec" && index > 0) {
      setDataId(ids[index - 1]);
      setIndex(index - 1);
      navigate(`./../../${action}-entry/${ids[index - 1]}`, {
        state: {
          totalData,
          index: index + pageOffset,
          readOnly: readOnlyValue,
          ids,
          action,
        },
      });
    }
  };

  const handleAdd = () => {
    flag === "create"
      ? navigate("./../create-entry", { state: { totalData, pageOffset } })
      : navigate("./../../create-entry", {
          state: { totalData: totalData, pageOffset: 0 },
        });
  };

  const handleEditClick = () => {
    setIsEditable(!isEditable);
    navigate(`./../../edit-entry/${id}`, {
      state: {
        showSaveBtn: true,
        totalData: totalData,
        index: selectedIndex,
        readOnly: false,
        action: "edit",
        ids,
      },
    });
  };
  const handleBackClick = () => {
    flag === "create" ? navigate("./../") : navigate("./../../../all-teams");
  };
  const handleGridViewClick = () => {
    flag === "create" ? navigate("./../../") : navigate("./../../");
  };
  const handleFormViewClick = () => {
    flag === "create"
      ? navigate("./../create-entry", { state: { totalData, pageOffset } })
      : navigate("./../../create-entry", {
          state: { totalData: totalData, pageOffset: 0 },
        });
  };

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: "65px",
          zIndex: "1000",
          display: "flex",
          marginBottom: "80px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "white",
          border: "1px solid rgb(221, 220, 220)",
          "@media (max-width: 370px)": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            top: "150px",
            marginBottom: "170px",
          },
          "@media (370px <=width<= 442px)": {
            top: "100px",
            marginBottom: "120px",
          },
          "@media (max-width: 690px)": {
            flexDirection: "column",
            gap: "10px",
          },
        }}
      >
        {/* left */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "@media (480px<=width<=840px)": {
              width: "70%",
              display: "flex",
              justifyContent: "space-evenly",
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
            onClick={handleBackClick}
          />
          <AttachFileIcon sx={{ color: "gray", cursor: "pointer" }} />
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
                left: "150px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "8px",
                zIndex: "1",
                display: "block",
              }}
            >
              <Box sx={{ cursor: "pointer", padding: "3px", color: "gray" }}>
                Refreshindex
              </Box>
              <Box sx={{ cursor: "pointer", padding: "3px", color: "gray" }}>
                Duplicate
              </Box>
              <Box
                sx={{ cursor: "pointer", padding: "3px", color: "gray" }}
                style={{ borderTop: "1px solid gray" }}
              >
                totalData Archive
              </Box>
              <Box
                sx={{ cursor: "pointer", padding: "3px", color: "gray" }}
                style={{ borderTop: "1px solid gray" }}
              >
                Last modified...
              </Box>
            </Box>
          )}
          <AutoFixHighIcon
            sx={{ cursor: "pointer", padding: "3px", color: "gray" }}
          />
        </Box>
        {/* right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {flag === "create" ? (
            <></>
          ) : (
            <Typography
              component="p"
              sx={{ margin: "0px 10px", color: "gray" }}
            >
              {index + 1} of {totalData}
            </Typography>
          )}
          <ArrowLeftIcon
            sx={{ cursor: "pointer", color: "gray" }}
            onClick={() => handlePagination("dec")}
          />
          <ArrowRightIcon
            sx={{ cursor: "pointer", color: "gray" }}
            onClick={() => handlePagination("inc")}
          />
          <Tooltip title="Grid">
            <GridViewIcon
              sx={{ cursor: "pointer", color: "gray" }}
              onClick={handleGridViewClick}
            />
          </Tooltip>
          <Tooltip title="Form">
            <ListAltIcon
              sx={{ cursor: "pointer", color: "gray" }}
              onClick={handleFormViewClick}
            />
          </Tooltip>
          <SettingsIcon
            sx={{ cursor: "pointer", color: "gray" }}
            onClick={() => setSettingsDropdownOpen(!isSettingsDropdownOpen)}
          />
          {isSettingsDropdownOpen && (
            <Box
              sx={{
                position: "absolute",
                width: "150px",
                top: "120px",
                left: "150px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "8px",
                zIndex: "1",
                display: "block",
              }}
            >
              <Box sx={{ cursor: "pointer", padding: "3px", color: "gray" }}>
                View...
              </Box>
              <Box sx={{ cursor: "pointer", padding: "3px", color: "gray" }}>
                Model...
              </Box>
              <Box sx={{ cursor: "pointer", padding: "3px", color: "gray" }}>
                Action...
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ViewEditHeader;
