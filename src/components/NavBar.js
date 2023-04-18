import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useRef, useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import jazzicon from "@metamask/jazzicon";

import {
  DiscordIcon,
  CordIcon,
  FacebookIcon,
  InstagramIcon,
  PaperIcon,
  TelegramIcon,
  TwitterIcon,
} from "../config/icons";

import { ReactComponent as ErrorIcon } from "../assets/images/icons/error.svg";

import { Images_Src } from "../config/images";
import {
  getUserBalance,
  humanReadableAccount,
  jsNumberForAddress,
  web3,
} from "../web3";
import ConnectWalletModal from "./ConnectWalletModal";
import AccountModal from "./AccountModal";
import WrongNetworkModal from "./WrongNetworkModal";

const NavBar = () => {
  const { active, account, error } = useWeb3React();
  const [linksmodalStatus, setLinksModalStatus] = useState(false);
  const [walletConnectModalStatus, setWalletConnectModalStatus] =
    useState(false);
  const [accountModalStatus, setAccountModalStatus] = useState(false);
  const [wrongNetworkModalStatus, setWrongNetworkModalStatus] = useState(false);
  const [userBalance, setUserBalance] = useState(null);

  const modalRef = useRef(null);

  const toggleLinksModal = () => {
    if (linksmodalStatus) {
      modalRef.current.style.opacity = 0;
      modalRef.current.style.display = "none";
    } else {
      modalRef.current.style.opacity = 1;
      modalRef.current.style.display = "flex";
    }
    setLinksModalStatus(!linksmodalStatus);
  };

  const handleModalShow = () => {
    if (error instanceof UnsupportedChainIdError) {
      setWrongNetworkModalStatus(true);
    } else {
      if (active) setAccountModalStatus(true);
      else setWalletConnectModalStatus(true);
    }
  };

  const load = async () => {
    const _userBalance = await getUserBalance(account);
    setUserBalance(parseFloat(_userBalance).toFixed(2));
  };

  useEffect(() => {
    if (active) {
      load();
    }
  }, [active, account]);

  return (
    <div className="component-navbar">
      <div>
        <img className="nav-logo" src={Images_Src.logo} alt="logo" />
      </div>
      <div className="navigation">
        <div className="nav-buttons">
          <div className="left-buttons">
            <div className="network">BSC</div>
            <button className="buy-btn">Buy XDOGE</button>
          </div>

          <div className="right-buttons">
            {userBalance && (
              <div className="user-balance">{`${userBalance} BNB`}</div>
            )}
            <button
              onClick={() => {
                handleModalShow();
              }}
              className={
                "connect-btn " +
                (active && "connected ") +
                (error instanceof UnsupportedChainIdError && " wrong-network")
              }
            >
              {error instanceof UnsupportedChainIdError ? (
                <div className="error">
                  <ErrorIcon />
                  Wrong Network
                </div>
              ) : !active ? (
                "Connect to a wallet"
              ) : (
                <div className="flex items-center">
                  <div
                    className="mr-2 flex"
                    dangerouslySetInnerHTML={{
                      __html: jazzicon(16, jsNumberForAddress(account))
                        .outerHTML,
                    }}
                  ></div>
                  <div className="address">{humanReadableAccount(account)}</div>
                </div>
              )}
            </button>
          </div>
        </div>
        <AccountModal
          accountModalStatus={accountModalStatus}
          setAccountModalStatus={setAccountModalStatus}
        />
        <ConnectWalletModal
          walletConnectModalStatus={walletConnectModalStatus}
          setWalletConnectModalStatus={setWalletConnectModalStatus}
        />
        <WrongNetworkModal
          wrongNetworkModalStatus={wrongNetworkModalStatus}
          setWrongNetworkModalStatus={setWrongNetworkModalStatus}
        />
        <div className="menu">
          <div className="menu-bar" onClick={toggleLinksModal}>
            <BsThreeDots />
          </div>
          <div className="modal" ref={modalRef}>
            <a className="link" target="_blank">
              <TelegramIcon />
              Telegram
            </a>
            <a className="link" target="_blank">
              <TwitterIcon />
              Twitter
            </a>
            <a className="link" target="_blank">
              <FacebookIcon />
              Facebook
            </a>
            <a className="link" target="_blank">
              <InstagramIcon />
              Instagram
            </a>
            <a className="link" target="_blank">
              <DiscordIcon />
              Discord
            </a>
            <a className="link" target="_blank">
              <CordIcon />
              Code
            </a>
            <a className="link" target="_blank">
              <PaperIcon />
              Whitepaper
            </a>
            <a className="link" target="_blank">
              <PaperIcon />
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
