function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `A ${statusCode} error occurred on the server`
        : "An error occurred on client"}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  console.log(res);
  console.log(err);
  return { statusCode };
};

export default Error;
