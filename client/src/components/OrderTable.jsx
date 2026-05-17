import React, { useState, useContext, useEffect } from "react";
import "./styles/OrderTable.css";
import { ProductContext } from "../context/ProductContext";
import AuthContext from "../context/AuthContext";
import OrderTableDetailsRow from "./OrderTableDetailsRow";

const OrderTable = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);

  const { authTokens } = useContext(AuthContext);
  const products = useContext(ProductContext);

  const toggleRowExpansion = (orderId) => {
    setExpandedOrderId((prevExpandedOrderId) =>
      prevExpandedOrderId === orderId ? null : orderId
    );
  };

  const getOrders = async () => {
    try {
      let response = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      let data = await response.json();

      if (response.status === 200) {
        setOrders(data);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error("Error while fetching orders", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const calculateOrderValue = (orderDetails) => {
    return orderDetails
      .reduce((totalValue, detail) => {
        const totalPrice =
          parseFloat(detail.unit_price) * parseInt(detail.quantity, 10);
        return totalValue + totalPrice;
      }, 0)
      .toFixed(2);
  };

  return (
    <table className="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date and Time</th>
          <th>Value</th>
          <th>Number of Wines</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const orderDate = new Date(order.date);
          const formattedDateTime = `${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}`;

          return (
            <React.Fragment key={order.id}>
              <tr className={expandedOrderId === order.id ? "expanded" : ""}>
                <td>{order.id}</td>
                <td>{formattedDateTime}</td>
                <td>{calculateOrderValue(order.order_details)} zł</td>
                <td>
                  {order.order_details.reduce(
                    (totalWines, detail) =>
                      totalWines + parseInt(detail.quantity, 10),
                    0
                  )}
                </td>
                <td className="details-button-cell">
                  <button onClick={() => toggleRowExpansion(order.id)}>
                    {expandedOrderId === order.id ? "Hide" : "Details"}
                  </button>
                </td>
              </tr>
              {expandedOrderId === order.id && (
                <tr>
                  <td colSpan="5">
                    <table className="details-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.order_details.map((detail, index) => (
                          <OrderTableDetailsRow
                            key={index}
                            product={products.products[detail.wine_id]}
                            details={detail}
                          />
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrderTable;
