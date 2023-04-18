import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef, useState } from "react";
import jazzicon from "@metamask/jazzicon";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { ReactComponent as ExplorerIcon } from "../assets/images/icons/explorer.svg";
import { ReactComponent as CopyIcon } from "../assets/images/icons/copy.svg";
import { humanReadableAccount, jsNumberForAddress } from "../web3";
import ModalContainer from "./ModalContainer";

import ConnectWalletModal from "./ConnectWalletModal";

const AccountModal = ({ accountModalStatus, setAccountModalStatus }) => {
  const [currentModal, setCurrentModal] = useState(false);
  const { account, active } = useWeb3React();
  const addressRef = useRef(null);
  const copyRef = useRef(null);
  const copyIconRef = useRef(null);
  const copiedIconRef = useRef(null);

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    copyRef.current.innerHTML = "Copied";
    copyIconRef.current.style.display = "none";
    copiedIconRef.current.style.display = "block";
    setTimeout(() => {
      copyRef.current.innerHTML = "Copy Address";
      copyIconRef.current.style.display = "block";
      copiedIconRef.current.style.display = "none";
    }, 500);
  };

  useEffect(() => {
    const recentTranstionHash = localStorage.getItem("transaction")?.split(",");
  }, []);

  return (
    <div>
      <ModalContainer
        modalStatus={accountModalStatus}
        setModalStatus={setAccountModalStatus}
      >
        <div className="account-modal">
          <div className="ml-4">Account</div>

          <div className="box">
            <div className="header">
              <div className="status">Connected with Metamask</div>
              <button
                onClick={() => setCurrentModal(true)}
                className="change-btn"
              >
                Change
              </button>
            </div>
            {active && (
              <div className="flex items-center">
                <div
                  className="mr-2 flex"
                  dangerouslySetInnerHTML={{
                    __html: jazzicon(16, jsNumberForAddress(account)).outerHTML,
                  }}
                ></div>
                <div className="address" ref={addressRef}>
                  {humanReadableAccount(account)}
                </div>
              </div>
            )}
            <div className="flex">
              <div className="copy-btn" onClick={() => copyAddress()}>
                <div ref={copyIconRef}>
                  <CopyIcon />
                </div>
                <div className="hidden" ref={copiedIconRef}>
                  <RiCheckboxMultipleLine />
                </div>
                <div className="copy-status" ref={copyRef}>
                  Copy Address
                </div>
              </div>
              <a
                href={`https://bscscan.com/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-link"
              >
                <ExplorerIcon />
                View on Explorer
              </a>
            </div>
          </div>

          <div className="transaction">
            <div>Your transactions will appear here...</div>
          </div>
        </div>
      </ModalContainer>
      <ConnectWalletModal
        walletConnectModalStatus={currentModal}
        setWalletConnectModalStatus={(val) => setCurrentModal(val)}
      />
    </div>
  );
};

export default AccountModal;
