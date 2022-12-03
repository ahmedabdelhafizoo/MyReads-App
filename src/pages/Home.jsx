import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import BooksShelf from "../components/BooksShelf";

const Home = (props) => {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          {props.shelves.map((shelf, index) => (
            <BooksShelf
              id={shelf.id}
              key={index}
              shelfTitle={shelf.title}
              books={shelf.books}
              handelBookStatus={props.handelBookStatus}
            />
          ))}
        </div>
      </div>

      <div className="open-search">
        <Link to="/search">
          <button>Add a book</button>
        </Link>
      </div>
    </div>
  );
};
// validate props
Home.propTypes = {
  shelves: PropTypes.array.isRequired,
  handelBookStatus: PropTypes.func.isRequired,
};

export default Home;
