import React, { Fragment, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import axios from "axios";
import { POST_API_ENDPOINT } from "@/constants/constants";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import Posts from "./Posts";
import useGetAllPost from "@/hooks/useGetAllPost";

export default function CreatePost({ open, setOpen }) {
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const imageRef = useRef();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) {
      formData.append("image", file);
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${POST_API_ENDPOINT}/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data);
        dispatch(setPosts([response.data.post, ...posts]));
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)} className="p-0">
          <div className=" py-3 font-semibold flex items-center justify-center text-lg relative">
            Create new post
            <Button
              onClick={createPostHandler}
              disabled={!imagePreview}
              variant="outline"
              className="absolute right-0 mr-2  bg-[#0895F6] hover:bg-[#258bcf] font-semibold text-sm text-white hover:text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>

          <div className="px-2 pb-2 space-y-2">
            <div className="flex-1 items-center justify-center">
              {imagePreview && (
                <Fragment className="flex items-center justify-center w-full h-64">
                  <img
                    className="object-cover h-full w-full rounded-md"
                    src={imagePreview}
                    alt="preview_image"
                  />
                </Fragment>
              )}
              <div className="flex items-center justify-center mt-2">
                <input
                  ref={imageRef}
                  type="file"
                  className="hidden"
                  onChange={fileChangeHandler}
                />
                <Button
                  onClick={() => imageRef.current.click()}
                  className={`w-fit mx-auto bg-[#0895F6] hover:bg-[#258bcf]`}
                >
                  {imagePreview
                    ? "Choose another picture"
                    : " Select from computer"}
                </Button>
              </div>
            </div>

            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="focus-visible:ring-transparent border-none"
              placeholder="Cation here..."
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
