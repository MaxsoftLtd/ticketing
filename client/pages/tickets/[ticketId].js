import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

const TicketShow = ({ currentUser, ticket }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: `/api/orders/`,
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      router.push(`/orders/${order.id}`);
    },
  });

  return (
    <div>
      <h1> {ticket.title} </h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button
        className="btn btn-primary"
        onClick={() => {
          doRequest();
        }}
      >
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client, currentUser) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
