const InfoBox = ({ className, title, value }) => {
  return (
    <div className={className + " component-infobox"}>
      <div className="infobox-title">{title}</div>
      <div className="value">{value}</div>
    </div>
  );
};

export default InfoBox;
