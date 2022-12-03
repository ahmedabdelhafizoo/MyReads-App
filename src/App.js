import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ErrorPage from "./pages/ErrorPage";
import "./App.css";

const BooksApp = () => {
  // app data
  let [categories] = useState([
    {
      text: "Currently Reading",
      value: "currentlyReading",
    },
    {
      text: "Want To Read",
      value: "wantToRead",
    },
    {
      text: "Read",
      value: "read",
    },
  ]);
  // to store each shelf with it's own books
  let [shelves, updateShelves] = useState([]);
  // to store all user books
  let [books, updateBooks] = useState([]);
  // to showing loading indicator
  let [loading, updateLoading] = useState(false);

  // app function
  let toggleLoading = () => {
    updateLoading((loading) => !loading);
  };

  let getBooksByShelf = (shelf, arr) =>
    arr.filter((book) => book.shelf === shelf);

  let handelBookStatus = (book, shelf) => {
    book.shelf = shelf;
    toggleLoading();
    BooksAPI.update(book, shelf)
      .then((res) => {
        let updatedShelves = [...shelves];

        // remove book from old shelf
        for (let shelfItem of updatedShelves) {
          let targetBookIndex = shelfItem.books.findIndex(
            (item) => item.id === book.id
          );
          if (targetBookIndex > -1) {
            shelfItem.books.splice(targetBookIndex, 1);
            break;
          }
        }

        // also update user books array
        let updatedBooks = [...books];
        let targetIndex = updatedBooks.findIndex((item) => item.id === book.id);
        if (targetIndex > -1) {
          updatedBooks.splice(targetIndex, 1);
        }
        updatedBooks.push(book);
        updateBooks(updatedBooks);

        // add the book to the new shelf
        let TargetShelf = updatedShelves.find((item) => item.id === shelf);
        if (TargetShelf) {
          TargetShelf.books.push(book);
          updateShelves(updatedShelves);
          let shelfContainer = document.getElementById(shelf);
          if (shelfContainer)
            shelfContainer.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch(() => {
        alert("something went wrong, please try again later :)");
      })
      .finally(() => {
        toggleLoading();
      });
  };

  useEffect(() => {
    toggleLoading();
    BooksAPI.getAll()
      .then((books) => {
        updateBooks(books);
        let shelves = [];
        categories.forEach((category) => {
          let shelf = {};
          shelf.title = category.text;
          shelf.id = category.value;
          shelf.books = getBooksByShelf(category.value, books);
          shelves.push(shelf);
          updateShelves(shelves);
        });
      })
      .catch(() => {
        alert("something went wrong, please try again later :)");
      })
      .finally(() => {
        toggleLoading();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      {loading && (
        <div className="loading">
          <span className="spinner" />
        </div>
      )}
      <Routes>
        <Route path="/">
          <Route
            index
            exact
            element={
              <Home shelves={shelves} handelBookStatus={handelBookStatus} />
            }
          />
          <Route
            path="search"
            element={
              <Search
                handelBookStatus={handelBookStatus}
                toggleLoading={toggleLoading}
                userBooks={books}
              />
            }
          />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default BooksApp;
