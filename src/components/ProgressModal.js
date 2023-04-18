import { useWeb3React } from "@web3-react/core";

import ModalContainer from "./ModalContainer";
import { ReactComponent as ProgressIcon } from "../assets/images/icons/progress.svg";
import { SUCCESS, FAILED } from "../utility/statusVariable";

const ProgressModal = ({
  transactionPendingStatus,
  setTransactionPendingStatus,
}) => {
  const { progressModalStatus, transactionStatus, transactionMessage } =
    transactionPendingStatus;
  const { account, active } = useWeb3React();

  const setProgressModalStatus = (value) => {
    setTransactionPendingStatus((state) => ({
      ...state,
      progressModalStatus: value,
    }));
  };

  return (
    <ModalContainer
      modalStatus={progressModalStatus}
      setModalStatus={setProgressModalStatus}
    >
      <div className="progress-modal">
        {transactionStatus !== "loading" && (
          <div className="progress-modal-title">Confirmation</div>
        )}
        {transactionStatus === "loading" && (
          <div className="text-center">
            <div className="progress">
              <ProgressIcon />
            </div>
            <div className="waiting-text">Waiting For Confirmation</div>
            <div className="pending-text">Transaction is pending.</div>
            <div className="confirm-text">
              Confirm this transaction in your wallet
            </div>
          </div>
        )}
        {transactionStatus === FAILED && (
          <div>
            <hr className="error-line" />
            <div className="my-4">Transaction failed!:</div>
            <div>{transactionMessage}</div>
          </div>
        )}

        {transactionStatus === SUCCESS && (
          <div className="my-4">Transaction Success</div>
        )}
      </div>
    </ModalContainer>
  );
};

export default ProgressModal;
