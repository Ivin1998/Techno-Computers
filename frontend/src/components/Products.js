import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { Contextreact } from "../Context";
import { Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GiClick } from "react-icons/gi";
import { REACT_SERVER_URL } from "../configs/ENV";
import { AiFillInfoCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { AiTwotoneEdit } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import Loading from "./Loading";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredproducts, setFilteredproducts] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading,setLoading] = useState(true);

  const userInfo = localStorage.getItem("userInfo");
  const userInfoParsed = JSON.parse(userInfo);
  const isAdmin = userInfoParsed.isAdmin;

  var guest_user = false;
  var guest = userInfoParsed.email;
  if (guest === "guest@example.com") {
    guest_user = true;
  }

  const {
    state: { cart },
    dispatch,
    productstate: { searchQuery },
  } = useContext(Contextreact);

  const transformProducts = useCallback(() => {
    let sortedProducts = products;

    if (searchQuery) {
      sortedProducts = sortedProducts.filter((prod) =>
        prod.name.toLowerCase().includes(searchQuery)
      );
    }
    return sortedProducts;
  }, [products, searchQuery]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

  useEffect(() => {
    const filtered = transformProducts();
    setFilteredproducts(filtered);
  }, [searchQuery, transformProducts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const response = await axios.get(
          `${REACT_SERVER_URL}/api/users/showproducts`,
          config
        );
        const sortedProduct = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProduct);
        setLoading(false); 
      } catch (error) {
        console.log("Response Status:", error.response?.status);
        console.log("Response Data:", error.response?.data);
      }
    };
    fetchData();
  }, [products]);

  const updateData = async (id) => {
    const update = await axios.put(
      `${REACT_SERVER_URL}/api/users/updateproducts/${id}`
    ); //update the availability of product

    if (update) {
      const updatedProducts = products.map((prod) =>
        prod._id === id ? { ...prod, isavailable: !prod.isavailable } : prod
      );
      setProducts(updatedProducts);
    }
  };

  const updateProduct = async (id) => {
    const updatedProductInfo = {
      name: selectedProduct.name,
      price: selectedProduct.price,
      description: selectedProduct.description,
    };
    await axios.put(
      `${REACT_SERVER_URL}/api/users/updateproductinfo/${id}`,
      updatedProductInfo
    );
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleNamechange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      name: e.target.value,
    });
  };

  const handlePricechange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      price: e.target.value,
    });
  };

  const handleDescriptionchange = (e) => {
    setSelectedProduct({
      ...selectedProduct,
      description: e.target.value,
    });
  };
  const removeData = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${REACT_SERVER_URL}/api/users/delete/${id}`);
        } catch (error) {
          console.error("Error deleting product:", error);
        }
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      {guest_user && (
        <Link to="/">
          <h4 className="guest_login">
            Login <GiClick /> and place your orders!!
          </h4>
        </Link>
      )}
            {loading && <Loading size={100} style={{marginTop:'20%'}} />}

      <div className="productContainer">
        {filteredproducts.map((product) => (
          <Card className="products" key={product._id}>
            <Card.Img
              variant="top"
              src={product.image}
              alt={product.name}
              style={{ height: "300px", width: "100%", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>
                <h6>{product.name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>
                  {isAdmin && (
                    <AiTwotoneEdit onClick={() => handleEdit(product)} style={{cursor: 'pointer'}}/>
                  )}
                </span></h6>
              </Card.Title>
              <Card.Subtitle style={{ paddingBottom: 10 }}>
                <b>
                  <span
                    style={{
                      paddingBottom: 10,
                      paddingLeft: "70%",
                      backgroundColor: "aliceblue",
                    }}
                  >
                    Rs. {product.price.toLocaleString()}.00
                  </span>
                </b>
                <br />
                <br />
                <div className="description-container">
                  <span className="description">{product.description}</span>
                  <span className="info-icon dropdown">
                    <AiFillInfoCircle />
                    <div className="dropdown-content">
                      {product.description}
                    </div>
                  </span>
                </div>
              </Card.Subtitle>

              {cart.some((p) => p._id === product._id) ? (
                <Button
                  onClick={() => {
                    dispatch({
                      type: "REMOVE_FROM_CART",
                      payload: product,
                    });
                  }}
                  variant="warning"
                >
                  Remove from cart
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: product,
                    });
                  }}
                  variant={product.isavailable ? "success" : "danger"}
                  disabled={!product.isavailable || guest_user}
                  hidden={isAdmin}
                >
                  {product.isavailable && !isAdmin
                    ? "Add to cart"
                    : isAdmin
                    ? "Out of Stock"
                    : "Sold Out"}
                </Button>
              )}
              {isAdmin && (
                <div>
                  <Button
                    variant="danger"
                    onClick={() => removeData(product._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    style={{ float: "right" }}
                    onClick={() => updateData(product._id)}
                    disabled={!product.isavailable || guest_user}
                  >
                    {product.isavailable ? "Mark Sold Out" : "Marked as sold"}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              style={{ width: "70%", marginLeft: "10%" }}
            >
              <Form.Label>Product Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the Product Name"
                value={selectedProduct && selectedProduct.name}
                onChange={handleNamechange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{ width: "70%", marginLeft: "10%" }}
            >
              <Form.Label>Product Price:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the Product Price"
                value={selectedProduct && selectedProduct.price}
                onChange={handlePricechange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{ width: "70%", marginLeft: "10%" }}
            >
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter the Product details"
                value={selectedProduct && selectedProduct.description}
                onChange={handleDescriptionchange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => updateProduct(selectedProduct._id)}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
