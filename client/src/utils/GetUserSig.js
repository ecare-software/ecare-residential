import Axios from "axios";

export const GetUserSig = async (email, homeId) => {
  return await Axios({
    method: "get",
    url: `/api/users/user/${email}/${homeId}`,
  });
};