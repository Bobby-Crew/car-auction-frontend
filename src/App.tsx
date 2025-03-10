import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AuctionDetail from "./pages/AuctionDetail";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./components/AuthContext";
import { ThemeProvider } from "./components/ThemeContext";
import Admin from "./pages/Admin";
import CreateAuction from "./pages/CreateAuction";
import BrowseAuctions from "./pages/BrowseAuctions";
import UserProfile from "./pages/UserProfile";
import Payment from "./pages/Payment";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/create-auction" element={<CreateAuction />} />
              <Route path="/auctions" element={<BrowseAuctions />} />
              <Route path="/auctions/:id" element={<AuctionDetail />} />
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
            <Footer />
          </Router>
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
