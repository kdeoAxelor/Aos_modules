import React, { useState } from "react";
import {
  fetchMessages,
  postMessages,
  deleteMessages,
  fetchComments,
} from "app/services/rest";

import { AttachFile, Edit } from "@mui/icons-material";
import { Stack, Button, TextField, Box } from "@mui/material";
import Message from "./Message";
import SnackbarAlert from "app/components/SnackbarAlert";

const MessageContainer = ({
  postButtonEnable,
  setPostButtonEnable,
  id,
  messageList,
  setMessageList,
  totalMsg,
  setTotalMsg,
  msgLimit,
  setMsgLimit,
  model,
}) => {
  const [message, setMessage] = useState("");
  const [activeButton, setActiveButton] = useState("All");

  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleTextAreaChange = (e) => {
    setPostButtonEnable(true);
    setMessage(e.target.value);
  };

  const handleMessagePost = async () => {
    const reqBody = { data: { type: "comment", body: message, files: [] } };
    try {
      const msgResponse = await postMessages(model, id, reqBody);
      setMessage("");
      setTotalMsg(totalMsg + 1);
      setMessageList((prevList) => {
        if (Array.isArray(prevList)) {
          return [msgResponse?.data[0], ...prevList];
        } else {
          return [msgResponse?.data[0]];
        }
      });
    } catch (error) {
      setAlertMessage(error);
    }
  };
  const handleActiveButton = async (buttonName) => {
    setActiveButton(buttonName); // Set the active button based on the clicked button
    if (buttonName === "comment" || buttonName === "notification") {
      const messages = await fetchComments(buttonName, model, id, msgLimit);
      messages?.total > 0 ? setMessageList(messages?.data) : setMessageList([]);
      setTotalMsg(messages?.total);
    } else {
      console.log("called");
      const messages = await fetchMessages(model, id, msgLimit);
      messages?.total > 0 ? setMessageList(messages?.data) : setMessageList([]);
      setTotalMsg(messages?.total);
    }
  };
  // function to handle load more button
  const handleMsgFetch = async () => {
    if (activeButton === "All") {
      const messages_response = await fetchMessages(
        model,
        id,
        (msgLimit = msgLimit + 4)
      );
      setMessageList(messages_response?.data);
    } else if (activeButton === "comment" || activeButton === "notification") {
      const messages = await fetchComments(
        activeButton,
        model,
        id,
        (msgLimit = msgLimit + 4)
      );
      setMessageList(messages?.data || []);
    }
    msgLimit <= totalMsg
      ? setMsgLimit((prev) => prev + 4)
      : setMsgLimit(totalMsg);
  };

  const handleAlertConfirm = () => {
    setShowAlertSnackbar(false);
  };

  return (
    <>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          m: "10px",
          "@media (width<= 480px)": {
            flexDirection: "column",
          },
        }}
      >
        <Button
          variant={activeButton === "All" ? "contained" : "outlined"}
          sx={{
            backgroundColor: activeButton === "All" ? "#6366f1" : "transparent",
            borderColor: "#6366f1",
            color: activeButton === "All" ? "#fff" : "#6366f1",
          }}
          onClick={() => handleActiveButton("All")}
        >
          All
        </Button>
        <Button
          variant={activeButton === "comment" ? "contained" : "outlined"}
          sx={{
            backgroundColor:
              activeButton === "comment" ? "#6366f1" : "transparent",
            borderColor: "#6366f1",
            color: activeButton === "comment" ? "#fff" : "#6366f1",
          }}
          onClick={() => handleActiveButton("comment")}
        >
          Comments
        </Button>
        <Button
          variant={activeButton === "notification" ? "contained" : "outlined"}
          sx={{
            backgroundColor:
              activeButton === "notification" ? "#6366f1" : "transparent",
            borderColor: "#6366f1",
            color: activeButton === "notification" ? "#fff" : "#6366f1",
          }}
          onClick={() => handleActiveButton("notification")}
        >
          Notifications
        </Button>
      </Stack>

      {activeButton === "All" || activeButton === "comment" ? (
        <>
          <TextField
            value={message}
            placeholder="Write your comment here"
            rows={1}
            multiline
            style={{ width: "95%", margin: "0 10px" }}
            onChange={handleTextAreaChange}
          />

          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              m: "10px",
              "@media (width<= 480px)": {
                flexDirection: "column",
              },
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "#6366f1" }}
              disabled={!postButtonEnable}
              onClick={handleMessagePost}
            >
              Post
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: "#6366f1", color: "#6366f1" }}
            >
              <AttachFile />
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: "#6366f1", color: "#6366f1" }}
            >
              <Edit />
            </Button>
          </Stack>
        </>
      ) : (
        <></>
      )}

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {messageList?.map((msgItem) => {
          return (
            <Message
              msgItem={msgItem}
              key={msgItem?.id}
              messageList={messageList}
              setMessageList={setMessageList}
            />
          );
        })}
        {totalMsg > msgLimit ? (
          <Button
            onClick={handleMsgFetch}
            variant="outlined"
            sx={{
              borderColor: "#6366f1",
              color: "#6366f1",
              width: "fit-content",
              margin: "auto",
              mb: "10px",
              ":hover": {
                backgroundColor: "#6366f1",
                color: "#fff",
              },
            }}
          >
            Load...
          </Button>
        ) : (
          <></>
        )}
      </Box>
      {showAlertSnackbar && (
        <SnackbarAlert message={alertMessage} onConfirm={handleAlertConfirm} />
      )}
    </>
  );
};

export default MessageContainer;
