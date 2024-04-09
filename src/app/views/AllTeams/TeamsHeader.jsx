import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "app/services/rest";
import { TEAM_MODEL } from "app/utils/constants";

import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  GridView as GridViewIcon,
  ListAlt as ListAltIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import {
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Button,
  Stack,
  Box,
  Typography,
  TextField,
  Input,
} from "@mui/material";

const Header = ({
  data,
  setData,
  pageOffset,
  pageLimit,
  setPageOffset,
  setPageLimit,
  totalData,
}) => {
  // State for search input value
  const [searchData, setSearchData] = useState("");
  const navigate = useNavigate();
  // State for controlling dropdown visibility
  const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [isArrowDropdownOpen, setArrowDropdownOpen] = useState(false);
  const [limitButton, setLimitButton] = useState(false);
  const [limitInput, setLimitInput] = useState(pageLimit);

  //search functionality
  const searchTeamData = () => {
    setData(
      data.filter((team) =>
        team.name.toLowerCase().includes(searchData.toLowerCase())
      )
    );
  };
  //function to handle pagination
  const handlePageChange = (val) => {
    if (val === 1) {
      pageOffset + pageLimit < totalData &&
        setPageOffset((prev) => prev + pageLimit);
    } else {
      pageOffset > 0 && setPageOffset((prevOffset) => prevOffset - pageLimit);
    }
  };
  //function to apply different page limit
  const handleApplyLimit = () => {
    setLimitButton(false);
    setPageLimit(limitInput);
  };
  const refreshDataReqBody = {
    offset: pageOffset,
    fields: ["name", "description"],
    limit: pageLimit,
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
  const handleRefresh = async () => {
    const response = await fetchData(TEAM_MODEL, refreshDataReqBody);
    setData(response.data);
  };

  const handleAdd = async () => {
    navigate("./create-entry", { state: { totalData, pageOffset } });
  };

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: "60px",
          zIndex: "1000",
          marginBottom: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "white",
          border: "1px solid rgb(221, 220, 220)",
          "@media (150px <= width <= 360px)": {
            top: "140px",
            marginBottom: "140px",
          },
          "@media (360px < width <= 368px)": {
            top: "100px",
            marginBottom: "100px",
          },
          "@media (368px <= width<= 442px)": {
            top: "100px",
            marginBottom: "100px",
          },
          "@media (max-width: 690px)": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
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
            "@media (max-width: 370px) and (min-width: 150px)": {
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
          <Tooltip title="Refresh">
            <RefreshIcon
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={handleRefresh}
            />
          </Tooltip>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: "20px",
            }}
          >
            <TextField
              sx={{
                border: "1px solid gray",
                margin: "0px 10px",
                width: "300px",
                height: "30px",
                border: "1px solid rgb(204, 203, 203)",
                borderRadius: "5px",
                "@media (max-width: 370px)": {
                  margin: "0 10px",
                  width: "auto",
                  height: "30px",
                  border: "1px solid rgb(204, 203, 203)",
                  borderRadius: "5px",
                },
              }}
              InputProps={{
                disableUnderline: true,
              }}
              variant="standard"
              onChange={(e) => setSearchData(e.target.value)}
              value={searchData}
            />
            <ArrowDropDownIcon
              sx={{
                right: "70px",
                color: "gray",
                cursor: "pointer",
                position: "absolute",
                top: "10%",
              }}
              onClick={() => setArrowDropdownOpen(!isArrowDropdownOpen)}
            />
            {isArrowDropdownOpen ? (
              <Box
                sx={{
                  position: "absolute",
                  width: "500px",
                  top: "30px",
                  left: "15px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  zIndex: "1",
                  "@media (max-width: 690px)": {
                    width: "fit-content",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottom: "1px solid lightgrey",
                    margin: "0px",
                    padding: "10px",
                  }}
                >
                  <Typography component="h4" sx={{ m: "0px", p: "0px" }}>
                    Advanced Search
                  </Typography>
                  <ClearIcon
                    onClick={() => setArrowDropdownOpen(!isArrowDropdownOpen)}
                  />
                </Box>
                <Box sx={{ margin: "0px 10px 5px 10px" }}>
                  <FormControl
                    sx={{
                      margin: "0px",
                      padding: "0px",
                      "@media(150px<=width< 690px)": {
                        display: "flex",
                        flexDirection: "column",
                      },
                    }}
                  >
                    <RadioGroup
                      defaultValue="and"
                      name="radio-buttons-group"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                      }}
                    >
                      <FormControlLabel
                        value="and"
                        control={<Radio size="small" />}
                        label="And"
                      />
                      <FormControlLabel
                        value="or"
                        control={<Radio size="small" />}
                        label="Or"
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label="Show archived"
                  />
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      marginTop: "10px",
                      "@media(150px<=width< 690px)": {
                        display: "grid",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        marginLeft: "0px",
                      },
                    }}
                  >
                    <Button
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        fontSize: "12px",
                      }}
                    >
                      Add Filter
                    </Button>
                    <Button
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        fontSize: "12px",
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        fontSize: "12px",
                      }}
                    >
                      Export{" "}
                    </Button>
                    <Button
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        fontSize: "12px",
                      }}
                    >
                      Export Full
                    </Button>
                    <Button
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        fontSize: "12px",
                      }}
                    >
                      Apply
                    </Button>
                  </Stack>
                  <Box>
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <TextField
                        rows={1}
                        sx={{
                          resize: "none",
                          border: "none",
                          outline: "none",
                          borderBottom: "1px solid lightgrey",
                          backgroundColor: "#fff",
                        }}
                      />
                      <FormControlLabel
                        control={<Checkbox size="small" />}
                        label="Share"
                      />
                    </Box>
                    <Button variant="outlined" style={{ color: "blue" }}>
                      save
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              ""
            )}
            <ClearIcon
              sx={{
                right: "40px",
                color: "gray",
                cursor: "pointer",
                position: "absolute",
                top: "10%",
              }}
              onClick={() => setSearchData("")}
            />
            <SearchIcon
              sx={{
                right: "10px",
                color: "gray",
                cursor: "pointer",
                position: "absolute",
                top: "10%",
              }}
              onClick={searchTeamData}
            />
          </Box>
        </Box>
        {/* right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Box style={{ position: "relative" }}>
            <Typography
              component="p"
              onClick={() => setLimitButton(!limitButton)}
              sx={{
                margin: "0 10px",
                color: "gray",
                ":hover": { cursor: "pointer" },
              }}
            >
              {`${pageOffset + 1} to ${
                pageLimit + pageOffset < totalData
                  ? pageLimit + pageOffset
                  : totalData
              } of ${totalData}`}
            </Typography>
            {limitButton && (
              <Box
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: 0,
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#fff",
                }}
              >
                <Input
                  style={{ width: "50px" }}
                  type="number"
                  value={limitInput}
                  onChange={(e) => {
                    const inputValue = parseInt(e.target.value, 10);
                    setLimitInput(isNaN(inputValue) ? 0 : inputValue);
                  }}
                />
                <Button
                  onClick={handleApplyLimit}
                  sx={{
                    backgroundColor: "gray",
                    color: "white",
                    ":hover": {
                      backgroundColor: "#3f3f46",
                    },
                  }}
                >
                  Apply
                </Button>
              </Box>
            )}
          </Box>
          <ArrowLeftIcon
            sx={{ color: "gray", cursor: "pointer" }}
            onClick={() => handlePageChange(-1)}
          />
          <ArrowRightIcon
            sx={{ color: "gray", cursor: "pointer" }}
            onClick={() => handlePageChange(1)}
          />
          <Tooltip title="Grid">
            <GridViewIcon sx={{ color: "gray", cursor: "pointer" }} />
          </Tooltip>
          <Tooltip title="Form" onClick={() => navigate("./create-entry")}>
            <ListAltIcon sx={{ color: "gray", cursor: "pointer" }} />
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
                top: "40px",
                right: "0px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "8px",
                zIndex: "1",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  "&:hover": {
                    backgroundColor: "lightGray",
                  },
                }}
              >
                View...
              </Box>
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  "&:hover": {
                    backgroundColor: "lightGray",
                  },
                }}
              >
                Model...
              </Box>
              <Box
                sx={{
                  cursor: "pointer",
                  p: "3px",
                  "&:hover": {
                    backgroundColor: "lightGray",
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

export default Header;
