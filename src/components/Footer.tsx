import { Box, Container, Typography, Link, Grid } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        mt: "auto",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="#ff0000" gutterBottom>
              AutoAuctions
            </Typography>
            <Typography variant="body2" color="grey.500">
              The premier destination for luxury and classic car auctions.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="#ff0000" gutterBottom>
              Quick Links
            </Typography>
            <Link href="#" color="grey.500" display="block" sx={{ mb: 1 }}>
              Terms of Service
            </Link>
            <Link href="#" color="grey.500" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="grey.500" display="block">
              Contact Us
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="#ff0000" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="grey.500">
              Email: info@thecarauctionsite.com
            </Typography>
            <Typography variant="body2" color="grey.500">
              Phone: (555) 123-4567
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
