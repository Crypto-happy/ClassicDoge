import { useRef } from "react";
import { ReactComponent as CopyIcon } from "../assets/images/icons/copy.svg";

const AddressBar = ({ label, address }) => {
  const copyRef = useRef(null);
  const ShortenAccount = (_account) => {
    if (!_account) return "---";
    return _account.slice(0, 10) + "..." + _account.slice(_account.length - 10);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    copyRef.current.style.display = "block";
    setTimeout(() => {
      copyRef.current.style.display = "none";
    }, 500);
  };

  return (
    <div className="component-address-bar">
      <div className="label">{`${label}:`}</div>
      <div className="flex">
        <a className="address">{ShortenAccount(address)}</a>
        <button onClick={copyAddress} className="copy-btn">
          <CopyIcon />
        </button>
        <div className="copy-status" ref={copyRef}>
          Copied
        </div>
      </div>
    </div>
  );
};

export default AddressBar;
