import { createContext } from "react";

const FormCountContext = createContext({
  count: -1,
  updateCount: () => {},
});

export default FormCountContext;
