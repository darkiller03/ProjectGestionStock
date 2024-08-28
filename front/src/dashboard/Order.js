import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axiosInstance from '../axiosInstance';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const STATUS_CHOICES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]); 
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  function formatDate(datestr) {
      const date = new Date(datestr);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
      return formattedDate // Output: 28 Aug, 2024
  }
  const [currentOrder, setCurrentOrder] = useState({
    customer: "",
    status: "",
    total: 0,
    order_date: formatDate( new Date().toISOString()) // Initialize with current date
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/orders/');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axiosInstance.get('/clients/');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchOrders();
    fetchClients();
  }, []);

  const handleOpenModal = (type, order = null) => {
    setModalType(type);
    if (type === "edit" && order) {
      setCurrentOrder(order);
    } else {
      setCurrentOrder({
        customer: "",
        status: "",
        total: 0,
        order_date: formatDate(new Date()),
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSaveOrder = async () => {
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post('/orders/', currentOrder);
        setOrders([...orders, response.data]);
      } else if (modalType === "edit") {
        const response = await axiosInstance.put(`/orders/${currentOrder.id_order}/`, currentOrder);
        setOrders(
          orders.map((order) =>
            order.id_order === response.data.id_order ? response.data : order
          )
        );
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
    
      await axiosInstance.delete(`/orders/${id}/`);
      setOrders(orders.filter((order) => order.id_order !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentOrder({ ...currentOrder, [e.target.name]: e.target.value });
  };

  const getCustomerByName = (id) => {
    const client = clients.find(client => client.id_client === id);
    return client ? client.name : "Unknown";
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal("add")}
          >
            Add Order
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Order Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{getCustomerByName(order.customer)}</TableCell>
                    <TableCell>{formatDate(order.order_date)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenModal("edit", order)}>
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDeleteOrder(order.id_order)}
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
            {modalType === "add" ? "Add New Order" : "Edit Order"}
          </Typography>
          <Select
            fullWidth
            margin="normal"
            label="Customer"
            name="customer"
            value={currentOrder.customer}
            onChange={handleInputChange}
          >
            {clients.map((client) => (
              <MenuItem key={client.id_client} value={client.id_client}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            margin="normal"
            label="Order Date"
            name="order_date"
            type="text"
            disabled
            value={formatDate(currentOrder.order_date)}
          />
          <Select
            fullWidth
            margin="normal"
            label="Status"
            name="status"
            value={currentOrder.status}
            onChange={handleInputChange}
          >
            {STATUS_CHOICES.map((status) => (
              <MenuItem key={status} value={status.toLowerCase()}>
                {status}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            margin="normal"
            label="Total"
            name="total"
            type="number"
            value={currentOrder.total}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSaveOrder}
          >
            {modalType === "add" ? "Add Order" : "Save Changes"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
