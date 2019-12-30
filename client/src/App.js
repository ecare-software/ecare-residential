import React, { Component } from "react";
import "./App.css";
import Axios from "axios";

class App extends Component {
  state = {
    users: []
  };

  componentDidMount() {
    Axios.get("/api/users").then(res => this.setState({ users: res.data }));
  }

  render() {
    return (
      <div>
        <h1>Users</h1>
        <ul>
          {this.state.users.map((user, index) => (
            <li key={"user-index-" + index}>
              {user.id} - {user.username}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
