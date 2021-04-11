import React from "react";
import PropTypes from "prop-types";

const BookCard = props => {
  let { book, handelBookStatus } = props;
  return (
    <li>
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage: book.imageLinks
                ? `url(${book.imageLinks.smallThumbnail})`
                : ""
            }}
          />
          <div className="book-shelf-changer">
            <select
              onChange={e => handelBookStatus(book, e.target.value)}
              value={book.shelf || "none"}
            >
              <option value="move" disabled>
                Move to...
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">
          {book.authors &&
            book.authors.map((author, index, arr) => (
              <span key={index}>
                {author} {index !== arr.length - 1 ? <br /> : ""}
              </span>
            ))}
        </div>
      </div>
    </li>
  );
};

// validate props
BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  handelBookStatus: PropTypes.func.isRequired
};

export default BookCard;
