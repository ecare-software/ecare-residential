import Axios from "axios";

export const FetchHomeData = async (homeId) => {
  return await Axios({
    method: "get",
    url: `/api/home/${homeId}`,
  });
};
