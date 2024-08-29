import { USER_API_ENDPOINT } from "@/constants/constants";
import { setUserProfile } from "@/redux/authSlice";
import { default as axios } from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${USER_API_ENDPOINT}/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          //   console.log(response.data);
          dispatch(setUserProfile(response.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
