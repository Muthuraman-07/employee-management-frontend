import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Grid,
} from "@mui/material"; // ✅ Material UI components
import DeleteIcon from "@mui/icons-material/Delete"; // ✅ MUI Delete Icon
import "./Shift.css";

const Shift = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [shiftId, setShiftId] = useState("");
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const confirmDeleteShift = async () => {
    if (!shiftId || isNaN(shiftId)) {
      alert("Please enter a valid Shift ID.");
      return;
    }

    try {
      await api.delete(`/delete-shift/${shiftId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Ensure authorization
        },
      });

      alert(`Shift ID ${shiftId} has been deleted successfully!`);
      console.log(`Shift ${shiftId} deleted.`);
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Error deleting shift:", error.response?.data || error.message);
      alert("Failed to delete shift. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        borderRadius: 3,
        color: "white",
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Shift Management
      </Typography>

      {/* Shift Navigation Buttons */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button variant="contained" sx={{ background: "#1e40af", color: "white" }} onClick={() => navigate("/createShift")}>
            Create Shift
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" sx={{ background: "#2563eb", color: "white" }} onClick={() => navigate("/allocatedShift")}>
            Allocated Shift
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" sx={{ background: "#60a5fa", color: "white" }} onClick={() => navigate("/getAllShift")}>
            Available Shift
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" sx={{ background: "#93c5fd", color: "black" }} onClick={() => navigate("/updateShift")}>
            Shift Changes
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" sx={{ background: "#bfdbfe", color: "black" }} onClick={() => navigate("/shiftSwapRequests")}>
            Shift Swap Requests
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{ backgroundColor: "red", color: "white", fontWeight: "bold", boxShadow: 3 }}
            startIcon={<DeleteIcon />}
            onClick={handleDeletePopup}
          >
            Delete Shift
          </Button>
        </Grid>
      </Grid>

      {/* ✅ Fancy Delete Shift Modal */}
      <Dialog open={showDeletePopup} onClose={() => setShowDeletePopup(false)}>
        <DialogTitle sx={{ backgroundColor: "red", color: "white", fontWeight: "bold" }}>
          Confirm Shift Deletion
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Shift ID"
            type="number"
            fullWidth
            variant="outlined"
            value={shiftId}
            sx={{ mt: 2 }}
            onChange={(e) => setShiftId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeletePopup(false)} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteShift} sx={{ backgroundColor: "red", color: "white" }} variant="contained">
            Delete Shift
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Shift;
