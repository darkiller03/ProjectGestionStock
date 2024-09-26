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

export default function Products() {
  const [products, setProducts] = useState([]); // State to hold products
  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [modalType, setModalType] = useState(""); // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  }); // State for the product being added/edited

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenModal = (type, product = null) => {
    setModalType(type);
    if (type === "edit" && product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct({
        id: "",
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSaveProduct = async () => {
    try {
      if (modalType === "add") {
        const response = await axiosInstance.post("/products/", currentProduct);
        setProducts([...products, response.data]);
      } else if (modalType === "edit") {
        const response = await axiosInstance.put(
          `/products/${currentProduct.id_product}/`,
          currentProduct
        );
        setProducts(
          products.map((product) =>
            product.id_product === response.data.id_product
              ? response.data
              : product
          )
        );
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}/`);
      setProducts(products.filter((product) => product.id_product !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
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
            Add Product
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenModal("edit", product)}>
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDeleteProduct(product.id_product)}
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
            {modalType === "add" ? "Add New Product" : "Edit Product"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={currentProduct.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Category"
            name="category"
            value={currentProduct.category}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={currentProduct.description}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            value={currentProduct.price}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Stock"
            name="stock"
            value={currentProduct.stock}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSaveProduct}
          >
            {modalType === "add" ? "Add Product" : "Save Changes"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
