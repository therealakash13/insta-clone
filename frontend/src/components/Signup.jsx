import React, { Fragment, useState } from "react";
import logo from "../assets/logo.png";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/constants/constants";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    // console.log(input);
    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_API_ENDPOINT}/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate("/login");
        toast.success(response.data.message);
        setInput({
          username: "",
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
          onSubmit={signUpHandler}
          className="max-w-4xl mx-auto gap-5 p-8 shadow-lg rounded-xl "
        >
          <div className="my-4 space-y-4">
            <img className="h-24" src={logo} alt="" />
            <p className="font-bold text-gray-500 pb-4">
              Sign up to see photos and videos from your friends.
            </p>
            <hr className="py-2" />
            <div className="grid w-full max-w-sm items-center gap-2">
              <Input
                type="text"
                id="username"
                name="username"
                value={input.username}
                onChange={onChangeHandler}
                placeholder="Usename"
              />
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
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  type="submit"
                  className="w-full font-bold bg-blue-500 text-white mt-2 hover:scale-105 hover:bg-blue-600 hover:text-white"
                >
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        </form>
        <span>
          Have an Account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </span>
      </div>
    </Fragment>
  );
}
