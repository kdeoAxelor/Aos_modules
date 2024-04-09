import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, CircularProgress } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { AddFollower, Follow } from "app/services/rest";
import { TEAM_MODEL } from "app/utils/constants";

const FollowersSnackbar = ({
  open,
  setOpen,
  initialState,
  setFollowersList,
  model
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [optionList, setOptionList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const loading = openDropdown && optionList.length === 0;
  const [followerValue, setFollowerValue] = useState([]);
  const [inputText, setInputText] = useState("");
  const handleFollowerAdd = async () => {
    handleClose(false);
    const reqBody = {
      data: {
        subject: initialState?.name,
        recipients: [followerValue],
      },
    };

    const response = await Follow(model, initialState?.id, reqBody);
    setFollowersList(response);
  };
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const reqBody = { data: { search: "", selected: [] } };

      if (active) {
        const res = await AddFollower(reqBody);
        setOptionList(res?.data || []);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!openDropdown) {
      setOptionList([]);
    }
  }, [openDropdown]);
  return (
    <>
      <Dialog onClose={handleClose} open={open} fullWidth="50%" sx={{ mt: 10 }}>
        <DialogTitle sx={{ m: 0, p: 2 }}>Add Followers </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Autocomplete
            sx={{ width: "100%", mb: "5px" }}
            open={openDropdown}
            onChange={(e, value) => setFollowerValue(value)}
            onOpen={() => {
              setOpenDropdown(true);
            }}
            onClose={() => {
              setOpenDropdown(false);
            }}
            isOptionEqualToValue={(optionList, value) =>
              optionList.address === value.address
            }
            getOptionLabel={(optionList) => optionList?.address || ""}
            options={optionList}
            loading={loading}
            renderInput={(params) => (
              <TextField
                sx={{ p: 0, borderBottom: "1px solid lightgray" }}
                {...params}
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              width: "100%",
            }}
          >
            <TextField
              variant="standard"
              sx={{ borderBottom: "1px solid lightgray" }}
              value={initialState?.name}
            />
            <TextField
              multiline
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              mt: "10px",
              width: "100%",
            }}
          >
            <Button
              sx={{
                border: "1px solid #4f46e5",
                color: "#4f46e5",
                height: "30px",
              }}
            >
              <AttachFileIcon />
            </Button>

            <Box
              sx={{
                display: "flex",
                gap: "10px",
              }}
            >
              <Button
                color="inherit"
                size="small"
                onClick={() => handleClose(true)}
                sx={{
                  backgroundColor: "#4f46e5",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#3730a3",
                  },
                }}
              >
                Close
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={handleFollowerAdd}
                sx={{
                  backgroundColor: "#374151",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#111827",
                  },
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FollowersSnackbar;
