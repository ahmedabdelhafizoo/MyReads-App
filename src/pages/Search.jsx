import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import BookCard from "../components/BookCard";
import * as BooksAPI from "../BooksAPI";

class Search extends Component {
  // validate props
  static propTypes = {
    handelBookStatus: PropTypes.func.isRequired,
    userBooks: PropTypes.array.isRequired
  };

  state = {
    books: []
  };

  handelSearch = query => {
    let searchQuery = query.trim();
    if (searchQuery) {
      this.props.toggleLoading();
      BooksAPI.search(searchQuery)
        .then(books => {
          books.forEach(book => {
            let targetBook = this.props.userBooks.find(
              userBook => userBook.id === book.id
            );
            if (targetBook) {
              book.shelf = targetBook.shelf;
            }
          });
          this.setState({ books });
        })
        .catch(() => {
          console.log("something went wrong, please try again later :)");
          this.setState({ books: null });
        })
        .finally(() => {
          this.props.toggleLoading();
        });
    }
  };

  handelBookStatus = (book, shelf) => {
    this.props.handelBookStatus(book, shelf);
    let { books } = this.state;
    let targetBook = books.find(bookItem => bookItem.id === book.id);
    targetBook.shelf = shelf;
    this.setState({ books });
  };
  render() {
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
              onChange={e => this.handelSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {!!(Array.isArray(this.state.books) && this.state.books.length) &&
              this.state.books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  handelBookStatus={this.handelBookStatus}
                />
              ))}
          </ol>

          {!Array.isArray(this.state.books) && (
            <h3
              style={{
                textAlign: "center",
                margin: "40px 0"
              }}
            >
              Try To Search For Another Book
            </h3>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.getElementById("search-input").focus();
  }
}

export default Search;
