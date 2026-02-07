import React, { useEffect, useState } from "react";
import useAxios from "../Utils/useAxios";
import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import { useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Comment({ videoId }) {
  const { sendRequest } = useAxios();
  const [isEditing, setIsEditing] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const { register, handleSubmit, reset, setValue } = useForm();
  const currentUser = useSelector((state) => state.user?.userData);
  const isLoggedIn = useSelector((state) => state.user.status);


  const getComments = async () => {
    const response = await sendRequest({
      method: "get",
      url: `/comments/${videoId}`,
    });
    setCommentData(response.data);
    console.log(response);

  };

  const addComment = async (formData) => {
    try {
      await sendRequest({
        method: "POST",
        url: `/comments/${videoId}`,
        body: formData,
      });
      getComments();
      reset(); // 
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (id) => {
    try {
      await sendRequest({
        method: "DELETE",
        url: `/comments/c/${id}`,
      });
      setCommentData((prev) => prev.filter((c) => c._id !== id)); // ✅ update UI instantly
    } catch (error) {
      console.log(error);
    }
  };

  const updateComment = async (id, updatedContent) => {
    try {
      await sendRequest({
        method: "PATCH",
        url: `/comments/c/${id}`,
        body: { content: updatedContent },
      });
      getComments();
      cancelEditing();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const startEditing = (comment) => {
    setIsEditing(true);
    setEditingComment(comment);
    setValue("content", comment.content);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingComment(null);
    reset();
  };

  const onAddSubmit = (formData) => {
    isLoggedIn ? addComment(formData) : toast.error("Login to post a comment");
  };

  const onUpdateSubmit = (formData) => {
    updateComment(editingComment._id, formData.content);
  };

  return (
    <div className="text-white p-4">
      <h3 className="text-xl font-bold mb-4">Comments</h3>

      {/* Add/Edit Comment Box */}
      <div className="bg-gray-800 p-4 rounded-xl mb-1 shadow-lg">
        <form onSubmit={handleSubmit(isEditing ? onUpdateSubmit : onAddSubmit)}>
          <textarea
            className="w-full h-24 p-3 mb-4 bg-gray-700 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder={isEditing ? "Edit your comment" : "Write a comment..."}
            {...register("content", { required: true })}
          />
          <div className="flex justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
              disabled={loading}
            >
              {isEditing ? "Update Comment" : "Comment"}
            </button>
          </div>
        </form>
      </div>

      {/* Comment Feed */}
      {loading ? (
        <p className="text-center mt-4 text-gray-400">Loading comments...</p>
      ) : commentData.length > 0 ? (
        <div>
          {commentData.map((comment) => (
            <div
              key={comment._id}
              className="hover:bg-gray-800 p-4 mt-4 rounded-xl border border-gray-700 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <img
                  src={comment.owner?.avatar || "https://placehold.co/100x100/374151/FFFFFF?text=A"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-semibold text-lg">{comment.owner?.username}</h4>
                    <p className="text-gray-400 text-sm">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-gray-300 leading-relaxed">
                    {comment.content}
                  </p>
                  {/* Actions */}
                  <div className="flex gap-6 mt-3 text-gray-400 text-sm">
                    {/* Like button and count - Assuming a like functionality exists */}
                    <button className="hover:text-red-500 transition-colors duration-200">
                      ❤️ {comment.likesCount ? comment.likesCount : 0}
                    </button>

                    {/* The rest of the actions... */}
                    <button className="hover:text-green-500 transition-colors duration-200">🔁</button>
                    <button className="hover:text-blue-500 transition-colors duration-200">🔗 Share</button>

                    {/* Edit and Delete Buttons (only for comment owner) */}
                    {isLoggedIn && currentUser && comment.owner && comment.owner._id === currentUser.user._id && (
                      <div className="ml-auto flex gap-3">
                        <button
                          onClick={() => deleteComment(comment._id)}
                          className="text-red-500 hover:text-red-600 font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => startEditing(comment)}
                          className="text-yellow-500 hover:text-yellow-600 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}

export default Comment;
