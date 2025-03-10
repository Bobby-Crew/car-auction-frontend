import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import GavelIcon from "@mui/icons-material/Gavel";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
  is_staff: boolean;
}

interface Auction {
  id: number;
  name: string;
  year: number;
  current_bid: number;
  starting_bid: number;
  buy_now_price: number;
  seller_username: string;
  time_left: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [auctionToDelete, setAuctionToDelete] = useState<Auction | null>(null);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/users/");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchAuctions = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auctions/");
      if (response.ok) {
        const data = await response.json();
        setAuctions(data);
      }
    } catch (error) {
      console.error("Failed to fetch auctions:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAuctions();
  }, []);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAuctionClick = (auction: Auction) => {
    setAuctionToDelete(auction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/users/${userToDelete.id}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      alert("Network error");
    }

    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteAuctionConfirm = async () => {
    if (!auctionToDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8000/api/auctions/${auctionToDelete.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setAuctions(
          auctions.filter((auction) => auction.id !== auctionToDelete.id)
        );
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete auction");
      }
    } catch (error) {
      alert("Network error");
    }

    setDeleteDialogOpen(false);
    setAuctionToDelete(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom color="#1a1a1a">
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Users Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                maxHeight: 400,
                overflow: "auto",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "background.paper",
                  zIndex: 2,
                  pb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PersonIcon sx={{ mr: 1, color: "#ff0000" }} />
                  Users Management
                </Typography>
                <Divider />
              </Box>
              {users.map((user) => (
                <Accordion
                  key={user.id}
                  expanded={expanded === `user-${user.id}`}
                  onChange={handleChange(`user-${user.id}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>{user.username}</Typography>
                    <Button
                      component={Link}
                      to={`/profile/${user.username}`}
                      variant="outlined"
                      sx={{ ml: 2 }}
                    >
                      View Profile
                    </Button>
                    {!user.is_staff && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(user);
                        }}
                        sx={{ color: "#ff0000" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Typography>
                        <strong>Email:</strong> {user.email}
                      </Typography>
                      <Typography>
                        <strong>Joined:</strong>{" "}
                        {new Date(user.date_joined).toLocaleDateString()}
                      </Typography>
                      <Typography>
                        <strong>Role:</strong>{" "}
                        {user.is_staff ? "Admin" : "User"}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>

          {/* Auctions Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <GavelIcon sx={{ mr: 1, color: "#ff0000" }} />
                Auctions Management
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Current Bid</TableCell>
                      <TableCell>Seller</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auctions.map((auction) => (
                      <TableRow key={auction.id}>
                        <TableCell>{auction.name}</TableCell>
                        <TableCell>{auction.year}</TableCell>
                        <TableCell>£{auction.current_bid}</TableCell>
                        <TableCell>{auction.seller_username}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteAuctionClick(auction)}
                            sx={{ color: "#ff0000" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              {auctionToDelete
                ? `Are you sure you want to delete the auction "${auctionToDelete.name}"?`
                : userToDelete
                ? `Are you sure you want to delete user "${userToDelete.username}"?`
                : ""}
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={
                auctionToDelete
                  ? handleDeleteAuctionConfirm
                  : handleDeleteConfirm
              }
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Admin;
