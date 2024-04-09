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
  MenuItem,
  Stack,
  Menu,
  FormGroup,
  Box,
  Input,
  Typography,
  TextField,
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
  Delete as DeleteIcon,
  Edit,
  Work as WorkIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

const GridViewHeader = ({ handleEdit, handleDelete, handleRefresh }) => {
  const [searchData, setSearchData] = useState("");
  const navigate = useNavigate();
  const [isSettingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [isArrowDropdownOpen, setArrowDropdownOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickListItem = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleAdd = async () => {
    navigate("./../create-entry");
  };

  return (
    <>
      <>
        <Box
          sx={{
            position: "sticky",
            top: "60px",
            zIndex: "1000",
            marginBottom: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "white",
            border: "1px solid rgb(221, 220, 220)",
            "@media (max-width: 690px)": {
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            },
            "@media (370px < width <= 530px)": {},
            "@media (360px < width <= 370px)": {
              top: "105px",
              marginBottom: "120px",
            },
            "@media (150px <=width <= 360px)": {
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
            <Tooltip title="Edit" onClick={handleEdit}>
              <Edit sx={{ color: "gray", cursor: "pointer" }} />
            </Tooltip>
            <Tooltip title="Delete">
              <DeleteIcon
                sx={{ color: "gray", cursor: "pointer" }}
                onClick={handleDelete}
              />
            </Tooltip>
            <Box>
              <Box>
                <Box onClick={handleClickListItem}>
                  <ArrowDropDownIcon
                    sx={{ color: "gray", cursor: "pointer" }}
                  />
                </Box>
              </Box>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem>Archive</MenuItem>
                <MenuItem>Unarchive</MenuItem>
              </Menu>
            </Box>

            <Tooltip title="Refresh">
              <RefreshIcon
                sx={{ color: "gray", cursor: "pointer" }}
                onClick={handleRefresh}
              />
            </Tooltip>
            <Tooltip
              title="Take Charge"
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={handleRefresh}
            >
              <WorkIcon />
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
                  "@media (max-width: 520px)": {
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
                  position: "absolute",
                  top: "10%",
                  right: "70px",
                  cursor: "pointer",
                  color: "gray",
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
                    <Typography component="h4">Advanced Search</Typography>
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
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "10px",
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
                  position: "absolute",
                  top: "10%",
                  right: "40px",
                  cursor: "pointer",
                  color: "gray",
                }}
                onClick={() => setSearchData("")}
              />
              <SearchIcon
                sx={{
                  position: "absolute",
                  top: "10%",
                  right: "10px",
                  cursor: "pointer",
                  color: "gray",
                }}
              />
            </Box>
          </Box>
          {/* right */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Tooltip
              title="Kanban"
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={() => navigate("./../")}
            >
              <ViewKanbanIcon />
            </Tooltip>
            <Tooltip title="Grid">
              <FormatListBulletedIcon
                sx={{ color: "gray", cursor: "pointer" }}
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
    </>
  );
};

export default GridViewHeader;
