import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PoolCard from "../../components/PoolCard";
import Title from "../../components/Title";
import { stakingContractV1Address, stakingContractV2Address } from "../../web3";

const Home = () => {
  const { active } = useWeb3React();
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useSelector((state) => state.dataReducer);

  const matchSearchQuery = (data, contractAddress) => {
    if (data === undefined) return false;

    return (
      data.name.toLowerCase().includes(searchQuery) ||
      data.description.toLowerCase().includes(searchQuery)
      ||
      contractAddress.toLowerCase().includes(searchQuery)
    );
  };


  return (
    <div className="page-home">
      <div className="content">
        <Title center>Staking Pools</Title>
        <div className="description">
          Earn while invested with the ClassicDoge Staking Pools
        </div>
        <div className="top-bar">
          <div className="all-pool">{`All Staking Pools (${Object.entries(data).length})`}</div>
          <div className="search-bar">
            <input
              placeholder="Search propasals"
              value={searchQuery}
              onChange={(ev) => setSearchQuery(ev.target.value.toLowerCase())}
            />
            <div className="icon">⌘/</div>
          </div>
        </div>

        {active ? (
          !matchSearchQuery(data.riverV1, stakingContractV1Address) && !matchSearchQuery(data.riverV2, stakingContractV2Address) ? (
            <div className="search-none">
              {[...Array(12)].map((value, index) => (
                <div key={index} />
              ))}
            </div>
          ) : (
            <div className="pool">
              <div className="pool-cards">
                {matchSearchQuery(data.riverV2, stakingContractV2Address) && (
                  <Link to={`/pool/${stakingContractV2Address}/0x`}>
                    <PoolCard data={data.riverV2} />
                  </Link>
                )}
                {matchSearchQuery(data.riverV1, stakingContractV1Address) && (
                  <Link to={`/pool/${stakingContractV1Address}/0x`}>
                    <PoolCard data={data.riverV1} />
                  </Link>
                )}
              </div>
              <div className="pagination">
                <div className="nav-btn disabled">←</div>
                <div className="current-page">Page 1 of 1</div>
                <div className="nav-btn disabled">→</div>
              </div>
            </div>
          )
        ) : (
          <div className="connect-text">Please connect to a wallet</div>
        )}
      </div>
    </div>
  );
};

export default Home;
