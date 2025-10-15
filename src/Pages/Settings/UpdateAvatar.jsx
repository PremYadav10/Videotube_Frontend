import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaUpload, FaImage } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { updateProfilePicture } from "../../features/Auth/userSlice.js"
import { useSelector } from "react-redux";
import useAxios from "../../Utils/useAxios.jsx";

const UpdateProfilePictureForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sendRequest } = useAxios();

  const currentUser = useSelector((state) => state.user.userData.user);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser.avatar);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setMessage({ type: "", text: "" });

    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(currentUser.avatar);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!file) {
      setMessage({
        type: "error",
        text: "Please select a new image before uploading.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file); // must match upload.single("avatar")

      const res = await sendRequest({
        url: "/users/avatar",
        method: "PATCH",
        body: formData,
      });
      console.log("avvatar res :",res);
      

      if (res.data.avatar) {
        // ✅ Update redux state
        dispatch(updateProfilePicture(res.data.avatar));
      }

      setMessage({
        type: "success",
        text: "Profile picture updated successfully! 🎉",
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to update profile picture. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (file) URL.revokeObjectURL(previewUrl);
    navigate("..");
  };

  const getMessageStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-400 dark:bg-green-900 dark:text-green-300";
      case "error":
        return "bg-red-100 text-red-800 border-red-400 dark:bg-red-900 dark:text-red-300";
      default:
        return "hidden";
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full mx-auto mb-8 border border-gray-200 dark:border-gray-700">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <FaImage className="w-6 h-6 text-gray-400" />
          <span>Update Profile Picture</span>
        </h3>
        <button
          onClick={handleGoBack}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-40 h-40">
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <FaUpload className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current Avatar for @{currentUser.username}
          </p>
        </div>

        {/* File Input */}
        <div>
          <label
            htmlFor="avatar-file"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Select new image file (PNG, JPG)
          </label>
          <input
            type="file"
            id="avatar-file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-300
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-blue-400 dark:hover:file:bg-gray-600
                       cursor-pointer"
          />
          {file && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-500">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !file}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-500 transition duration-150 mt-8"
        >
          {isLoading ? "Uploading..." : "Upload New Picture"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfilePictureForm;
