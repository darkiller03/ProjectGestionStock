import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axiosInstance from "../axiosInstance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]); // State to hold suppliers
  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [modalType, setModalType] = useState(""); // 'add' or 'edit'
  const [currentSupplier, setCurrentSupplier] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  }); // State for the supplier being added/edited

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get("/suppliers/");
        console.log(response.data,'supplier');
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleOpenModal = (type, supplier = null) => {
    setModalType(type);
    if (type === "edit" && supplier) {
      setCurrentSupplier(supplier);
    } else {
      setCurrentSupplier({
        id: "",
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSaveSupplier = async () => {
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/suppliers/", currentSupplier);
        
        setSuppliers([...suppliers, response.data]);
      } else if (modalType === "edit") {
        const response = await axiosInstance.put(
          `/suppliers/${currentSupplier.id_supplier}/`,
          currentSupplier
        );
        setSuppliers(
          suppliers.map((supplier) =>
            supplier.id_supplier === response.data.id_supplier ? response.data : supplier
          )
        );
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving supplier:", error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axiosInstance.delete(`/suppliers/${id}/`);
      setSuppliers(suppliers.filter((supplier) => supplier.id_supplier !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentSupplier({ ...currentSupplier, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal("add")}
            sx={{ mb: 2 }}
          >
            Add Supplier
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenModal("edit", supplier)}>
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDeleteSupplier(supplier.id_supplier)} 
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {modalType === "add" ? "Add New Supplier" : "Edit Supplier"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={currentSupplier.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={currentSupplier.phone}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={currentSupplier.email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            value={currentSupplier.address}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSaveSupplier}
          >
            {modalType === "add" ? "Add Supplier" : "Save Changes"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
