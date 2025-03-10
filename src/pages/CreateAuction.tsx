import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface PreviewImage {
  file: File;
  preview: string;
}

const CreateAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    starting_bid: "",
    buy_now_price: "",
    duration_hours: "",
  });
  const [selectedImages, setSelectedImages] = useState<PreviewImage[]>([]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: PreviewImage[] = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");

      // First, create the auction
      const auctionResponse = await fetch(
        "https://car-auction-backend.onrender.com/api/auctions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            current_bid: formData.starting_bid,
            year: parseInt(formData.year),
            starting_bid: parseFloat(formData.starting_bid),
            buy_now_price: parseFloat(formData.buy_now_price),
            duration_hours: parseInt(formData.duration_hours),
          }),
        }
      );

      if (auctionResponse.ok) {
        const auction = await auctionResponse.json();
        console.log("Auction created:", auction);

        // Then upload images if there are any
        if (selectedImages.length > 0) {
          const formData = new FormData();
          selectedImages.forEach((image, index) => {
            formData.append("images", image.file);
            formData.append("is_primary", index === 0 ? "true" : "false");
          });

          console.log("Uploading images for auction:", auction.id);
          const imageResponse = await fetch(
            `https://car-auction-backend.onrender.com/api/auctions/${auction.id}/images/`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!imageResponse.ok) {
            console.error(
              "Failed to upload images:",
              await imageResponse.json()
            );
            throw new Error("Failed to upload images");
          }
        }

        // Clean up preview URLs
        selectedImages.forEach((image) => URL.revokeObjectURL(image.preview));

        navigate("/");
      }
    } catch (error) {
      console.error("Failed to create auction:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create New Auction
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Car Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Starting Bid (£)"
                  name="starting_bid"
                  type="number"
                  value={formData.starting_bid}
                  onChange={(e) =>
                    setFormData({ ...formData, starting_bid: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Buy Now Price (£)"
                  name="buy_now_price"
                  type="number"
                  value={formData.buy_now_price}
                  onChange={(e) =>
                    setFormData({ ...formData, buy_now_price: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (hours)"
                  name="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_hours: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderColor: "#ff0000",
                    color: "#ff0000",
                    "&:hover": {
                      borderColor: "#cc0000",
                      backgroundColor: "rgba(255, 0, 0, 0.04)",
                    },
                  }}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </Button>
              </Grid>

              {/* Image Preview Section */}
              {selectedImages.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Selected Images (First image will be the primary image)
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ overflowX: "auto", pb: 2 }}
                  >
                    {selectedImages.map((image, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: 150,
                          height: 150,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#ff0000",
                    "&:hover": {
                      backgroundColor: "#cc0000",
                    },
                  }}
                >
                  Create Auction
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateAuction;
