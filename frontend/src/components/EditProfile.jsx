import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "@/constants/constants";
import { setAuthUser } from "@/redux/authSlice";

export default function EditProfile() {
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file });
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    // console.log(input);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("bio", input.bio);
      formData.append("gender", input.gender);
      if (input.profilePicture) {
        formData.append("file".input.profilePicture);
      }
      const response = await axios.post(
        `${USER_API_ENDPOINT}/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // fix this edit thing
      if (response.data.success) {
        const updatedUserData = {
          ...user,
          bio: response.data.user.bio,
          profilePicture: response.data.user.profilePicture,
          gender: response.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="flex w-screen">
          <div className="lg:flex-[1]"></div>
          <div className="lg:flex-[7] md:flex-[3] sm:flex-[1] mx-6 mt-10">
            <div className="flex sm:max-w-2xl lg:max-w-full mx-auto sm:pl-20">
              <section className="flex flex-col gap-8 w-full">
                <h1 className="text-xl font-bold">Edit Profile</h1>
                <div className="flex items-center gap-4 bg-gray-300 px-8 py-8 rounded-3xl">
                  <Avatar>
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h1 className="font-bold text-sm">{user?.username}</h1>
                      <span className="text-gray-600">{user?.bio}</span>
                    </div>
                    <div>
                      <input
                        onChange={fileChangeHandler}
                        ref={imageRef}
                        type="file"
                        className="hidden"
                      />
                      <Button
                        onClick={() => imageRef?.current.click()}
                        className="bg-[#0095F6] hover:bg-[#318BC7] rounded-xl"
                      >
                        Change photo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="font-semibold text-lg">Bio</h1>
                  <Textarea
                    className="focus-visible:ring-transparent"
                    name="bio"
                    value={input?.bio}
                    onChange={(e) =>
                      setInput({ ...input, bio: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <h1 className="font-semibold text-lg">Gender</h1>
                  <Select
                    defaultValue={input?.gender}
                    onValueChange={selectChangeHandler}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={input?.gender} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end ">
                  {loading ? (
                    <Button className="my-2 bg-[#0095F6] hover:bg-[#318BC7]">
                      <Loader2 className="mr-2 animate-spin h-4 w-4" /> Please
                      wait...
                    </Button>
                  ) : (
                    <Button
                      onClick={editProfileHandler}
                      className="my-2 bg-[#0095F6] hover:bg-[#318BC7]"
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
