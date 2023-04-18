import ModalContainer from "./ModalContainer";
import ConnectWalletTerm from "./ConnectWalletTerm";
import WalletConnectors from "./WalletConnectors";

const ConnectWalletModal = ({
  walletConnectModalStatus,
  setWalletConnectModalStatus,
}) => {
  return (
    <ModalContainer
      modalStatus={walletConnectModalStatus}
      setModalStatus={setWalletConnectModalStatus}
    >
      <div className="wallet-connect-modal">
        <div className="modal-title">Connect to a wallet</div>
        <ConnectWalletTerm />
        <WalletConnectors
          closeModal={() => setWalletConnectModalStatus(false)}
        />
      </div>
    </ModalContainer>
  );
};

export default ConnectWalletModal;
