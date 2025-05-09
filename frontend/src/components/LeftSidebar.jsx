import {
	Heart,
	Home,
	LogOut,
	MessageCircle,
	PlusSquare,
	Search,
	TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);
	const { likeNotification } = useSelector(
		(store) => store.realTimeNotification,
	);
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);

	const logoutHandler = async () => {
		try {
			const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/logout`, { 
				withCredentials: true,
			});
			if (res.data.success) {
				dispatch(setAuthUser(null));
				dispatch(setSelectedPost(null));
				dispatch(setPosts([]));
				navigate("/login");
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	const sidebarHandler = (textType) => {
		if (textType === "Logout") {
			logoutHandler();
		} else if (textType === "Create") {
			setOpen(true);
		} else if (textType === "Profile") {
			navigate(`/profile/${user?._id}`);
		} else if (textType === "Home") {
			navigate("/");
		} else if (textType === "Messages") {
			navigate("/chat");
		}
	};

	const sidebarItems = [
		{ icon: <Home />, text: "Home" },
		{ icon: <Search />, text: "Search" },
		{ icon: <TrendingUp />, text: "Explore" },
		{ icon: <MessageCircle />, text: "Messages" },
		{ icon: <Heart />, text: "Notifications" },
		{ icon: <PlusSquare />, text: "Create" },
		{
			icon: (
				<Avatar className="w-6 h-6">
					<AvatarImage src={user?.profilePicture} alt="Profile" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			),
			text: "Profile",
		},
		{ icon: <LogOut />, text: "Logout" },
	];

    return (
        // Sidebar hidden on small screens; fixed on desktop with ample width
        <div className="hidden md:flex fixed top-0 left-0 z-10 p-4 border-r border-gray-300 w-64 h-screen bg-white">
            <div className="flex flex-col w-full">
                <img src=""/>
                <div className="mb-6 flex justify-center">
                    <img src="/logo.png" alt="Instakilo Logo" className="w-32 h-auto" />
                </div>
                <div className="flex flex-col gap-2">
                    {sidebarItems.map((item, index) => (
                        <div
                            onClick={() => sidebarHandler(item.text)}
                            key={index}
                            className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 transition-colors">
                            {item.icon}
                            <span className="text-sm font-medium">{item.text}</span>
                            {item.text === "Notifications" && likeNotification.length > 0 && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="rounded-full h-5 w-5 bg-red-600 text-white absolute -top-1 -right-1">
                                            {likeNotification.length}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="p-2">
                                            {likeNotification.length === 0 ? (
                                                <p className="text-sm text-gray-500">
                                                    No new notifications
                                                </p>
                                            ) : (
                                                likeNotification.map((notification) => (
                                                    <div
                                                        key={notification.userId}
                                                        className="flex items-center gap-2 my-2">
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarImage
                                                                src={notification.userDetails?.profilePicture}
                                                            />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-sm">
                                                            <span className="font-bold">
                                                                {notification.userDetails?.username}
                                                            </span>{" "}
                                                            liked your post
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;
