import * as React from 'react';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Link } from '@mui/material';
import axiosInstance from '../axiosInstance';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/orders/');
        // Assuming orders are sorted by date in ascending order by default
        setOrders(response.data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)));
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

    fetchClients();
    fetchOrders();
  }, []);

  const getCustomerByName = (id) => {
    const client = clients.find(client => client.id_client === id);
    return client ? client.name : "Unknown";
  };

  // Get the last 3 orders
  const recentOrders = orders.slice(0, 3);

  return (
    <div>
      <Typography variant="h6" color='primary'  >Recent Orders</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Order Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No orders available</TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{getCustomerByName(order.customer)}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.total}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{marginTop:"20px"}} >
        <Link color="primary" href="/order">
          View more Orders
        </Link>
      </div>
    </div>
  );
}
