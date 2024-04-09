import React, { useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { Box, Button, Snackbar } from "@mui/material";

const SnackbarPrompt = ({ message, onConfirm, onCancel }) => {
  const [open, setOpen] = useState(true);
  const [topPosition, setTopPosition] = useState("80px"); // Default top position

  const handleClose = (confirmed) => {
    setOpen(false);
    if (confirmed) {
      onConfirm();
    } else {
      onCancel();
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
              backgroundColor: "#4f46e5",
              color: "white",
              "&:hover": {
                backgroundColor: "#3730a3",
              },
            }}
          >
            Delete
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={() => handleClose(false)}
            sx={{
              backgroundColor: "#374151",
              color: "white",
              "&:hover": {
                backgroundColor: "#111827",
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </MuiAlert>
    </Snackbar>
  );
};

export default SnackbarPrompt;
