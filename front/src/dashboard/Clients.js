import * as React from "react";
import { useState, useEffect } from "react";

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
export default function Clients() {
  const [clients, setClients] = useState([]); // State to hold clients
  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [modalType, setModalType] = useState(""); // 'add' or 'edit'
  const [currentClient, setCurrentClient] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  }); // State for the client being added/edited

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosInstance.get("/clients/");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleOpenModal = (type, client = null) => {
    setModalType(type);
    if (type === "edit" && client) {
      setCurrentClient(client);
    } else {
      setCurrentClient({
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
  const handleSaveClient = async () => {
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/clients/", currentClient);
        setClients([...clients, response.data]);
      } else if (modalType === "edit") {
        const response = await axiosInstance.put(
          `/clients/${currentClient.id_client}/`,
          currentClient
        );
        setClients(
          clients.map((client) =>
            client.id_client === response.data.id_client
              ? response.data
              : client
          )
        );
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axiosInstance.delete(`/clients/${id}/`);
      setClients(clients.filter((client) => client.id_client !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };
  const handleInputChange = (e) => {
    setCurrentClient({ ...currentClient, [e.target.name]: e.target.value });
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
          >
            Add Client
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="clients table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id_client}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.address}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenModal("edit", client)}>
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDeleteClient(client.id_client)}
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
            {modalType === "add" ? "Add New Client" : "Edit Client"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={currentClient.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={currentClient.phone}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={currentClient.email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            value={currentClient.address}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSaveClient}
          >
            {modalType === "add" ? "Add Client" : "Save Changes"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
