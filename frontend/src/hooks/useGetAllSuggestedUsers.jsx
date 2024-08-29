import { USER_API_ENDPOINT } from "@/constants/constants";
import { setSuggestedUsers } from "@/redux/authSlice";
import { default as axios } from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllSuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllSuggestedUsers = async () => {
      try {
        const response = await axios.get(`${USER_API_ENDPOINT}/suggested`, {
          withCredentials: true,
        });
        if (response.data.success) {
          //   console.log(response.data);
          dispatch(setSuggestedUsers(response.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllSuggestedUsers();
  }, []);
};

export default useGetAllSuggestedUsers;
