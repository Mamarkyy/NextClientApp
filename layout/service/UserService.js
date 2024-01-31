import axios from "axios";

export const UserService = {
  async getWorkerInfoSimple(userId) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/worker/${userId}/simple`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getUserInfoSimple(userUUID) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${userUUID}/simple`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
