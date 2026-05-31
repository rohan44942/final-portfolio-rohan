function Loader({ text = "Loading..." }) {
  return (
    <div className="card center">
      <div className="loader" />
      <p>{text}</p>
    </div>
  );
}

export default Loader;
