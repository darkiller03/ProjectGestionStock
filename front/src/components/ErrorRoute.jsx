import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./error.css";
function ErrorRoute({ label }) {
  const navigate = useNavigate();
  const path = "/" + label.toLowerCase();
  const handleNavigate = () => {
    navigate(path);
  };
  return (
    <>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />
        <AppBar
          position="absolute"
          //   open={open}
        >
          <Toolbar sx={{ pr: "24px" }}></Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            borderRadius: "15px",
            minWidth: "250px",
            width: "20%",
            height: "30%",
            display: "flex",
            p: 5,
            margin: "auto",
            background: "#1976d2",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flexDirection: "column",
              gap: "1",
              width: "100%",
              color: "white",
            }}
          >
            <h1>Error</h1>
            <p>404 Not Found</p>
            <p className="back" onClick={handleNavigate}>
              Go back to <span>{label}</span>
            </p>
          </div>
        </Box>
      </Box>
    </>
  );
}

export default ErrorRoute;
