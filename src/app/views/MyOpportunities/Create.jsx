import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OpportunityCardHeader from "./OpportunityCardHeader";
import Dropdown from "./Dropdown";
import { fetchInitialData, saveData } from "app/services/rest";
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
  contactReqBody,
  customerReqBody,
  dropdownReqBody,
  initialDataReqBody,
  userReqBody,
} from "./constants";
import {
  Box,
  Input,
  NativeSelect,
  InputLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Counter from "./Counter";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import SnackbarAlert from "../../components/SnackbarAlert";

const CreateNewEntry = () => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [active, setActive] = useState(0);
  const steps = [
    { name: "New", id: 1 },
    { name: "Qualification", id: 2 },
    { name: "Proposition", id: 3 },
    { name: "Negotiation", id: 4 },
    { name: "Closed Won", id: 5 },
    { name: "Closed Lost", id: 6 },
  ];
  const [isSaved, setIsSaved] = useState(false);
  const [ratings, setRatings] = useState([1, 2, 3, 4, 5]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [initialState, setInitialState] = useState({
    attrs: "{}",
    recurrentAmount: "0",
    amount: "",
    opportunityRating: 0,
    probability: "",
    worstCase: "",
    expectedDurationOfRecurringRevenue: 0,
    bestCase: "",
    company: "",
    team: "",
    user: "", //issue
    opportunityStatus: steps[active],
    currency: "",
    contact: "",
    contact: "",
    name: "",
    memo: "",
    opportunityType: "",
    source: "",
    expectedCloseDate: "",
    _original: {
      attrs: "{}",
      recurrentAmount: "0",
      amount: "0",
      opportunityRating: 0,
      probability: "0",
      worstCase: "0",
      expectedDurationOfRecurringRevenue: 0,
      bestCase: "0",
    },
  }); // To store the initial state of the form fields

  const [dataId, setDataId] = useState();
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
  const handleActiveState = () => {
    isSaved === true ? setActive((active) => active + 1) : setActive(active);
    setIsSaved(false);
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
      setAlertMessage("Saved Successfully");
      setShowAlertSnackbar(true);
      setIsSaved(true);
      setDataId(response[0]?.id);
    } catch (error) {
      setAlertMessage(error);
      showAlertSnackbar(true);
    }
  };
  const handleAlertConfirm = () => {
    setShowAlertSnackbar(false);
    isSaved === true && navigate(`./../view-opportunity/${dataId}`);
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

  //used to fetch already filled data in fields
  useEffect(() => {
    const initialDataFetch = async () => {
      const response = await fetchInitialData(initialDataReqBody);
      setInitialState((prev) => ({
        ...prev,
        currency: response[1]?.values?.currency,
      }));
      setInitialState((prev) => ({ ...prev, user: response[0]?.values?.user }));
      setInitialState((prev) => ({ ...prev, team: response[0]?.values?.team }));
      setInitialState((prev) => ({
        ...prev,
        company: response[0]?.values?.company,
      }));
    };
    initialDataFetch();
  }, []);
  return (
    <>
      {/* header */}
      <OpportunityCardHeader
        handleSave={handleSave}
        isEditable={true}
        flag={"create"}
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
        {/* left container */}
        <Box
          sx={{
            width: "70%",
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            border: "1px solid gray",
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
                  {steps.map((label) => (
                    <Step key={label.id}>
                      <StepLabel
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActiveState();
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
                    <Step key={label.id}>
                      <StepLabel
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActiveState();
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
            <FormControl required sx={{ minWidth: "50%" }}>
              <Input
                placeholder="Name"
                onChange={(e) => handleChange(e)}
                name="name"
              />
            </FormControl>
          </Box>
          {/* need , ratings , source dropdowns */}
          <Box sx={{ display: "flex", gap: "10%", flexWrap: "wrap" }}>
            {/* type of need */}
            <Box>
              <InputLabel>Type Of Need</InputLabel>
              <Dropdown
                handleSearchInputChange={handleSearchInputChange}
                model={OPPORTUNITIES_NEEDS_MODEL}
                reqBody={dropdownReqBody}
                name={"opportunityType"}
              />
            </Box>
            {/* opportunity rating */}
            <Box>
              <InputLabel>Opportunity Rating</InputLabel>
              <FormControl
                variant="standard"
                sx={{ minWidth: 120, width: "30%" }}
              >
                <NativeSelect
                  defaultValue={""}
                  // onFocus={handleOpportunityRating}
                >
                  <option></option>
                  {ratings?.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </NativeSelect>
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
              />
            </Box>
          </Box>
          {/* date , prob , currency */}
          <Box sx={{ display: "flex", gap: "10%", flexWrap: "wrap" }}>
            {/* date */}
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DemoItem
                    label=<InputLabel id="date">
                      Expected Close Date:
                    </InputLabel>
                    sx={{ margin: "0px", padding: "0px" }}
                  >
                    <DatePicker
                      name="expectedCloseDate"
                      format="YYYY/MM/DD"
                      onChange={(date) => handleDateChange(date)}
                      value={selectedDate}
                      sx={{
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                          { outline: "none", border: "none" },
                        borderBottom: "1px solid gray",
                      }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            {/* probability */}
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
              />
            </Box>
            {/* currency */}
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
                name={"currency"}
                initialValue={initialState?.currency}
                model={OPPORTUNITIES_CURRENCY_MODEL}
                reqBody={dropdownReqBody}
              />
            </Box>
          </Box>
          {/* amount , best , worst case */}
          <Box sx={{ display: "flex", gap: "15%", flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", gap: "10%", flexDirection: "column" }}>
              <Counter
                label={"Amount"}
                name={"amount"}
                setInitialState={setInitialState}
              />
            </Box>
            <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <Counter
                label={"Best Case"}
                name={"bestCase"}
                setInitialState={setInitialState}
              />
            </Box>
            <Box sx={{ display: "flex", gap: "10%", flexDirection: "column" }}>
              <Counter
                label={"Worst Case"}
                name={"worstCase"}
                setInitialState={setInitialState}
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
            border: "1px solid gray",
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
            {/* 1. follow up */}
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
                    name={"user"}
                    initialValue={initialState?.user}
                    model={OPPORTUNITIES_ASSIGNED_USER_MODEL}
                    reqBody={userReqBody}
                  />
                </Box>
                <Box>
                  <InputLabel>Company</InputLabel>
                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    name={"company"}
                    initialValue={initialState?.company}
                    model={OPPORTUNITIES_COMPANY_MODEL}
                    reqBody={dropdownReqBody}
                  />
                </Box>
                <Box>
                  <InputLabel>Team</InputLabel>
                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    name={"team"}
                    initialValue={initialState?.team}
                    model={OPPORTUNITIES_TEAM_MODEL}
                    reqBody={dropdownReqBody}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            {/* 2 reference */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Reference
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
              >
                <Box>
                  <InputLabel>Customer</InputLabel>
                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    name={"partner"}
                    model={OPPORTUNITIES_CUSTOMER_CONTACT_MODEL}
                    reqBody={customerReqBody}
                  />
                </Box>
                <Box>
                  <InputLabel>Contact</InputLabel>
                  <Dropdown
                    handleSearchInputChange={handleSearchInputChange}
                    name={"contact"}
                    model={OPPORTUNITIES_CUSTOMER_CONTACT_MODEL}
                    reqBody={contactReqBody}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            {/* 3. memo */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Memo
              </AccordionSummary>
              <AccordionDetails>
                <textarea
                  style={{ resize: "none", width: "90%" }}
                  name="memo"
                  onChange={(e) => handleChange(e)}
                />
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

export default CreateNewEntry;
