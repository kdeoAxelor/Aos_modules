import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Button,
  Box,
  Stack,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  GridView as GridViewIcon,
  ListAlt as ListAltIcon,
  Settings as SettingsIcon,
  ViewKanban as ViewKanbanIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

const MainPageHeader = ({ setIsRefreshed, isRefreshed }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState("");
  const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [isArrowDropdownOpen, setArrowDropdownOpen] = useState(false);

  const handleGridView = () => {
    navigate("./grid-view");
  };

  const handleAdd = () => {
    navigate("./create-entry");
  };

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: "60px",
          marginBottom: "70px",
          zIndex: "1000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "white",
          border: "1px solid rgb(221, 220, 220)",
          "@media (max-width: 360px)": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            top: "150px",
            marginBottom: "120px",
          },
          "@media (360px < width<= 442px)": {
            top: "100px",
            marginBottom: "80px",
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
              onClick={() => setIsRefreshed(!isRefreshed)}
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "1px solid lightGray",
                    p: "5px",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0px",
                      margin: "0px",
                      height: "30px",
                    }}
                  >
                    <FilterListIcon />
                    <Typography component="h4">Filters</Typography>
                  </Box>
                  <FormGroup sx={{ padding: "0px", margin: "0px" }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="MyOpportunities"
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        margin: "5px",
                        height: "10px",
                      }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Unassigned opportunities"
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        margin: "5px",
                        height: "10px",
                      }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="My Team opportunities"
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        margin: "5px",
                        height: "10px",
                      }}
                    />
                  </FormGroup>
                </Box>
                <Box sx={{ margin: "0px 10px 5px 10px" }}>
                  <Box>
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
                  </Box>

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
                        fontSize: "12px",
                        color: "blue",
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      style={{
                        textDecoration: "underline",
                        fontSize: "12px",
                        color: "blue",
                      }}
                    >
                      Apply
                    </Button>
                  </Stack>
                  <Box>
                    <Box
                      sx={{
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
            />
          </Box>
        </Box>
        {/* right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tooltip title="Kanban" sx={{ color: "gray", cursor: "pointer" }}>
            <ViewKanbanIcon />
          </Tooltip>
          <Tooltip title="Grid">
            <FormatListBulletedIcon
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={handleGridView}
            />
          </Tooltip>
          <Tooltip title="Form" onClick={handleAdd}>
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

export default MainPageHeader;
