import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Input from '../Components/Input'; // Assuming your Input component is generic
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { login } from '../features/Auth/userSlice';
import useAxios from '../Utils/useAxios';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null); // State for displaying API error
    const dispatch = useDispatch();
    const { sendRequest } = useAxios();
    const navigate = useNavigate();

    // Regex to validate if the string looks like an email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const userLogin = async (formData) => {
        setLoading(true);
        setLoginError(null);
        
        // --- Dynamic Backend Data Formatting ---
        const { identifier, password } = formData;
        let loginData = { password };

        if (emailRegex.test(identifier)) {
            // It looks like an email
            loginData.email = identifier;
        } else {
            // Treat it as a username (default if not a valid email format)
            loginData.username = identifier;
        }
        // --- End Formatting ---

        try {
            const response = await sendRequest({
                method: "post",
                url: "/users/login",
                body: loginData, // Send the dynamically formatted data
            });
            
            console.log(response);
            dispatch(login(response.data));
            navigate("/");
            
        } catch (error) {
            console.error("Login error:", error);
            // Display a user-friendly error message from the API response
            const errorMessage = error.response?.data?.message || "Login failed. Check credentials.";
            setLoginError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (formData) => {
        console.log("Form Data Submitted:", formData);
        userLogin(formData);
    };

    return (
        <div className='min-h-screen w-full bg-gray-900 text-white p-5'>
            <div className='h-full w-[70%] mx-[15%] flex flex-col items-center gap-2 mt-10 border border-gray-700 rounded-3xl p-5'>
                <h1 className='text-5xl '>Welcome Back!</h1>
                <p className='text-md'>Please enter your credentials to access your account.</p>
                <p className='text-md'>Don't have an account? <Link to="/signup" className='text-blue-500'>Sign up</Link></p>
                
                {loginError && (
                    <p className='text-red-500 bg-red-900/30 p-2 rounded w-4/5 text-center'>{loginError}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className='w-4/5 flex flex-col gap-4 mt-4'>
                    
                    {/* COMBINED INPUT FOR EMAIL OR USERNAME */}
                    <Input
                        label="Username or Email *"
                        placeholder="Enter your username or email"
                        type="text"
                        autoComplete="username"
                        {...register("identifier", {
                            required: "Username or Email is required",
                            minLength: {
                                value: 3, // Set a reasonable minimum length for either username or start of email
                                message: "Input must be at least 3 characters long",
                            },
                        })}
                    />
                    
                    {/* PASSWORD INPUT */}
                    <Input
                        label="Password *"
                        placeholder="Enter your password"
                        type="password"
                        autoComplete="current-password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters long",
                            },
                        })}
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className='m-1 '>Or</div>

                {/* login with google */}
                <div className=' flex flex-col justify-center items-center'>
                    <button className='flex flex-row items-center gap-2 border border-gray-700 p-2 rounded-lg hover:bg-gray-800 cursor-pointer'>
                        <FaGoogle />
                        Login with Google
                    </button>
                    <p className='text-sm mt-2'>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;