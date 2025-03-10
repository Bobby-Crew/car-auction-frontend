import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

interface Auction {
  id: number;
  name: string;
  year: number;
  current_bid: number;
  time_left: string;
  images: { id: number; image: string; is_primary: boolean }[];
  seller_username: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const url = isLoggedIn
          ? "http://localhost:8000/api/auctions/?my_auctions=true"
          : "http://localhost:8000/api/auctions/?featured=true";

        const token = localStorage.getItem("accessToken");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (isLoggedIn && token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });
        if (response.ok) {
          const data = await response.json();
          setAuctions(data);
        }
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      }
    };

    fetchAuctions();
  }, [isLoggedIn]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://source.unsplash.com/random/800x600/?car";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom color="#1a1a1a">
            Find Your Dream Car
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Discover exclusive auctions for luxury and classic cars
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            {isLoggedIn && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate("/create-auction")}
                sx={{
                  backgroundColor: "#ff0000",
                  "&:hover": {
                    backgroundColor: "#cc0000",
                  },
                }}
              >
                Create Auction
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate("/auctions")}
              sx={{
                borderColor: "#ff0000",
                color: "#ff0000",
                "&:hover": {
                  borderColor: "#cc0000",
                  backgroundColor: "rgba(255, 0, 0, 0.04)",
                },
              }}
            >
              Browse Auctions
            </Button>
          </Stack>
        </Box>

        {/* Active Auctions Grid */}
        <Typography variant="h4" component="h2" sx={{ mb: 4 }} color="#1a1a1a">
          {isLoggedIn ? "My Active Auctions" : "Featured Auctions"}
        </Typography>
        <Grid container spacing={4}>
          {auctions.map((auction) => (
            <Grid item key={auction.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(auction.images[0]?.image)}
                  alt={auction.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h3">
                    {auction.year} {auction.name}
                  </Typography>
                  <Typography variant="h6" color="#ff0000" gutterBottom>
                    £{auction.current_bid.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Seller:{" "}
                    <Link
                      to={`/profile/${auction.seller_username}`}
                      style={{
                        color: "#ff0000",
                        textDecoration: "none",
                      }}
                    >
                      {auction.seller_username}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time left: {auction.time_left}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/auctions/${auction.id}`)}
                    sx={{ mt: 2 }}
                  >
                    View Auction
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
