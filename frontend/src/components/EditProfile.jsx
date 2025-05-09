import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if(input.profilePhoto && input.profilePhoto instanceof File) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/profile/edit`, formData, { 
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            if(res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {/* Back link and title */}
            <div className="flex items-center gap-4 mb-6">
                <Link to={`/profile/${user?._id}`} className="text-gray-500 hover:text-black">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="font-bold text-xl md:text-2xl">Edit Profile</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                {/* Profile photo section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-gray-50 rounded-xl p-4 md:p-6 mb-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={
                            input.profilePhoto instanceof File 
                                ? URL.createObjectURL(input.profilePhoto) 
                                : user?.profilePicture
                        } alt={user?.username} />
                        <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col items-center sm:items-start gap-3">
                        <div className="text-center sm:text-left">
                            <h2 className="font-bold text-base">{user?.username}</h2>
                            <span className="text-gray-600 text-sm">{user?.email}</span>
                        </div>
                        
                        <input 
                            ref={imageRef} 
                            onChange={fileChangeHandler} 
                            type='file' 
                            accept="image/*"
                            className='hidden' 
                        />
                        <Button 
                            onClick={() => imageRef?.current.click()} 
                            variant="outline"
                            className="flex items-center gap-2 h-9 text-sm"
                        >
                            <Upload size={16} />
                            Change profile photo
                        </Button>
                    </div>
                </div>
                
                {/* Bio section */}
                <div className="mb-6">
                    <label className="block font-medium text-sm mb-2" htmlFor="bio">Bio</label>
                    <Textarea 
                        id="bio"
                        value={input.bio || ''} 
                        onChange={(e) => setInput({ ...input, bio: e.target.value })} 
                        placeholder="Write something about yourself..."
                        className="resize-none min-h-[100px] focus-visible:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Bio appears on your profile page and helps people learn more about you.
                    </p>
                </div>
                
                {/* Gender section */}
                <div className="mb-6">
                    <label className="block font-medium text-sm mb-2" htmlFor="gender">Gender</label>
                    <Select 
                        defaultValue={input.gender || ''} 
                        onValueChange={selectChangeHandler}
                    >
                        <SelectTrigger id="gender" className="w-full">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        This won't be part of your public profile.
                    </p>
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-between gap-4 mt-8">
                    <Link to={`/profile/${user?._id}`}>
                        <Button variant="outline" className="w-full">Cancel</Button>
                    </Link>
                    <Button 
                        onClick={editProfileHandler} 
                        disabled={loading}
                        className="w-full bg-[#0095F6] hover:bg-[#1a86ca] text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile