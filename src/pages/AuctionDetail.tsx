import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import BidAuction from "../components/BidAuction";

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuction = async () => {
      const response = await fetch(`http://localhost:8000/api/auctions/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setAuction(data);
      }
    };

    fetchAuction();
  }, [id]);

  useEffect(() => {
    if (auction && new Date(auction.end_time) < new Date()) {
      navigate("/payment");
    }
  }, [auction, navigate]);

  const handleBidSuccess = () => {
    setSnackbarMessage("Bid placed successfully!");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBuyNow = () => {
    navigate("/payment");
  };

  if (!auction) return <div>Loading...</div>;

  return (
    <Container>
      <Card sx={{ marginTop: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {auction.name}
          </Typography>
          <Typography variant="h6">
            Current Bid: £{auction.current_bid}
          </Typography>
          <Typography variant="body1">
            Time Left: {auction.time_left}
          </Typography>
          <BidAuction
            auctionId={auction.id}
            currentBid={auction.current_bid}
            onBidSuccess={handleBidSuccess}
          />
          <Button
            variant="contained"
            onClick={handleBuyNow}
            sx={{ marginTop: 2 }}
          >
            Buy Now for £{auction.buy_now_price}
          </Button>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default AuctionDetail;
