import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";

const Payment = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment
        </Typography>
        <Typography variant="h6" gutterBottom>
          Please enter your payment details
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                variant="outlined"
                required
                placeholder="1234 5678 9012 3456"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                variant="outlined"
                required
                placeholder="MM/YY"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CVV"
                variant="outlined"
                required
                placeholder="123"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Or pay with PayPal
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  // Handle PayPal payment logic here
                  alert("Redirecting to PayPal...");
                }}
              >
                Pay with PayPal
              </Button>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 4 }}
            type="submit"
          >
            Complete Payment
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Payment;
