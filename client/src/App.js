import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AllRoutes from "./AllRoutes";
import { fetchAllQuestions } from "./actions/question";
import { fetchAllUsers } from "./actions/users";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import i18n from "./i18n"; 
import MobileAccessRestriction from "./components/MobileAccessRestriction/MobileAccessRestriction";


function App() {
  useEffect(() => {
    const lang = i18n.language;
    switch (lang) {
      case "fr":
        document.body.style.backgroundColor = "#FFFAA0";
        break;
      case "hi":
        document.body.style.backgroundColor = "#89CFF0";
        break;
      case "zh":
        document.body.style.backgroundColor = "#90EE90";
        break;
      default:
        document.body.style.backgroundColor = "white";
    }
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllQuestions());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const [slideIn, setSlideIn] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 760) {
      setSlideIn(false);
    }
  }, []);

  const handleSlideIn = () => {
    if (window.innerWidth <= 760) {
      setSlideIn((state) => !state);
    }
  };

  return (
    <div className="App">
      <ToastContainer /> 
      <Router>
      <MobileAccessRestriction /> 
        <Navbar handleSlideIn={handleSlideIn} />
        <AllRoutes slideIn={slideIn} handleSlideIn={handleSlideIn} />

      </Router>
    </div>
  );
}

export default App;
