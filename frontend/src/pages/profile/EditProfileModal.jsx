import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../../utils/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		userName: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "", 
	});

	const queryClient = useQueryClient();

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName || "",
				userName: authUser.userName || "",
				email: authUser.email || "",
				bio: authUser.bio || "",
				link: authUser.link || "",
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	const { mutate: updateProfile, isPending } = useMutation({
		mutationFn: async (profileData) => {
			const res = await fetchWithAuth("api/users/update", {
				method: "POST",
				body: JSON.stringify(profileData),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			return data;
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
			]);
			document.getElementById("edit_profile_modal").close();
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		updateProfile(formData);
	};

	return (
		<>
			<button
				className='rounded-full btn btn-outline btn-sm hover:scale-105 active:scale-95 transition-all duration-150 border-white/20 hover:bg-white hover:text-black font-semibold'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal backdrop-blur-sm transition-all duration-300'>
				<div className='border border-white/10 rounded-2xl shadow-2xl modal-box bg-[#090a0f]/90 backdrop-blur-md max-w-lg p-6'>
					<h3 className='my-3 text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent'>Update Profile</h3>
					
					<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
						<div className='flex flex-wrap gap-3'>
							<div className='flex-1 flex flex-col gap-1'>
								<label className='text-xs text-slate-400 font-medium px-1'>Full Name</label>
								<input
									type='text'
									placeholder='Full Name'
									className='w-full p-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none text-white text-sm transition-all duration-200'
									value={formData.fullName}
									name='fullName'
									onChange={handleInputChange}
								/>
							</div>
							<div className='flex-1 flex flex-col gap-1'>
								<label className='text-xs text-slate-400 font-medium px-1'>Username</label>
								<input
									type='text'
									placeholder='Username'
									className='w-full p-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none text-white text-sm transition-all duration-200'
									value={formData.userName}
									name='userName'
									onChange={handleInputChange}
								/>
							</div>
						</div>
						
						<div className='flex flex-col gap-1'>
							<label className='text-xs text-slate-400 font-medium px-1'>Email</label>
							<input
								type='email'
								placeholder='Email'
								className='w-full p-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none text-white text-sm transition-all duration-200'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
						</div>

						<div className='flex flex-col gap-1'>
							<label className='text-xs text-slate-400 font-medium px-1'>Bio</label>
							<textarea
								placeholder='Bio'
								className='w-full p-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none text-white text-sm min-h-[80px] resize-none transition-all duration-200'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>

						<div className='flex flex-col gap-1'>
							<label className='text-xs text-slate-400 font-medium px-1'>Link</label>
							<input
								type='text'
								placeholder='Link'
								className='w-full p-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none text-white text-sm transition-all duration-200'
								value={formData.link}
								name='link'
								onChange={handleInputChange}
							/>
						</div>

						<div className='border-t border-white/10 my-1 pt-3'>
							<p className='text-xs text-slate-400 font-semibold mb-2 px-1'>Change Password (Optional)</p>
							<div className='flex flex-wrap gap-3'>
								<div className='flex-1 flex flex-col gap-1'>
									<label className='text-xs text-slate-500 px-1'>Current Password</label>
									<input
										type='password'
										placeholder='Current Password'
										className='w-full p-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none text-white text-sm transition-all duration-200'
										value={formData.currentPassword}
										name='currentPassword'
										onChange={handleInputChange}
									/>
								</div>
								<div className='flex-1 flex flex-col gap-1'>
									<label className='text-xs text-slate-500 px-1'>New Password</label>
									<input
										type='password'
										placeholder='New Password'
										className='w-full p-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 outline-none text-white text-sm transition-all duration-200'
										value={formData.newPassword}
										name='newPassword'
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>

						<button className='w-full py-3 mt-2 text-white bg-primary hover:bg-primary/95 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-primary/20'>
							{isPending ? <LoadingSpinner size='sm' /> : "Save Changes"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;
