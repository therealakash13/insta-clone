import { POST_API_ENDPOINT } from "@/constants/constants";
import { setPosts } from "@/redux/postSlice";
import { default as axios } from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllPost = () => {
  const { user } = useSelector((store) => store.auth);
  const { post } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const response = await axios.get(`${POST_API_ENDPOINT}/all`, {
          withCredentials: true,
        });
        if (response.data.success) {
          //   console.log(response.data);
          dispatch(setPosts(response.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, [user, post]);
};

export default useGetAllPost;
