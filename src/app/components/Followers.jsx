import React, { useEffect, useState } from "react";
import {
  Add as AddIcon,
  StarBorderOutlined as StarBorderOutlinedIcon,
  Clear as ClearIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { Follow, deleteFollowers } from "app/services/rest";
import { TEAM_MODEL } from "app/utils/constants";
import SnackbarPrompt from "app/components/SnackbarPrompt";
import FollowersSnackbar from "app/components/FollowersSnackbar";

const Followers = ({
  followers,
  followerDelete,
  setFollowersList,
  id,
  follow,
  setFollow,
  initialState,
  model
}) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleFollow = async () => {
    setFollow(true);
    const reqBody = {};
    const response = await Follow(model, id, reqBody);
    setFollowersList(response);
  };

  const handleUnfollow = async () => {
    setShowSnackbar(true);
  };
  const handleDeleteConfirm = async () => {
    setFollow(false);
    const deleteReqBody = { records: [] };
    try {
      const response = await deleteFollowers(model, id, deleteReqBody);
      setFollowersList(response?.data);
    } catch (error) {
      console.error("Error deleting follower:", error);
    }
    setShowSnackbar(false);
  };
  const handleDeleteCancel = () => {
    setShowSnackbar(false);
  };

  useEffect(() => {
    const isAdminPresent =
      followers &&
      followers.some((follower) => follower?.$author?.fullName === "Admin");
    isAdminPresent && setFollow(true);
  }, [followers]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "rgb(248, 248, 248)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "20px",
          color: "rgb(78, 77, 77)",
          alignItems: "flex-start",
          padding: "10px 0",
          margin: "0 5px",
        }}
      >
        <Typography component="h5" sx={{ m: "0px", p: "0px" }}>
          Followers
        </Typography>
        <Box>
          {follow === false ? (
            <StarBorderOutlinedIcon
              sx={{ cursor: "pointer" }}
              onClick={handleFollow}
            />
          ) : (
            <StarIcon sx={{ cursor: "pointer" }} onClick={handleUnfollow} />
          )}

          <AddIcon sx={{ cursor: "pointer" }} onClick={handleClickOpen} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {followers?.map((followerData) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "0",
              margin: "0",
              lineHeight: "0px",
              color: "rgb(88, 88, 255) ",
            }}
            key={followerData.id}
          >
            <ClearIcon onClick={() => followerDelete(followerData)} />
            <Typography component="p" sx={{ textDecoration: "underline" }}>
              {followerData.$author.fullName}
            </Typography>
          </Box>
        ))}
      </Box>
      {showSnackbar && (
        <SnackbarPrompt
          message="Are you sure to unfollow this document?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
      {open && (
        <FollowersSnackbar
          open={open}
          handleClickOpen={handleClickOpen}
          setOpen={setOpen}
          initialState={initialState}
          setFollowersList={setFollowersList}
          model={model}
        />
      )}
    </>
  );
};

export default Followers;
