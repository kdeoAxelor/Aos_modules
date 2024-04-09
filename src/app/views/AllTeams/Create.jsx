import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SnackbarAlert from "../../components/SnackbarAlert";
import { TEAM_MODEL, MEMBERS_MODEL, ROLES_MODEL } from "app/utils/constants";
import { fetchData, saveData } from "app/services/rest";
import { membersReqBody, rolesReqBody } from "./constants";

import {
  Upload as UploadIcon,
  Clear as ClearIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Chip,
  Box,
  Typography,
  Input,
  TextField,
} from "@mui/material";
import ViewEditHeader from "./Header";

const DataForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { totalData, pageOffset } = state;

  const theme = createTheme({
    components: {
      MuiInput: {
        styleOverrides: {
          underline: {
            "&:hover:not(.Mui-disabled):before": {
              borderBottom: "none",
            },
            "&:before": {
              borderBottom: "none",
            },
            "&:hover:not($disabled):after": {
              borderBottom: "none",
            },
            "&:after": {
              borderBottom: "none",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              px: 1,
              py: 0.25,
              backgroundColor: "#6366f1",
              color: "#fff",
            }),
        },
      },
    },
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [initialState, setInitialState] = useState({
    typeSelect: "general",
    name: "",
    description: "",
    roles: selectedRoles,
    members: selectedMembers,
  });
  const [dataId, setDataId] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setInitialState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const saveDataReqBody = {
      data: initialState,
    };
    if (!initialState?.name) {
      setAlertMessage("Name is required");
      setShowAlertSnackbar(true);
      return;
    }
    try {
      const response = await saveData(TEAM_MODEL, saveDataReqBody);
      setDataId(response[0]?.id);
      setAlertMessage("Saved Successfully");
      setIsSaved(true);
      setShowAlertSnackbar(true);
    } catch (error) {
      setAlertMessage(error);
      showAlertSnackbar(true);
    }
  };

  const handleAlertConfirm = () => {
    setShowAlertSnackbar(false);
    isSaved &&
      navigate(`./../edit-entry/${dataId}`, {
        state: {
          showSaveBtn: true,
          totalData: totalData + 1,
          index: totalData + pageOffset + 1,
          readOnly: false,
        },
      });
  };

  useEffect(() => {
    const fetchRolesAndMembersFromApi = async () => {
      try {
        const rolesResponse = await fetchData(ROLES_MODEL, rolesReqBody);
        setRoles(rolesResponse?.data);
        const membersResponse = await fetchData(MEMBERS_MODEL, membersReqBody);
        setMembers(membersResponse?.data);
      } catch (error) {
        setAlertMessage(error);
        setShowAlertSnackbar(true);
      }
    };
    fetchRolesAndMembersFromApi();
  }, []);

  useEffect(() => {
    setInitialState((prev) => ({
      ...prev,
      roles: selectedRoles,
      members: selectedMembers,
    }));
  }, [selectedRoles, selectedMembers]);

  return (
    <ThemeProvider theme={theme}>
      {/* header section */}
      <ViewEditHeader
        handleSave={handleSave}
        isEditable={true}
        flag={"create"}
        totalData={totalData}
        pageOffset={pageOffset}
      />
      {/* main container */}
      <Box
        sx={{
          width: "70vw",
          margin: "20px auto",
          display: "flex",
          flexDirection: "column",
          "@media (width <= 840px)": {
            width: "90vw",
          },
        }}
      >
        {/* form container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgb(216, 213, 213)",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          {/* overview header */}
          <Box
            sx={{
              backgroundColor: "rgb(248, 248, 248)",
              height: "50px",
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              color: "rgb(78, 77, 77)",
              padding: "10px",
            }}
          >
            <Typography component="h5">Overview</Typography>
          </Box>
          {/* left and right */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* left container */}
            <Box
              sx={{
                flex: "1",
                alignItems: "flex-start",
                marginRight: "20px",
              }}
            >
              <Box
                sx={{
                  height: "200px",
                  width: "200px",
                  position: "relative",
                  border: "1px solid lightGray",
                }}
              >
                {selectedImage && (
                  <>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      style={{ height: "200px", width: "200px" }}
                    />
                  </>
                )}

                <Box
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: "2000",
                    opacity: "0",
                    transition: "opacity 0.3s ease",
                    ":hover": {
                      opacity: "1",
                    },
                  }}
                >
                  {/* image container */}
                  <Box sx={{ display: "flex" }}>
                    <InputLabel htmlFor="file-input">
                      <UploadIcon />
                    </InputLabel>
                    <Input
                      sx={{ display: "none" }}
                      type="file"
                      name="avatar"
                      id="file-input"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => {
                        setSelectedImage(e.target.files[0]);
                        e.target.value = null;
                      }}
                    />
                    <ClearIcon
                      onClick={() => {
                        setSelectedImage(null);
                      }}
                      sx={{ color: "gray" }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* right container */}
            <Box
              sx={{
                flex: "3",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <InputLabel htmlFor="name" sx={{ color: "rgb(139, 137, 137)" }}>
                Name
              </InputLabel>
              <Input
                type="text"
                name="name"
                sx={{
                  color: "#615a59",
                  borderBottom: "1px solid lightGray",
                }}
                required
                onChange={(e) => handleChange(e)}
              />

              <TextField
                name="description"
                multiline
                rows={3}
                onChange={(e) => handleChange(e)}
                sx={{
                  backgroundColor: "rgb(248, 248, 248)",
                  borderRadius: "10px",
                  mt: "10px",
                  letterSpacing: "2px",
                  color: "#615a59",
                  borderColor: "lightGray",
                }}
              />
              {/*  Authorized roles dropdown */}
              <InputLabel sx={{ mt: 2 }}>Authorized Roles</InputLabel>
              <FormControl>
                <Select
                  multiple
                  value={selectedRoles}
                  onChange={(e) => setSelectedRoles(e.target.value)}
                  variant="standard"
                  sx={{
                    color: "#615a59",
                    borderBottom: "1px solid lightGray",
                  }}
                  renderValue={(selected) => (
                    <Stack gap={1} direction="row" flexWrap="wrap">
                      {selected.map((value) => (
                        <Chip
                          key={value.id}
                          label={value?.name}
                          onDelete={() =>
                            setSelectedRoles(
                              selectedRoles.filter((item) => item !== value)
                            )
                          }
                          deleteIcon={
                            <CancelIcon
                              onMouseDown={(event) => event.stopPropagation()}
                            />
                          }
                        />
                      ))}
                    </Stack>
                  )}
                >
                  {roles.map((role) => (
                    <MenuItem
                      key={role.id}
                      value={role}
                      sx={{ justifyContent: "space-between" }}
                    >
                      {role.name}

                      {selectedRoles.some((obj) => obj.id === role.id) ? (
                        <CheckIcon color="info" />
                      ) : null}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* members dropdown */}
              <InputLabel sx={{ mt: 2 }}>Members</InputLabel>
              <FormControl>
                <Select
                  multiple
                  value={selectedMembers}
                  onChange={(e) => setSelectedMembers(e.target.value)}
                  variant="standard"
                  sx={{
                    color: "#615a59",
                    borderBottom: "1px solid lightGray",
                  }}
                  renderValue={(selected) => (
                    <Stack gap={1} direction="row" flexWrap="wrap">
                      {selected.map((value) => (
                        <Chip
                          key={value.id}
                          label={value?.name}
                          onDelete={() =>
                            setSelectedMembers(
                              selectedMembers.filter((item) => item !== value)
                            )
                          }
                          deleteIcon={
                            <CancelIcon
                              onMouseDown={(event) => event.stopPropagation()}
                            />
                          }
                        />
                      ))}
                    </Stack>
                  )}
                >
                  {members.map((member) => (
                    <MenuItem
                      key={member.id}
                      value={member}
                      sx={{ justifyContent: "space-between" }}
                    >
                      {member.name}
                      {selectedMembers.some((obj) => obj.id === member.id) ? (
                        <CheckIcon color="info" />
                      ) : null}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>
      {showAlertSnackbar && (
        <SnackbarAlert message={alertMessage} onConfirm={handleAlertConfirm} />
      )}
    </ThemeProvider>
  );
};

export default DataForm;
