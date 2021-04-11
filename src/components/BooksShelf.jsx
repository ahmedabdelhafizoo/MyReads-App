import React from "react";
import PropTypes from "prop-types";

import BookCard from "./BookCard";

const BooksShelf = props => {
  return (
    <div className="bookshelf" id={props.id}>
      <h2 className="bookshelf-title">{props.shelfTitle}</h2>
      <div className="bookshelf-books">
        {props.books.length ? (
          <ol className="books-grid">
            {props.books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                handelBookStatus={props.handelBookStatus}
              />
            ))}
          </ol>
        ) : (
          <h3
            style={{
              textAlign: "initial",
              margin: "20px 0"
            }}
          >
            You don't have any book that marked as ({props.shelfTitle}) yet.
          </h3>
        )}
      </div>
    </div>
  );
};

// validate props
BooksShelf.propTypes = {
  shelfTitle: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  handelBookStatus: PropTypes.func.isRequired
};

export default BooksShelf;
