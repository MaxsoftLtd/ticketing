const OrderIndex = ({ currentUser, orders }) => {
  return (
    <div>
      <h4>My Orders - {orders.length}</h4>
      <ul>
        {orders.map((o) => {
          return (
            <li key={o.id}>
              {o.ticket.title} - {o.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
