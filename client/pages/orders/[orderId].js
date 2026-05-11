import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

const OrderShow = ({ currentUser, order }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // invoked when component is navigated away
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const { doRequest, errors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      router.push("/orders");
    },
  });

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <div>Time left to pay: {timeLeft} seconds</div>
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51TVSmo0QV44uovUEx0LgNtZh0bybNtZF9ZLARMkvbiwLDY6tebLJe6EbluUx74W5Y5WXlw2eyLPaCSlZkzrOuzJz005J93FUoH"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
