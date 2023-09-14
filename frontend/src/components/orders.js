import axios from "axios";
import React, {  useEffect, useState } from "react";
import Table from "react-bootstrap/Table";


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
          "http://localhost:5000/api/users/address/",
          config
        );
        setAddress(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error");
      }
    };
    fetchOrders();
  },[]);
  return (
    <>
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>Sl.No.</th>
            <th>User ID:</th>
            <th>Name</th>
            <th>Products</th>
            <th>Price:</th>
            <th>Quantity</th>
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
          {address.map((item,index) => (
            <tr key={item._id}>
              <td>{no+index}</td>
              <td>{item.userid}</td>
              <td>{item.name}</td>
              <td>{item.details.map((prod,i)=>(
                <span key={prod.name}>{prod.name}
                {i !== item.details.length -1 && <>,<br/></>}      {/* Some pblm is here */}   
                </span>
              ))}</td>
              <td>{item.details.map((amount,i)=>(
                <span key={amount.price}>{amount.price}.00
                {i !== item.details.length -1 && <>, <br/></>}</span>
              ))}</td>
              <td>{item.details.map((quantity,index)=>(
                <span key={index}>{quantity.qty}</span>
              ))}</td>
              <td>{item.total.toLocaleString()}.00</td>
              <td>{item.street}</td>
              <td>{item.place}</td>
              <td>{item.district}</td>
              <td>{item.state}</td>
              <td>{item.landmark}</td>
              <td>{item.phonenumber}</td>


            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Orders;