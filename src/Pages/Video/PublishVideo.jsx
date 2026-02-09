import React from 'react'
import Input from '../../Components/Input'
import { useForm } from 'react-hook-form'
import useAxios from '../../Utils/useAxios';

function PublishVideo() {

  const { register, handleSubmit, } = useForm();
const { sendRequest, loading } = useAxios();

  const onSubmit = (formData) => {
      const submitData = new FormData();

    console.log("Form Data :", formData);
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);

    if (formData.videoFile && formData.videoFile.length > 0) {
      submitData.append("videoFile", formData.videoFile[0]);
    }

    if (formData.thumbnail && formData.thumbnail.length > 0) {
      submitData.append("thumbnail", formData.thumbnail[0]);
    }

    publishVideo(submitData)
    
  };
// API call to publish video  
  const publishVideo = async(submitData)=> {
    try {
      const response = await sendRequest({
        method:"post",
        url:"/videos",
        body: submitData,
      })
      console.log(response);
    } catch (error) {
      console.log("Error in publish video",error)
    }
  }



  return (
    <div className='min-h-screen w-full py-16'>
      <div className='w-[70%] h-auto mx-[15%] py-30'>
        <div className=' text-white w-full flex flex-col items-center p-10 rounded-lg border border-gray-700 gap-2'>
          <h1 className='text-4xl font-bold'>Publish Your Video</h1>
          <h4 className=''>For uploading your video fill the details below</h4>
          {/* //drag and drop , and select option for video */}
          <form onSubmit={handleSubmit(onSubmit)} className='mt-10 flex flex-col w-full gap-4 items-center'>

            <Input
              label="Select the video file :"
              className="h-15 cursor-pointer hover:scale-105"
              type="file"
              accept="video/*"
              {...register("videoFile", { required: "Video is required" })}
            />

            <Input
              label="Select the thumbnail for video :"
              className="h-15 cursor-pointer hover:scale-105"
              type="file"
              accept="image/*"
              {...register("thumbnail", { required: "Thumbnail is required" })}
            />

            <Input
              label="Title :"
              placeholder="Enter the title for video"
              className="h-15 hover:scale-105"
              type="text"
              autoComplete="title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 4,
                  message: "Title must be at least 4 characters long",
                },
              })}
            />

            <Input
              label="Description :"
              className="h-30 hover:scale-105"
              placeholder="Enter the description for video"
              type="textarea"
              autoComplete="description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 4,
                  message: "Description must be at least 4 characters long",
                },
              })}
            />

           <button
  type="submit"
  disabled={loading}
  className="w-[50%] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
>
  {loading ? "Uploading..." : "Upload Video"}
</button>


          </form>

        </div>
      </div>
    </div>
  )
}

export default PublishVideo