import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";

const SnackbarAlert = ({ message, onConfirm }) => {
  const [open, setOpen] = useState(true);
  const [topPosition, setTopPosition] = useState("80px");

  const handleClose = (confirmed) => {
    setOpen(false);
    if (confirmed) {
      onConfirm();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      let newPosition = "80px";
      if (windowWidth < 360) {
        newPosition = "160px";
      } else if (windowWidth < 442) {
        newPosition = "110px";
      }
      setTopPosition(newPosition);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Snackbar
        open={open}
        onClose={() => handleClose(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        style={{ top: topPosition }}
      >
        <MuiAlert
          onClose={() => handleClose(false)}
          severity="info"
          sx={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid lightGray",
          }}
        >
          {message}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              mt: "10px",
            }}
          >
            <Button
              color="inherit"
              size="small"
              onClick={() => handleClose(true)}
              sx={{
                backgroundColor: "lightGray",
                color: "white",
                "&:hover": {
                  backgroundColor: "gray",
                },
              }}
            >
              Ok
            </Button>
          </Box>
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default SnackbarAlert;
