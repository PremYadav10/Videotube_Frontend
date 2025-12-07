import React, { useState } from 'react'; // 1. Import useState
import Input from '../Components/Input';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import useAxios from '../Utils/useAxios.jsx';
import { useDispatch } from 'react-redux';
import { login } from '../features/Auth/userSlice';

function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false); // 2. Initialize loading state
    const [apiError, setApiError] = useState(null); // 3. State for API errors
    
    const dispatch = useDispatch();
    const { sendRequest } = useAxios();
    const navigate = useNavigate();

    const onSubmit = (formData) => {
        setApiError(null); // Clear previous errors
        
        // Convert react-hook-form data to FormData (for file upload)
        const submitData = new FormData();
        submitData.append("fullname", formData.fullname);
        submitData.append("username", formData.username);
        submitData.append("email", formData.email);
        submitData.append("password", formData.password);

        if (formData.avatar && formData.avatar.length > 0) {
            submitData.append("avatar", formData.avatar[0]); 
        }

        if (formData.coverImage && formData.coverImage.length > 0) {
            submitData.append("coverImage", formData.coverImage[0]);
        }

        registerUser(submitData);
    };

    const registerUser = async (submitData) => {
        setLoading(true); // 4. Start loading
        try {
            const response = await sendRequest({
                method: "post",
                url: "/users/register",
                body: submitData, // FormData
            });

            console.log("User Registered:", response);
            dispatch(login(response.data));
            navigate("/");
            
        } catch (error) {
            console.error("Register Error:", error);
            // 5. Handle and display API errors (e.g., User already exists)
            const errorMessage = error.response?.data?.message || "Registration failed. Please check your inputs.";
            setApiError(errorMessage);
        } finally {
            setLoading(false); // 6. Stop loading regardless of success/fail
        }
    };

    return (
        <div className='min-h-screen w-full bg-gray-900 text-white p-5 '>
            <div className='h-full w-[70%] mx-[15%] flex flex-col items-center gap-2 mt-10 border border-gray-700 rounded-3xl p-5'>
                <div className='flex flex-col items-center gap-1.5 '>
                    <h1 className='text-5xl '>Welcome to Videotube</h1>
                    <h3 className='text-lg'>Join us and share your videos & tweets with the world!</h3>
                    <p className='text-sm'>If you already have an account? <Link to="/login" className='text-blue-500'>Log in</Link></p>
                </div>

                {/* <span className='border-b border-gray-700 w-full my-2'></span> */}

                {/* API Error Display */}
                {apiError && (
                    <p className='text-red-400 bg-red-900/30 p-2 rounded w-full max-w-lg text-center font-medium'>{apiError}</p>
                )}

                <div className='w-full flex flex-col items-center'>

                    {/* ... Google Sign Up section remains the same ... */}

                    {/* <div className=' flex flex-col justify-center items-center gap-2'>
                        <h2 className='text-lg '>If you have a google account you can create account with google </h2>
                        <button className='flex flex-row items-center gap-2 border border-gray-700 p-2 rounded-lg hover:bg-gray-800 cursor-pointer'>
                            <FaGoogle />
                            Sign up with Google
                        </button>
                        <p className='text-sm mt-2'>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                    </div> */}

                    <span className='border-b border-gray-700 w-full my-2'></span>

                    <p className='text-lg'>Please enter your details to create an account.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className='w-[60%] flex flex-col items-center '>
                        {/* --- Input fields (omitted for brevity) --- */}
                        <Input label="Full Name *" placeholder="Enter your full name" type="text" autoComplete="fullname" {...register("fullname", { required: "Full Name is required" })} />
                        <Input label="Username *" placeholder="Enter your username" type="text" autoComplete="username" {...register("username", { required: "Username is required" })} />
                        <Input label="Email *" placeholder="Enter your email" type="email" autoComplete="email" {...register("email", { required: "Email is required" })} />
                        <Input label="Password *" placeholder="Enter your password" type="password" autoComplete="new-password" {...register("password", { required: "Password is required" })} />
                        
                        {/* File inputs */}
                        <Input label="Select the profile picture [avatar] *" type="file" accept="image/*" {...register("avatar", { required: "Avatar is required" })} />
                        <Input label="Select the cover image" type="file" accept="image/*" {...register("coverImage")} />

                        {/* SUBMIT BUTTON WITH LOADING STATE */}
                        <button 
                            type="submit" 
                            disabled={loading} // 7. Disable button while loading
                            className="w-[50%] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registering...' : 'Sign Up'} {/* 8. Dynamic Button Text */}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;