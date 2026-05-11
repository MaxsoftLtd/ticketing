import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => {
      Router.push("/");
    },
  });

  const onSumbit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div>
      <h1 className="p-2">Create a ticket</h1>
      <form className="container-lg" onSubmit={onSumbit}>
        <div className="form-group p-2">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <div className="form-group p-2">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            onBlur={onBlur}
          ></input>
        </div>
        {errors}
        <button className="btn btn-primary m-2">Submit</button>
      </form>
    </div>
  );
};

// NewTicket.getInitialProps = async (context, client, currentUser) => {
//   return {};
// };

export default NewTicket;
