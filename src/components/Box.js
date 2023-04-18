const Box = ({ title, children }) => {
  return (
    <div className="component-box">
      <div className="box-title">{title}</div>
      {children}
    </div>
  );
};

export default Box;
