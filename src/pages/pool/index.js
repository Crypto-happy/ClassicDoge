import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { ReactComponent as BackIcon } from "../../assets/images/icons/back.svg";
import { ReactComponent as CopyIcon } from "../../assets/images/icons/copy.svg";

import { SUCCESS, FAILED } from "../../utility/statusVariable";

import Box from "../../components/Box";
import Button from "../../components/Button";
import InfoBox from "../../components/InfoBox";
import AddressBar from "../../components/AddressBar";
import StatsBar from "../../components/StatsBar";
import { useEffect, useRef, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  approve,
  claim,
  isApproved,
  reinvest,
  stake,
  stakingContractV1Address,
  toWei,
  withdraw,
} from "../../web3";
import { getData } from "../../store/data/action";
import { isValidNumber } from "../../utility";
import ProgressModal from "../../components/ProgressModal";
import HorizontalLine from "../../components/HorizontalLine";

const Pool = () => {
  const { contractAddress, referralAddress } = useParams();
  const { active, account } = useWeb3React();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.dataReducer);

  const [rewardCal, setRewardCal] = useState({
    amountInput: 0,
    periodInput: 0,
  });

  const isContractV1 = contractAddress === stakingContractV1Address;

  const asArray = Object.entries(data);
  const poolData =
    data.length === 0
      ? {}
      : asArray.filter(
          ([key, value]) => value.contractAddress === contractAddress
        )[0][1];
  console.log(poolData);
  const [approveStatus, setApproveStatus] = useState(false);
  const [input, setInput] = useState({
    stakingAmount: "",
    withdrawAmount: "",
  });
  const [transactionPendingStatus, setTransactionPendingStatus] = useState({
    transactionStatus: null,
    progressModalStatus: false,
    transactionMessage: null,
  });

  const referralCopyRef = useRef(null);
  const poolValidFor = isContractV1
    ? (poolData.periodFinish * 1000 - new Date()) / 1000 / 24 / 3600
    : poolData?.poolValidFor / 24 / 3600 -
      (new Date().getTime() / 1000 - poolData?.poolStartTime) / 3600 / 24;

  const copyAddress = () => {
    navigator.clipboard.writeText(
      "http://localhost:3001/pool/" + contractAddress + "/" + account
    );
    referralCopyRef.current.style.display = "block";
    setTimeout(() => {
      referralCopyRef.current.style.display = "none";
    }, 500);
  };

  const handleApprove = async () => {
    if (!approveStatus) {
      setTransactionPendingStatus((state) => ({
        ...state,
        transactionStatus: "loading",
        progressModalStatus: true,
      }));

      approve(contractAddress, account)
        .on("receipt", (receipt) => {
          const preTransaction = localStorage.getItem("transaction");
          localStorage.setItem("transaction", [
            ...preTransaction.slice(-9),
            receipt.blockHash,
          ]);

          setApproveStatus(true);
          setTransactionPendingStatus((state) => ({
            ...state,
            transactionStatus: SUCCESS,
            transactionMessage: "",
          }));
        })
        .on("error", function (error) {
          setTransactionPendingStatus((state) => ({
            ...state,
            transactionStatus: FAILED,
            transactionMessage: error.message,
          }));
        });
    } else {
      if (!input.stakingAmount || !isValidNumber(input.stakingAmount)) {
        return;
      }

      if (
        isContractV1 &&
        parseFloat(input.stakingAmount) - parseFloat(poolData.minStakingLimit) <
          0
      ) {
        return;
      }
      setTransactionPendingStatus((state) => ({
        ...state,
        transactionStatus: "loading",
        progressModalStatus: true,
      }));

      stake(
        isContractV1,
        account,
        toWei(input.stakingAmount),
        referralAddress === "0x"
          ? "0x0000000000000000000000000000000000000000"
          : referralAddress
      )
        .on("receipt", (receipt) => {
          const preTransaction = localStorage.getItem("transaction");

          localStorage.setItem("transaction", [
            ...preTransaction.slice(-9),
            receipt.blockHash,
          ]);
          dispatch(getData());
          setTransactionPendingStatus((state) => ({
            ...state,
            transactionStatus: SUCCESS,
            transactionMessage: "",
          }));
        })
        .on("error", function (error) {
          setTransactionPendingStatus((state) => ({
            ...state,
            transactionStatus: FAILED,
            transactionMessage: error.message,
          }));
        });
    }
  };

  const handleWithdraw = () => {
    if (!isValidNumber(input.withdrawAmount) || !input.withdrawAmount) {
      return;
    }

    setTransactionPendingStatus((state) => ({
      ...state,
      transactionStatus: "loading",
      progressModalStatus: true,
    }));
    withdraw(isContractV1, account, toWei(input.withdrawAmount))
      .on("receipt", (receipt) => {
        const preTransaction = localStorage.getItem("transaction") || [];

        localStorage.setItem("transaction", [
          ...preTransaction.slice(-9),
          receipt.blockHash,
        ]);
        console.log("ere");

        dispatch(getData());
        setTransactionPendingStatus((state) => ({
          ...state,
          transactionStatus: SUCCESS,
          transactionMessage: "",
        }));
      })
      .on("error", function (error) {
        setTransactionPendingStatus((state) => ({
          ...state,
          transactionStatus: FAILED,
          transactionMessage: error.message,
        }));
      });
  };

  const handleClaim = () => {
    if (poolData?.userClaimableReward === 0) {
      return;
    }
    setTransactionPendingStatus((state) => ({
      ...state,
      transactionStatus: "loading",
      progressModalStatus: true,
    }));
    claim(poolData.contract, account)
      .on("receipt", (receipt) => {
        const preTransaction = localStorage.getItem("transaction");

        localStorage.setItem("transaction", [
          ...preTransaction.slice(-9),
          receipt.blockHash,
        ]);
        dispatch(getData());
        setTransactionPendingStatus((state) => ({
          ...state,
          transactionStatus: SUCCESS,
          transactionMessage: "",
        }));
      })
      .on("error", function (error) {
        setTransactionPendingStatus((state) => ({
          ...state,
          transactionStatus: FAILED,
          transactionMessage: error.message,
        }));
      });
  };

  const handleReinvest = () => {
    if (poolData?.userClaimableReward === 0) {
      return;
    }
    setTransactionPendingStatus((state) => ({
      ...state,
      transactionStatus: "loading",
      progressModalStatus: true,
    }));
    reinvest(poolData.contract, account)
      .on("receipt", (receipt) => {
        const preTransaction = localStorage.getItem("transaction");

        localStorage.setItem("transaction", [
          ...preTransaction.slice(-9),
          receipt.blockHash,
        ]);
        dispatch(getData());
        setTransactionPendingStatus((state) => ({
          ...state,
          transactionStatus: SUCCESS,
          transactionMessage: "",
        }));
      })
      .on("error", function (error) {
        setTransactionPendingStatus((state) => ({
          ...state,
          transactionStatus: FAILED,
          transactionMessage: error.message,
        }));
      });
  };

  const loadData = async () => {
    const _isapproved = await isApproved(contractAddress, account);
    setApproveStatus(_isapproved);
  };

  useEffect(() => {
    if (active) loadData();
  }, [active]);

  return (
    <div className="page-pool">
      {active ? (
        <div className="content">
          <Link to="/" className="header">
            <BackIcon />
            <img src={poolData?.avatarSrc || ""} alt="avatar" />
            <div className="name">{poolData?.name || ""}</div>
          </Link>
          <div className="card">
            <div className="half-box">
              <Box title="Deposit">
                <div className="content-box">
                  <div className="input">
                    <input
                      className="token-amount-input"
                      inputMode="decimal"
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      minLength="1"
                      maxLength="79"
                      placeholder="0.0"
                      value={input.stakingAmount}
                      onChange={(ev) =>
                        setInput({ ...input, stakingAmount: ev.target.value })
                      }
                    />
                  </div>
                  <div className="info-bar">
                    <div>{`Available: ${
                      poolData
                        ? parseFloat(poolData.userBalance).toFixed(2)
                        : "---"
                    } XDOGE`}</div>
                    <button
                      onClick={() =>
                        setInput({
                          ...input,
                          stakingAmount: parseFloat(
                            poolData.userBalance
                          ).toFixed(2),
                        })
                      }
                      className="max-btn"
                    >
                      (Max)
                    </button>
                  </div>
                  {!isContractV1 && (
                    <div className="referral-link">
                      <a
                        href={`/pool/${contractAddress}/${account}`}
                        target="_blank"
                      >
                        Referral Link
                      </a>
                      <button onClick={copyAddress} className="copy-btn">
                        <CopyIcon />
                      </button>
                      <div className="copy-status" ref={referralCopyRef}>
                        Copied
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    handleApprove();
                  }}
                  md
                >
                  {approveStatus ? "Stake" : "Approve"}
                </Button>
              </Box>
              <Box title="Withdraw">
                <div className="content-box">
                  <div className="input">
                    <input
                      className="token-amount-input"
                      inputMode="decimal"
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      minLength="1"
                      maxLength="79"
                      placeholder="0.0"
                      value={input.withdrawAmount}
                      onChange={(ev) => {
                        setInput({ ...input, withdrawAmount: ev.target.value });
                      }}
                    />
                  </div>
                  <div className="info-bar">
                    <div>{`Available: ${
                      poolData
                        ? parseFloat(
                            poolData.userDepositedTokenBalance
                          ).toFixed(2)
                        : "---"
                    } XDOGE`}</div>
                    <button
                      onClick={() => {
                        setInput({
                          ...input,
                          withdrawAmount: parseFloat(
                            poolData.userDepositedTokenBalance
                          ).toFixed(2),
                        });
                      }}
                      className="max-btn"
                    >
                      (Max)
                    </button>
                  </div>
                </div>
                <Button
                  md
                  disabled={
                    parseFloat(poolData?.userDepositedTokenBalance).toFixed(
                      2
                    ) === 0
                      ? true
                      : false
                  }
                  onClick={() => {
                    handleWithdraw();
                  }}
                >
                  Withdraw
                </Button>
              </Box>
              <Box title="Claim Rewards">
                <div className="claimable-reward">
                  {`Claimable Rewards: ${
                    poolData
                      ? parseFloat(poolData.userClaimableReward).toFixed(4)
                      : "---"
                  } XDOGE`}
                </div>
                <div className="flex xs-flex-wrap">
                  <Button
                    className="mr-2"
                    onClick={() => handleClaim()}
                    disabled={
                      parseFloat(poolData?.userDepositedTokenBalance).toFixed(
                        2
                      ) === 0
                        ? true
                        : false
                    }
                  >
                    {`CLAIM ${
                      poolData
                        ? parseFloat(poolData.userClaimableReward).toFixed(4)
                        : "---"
                    } XDOGE`}
                  </Button>
                  {!isContractV1 > 0 && (
                    <Button
                      onClick={() => {
                        handleReinvest();
                      }}
                      disabled={
                        parseFloat(poolData?.userClaimableReward).toFixed(2) ===
                        0
                          ? true
                          : false
                      }
                    >{`Reinvest ${
                      poolData
                        ? parseFloat(poolData.userClaimableReward).toFixed(4)
                        : "---"
                    } XDOGE`}</Button>
                  )}
                </div>
              </Box>
              <Box title="Rewards Calculator">
                <div className="content-box border">
                  <div className="flex justify-center gap-10 flex-wrap">
                    <div className="input-box">
                      <div className="label">Staking Amount(XDOGE)</div>
                      <input
                        className="token-amount-input"
                        inputMode="decimal"
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        minLength="1"
                        maxLength="79"
                        placeholder="0.0"
                        value={rewardCal.amountInput}
                        onChange={(ev) => {
                          setRewardCal((state) => ({
                            ...state,
                            amountInput: ev.target.value,
                          }));
                        }}
                      />
                    </div>
                    <div className="input-box">
                      <div className="label">Lokced Period(days)</div>
                      <input
                        className="token-amount-input"
                        inputMode="decimal"
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        minLength="1"
                        maxLength="79"
                        placeholder="0.0"
                        value={rewardCal.periodInput}
                        onChange={(ev) => {
                          setRewardCal((state) => ({
                            ...state,
                            periodInput: ev.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="info-bar">
                    <div>{`Reward Amount: ${
                      (rewardCal.amountInput *
                        rewardCal.periodInput *
                        poolData?.apr) /
                        365 /
                        100 || 0
                    } XDOGE`}</div>
                  </div>
                </div>
              </Box>
            </div>
            <div className="half-box">
              <Box title={`${poolData?.name || ""} Pool Details`}>
                <div className="flex flex-wrap justify-center">
                  <InfoBox
                    className="mr-2"
                    title="APR"
                    value={`${
                      poolData ? parseFloat(poolData.apr).toFixed(2) : "---"
                    }%`}
                  />
                  <InfoBox
                    title="Total Deposited"
                    value={
                      poolData
                        ? parseFloat(poolData.totalDeposited).toFixed(2)
                        : "---"
                    }
                  />
                </div>
              </Box>
              <Box>
                <div className="avatar">
                  <img src={poolData?.avatarSrc || ""} alt="avatar" />
                </div>
                <div>
                  <div className="flex items-center justify-between leading-loose">
                    <div className="label">Pool Status:</div>
                    <div
                      className={
                        "pool-status " + (poolData.finished && "finished ")
                      }
                    >
                      {poolData.finished ? "Finished" : "UNLOCKED"}
                    </div>
                  </div>
                  <AddressBar
                    label={"Pool Address"}
                    address={contractAddress}
                  />
                  <AddressBar
                    label={"Deposit Token (XDOGE)"}
                    address={poolData?.stakingTokenAddress || ""}
                  />
                  <AddressBar
                    label={"Reward Token (XDOGE)"}
                    address={poolData?.rewardTokenAddress || ""}
                  />
                  <HorizontalLine />
                  {isContractV1 ? (
                    <StatsBar
                      label="Min. Stake Limit"
                      value={`${
                        poolData ? poolData.minStakingLimit : "---"
                      } XDOGE`}
                    />
                  ) : (
                    <div>
                      <StatsBar
                        label="Pool Staking Fee"
                        value={`${poolData ? poolData.stakingFee : "---"}%`}
                      />
                      <StatsBar
                        label="Pool Withdraw Fee"
                        value={`${poolData ? poolData.unstakingFee : "---"}%`}
                      />
                      <StatsBar
                        label="Pool Refferal Fee"
                        value={`${poolData ? poolData.referralFee : "---"}%`}
                      />
                      <StatsBar
                        label="Withdraw Lock Time"
                        value={`${
                          poolData?.lockupTime / 3600 / 24 || "---"
                        } day`}
                      />
                    </div>
                  )}
                  <HorizontalLine />

                  <StatsBar
                    label="Total Deposited"
                    value={`${
                      poolData
                        ? parseFloat(poolData.totalDeposited).toFixed(2)
                        : "---"
                    } XDOGE`}
                  />
                  <StatsBar
                    label="Total Rewards"
                    value={`${
                      poolData
                        ? parseFloat(poolData.totalReward).toFixed(2)
                        : "---"
                    } XDOGE`}
                  />

                  {!isContractV1 && (
                    <StatsBar
                      label="Total Referral Rewards"
                      value={`${
                        poolData
                          ? parseFloat(
                              poolData.totalClaimedRefferalFee
                            ).toFixed(2)
                          : "---"
                      } XDOGE`}
                    />
                  )}
                  <StatsBar
                    label="Deposit Finished"
                    value={`${
                      poolData
                        ? isContractV1
                          ? new Date(
                              poolData.periodFinish * 1000
                            ).toLocaleString()
                          : new Date(
                              (parseInt(poolData?.poolStartTime) +
                                parseInt(poolData?.poolValidFor)) *
                                1000
                            ).toLocaleString()
                        : "--/--/-- --:--:--"
                    }`}
                  />
                  <StatsBar
                    label="Pool valid for"
                    value={
                      poolData
                        ? !poolData.finished
                          ? parseInt(poolValidFor) + 1 + " days"
                          : "Expired"
                        : "---"
                    }
                  />
                  <HorizontalLine />
                  <StatsBar
                    label="My XDOGE Balance"
                    value={`${
                      poolData
                        ? parseFloat(poolData.userBalance).toFixed(2)
                        : "---"
                    } XDOGE`}
                  />
                  <StatsBar
                    label="My Deposited"
                    value={`${
                      poolData
                        ? parseFloat(
                            poolData.userDepositedTokenBalance
                          ).toFixed(2)
                        : "---"
                    } XDOGE`}
                  />
                  {!isContractV1 && (
                    <StatsBar
                      label="My Referral Reward Earned"
                      value={`${
                        poolData
                          ? parseFloat(poolData.userRefferalReward).toFixed(2)
                          : "---"
                      } XDOGE`}
                    />
                  )}
                  <StatsBar
                    label="Claimable Rewards"
                    value={`${
                      poolData
                        ? parseFloat(poolData.userClaimableReward).toFixed(2)
                        : "---"
                    } XDOGE`}
                  />
                </div>
              </Box>
            </div>
          </div>
        </div>
      ) : (
        <div className="connect-text">Please connect to a wallet</div>
      )}

      <ProgressModal
        transactionPendingStatus={transactionPendingStatus}
        setTransactionPendingStatus={setTransactionPendingStatus}
      />
    </div>
  );
};

export default Pool;
