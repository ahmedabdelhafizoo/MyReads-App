import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import BookCard from "../components/BookCard";
import * as BooksAPI from "../BooksAPI";

const Search = (props) => {
  let [books, updateBooks] = useState([]);

  let handelSearch = debounce((query) => {
    let searchQuery = query.trim();
    if (searchQuery) {
      props.toggleLoading();
      BooksAPI.search(searchQuery)
        .then((result) => {
          result.forEach((book) => {
            let targetBook = props.userBooks.find(
              (userBook) => userBook.id === book.id
            );
            if (targetBook) {
              book.shelf = targetBook.shelf;
            }
          });
          updateBooks(result);
        })
        .catch(() => {
          console.log("something went wrong, please try again later :)");
          updateBooks(null);
        })
        .finally(() => {
          props.toggleLoading();
        });
    }
  }, 500);

  let handelBookStatus = (book, shelf) => {
    props.handelBookStatus(book, shelf);
    let updatedBooks = [...books];
    let targetBook = updatedBooks.find((bookItem) => bookItem.id === book.id);
    targetBook.shelf = shelf;
    updateBooks(updatedBooks);
  };

  useEffect(() => {
    document.getElementById("search-input").focus();
  }, []);

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/">
          <button className="close-search">Close</button>
        </Link>

        <div className="search-books-input-wrapper">
          <input
            id="search-input"
            type="text"
            placeholder="Search by title or author"
            onChange={(e) => handelSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {!!(Array.isArray(books) && books.length) &&
            books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                handelBookStatus={handelBookStatus}
              />
            ))}
        </ol>

        {!Array.isArray(books) && (
          <h3
            style={{
              textAlign: "center",
              margin: "40px 0",
            }}
          >
            Try To Search For Another Book
          </h3>
        )}
      </div>
    </div>
  );
};

// validate props
Search.propTypes = {
  userBooks: PropTypes.array.isRequired,
  handelBookStatus: PropTypes.func.isRequired,
};

export default Search;
