import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import useAxios from "../../Utils/useAxios.jsx";
import { updateAccountDetails } from "../../features/Auth/userSlice.js";

const UpdateAccountDetails = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.userData.user);
  const { sendRequest } = useAxios();
  const [message, setMessage] = useState({ type: "", text: "" });
 const dispatch = useDispatch();

 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fullName: currentUser.fullname || "",
      email: currentUser.email || "",
    },
  });

  // Keep RHF values in sync if user changes externally
  useEffect(() => {
    reset({
      fullName: currentUser.fullname,
      email: currentUser.email,
    });
  }, [currentUser.fullname, currentUser.email, reset]);

  const UpdateAccountData = async (data) => {
    try {
      const res = await sendRequest({
        url: "/users/update-account",
        method: "PATCH",
        body: {
          fullname: data.fullName,
          email: data.email,
        },
      });


      if (res?.data) {
        dispatch(
          updateAccountDetails({
            fullname: res.data.fullname,
            email: res.data.email,
          })
        );
      }

      console.log("/update-account", res);
      setMessage({
        type: "success",
        text: "Account details updated successfully! ✅",
      });
    } catch (error) {
      console.error("Error while updating user:", error);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const onSubmit = async (data) => {
    setMessage({ type: "", text: "" });

    // Check if no changes made
    if (
      data.fullName === currentUser.fullname &&
      data.email === currentUser.email
    ) {
      setMessage({ type: "info", text: "No changes detected." });
      return;
    }

    await UpdateAccountData(data);
  };

  const getMessageStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-400 dark:bg-green-900 dark:text-green-300";
      case "error":
        return "bg-red-100 text-red-800 border-red-400 dark:bg-red-900 dark:text-red-300";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "hidden";
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full mx-auto mb-8 border border-gray-200 dark:border-gray-700">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Edit Details
        </h3>
        <button
          onClick={() => navigate("..")}
          className="flex items-center text-gray-500 hover:text-blue-600 transition duration-150 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Back to Settings"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Feedback Message */}
      {message.text && (
        <div
          className={`p-3 mb-6 border rounded-md ${getMessageStyle(
            message.type
          )}`}
        >
          <p>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Your full name"
            {...register("fullName", { required: "Full name is required" })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Your email address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-500 transition duration-150 mt-8"
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAccountDetails;
