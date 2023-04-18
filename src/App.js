import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import Pool from "./pages/pool";

import "./App.scss";
import NavBar from "./components/NavBar";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { getData } from "./store/data/action";

function App() {
  const { active } = useWeb3React();
  const dispatch = useDispatch();

  const loadData = () => {
    if (active) {
      dispatch(getData());
    }
  };

  useEffect(() => {
    loadData();
    setInterval(() => {
      loadData();
    }, 60000);
  }, [active]);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="pool/:contractAddress/:referralAddress"
            element={<Pool />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
