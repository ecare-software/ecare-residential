import { Home } from "./pages";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const cookies = new Cookies();

const App = () => {
  console.log(cookies.getAll());

  return (
    <Router>
      <div id="App">
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
        {/* pre-page load fade in comp  AppCover()*/}
      </div>
    </Router>
  );
};

export default App;
