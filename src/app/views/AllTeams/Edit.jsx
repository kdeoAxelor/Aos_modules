import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ViewEditHeader from "./Header";
import SnackbarAlert from "../../components/SnackbarAlert";
import MessageContainer from "../../components/MessageContainer";
import Followers from "../../components/Followers";
import DummyImg from "./images/dummy.jpg";

import { TEAM_MODEL, MEMBERS_MODEL, ROLES_MODEL } from "app/utils/constants";
import {
  fetchData,
  saveData,
  fetchFollowers,
  deleteFollowers,
  fetchDataById,
  fetchMessages,
} from "app/services/rest";

import {
  Upload as UploadIcon,
  Clear as ClearIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

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
import { editDataReqBody, membersReqBody, rolesReqBody } from "./constants";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const EditForm = () => {
  const location = useLocation();
  const { state } = location;
  const { showSaveBtn, totalData, index, readOnly, ids, action } = state;
  const { id } = useParams();
  console.log("id", id);
  const navigate = useNavigate();

  const theme = createTheme({
    components: {
      MuiInput: {
        styleOverrides: {
          underline: {
            "&:hover:not(.Mui-disabled):before": {
              borderBottom: "none", // Remove bottom border on hover
            },
            "&:before": {
              borderBottom: "none", // Remove default bottom border
            },
            "&:hover:not($disabled):after": {
              borderBottom: "none", // Remove bottom border on hover when active
            },
            "&:after": {
              borderBottom: "none", // Remove default bottom border when active
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
      MuiSelect: {
        styleOverrides: {
          icon: ({ theme }) =>
            theme.unstable_sx({
              visibility: readOnly ? "hidden" : "visible",
            }),
        },
      },
    },
  });
  const [dataId, setDataId] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [initialState, setInitialState] = useState();
  const [saveDataReqBody, setSaveDataReqBody] = useState(null);

  const [followersList, setFollowersList] = useState();
  const [postButtonEnable, setPostButtonEnable] = useState(false);
  const [messageList, setMessageList] = useState();
  const [totalMsg, setTotalMsg] = useState();
  const [msgLimit, setMsgLimit] = useState(4);

  const [isSaved, setIsSaved] = useState(false); // To track whether the form data is saved or not

  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [follow, setFollow] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  let clickedRole;
  let clickedMember;

  const handleChange = (e) => {
    setInitialState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!initialState?.name) {
      setAlertMessage("Name is required");
      setShowAlertSnackbar(true);
      return;
    }
    try {
      const response = await saveData(TEAM_MODEL, saveDataReqBody);
      setAlertMessage("Saved Successfully");
      setShowAlertSnackbar(true);
      setIsSaved(true);
    } catch (error) {
      setAlertMessage(error);
      showAlertSnackbar(true);
    }
  };

  const handleAlertConfirm = () => {
    setShowAlertSnackbar(false);
    isSaved === true &&
      navigate(`./../../view-entry/${id}`, {
        state: {
          totalData,
          index,
          readOnly: true,
          showSaveBtn: false,
        },
      });
  };

  const followerDelete = async (data) => {
    console.log(data);
    let deleteReqBody;
    deleteReqBody = { records: [data?.id] };
    try {
      const response = await deleteFollowers(TEAM_MODEL, id, deleteReqBody);
      setFollowersList(response?.data);
    } catch (error) {
      console.error("Error deleting follower:", error);
    }
    if (data?.$author?.fullName === "Admin") {
      setFollow(false);
    }
  };

  const handleRoleClick = (role) => {
    clickedRole = role;
  };
  const handleMemberClick = (member) => {
    clickedMember = member;
  };
  const handleRolesChange = (e) => {
    setSelectedRoles((prevRoles) => {
      const index = prevRoles?.findIndex(
        (role) => role?.id === clickedRole?.id
      );

      if (index === -1) {
        return [...prevRoles, clickedRole];
      } else {
        const updatedRoles = [...prevRoles];
        updatedRoles?.splice(index, 1);
        return updatedRoles;
      }
    });
  };
  const handleMembersChange = (e) => {
    setSelectedMembers((prevMembers) => {
      const index = prevMembers?.findIndex(
        (role) => role?.id === clickedMember?.id
      );

      if (index === -1) {
        return [...prevMembers, clickedMember];
      } else {
        const updatedMembers = [...prevMembers];
        updatedMembers?.splice(index, 1);
        return updatedMembers;
      }
    });
  };

  useEffect(() => {
    const saveDataReqBody = {
      data: {
        ...initialState,
        roles: selectedRoles,
        members: selectedMembers,
      },
    };

    setSaveDataReqBody(saveDataReqBody);
  }, [
    initialState?.name,
    initialState?.description,
    selectedRoles,
    selectedMembers,
  ]);
  useEffect(() => {
    const fetchRolesAndMembersFromApi = async () => {
      try {
        const rolesResponse = await fetchData(ROLES_MODEL, rolesReqBody);
        setRoles(rolesResponse.data);
        const membersResponse = await fetchData(MEMBERS_MODEL, membersReqBody);
        setMembers(membersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRolesAndMembersFromApi();
  }, []);

  // fetch data to edit on component mount
  useEffect(() => {
    const fetchEditData = async () => {
      const response = await fetchDataById(TEAM_MODEL, id, editDataReqBody);
      const followers_response = await fetchFollowers(TEAM_MODEL, id);

      setSelectedRoles(response[0]?.roles);
      setSelectedMembers(response[0]?.members);
      setFollowersList(followers_response);
      setInitialState(response[0]);
    };
    fetchEditData();
  }, [id]);

  useEffect(() => {
    const fetchMessagesFromApi = async () => {
      try {
        const messages_response = await fetchMessages(TEAM_MODEL, id, msgLimit);
        setMessageList(messages_response.data);
        setTotalMsg(messages_response?.total);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessagesFromApi();
  }, [id, msgLimit]);

  return (
    <ThemeProvider theme={theme}>
      <ViewEditHeader
        isEditable={isEditable || showSaveBtn}
        setIsEditable={setIsEditable}
        handleSave={handleSave}
        selectedIndex={index}
        totalData={totalData}
        id={id}
        setDataId={setDataId}
        readOnly={readOnly}
        ids={ids}
        action={action}
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
        {/* top container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgb(216, 213, 213)",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* left */}
            <Box
              sx={{
                flex: "1",
                alignItems: "flex-start",
                marginRight: "20px",
              }}
            >
              {readOnly === true ? (
                <img
                  style={{
                    height: "200px",
                    width: "200px",
                    position: "relative",
                    border: "1px solid lightGray",
                  }}
                  src={DummyImg}
                  alt="Axelor"
                />
              ) : (
                <Box
                  sx={{
                    height: "200px",
                    width: "200px",
                    position: "relative",
                    border: "1px solid lightGray",
                  }}
                >
                  {selectedImage && (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      style={{ height: "200px", width: "200px" }}
                    />
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
                      <ClearIcon onClick={() => setSelectedImage(null)} />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            {/* right */}
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
                required
                sx={{
                  color: "#615a59",
                  borderBottom: readOnly ? "none" : "1px solid lightGray",
                }}
                onChange={(e) => handleChange(e)}
                value={initialState?.name || ""}
                readOnly={readOnly}
              />
              <TextField
                disabled={readOnly}
                name="description"
                rows={readOnly ? 1 : 3}
                multiline
                onChange={(e) => handleChange(e)}
                value={initialState?.description || ""}
                style={{
                  backgroundColor: "rgb(248, 248, 248)",
                  borderRadius: "10px",
                  mt: "10px",
                  letterSpacing: "2px",
                  color: "#615a59",
                  borderColor: "lightGray",
                }}
              />
              <InputLabel sx={{ mt: 2 }}>Authorized Roles</InputLabel>
              <FormControl>
                <Select
                  multiple
                  value={selectedRoles}
                  onChange={handleRolesChange}
                  variant="standard"
                  sx={{
                    color: "#615a59",
                    borderBottom: readOnly ? "none" : "1px solid lightGray",
                    appearance: readOnly && "none",
                  }}
                  readOnly={readOnly}
                  renderValue={(selected) => (
                    <Stack gap={1} direction="row" flexWrap="wrap">
                      {selected.map((value) =>
                        readOnly === true ? (
                          <Chip key={value.id} label={value?.name} />
                        ) : (
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
                        )
                      )}
                    </Stack>
                  )}
                >
                  {roles.map((role) => (
                    <MenuItem
                      key={role.id}
                      value={role}
                      sx={{ justifyContent: "space-between" }}
                      onClick={() => handleRoleClick(role)}
                    >
                      {role?.name}
                      {selectedRoles?.some((obj) => obj.id === role.id) ? (
                        <CheckIcon color="info" />
                      ) : null}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <InputLabel sx={{ mt: 2 }}>Members</InputLabel>
              <FormControl>
                <Select
                  multiple
                  value={selectedMembers}
                  onChange={handleMembersChange}
                  variant="standard"
                  readOnly={readOnly}
                  sx={{
                    color: "#615a59",
                    borderBottom: readOnly ? "none" : "1px solid lightGray",
                  }}
                  renderValue={(selected) => (
                    <Stack gap={1} direction="row" flexWrap="wrap">
                      {selected.map((value) =>
                        readOnly === true ? (
                          <Chip key={value.id} label={value?.fullName} />
                        ) : (
                          <Chip
                            key={value.id}
                            label={value?.fullName}
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
                        )
                      )}
                    </Stack>
                  )}
                >
                  {members.map((member) => (
                    <MenuItem
                      key={member.id}
                      value={member}
                      sx={{ justifyContent: "space-between" }}
                      onClick={() => handleMemberClick(member)}
                    >
                      {member?.fullName}
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
        {/* bottom container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            marginTop: "0",
            "@media (width <= 840px)": {
              flexDirection: "column",
            },
          }}
        >
          {/* msg */}
          <Box
            sx={{
              width: "70%",
              border: "1px solid rgb(216, 213, 213)",
              borderRadius: "10px",
              "@media (width <= 840px)": {
                width: "100%",
              },
            }}
          >
            <MessageContainer
              postButtonEnable={postButtonEnable}
              setPostButtonEnable={setPostButtonEnable}
              id={id}
              messageList={messageList}
              setMessageList={setMessageList}
              totalMsg={totalMsg}
              setTotalMsg={setTotalMsg}
              setMsgLimit={setMsgLimit}
              msgLimit={msgLimit}
              model={TEAM_MODEL}
            />
          </Box>
          {/* followers */}
          <Box
            sx={{
              width: "30%",
              border: "1px solid rgb(216, 213, 213)",
              borderRadius: "10px",
              height: "fit-content",
              "@media (width <= 840px)": {
                width: "100%",
              },
            }}
          >
            <Followers
              followers={followersList}
              setFollowersList={setFollowersList}
              followerDelete={followerDelete}
              id={id}
              follow={follow}
              setFollow={setFollow}
              initialState={initialState}
              model={TEAM_MODEL}
            />
          </Box>
        </Box>
      </Box>
      {showAlertSnackbar && (
        <SnackbarAlert message={alertMessage} onConfirm={handleAlertConfirm} />
      )}
    </ThemeProvider>
  );
};

export default EditForm;
