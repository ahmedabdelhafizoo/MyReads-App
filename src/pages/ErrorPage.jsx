import { Link } from "react-router-dom";
import errorPageImage from "../assets/images/404.svg";

const Search = () => {
  return (
    <div className="error-page">
      <img src={errorPageImage} alt="error page" className="error-page__img" />
      <Link to="/">
        <button className="error-page__btn">Back To Home</button>
      </Link>
    </div>
  );
};

export default Search;
