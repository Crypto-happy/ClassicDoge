import { Images_Src } from "../config/images";

const PoolCard = ({ data, unlocked = true }) => {
  console.log(data);
  const {
    finished,
    name,
    minStakingLimit,
    apr,
    avatarSrc,
    description,
    userBalance,
    userDepositedTokenBalance,
    userClaimableReward,
  } = data;
  return (
    <div className="component-pool-card">
      <div className="lock-status">{unlocked ? "UNLOCKED" : "LOCKED"}</div>
      <div className="pool-header">
        <div className="title-bar">
          <div className="title">{name} </div>
          <div className="min-stake">
            {minStakingLimit
              ? `Min. Stake ${minStakingLimit}`
              : `No Stake Limit`}
          </div>
        </div>
        <div>
          <img
            className={"avatar " + (finished && "finished")}
            src={avatarSrc}
            alt="avatar"
          />
        </div>
      </div>
      <div className="apr">{`${apr?.toFixed(1) || "0"}% APR`}</div>
      <div className="pool-description">{description}</div>
      <div className="stake-info">
        <div className="title">
          Staking Token:
          <div className="token">
            <img src={Images_Src.tokenIcon} alt="XDOGE" />
            XDOGE
          </div>
        </div>
        <div className="balance">{`Available: ${
          parseFloat(userBalance)?.toFixed(4) || "0"
        } XDOGE`}</div>
        <div className="balance">{`Staked: ${
          parseFloat(userDepositedTokenBalance).toFixed(4) || "0"
        } XDOGE`}</div>

        <div className="title">
          Reward Token:
          <div className="token">
            <img src={Images_Src.tokenIcon} alt="XDOGE" />
            XDOGE
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="balance">{`${
            parseFloat(userClaimableReward)?.toFixed(4) || 0
          } XDOGE`}</div>
          {userClaimableReward === 0 ? (
            <div className="no-reward-btn">No Reward</div>
          ) : (
            <div>Reward</div>
          )}
        </div>
      </div>
      <button className="confirm-btn">Deposit</button>
      {finished && <div className="finish-status">Finished</div>}
    </div>
  );
};

export default PoolCard;
