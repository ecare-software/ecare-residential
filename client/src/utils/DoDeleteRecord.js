import Axios from "axios";

export const DoDeleteRecord = async (
  message = "Are you sure? This cannot be undone",
  apiPath,
  callback = () => {}
) => {
  const answer = await window.confirm(message);
  if (answer) {
    try {
      await Axios.delete(apiPath);
      callback();
    } catch (e) {
      alert("Error deleting record");
    }
  }
};
