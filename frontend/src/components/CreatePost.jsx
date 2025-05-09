import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Image, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const createPostHandler = async () => {
    if (!imagePreview) {
      toast.error("Please select an image for your post");
      return;
    }
    
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);
    
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/post/addpost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        resetForm();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  }
  
  const resetForm = () => {
    setFile("");
    setCaption("");
    setImagePreview("");
  }
  
  const removeImage = () => {
    setFile("");
    setImagePreview("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto p-0" 
        onInteractOutside={() => setOpen(false)}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <DialogHeader className="px-4 py-3 flex flex-row items-center justify-between">
            <div className="w-10"></div>
            <DialogTitle className="text-center text-base font-semibold">Create New Post</DialogTitle>
            <Button 
              onClick={createPostHandler} 
              variant="ghost" 
              className="w-10 p-0 h-auto text-blue-500 hover:text-blue-700 font-semibold disabled:opacity-50"
              disabled={!imagePreview || loading}
            >
              {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Post'}
            </Button>
          </DialogHeader>
        </div>

        <div className="flex flex-col gap-4 p-4">
          {/* User info */}
          <div className='flex items-center gap-3'>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-sm'>{user?.username}</h1>
              <span className='text-gray-500 text-xs'>{user?.bio || 'Bio here...'}</span>
            </div>
          </div>
          
          {/* Caption input */}
          <Textarea 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            className="focus-visible:ring-0 border-none resize-none h-24" 
            placeholder="Write a caption..." 
          />

          {/* Image preview or placeholder */}
          {imagePreview ? (
            <div className='relative w-full aspect-square rounded-md overflow-hidden bg-gray-100 border border-gray-200'>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className='w-full h-full object-cover' 
              />
              <button 
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => imageRef.current.click()}
              className="w-full aspect-square flex flex-col items-center justify-center gap-3 bg-gray-50 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition"
            >
              <Image className="w-12 h-12 text-gray-400" />
              <p className="text-gray-500 text-sm font-medium">Click to upload a photo</p>
            </div>
          )}
          
          {/* Hidden file input */}
          <input 
            ref={imageRef} 
            type='file' 
            accept="image/*"
            className='hidden' 
            onChange={fileChangeHandler} 
          />
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button 
              onClick={() => imageRef.current.click()} 
              variant="secondary"
              className='w-full'
            >
              {imagePreview ? 'Change Photo' : 'Select from computer'}
            </Button>
            
            {imagePreview && (
              <Button
                onClick={createPostHandler}
                disabled={loading}
                className="w-full bg-[#0095F6] hover:bg-[#1a86ca]"
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating post...
                  </>
                ) : 'Share Post'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost