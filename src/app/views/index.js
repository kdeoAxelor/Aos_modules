import { Outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import "./../components/login.css";
import { useTranslation } from "app/services/translate";
import { CssBaseline } from "@mui/material";
import { style } from "@mui/system";

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRedirection = (path) => () => {
    navigate(`/${path}`);
  };

  return (
    <Box className="appbarContainer">
    <AppBar  color="primary" sx={{"@media(width<=442px)":{
        height:"fit-content",
        p:"10px"
    } }}>
      <Toolbar>
        <Box flexGrow={1}></Box>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap="10px">
          <Button
            onClick={handleRedirection("all-teams")}
            sx={{
              mr: 1,
              "@media(150px<=width< 360px)": {
                width: "80vw",
              },
            }}
            color="secondary"
            variant="contained"
          >
            {t("All Teams")}
          </Button>
          <Button
            onClick={handleRedirection("my-opportunities")}
            sx={{
              mr: 1,
              "@media(150px<=width< 360px)": {
                width: "80vw",
              },
            }}
            color="secondary"
            variant="contained"
          >
            {t("My Opportunities")}
          </Button>
          <Button
            onClick={handleRedirection("/login")}
            sx={{
              mr: 1,
              "@media(150px<=width< 360px)": {
                width: "80vw",
              },
            }}
            color="error"
            variant="contained"
          >
            {t("Logout")}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
    </Box>
  );
}

function Content() {
  return (
    <Box component="main" flexGrow={1}>
      <Outlet />
    </Box>
  );
}

function Footer() {
  return (
    <Box
      height="60px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow={2}
      component="footer"
    >
      <Typography color="primary">
        &copy; Copyright 2005 - {new Date().getFullYear()}, Axelor. All Rights
        Reserved.
      </Typography>
    </Box>
  );
}

function Layout() {
  return (
    <Box display="flex" position={"relative"} flexDirection="column" height="100%">
      <Header />
      <Content />
      <Footer />
    </Box>
  );
}

export function Index() {
  return (
    <>
      <Layout />
    </>
  );
}

export default Index;
