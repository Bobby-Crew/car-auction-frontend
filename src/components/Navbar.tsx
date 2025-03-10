import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useTheme } from "./ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, isAdmin, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  console.log("isLoggedIn:", isLoggedIn);
  console.log("user:", user);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
      });
      if (response.ok) {
        logout();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }

    console.log(isAdmin, user);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: darkMode ? "#1a1a1a" : "#ffffff" }}
    >
      <Toolbar>
        <DirectionsCarIcon sx={{ fontSize: 32, color: "#ff0000", mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: darkMode ? "#ffffff" : "#1a1a1a" }}
        >
          The Car Auction Site
        </Typography>
        <Box>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ color: darkMode ? "#ffffff" : "#1a1a1a" }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/auctions")}
            sx={{ color: darkMode ? "#ffffff" : "#1a1a1a" }}
          >
            Auctions
          </Button>

          {isLoggedIn && user ? (
            <Button
              color="inherit"
              onClick={() => navigate(`/profile/${user.username}`)}
              sx={{ color: darkMode ? "#ffffff" : "#1a1a1a" }}
            >
              Profile
            </Button>
          ) : null}
          <Button
            color="inherit"
            sx={{ color: darkMode ? "#ffffff" : "#1a1a1a" }}
          >
            About
          </Button>
          {isLoggedIn && isAdmin && (
            <Button
              color="inherit"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => navigate("/admin")}
              sx={{ color: darkMode ? "#ffffff" : "#1a1a1a" }}
            >
              Admin Panel
            </Button>
          )}
          {isLoggedIn ? (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ color: darkMode ? "#ffffff" : "#1a1a1a" }}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{ color: darkMode ? "#ffffff" : "#1a1a1a" }}
            >
              Login
            </Button>
          )}
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            sx={{ ml: 1, color: darkMode ? "#ffffff" : "#1a1a1a" }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
