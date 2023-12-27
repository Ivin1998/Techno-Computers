import axios from "axios";
import React, { useEffect, useState } from "react";
// import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {REACT_SERVER_URL} from '../configs/ENV'
import Footer from './Footer';
import { Button } from "react-bootstrap";

const Orders = () => {
  const [address, setAddress] = useState([]);
  const [no] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const response = await axios.get(
          `${REACT_SERVER_URL}/api/users/address/`,
          config
        );
        setAddress(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error");
      }
    };
    fetchOrders();
  }, [address]);
  
  return (
    <>
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>Sl.No.</th>
            <th hidden>User ID:</th>
            <th>Date</th>
            <th>Name</th>
            <th>Products</th>
            <th>Price:</th>
            <th>Total Quantity</th>
            <th>Total Amount:</th>
            <th>Street</th>
            <th>Place</th>
            <th>District</th>
            <th>State</th>
            <th>Landmark</th>
            <th>Phone Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {address.reverse().map((item, index) => (
            <tr key={item._id}>
              <td>{no + index}</td>
              <td hidden>{item.userid}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>{item.name}</td>
              <td>
                {item.details.map((prod, i) => (
                  <span key={prod.name}>
                    {prod.name} [{prod.qty}]
                    {i !== item.details.length - 1 && (
                      <>
                        ,<br />
                      </>
                    )}
                  </span>
                ))}
              </td>
              <td>
                {item.details.map((amount, i) => (
                  <span key={amount.price}>
                    {amount.price}.00 [{amount.qty}]
                    {i !== item.details.length - 1 && (
                      <>
                        , <br />
                      </>
                    )}
                  </span>
                ))}
              </td>
              <td>
                {item.details.reduce(
                  (total, quantity) => total + quantity.qty,
                  0
                )}
              </td>
              <td>{item.total.toLocaleString()}.00</td>
              <td>{item.street}</td>
              <td>{item.place}</td>
              <td>{item.district}</td>
              <td>{item.state}</td>
              <td>{item.landmark}</td>
              <td>{item.phonenumber}</td>
              <td>
                {item.ispaid !== "0" ? (
                  <Button
                    variant="success"
                    title={item.ispaid}
                    style={{ cursor: "default" }}
                  >
                    Paid
                  </Button>
                ) : (
                  <Button variant="danger" style={{ pointerEvents: "none" }}>
                    Not Paid
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Footer />
    </>
  );
};

export default Orders;
