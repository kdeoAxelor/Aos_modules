import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import OpportunityCardHeader from "./OpportunityCardHeader";

import {
  deleteFollowers,
  fetchDataById,
  fetchFollowers,
  fetchMessages,
  saveData,
} from "app/services/rest";
import {
  OPPORTUNITIES_ASSIGNED_USER_MODEL,
  OPPORTUNITIES_COMPANY_MODEL,
  OPPORTUNITIES_CURRENCY_MODEL,
  OPPORTUNITIES_CUSTOMER_CONTACT_MODEL,
  OPPORTUNITIES_MODEL,
  OPPORTUNITIES_NEEDS_MODEL,
  OPPORTUNITIES_SOURCE_MODEL,
  OPPORTUNITIES_TEAM_MODEL,
} from "app/utils/constants";

import {
  Box,
  Typography,
  Input,
  NativeSelect,
  Slider,
  InputLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  editDataReqBody,
  contactReqBody,
  customerReqBody,
  dropdownReqBody,
  userReqBody,
} from "./constants";
import Dropdown from "./Dropdown";
import Counter from "./Counter";
import SnackbarAlert from "../../components/SnackbarAlert";
import MessageContainer from "../../components/MessageContainer";
import Followers from "../../components/Followers";

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const { state } = location;
  const { editable } = state;

  const [initialState, setInitialState] = useState(); // To store the state of the form fields initially and on change
  const ratings = [1, 2, 3, 4, 5];
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [active, setActive] = useState();
  const steps = [
    { name: "New", id: 1 },
    { name: "Qualification", id: 2 },
    { name: "Proposition", id: 3 },
    { name: "Negotiation", id: 4 },
    { name: "Closed Won", id: 5 },
    { name: "Closed Lost", id: 6 },
  ];
  const [isSaved, setIsSaved] = useState(true);

  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [selectedDate, setSelectedDate] = useState();

  // states for managing msg and followers container
  const [postButtonEnable, setPostButtonEnable] = useState(false);
  const [messageList, setMessageList] = useState();
  const [totalMsg, setTotalMsg] = useState();
  const [msgLimit, setMsgLimit] = useState(4);
  const [followersList, setFollowersList] = useState();
  const [follow, setFollow] = useState(false);

  // function to handle date change
  const handleDateChange = (dateStr) => {
    const date = new Date(dateStr.$d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
    setInitialState((prev) => ({ ...prev, expectedCloseDate: formattedDate }));
  };
  // function to handle change in name and memo input
  const handleChange = (e) => {
    setInitialState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // function to handle change in dropdowns
  const handleSearchInputChange = (val, name) => {
    setInitialState((prev) => ({ ...prev, [name]: val }));
  };
  // function to handle active state for stepper component
  const handleActiveState = (i) => {
    setActive(i - 1);
    setInitialState((prev) => ({
      ...prev,
      opportunityStatus: steps[i - 1],
    }));
    setIsSaved(false);
  };
  // function to handle click for lost/won
  const handleBtnClick = (flag) => {
    if (flag === "close") {
      setActive(active);
      setInitialState((prev) => ({
        ...prev,
        opportunityStatus: steps[active],
      }));
    } else {
      setActive(active - 1);
      setInitialState((prev) => ({
        ...prev,
        opportunityStatus: steps[active - 1],
      }));
    }
  };
  // function to handle save functionality
  const handleSave = async () => {
    const { name, partner, contact } = initialState;

    const saveDataReqBody = {
      data: initialState,
    };

    if (!name) {
      setAlertMessage("Name is required");
      setShowAlertSnackbar(true);
      return;
    } else if (!partner || !partner.fullName) {
      setAlertMessage("Customer Name is Required");
      setShowAlertSnackbar(true);
      return;
    } else if (!contact || !contact.fullName) {
      setAlertMessage("Contact Name is Required");
      setShowAlertSnackbar(true);
      return;
    }
    try {
      const response = await saveData(OPPORTUNITIES_MODEL, saveDataReqBody);
      const followers_res = await fetchFollowers(OPPORTUNITIES_MODEL, id);
      const messages_response = await fetchMessages(
        OPPORTUNITIES_MODEL,
        id,
        msgLimit
      );
      setFollowersList(followers_res);
      setMessageList(messages_response.data);
      setAlertMessage("Saved Successfully");
      setShowAlertSnackbar(true);
      setIsSaved(false);
    } catch (error) {
      setAlertMessage(error);
      showAlertSnackbar(true);
    }
  };
  const handleAlertConfirm = () => {
    setShowAlertSnackbar(false);
    !isSaved &&
      navigate(`./../../view-opportunity/${id}`, {
        state: { editable: false },
      });
  };
  const followerDelete = async (data) => {
    console.log(data);
    let deleteReqBody;
    deleteReqBody = { records: [data?.id] };
    try {
      const response = await deleteFollowers(
        OPPORTUNITIES_MODEL,
        id,
        deleteReqBody
      );
      setFollowersList(response?.data);
    } catch (error) {
      console.error("Error deleting follower:", error);
    }
    if (data?.$author?.fullName === "Admin") {
      setFollow(false);
    }
  };
  //used for handling stepper component responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    // Add event listener to listen for window resize
    if (windowSize.width < 520) {
      setIsMobileScreen(true);
    } else if (windowSize.width >= 520) {
      setIsMobileScreen(false);
    }
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize]);
  //used to fetch data using id for edit
  useEffect(() => {
    const fetchEditData = async () => {
      const fetchedData = await fetchDataById(
        OPPORTUNITIES_MODEL,
        id,
        editDataReqBody
      );
      const followers_response = await fetchFollowers(OPPORTUNITIES_MODEL, id);

      setInitialState(fetchedData[0]);
      setFollowersList(followers_response);

      setActive(fetchedData[0]?.opportunityStatus?.id - 1);
      setSelectedDate(dayjs(fetchedData[0]?.expectedCloseDate) || "");
    };
    fetchEditData();
  }, [id]);

  useEffect(() => {
    if (!messageList) {
      const fetchMessagesFromApi = async () => {
        try {
          const messages_response = await fetchMessages(
            OPPORTUNITIES_MODEL,
            id,
            msgLimit
          );
          setMessageList(messages_response.data);
          setTotalMsg(messages_response?.total);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessagesFromApi();
    }
  }, [id, msgLimit, messageList]);
  return (
    <>
      {/* header */}
      <OpportunityCardHeader
        handleSave={handleSave}
        isEditable={editable}
        id={id}
      />
      {/* main container */}
      <Box
        sx={{
          width: "90%",
          margin: "auto",
          display: "flex",
          marginTop: "20px",
          gap: "10px",
          "@media(150px<=width< 360px)": {
            flexDirection: " column",
            width: "90%",
          },
          "@media(360px<=width<=720px)": {
            flexDirection: " column",
            width: "90%",
          },
        }}
      >
        {active === 5 ? (
          <Box>
            <Typography>Lost Reason</Typography>
            <FormControl
              variant="standard"
              sx={{ minWidth: 120, width: "30%" }}
            >
              <NativeSelect>
                <option></option>
                <option>No results found</option>
              </NativeSelect>
            </FormControl>
            <Button variant="contained" onClick={() => handleBtnClick("close")}>
              Close
            </Button>
            <Button variant="contained" onClick={() => handleBtnClick("ok")}>
              Ok
            </Button>
          </Box>
        ) : (
          ""
        )}
        {/* left container */}
        <Box
          sx={{
            width: "70%",
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            borderRadius: "10px",
            "@media(150px<=width< 360px)": {
              flexDirection: " column",
              width: "100%",
            },
            "@media(360px<=width<=720px)": {
              width: "100%",
            },
          }}
        >
          {/* top */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              border: "1px solid rgb(216, 213, 213)",
              borderRadius: "10px",
              padding: "20px",
              "@media(150px<=width< 360px)": {
                flexDirection: " column",
                width: "100%",
              },
              "@media(360px<=width<=720px)": {
                width: "100%",
              },
            }}
          >
            {/* stepper */}
            <Box sx={{ width: "100%", margin: "10px" }}>
              {isMobileScreen === true ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Stepper
                    activeStep={active}
                    alternativeLabel
                    orientation="vertical"
                  >
                    {steps.map((label, index) => (
                      <Step key={label?.id}>
                        <StepLabel
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActiveState(label?.id);
                          }}
                        >
                          {label.name}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>
              ) : (
                <>
                  <Stepper activeStep={active} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label?.id}>
                        <StepLabel
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActiveState(label?.id);
                          }}
                        >
                          {label.name}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </>
              )}
            </Box>
            {/* name input */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                required
                sx={{
                  minWidth: "50%",
                  display: "flex",
                  gap: "30px",
                  flexDirection: "row",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ fontWeight: "bold", fontSize: "30px", margin: "auto" }}
                >
                  {" "}
                  {initialState?.id || ""}
                </Typography>

                <Input
                  placeholder="Name"
                  onChange={(e) => handleChange(e)}
                  name="name"
                  value={initialState?.name || ""}
                  readOnly={active === 4 || active === 5 ? true : !editable}
                  disableUnderline={
                    active === 4 || active === 5 ? true : !editable
                  }
                  sx={{
                    fontWeight:
                      active === 4 || active === 5 || editable === false
                        ? "bold"
                        : "normal",
                    fontSize:
                      active === 4 || active === 5 || editable === false
                        ? "30px"
                        : "normal",
                  }}
                />
              </FormControl>
            </Box>
            {/* dropdowns */}
            <Box sx={{ display: "flex", gap: "10%", flexWrap: "wrap" }}>
              {/* type of need */}
              <Box>
                <InputLabel>Type Of Need</InputLabel>

                <Dropdown
                  handleSearchInputChange={handleSearchInputChange}
                  model={OPPORTUNITIES_NEEDS_MODEL}
                  reqBody={dropdownReqBody}
                  name={"opportunityType"}
                  editable={editable}
                  activeStepper={active}
                  initialValue={initialState?.opportunityType || "hii"}
                />
              </Box>
              {/* opportunity rating */}
              <Box>
                <InputLabel>Opportunity Rating</InputLabel>
                <FormControl
                  variant="standard"
                  sx={{ minWidth: 120, width: "30%" }}
                >
                  {active === 4 || active === 5 || editable === false ? (
                    <>
                      <Typography>{initialState?.opportunityRating}</Typography>
                    </>
                  ) : (
                    <>
                      <NativeSelect defaultValue={""}>
                        {ratings?.map((item) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ))}
                      </NativeSelect>
                    </>
                  )}
                </FormControl>
              </Box>
              {/* source */}
              <Box>
                <InputLabel>Source</InputLabel>
                <Dropdown
                  handleSearchInputChange={handleSearchInputChange}
                  name={"source"}
                  model={OPPORTUNITIES_SOURCE_MODEL}
                  reqBody={dropdownReqBody}
                  editable={editable}
                  activeStepper={active}
                  initialValue={initialState?.source || ""}
                />
              </Box>
            </Box>
            {/* date , prob , currency */}
            <Box sx={{ display: "flex", gap: "10%", flexWrap: "wrap" }}>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DemoItem
                      label=<InputLabel id="date">
                        Expected Close Date:
                      </InputLabel>
                      sx={{ margin: "0px", padding: "0px" }}
                    >
                      {active === 4 || active === 5 || editable === false ? (
                        <Typography>
                          {initialState?.expectedCloseDate || ""}
                        </Typography>
                      ) : (
                        <DatePicker
                          name="expectedCloseDate"
                          format="YYYY/MM/DD"
                          onChange={(date) => handleDateChange(date)}
                          value={selectedDate}
                          sx={{
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              { outline: "none", border: "none" },
                            borderBottom:
                              active === 4 || active === 5 || editable === false
                                ? "none"
                                : "1px solid gray",
                          }}
                        />
                      )}
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "10%",
                  flexDirection: "column",
                  mt: "2%",
                }}
              >
                <Counter
                  label={"Probability"}
                  name={"probability"}
                  setInitialState={setInitialState}
                  initialValue={parseFloat(initialState?.probability, 10) || 0}
                  editable={editable}
                  active={active}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "10%",
                  flexDirection: "column",
                  mt: "2%",
                }}
              >
                <InputLabel>Currency</InputLabel>

                <Dropdown
                  handleSearchInputChange={handleSearchInputChange}
                  model={OPPORTUNITIES_CURRENCY_MODEL}
                  reqBody={dropdownReqBody}
                  name={"currency"}
                  initialValue={initialState?.currency || ""}
                  editable={editable}
                  activeStepper={active}
                />
              </Box>
            </Box>

            {/* amount , best , worst case */}
            <Box sx={{ display: "flex", gap: "5%", flexWrap: "wrap" }}>
              <Box
                sx={{ display: "flex", gap: "10%", flexDirection: "column" }}
              >
                <Counter
                  label={"Amount"}
                  name={"amount"}
                  setInitialState={setInitialState}
                  initialValue={parseFloat(initialState?.amount, 10) || 0.0}
                  editable={editable}
                  active={active}
                />
              </Box>
              <Box
                sx={{ display: "flex", gap: "10%", flexDirection: "column" }}
              >
                <Counter
                  label={"Best Case"}
                  name={"bestCase"}
                  setInitialState={setInitialState}
                  initialValue={parseFloat(initialState?.bestCase, 10) || 0.0}
                  editable={editable}
                  active={active}
                />
              </Box>
              <Box
                sx={{ display: "flex", gap: "10%", flexDirection: "column" }}
              >
                <Counter
                  label={"Worst Case"}
                  name={"worstCase"}
                  setInitialState={setInitialState}
                  initialValue={parseFloat(initialState?.worstCase, 10) || 0.0}
                  editable={editable}
                  active={active}
                />
              </Box>
            </Box>
          </Box>
          {/* bottom */}
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
                model={OPPORTUNITIES_MODEL}
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
                model={OPPORTUNITIES_MODEL}
              />
            </Box>
          </Box>
        </Box>
        {/* right container */}
        <Box
          sx={{
            width: "30%",
            display: "flex",
            gap: "10%",
            flexDirection: "column",
            height: "fit-content",
            border: "1px solid rgb(216, 213, 213)",
            borderRadius: "10px",
            "@media(150px<=width< 360px)": {
              flexDirection: " column",
              width: "100%",
            },
            "@media(360px<=width<=720px)": {
              width: "100%",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10%",
              flexDirection: "column",
            }}
          >
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Follow Up
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", gap: "20%", flexWrap: "wrap" }}
              >
                <Box>
                  <InputLabel>Assigned To</InputLabel>

                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    model={OPPORTUNITIES_ASSIGNED_USER_MODEL}
                    reqBody={userReqBody}
                    name={"user"}
                    initialValue={initialState?.user || ""}
                    editable={editable}
                    activeStepper={active}
                  />
                </Box>
                <Box>
                  <InputLabel>Company</InputLabel>

                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    model={OPPORTUNITIES_COMPANY_MODEL}
                    reqBody={dropdownReqBody}
                    name={"company"}
                    initialValue={initialState?.company || ""}
                    editable={editable}
                    activeStepper={active}
                  />
                </Box>
                <Box>
                  <InputLabel>Team</InputLabel>

                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    model={OPPORTUNITIES_TEAM_MODEL}
                    reqBody={dropdownReqBody}
                    name={"team"}
                    initialValue={initialState?.team || ""}
                    editable={editable}
                    activeStepper={active}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Reference
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
              >
                <Box>
                  <InputLabel>Customer/Prospect</InputLabel>

                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    model={OPPORTUNITIES_CUSTOMER_CONTACT_MODEL}
                    reqBody={customerReqBody}
                    name={"partner"}
                    initialValue={initialState?.partner || ""}
                    editable={editable}
                    activeStepper={active}
                  />
                </Box>
                <Box>
                  <InputLabel>Contact</InputLabel>

                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    model={OPPORTUNITIES_CUSTOMER_CONTACT_MODEL}
                    reqBody={contactReqBody}
                    name={"contact"}
                    initialValue={initialState?.contact || ""}
                    editable={editable}
                    activeStepper={active}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Memo
              </AccordionSummary>
              <AccordionDetails>
                {active === 4 || active === 5 ? (
                  <textarea
                    readOnly
                    style={{ resize: "none", width: "90%" }}
                    value={initialState?.memo || ""}
                  />
                ) : (
                  <TextField
                    sx={{ resize: "none", width: "90%" }}
                    name="memo"
                    onChange={(e) => handleChange(e)}
                    value={initialState?.memo || ""}
                    disabled={active === 4 || active === 5 ? true : !editable}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
      {showAlertSnackbar && (
        <SnackbarAlert message={alertMessage} onConfirm={handleAlertConfirm} />
      )}
    </>
  );
};

export default EditOpportunity;
