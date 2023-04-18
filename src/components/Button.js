const Button = ({
  children,
  md = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={
        className +
        " component-button " +
        (md ? "text-md " : "") +
        (disabled ? "disabled" : "")
      }
    >
      {children}
    </button>
  );
};

export default Button;
