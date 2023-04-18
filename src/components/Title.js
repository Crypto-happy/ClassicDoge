const Title = ({ children, center = false, sm = false }) => {
  return (
    <div
      className={
        "component-title " + (center && "text-center ") + (sm && "text-sm")
      }
    >
      {children}
    </div>
  );
};

export default Title;
