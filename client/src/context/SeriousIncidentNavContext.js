import { createContext } from "react";

// Provided by App.js. Lets any form open a pre-filled Serious Incident Report without prop drilling.
const SeriousIncidentNavContext = createContext({
  openSeriousIncidentReport: null, // (clientId) => void
});

export default SeriousIncidentNavContext;
