import ModalContainer from "./ModalContainer";

const WrongNetworkModal = ({
  wrongNetworkModalStatus,
  setWrongNetworkModalStatus,
}) => {
  const switchNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });
    setWrongNetworkModalStatus(false);
  };

  return (
    <ModalContainer
      modalStatus={wrongNetworkModalStatus}
      setModalStatus={setWrongNetworkModalStatus}
    >
      <div className="wrong-network-modal">
        <div className="modal-title">Wrong Network</div>
        <div className="warn">Please connect to the Binance Smart Chain.</div>
        <button onClick={() => switchNetwork()} className="switch-btn">
          Switch
        </button>
      </div>
    </ModalContainer>
  );
};

export default WrongNetworkModal;
