import React, { Fragment, useState } from "react";
import logo from "../assets/logo.png";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/constants/constants";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    // console.log(input);
    try {
      setLoading(true);
      const response = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data);

      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
        navigate("/");
        toast.success(response.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <div className="flex flex-col items-center w-screen h-screen justify-center space-y-4">
        <form
          onSubmit={loginHandler}
          className="max-w-4xl mx-auto gap-5 p-8 shadow-lg rounded-xl  "
        >
          <div className="my-4 space-y-4">
            <img className="h-24" src={logo} alt="" />
            <hr className="py-2" />
            <div className="grid w-full max-w-sm items-center gap-2">
              <Input
                type="email"
                id="email"
                name="email"
                value={input.email}
                onChange={onChangeHandler}
                placeholder="Email"
              />
              <Input
                type="password"
                id="password"
                name="password"
                value={input.password}
                onChange={onChangeHandler}
                placeholder="Password"
              />
              {loading ? (
                <Button
                  variant="ghost"
                  className="w-full font-bold bg-blue-500"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  type="submit"
                  className="w-full font-bold bg-blue-500 text-white mt-2 hover:scale-105 hover:bg-blue-600 hover:text-white"
                >
                  Log In
                </Button>
              )}
            </div>
          </div>
        </form>
        <span>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </span>
      </div>
    </Fragment>
  );
}
