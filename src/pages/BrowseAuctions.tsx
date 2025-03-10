import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";

interface Auction {
  id: number;
  name: string;
  year: number;
  current_bid: number;
  starting_bid: number;
  buy_now_price: number;
  time_left: string;
  images: { id: number; image: string; is_primary: boolean }[];
  seller_username: string;
  start_time: string;
  duration_hours: number;
}

const BrowseAuctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch(
          "https://car-auction-backend.onrender.com/api/auctions/"
        );
        if (response.ok) {
          const data = await response.json();
          const activeAuctions = data.filter((auction: Auction) => {
            const endTime = new Date(auction.start_time);
            endTime.setHours(endTime.getHours() + auction.duration_hours);
            return endTime > new Date();
          });
          setAuctions(activeAuctions);
          setFilteredAuctions(activeAuctions);
        }
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    let sorted = [...auctions];

    // Apply search filter
    if (searchQuery) {
      sorted = sorted.filter(
        (auction) =>
          auction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          auction.year.toString().includes(searchQuery) ||
          auction.seller_username
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-high":
        sorted.sort((a, b) => b.current_bid - a.current_bid);
        break;
      case "price-low":
        sorted.sort((a, b) => a.current_bid - b.current_bid);
        break;
      case "oldest":
        sorted.sort((a, b) => a.year - b.year);
        break;
      case "newest":
        sorted.sort((a, b) => b.year - a.year);
        break;
    }

    setFilteredAuctions(sorted);
  }, [auctions, sortBy, searchQuery]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://source.unsplash.com/random/800x600/?car";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom color="#1a1a1a">
          Browse Auctions
        </Typography>

        {/* Filters Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.primary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "background.paper",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "divider",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "text.primary",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "text.primary" }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortChange}
                  sx={{
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Auctions Grid */}
        <Grid container spacing={4}>
          {filteredAuctions.map((auction) => (
            <Grid item key={auction.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    auction.images[0]
                      ? getImageUrl(auction.images[0].image)
                      : "https://source.unsplash.com/random/800x600/?car"
                  }
                  alt={auction.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
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
                    Buy Now: £{auction.buy_now_price.toLocaleString()}
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

export default BrowseAuctions;
