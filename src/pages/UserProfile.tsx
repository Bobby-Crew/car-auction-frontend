import { useEffect, useState } from "react";
import { Box, Container, Typography, Avatar, Grid, Paper } from "@mui/material";
import { useParams } from "react-router-dom";

interface Auction {
  title: string;
  current_bid: number;
  time_left: string;
}

interface PreviousAuction {
  title: string;
  final_price: number;
  date: string;
}

interface UserProfile {
  username: string;
  email: string;
  profile_picture: string | null;
  active_auctions: Auction[];
  previous_auctions: PreviousAuction[];
}

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/auth/profile/${username}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred"); // Handle non-Error cases
        }
      }
    };

    fetchProfile();
  }, [username]);

  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <Container>
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h4">{profile.username}</Typography>
        {profile.profile_picture && (
          <Avatar
            alt={profile.username}
            src={profile.profile_picture}
            sx={{ width: 100, height: 100, margin: "auto" }}
          />
        )}
        <Typography variant="body1">{profile.email}</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5">Active Auctions</Typography>
            {profile.active_auctions.length > 0 ? (
              profile.active_auctions.map((auction) => (
                <Box key={auction.title} sx={{ mb: 2 }}>
                  <Typography variant="h6">{auction.title}</Typography>
                  <Typography>Current Bid: £{auction.current_bid}</Typography>
                  <Typography>Time Left: {auction.time_left}</Typography>
                </Box>
              ))
            ) : (
              <Typography>No active auctions.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5">Previous Auctions</Typography>
            {profile.previous_auctions.length > 0 ? (
              profile.previous_auctions.map((auction) => (
                <Box key={auction.title} sx={{ mb: 2 }}>
                  <Typography variant="h6">{auction.title}</Typography>
                  <Typography>Final Price: £{auction.final_price}</Typography>
                  <Typography>
                    Date: {new Date(auction.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No previous auctions.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
