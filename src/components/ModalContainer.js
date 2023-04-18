import { ReactComponent as CloseIcon } from "../assets/images/icons/close.svg";

const ModalContainer = ({ children, modalStatus, setModalStatus }) => {
  return (
    <div className={"component-modal-container " + (modalStatus && "show")}>
      <div className="overlay" onClick={() => setModalStatus(false)} />
      <div className="modal">
        <div className="close-modal">
          <CloseIcon onClick={() => setModalStatus(false)} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
