import React, { useState, useEffect } from "react";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import { MenuItem, Menu, Box, Divider, Typography } from "@mui/material";
import { deleteMessages } from "app/services/rest";

const Message = ({ msgItem, messageList, setMessageList }) => {
  const [timeDiff, setTimeDiff] = useState("");

  const timestamp = msgItem?.$eventTime;
  const dateObj = new Date(timestamp);
  const time = dateObj.getTime();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleClickListItem = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = async (id, flag) => {
    if (flag === "delete") {
      setAnchorEl(null);
      try {
        const response = await deleteMessages(id);
        if (response?.data?.status === 0) {
          const newMessageList = messageList.filter((msg) => msg?.id !== id);
          setMessageList(newMessageList);
        } else {
          setAlertMessage("Error deleting message");
          setShowAlertSnackbar(true);
        }
      } catch (error) {
        setAlertMessage("Error deleting message");
        setShowAlertSnackbar(true);
      }
    }
  };

  const renderTrackInfo = () => {
    try {
      const parsedBody = JSON.parse(msgItem?.body);
      const firstTrack = parsedBody?.tracks[0];

      if (firstTrack) {
        return (
          <>
            <Typography sx={{ padding: "5px" }}>{parsedBody?.title}</Typography>
            <Divider />
            <ul
              style={{
                margin: 0,
                lineHeight: 2,
                fontSize: "12px",
                paddingLeft: "18px",
              }}
            >
              {parsedBody?.title === "Opportunity created" ? (
                <>
                  {parsedBody?.tracks.map((item, index) => (
                    <>
                      <li key={index}>
                        <strong>{item?.title}: </strong>{" "}
                        <span>{item?.value}</span>
                      </li>
                    </>
                  ))}
                </>
              ) : (
                <li>
                  <strong>{firstTrack?.title}: </strong>{" "}
                  <span>
                    {firstTrack?.oldValue} -&gt; {firstTrack?.value}
                  </span>
                </li>
              )}
              <span style={{ color: "#6366f1" }}>
                {` - ${msgItem?.$author?.fullName} ${msgItem?.$eventText} ${timeDiff} ago`}{" "}
              </span>
            </ul>
          </>
        );
      } else {
        return <span>No tracks found</span>;
      }
    } catch (error) {
      return <span>Error parsing JSON</span>;
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();
      const diffInMs = now - time;
      const diffInMin = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMin / 60);
      const remainingMin = diffInMin % 60;

      let timeDiffStr = "";
      if (diffInHours > 0) {
        timeDiffStr = `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
        if (remainingMin > 0) {
          timeDiffStr += ` ${remainingMin} minute${
            remainingMin > 1 ? "s" : ""
          }`;
        }
      } else {
        timeDiffStr = `${remainingMin} minute${remainingMin > 1 ? "s" : ""}`;
      }

      setTimeDiff(timeDiffStr === "0 minutes" ? "Just now" : timeDiffStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <>
      <Box sx={{ display: "flex", m: 1, position: "relative" }}>
        {/* image */}
        <span
          style={{
            margin: ".65rem",
            marginTop: 0,
            width: "2.5rem",
            height: "2.5rem",
            display: "flex",
            overflow: "hidden",
            fontSize: "1.25rem",
            alignItems: "center",
            flexShrink: 0,
            userSelect: "none",
            borderRadius: "50%",
            justifyContent: "center",
          }}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src=" http://localhost:8080/axelor-erp/ws/rest/com.axelor.auth.db.User/1/image/download?image=true&v=5"
            alt="Admin"
          ></img>
        </span>
        {/* message body */}
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            width: "100%",
          }}
        >
          {msgItem?.$eventType === "comment" ? (
            <>
              {" "}
              <Typography sx={{ p: 1 }}>{msgItem?.body}</Typography>
              <Divider />
              <Typography
                component="p"
                variant="p"
                sx={{ fontSize: "12px", pl: 1 }}
              >
                <span style={{ color: "#6366f1" }}>
                  {` - ${msgItem?.$author?.fullName} ${msgItem?.$eventText} ${timeDiff} ago`}{" "}
                </span>
              </Typography>
            </>
          ) : (
            renderTrackInfo()
          )}
        </Box>
        {/* menu */}
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: "5px",
            height: "25px",
            ":hover": {
              backgroundColor: "#6366f1",
            },
          }}
        >
          <Box onClick={handleClickListItem}>
            <ArrowDropDownIcon />
          </Box>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => handleClick(msgItem?.id, "unread")}>
              Mark as Unread
            </MenuItem>
            <MenuItem onClick={() => handleClick(msgItem?.id, "imp")}>
              Mark as not Important
            </MenuItem>

            {msgItem?.$eventType === "comment" && (
              <MenuItem onClick={() => handleClick(msgItem?.id, "delete")}>
                Delete{" "}
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default Message;
