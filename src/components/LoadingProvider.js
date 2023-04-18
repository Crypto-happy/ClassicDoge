import { useCallback, useEffect, useRef } from "react";
import loading from "../assets/lottie/24693-coin-falling-animation.json";
import { useLottie } from "lottie-react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

const Loading = () => {
  const options = {
    animationData: loading,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { View } = useLottie(options);
  return View;
};

const LoadingProvider = ({ children }) => {
  const { loadingData } = useSelector((state) => state.dataReducer);
  const { active } = useWeb3React();
  const loadingRef = useRef(null);

  useEffect(() => {
    if (!loadingData) loadingRef.current.style.left = "100%";
  }, [loadingData]);

  return (
    <div>
      {active && (
        <div ref={loadingRef} className="loading-screen">
          <Loading />
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingProvider;
