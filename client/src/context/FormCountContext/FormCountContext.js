// import Axios from "axios";
import { createContext } from "react";

const FormCountContext = createContext({
  count: -1,
  updateCount: () => {
    //updated by App.js
  },
});

export default FormCountContext;
