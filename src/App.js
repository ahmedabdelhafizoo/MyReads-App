import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import Home from "./pages/Home";
import Search from "./pages/Search";
import "./App.css";

class BooksApp extends React.Component {
  state = {
    categories: [
      {
        text: "Currently Reading",
        value: "currentlyReading"
      },
      {
        text: "Want To Read",
        value: "wantToRead"
      },
      {
        text: "Read",
        value: "read"
      }
    ],
    // store each shelf with it's own books
    shelves: [],
    // store all user books
    books: [],
    loading: false
  };

  render() {
    return (
      <div className="app">
        {this.state.loading && (
          <div className="loading">
            <span className="spinner" />
          </div>
        )}
        <BrowserRouter>
          <Route path="/" exact>
            <Home
              shelves={this.state.shelves}
              handelBookStatus={this.handelBookStatus}
            />
          </Route>
          <Route path="/search">
            <Search
              handelBookStatus={this.handelBookStatus}
              toggleLoading={this.toggleLoading}
              userBooks={this.state.books}
            />
          </Route>
        </BrowserRouter>
      </div>
    );
  }

  handelBookStatus = (book, shelf) => {
    book.shelf = shelf;
    console.log(book);
    this.toggleLoading();
    BooksAPI.update(book, shelf)
      .then(res => {
        console.log(res);
        let { shelves } = this.state;

        // remove book from old shelf
        for (let shelfItem of shelves) {
          let targetBookIndex = shelfItem.books.findIndex(
            item => item.id === book.id
          );
          if (targetBookIndex > -1) {
            shelfItem.books.splice(targetBookIndex, 1);
            break;
          }
        }

        // also update user books array
        let books = this.state.books;
        let targetIndex = books.findIndex(item => item.id === book.id);
        if (targetIndex > -1) {
          books.splice(targetIndex, 1);
        }
        books.push(book);
        this.setState({ books });

        // add the book to the new shelf
        let TargetShelf = shelves.find(item => item.id === shelf);
        if (TargetShelf) {
          TargetShelf.books.push(book);
          this.setState({ shelves });
          let shelfContainer = document.getElementById(shelf);
          if (shelfContainer)
            shelfContainer.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch(() => {
        alert("something went wrong, please try again later :)");
      })
      .finally(() => {
        this.toggleLoading();
      });
  };

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading
    });
  };

  getBooksByShelf(shelf, arr) {
    return arr.filter(book => book.shelf === shelf);
  }

  componentDidMount() {
    this.toggleLoading();
    BooksAPI.getAll()
      .then(books => {
        this.setState({ books });
        let shelves = [];
        this.state.categories.forEach(category => {
          let shelf = {};
          shelf.title = category.text;
          shelf.id = category.value;
          shelf.books = this.getBooksByShelf(category.value, books);
          shelves.push(shelf);
          this.setState({ shelves });
        });
      })
      .catch(() => {
        alert("something went wrong, please try again later :)");
      })
      .finally(() => {
        this.toggleLoading();
      });
  }
}

export default BooksApp;
