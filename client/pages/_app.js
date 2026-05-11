import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (context) => {
  const api = buildClient(context.ctx);
  const { data } = await api.get("/api/users/currentuser");
  // console.log(data);

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(
      context.ctx,
      api,
      data.currentUser,
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
