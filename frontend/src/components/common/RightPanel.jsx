import React from 'react';
import RightPanelSkeleton from '../skeletons/RightPanelSkeleton';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from '../../utils/api';
import useFollow from '../../hooks/useFollow';
import LoadingSpinner from '../common/LoadingSpinner';


const RightPanel = () => {
    const { data: suggestedUsers, isLoading } = useQuery({
        queryKey: ["suggestedUsers"],
        queryFn: async () => {
            const res = await fetchWithAuth("api/users/suggested", {
                method: "GET"
            })
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        }
    })

    const { follow, isPending } = useFollow();

    if (suggestedUsers?.length === 0) {
        return (
            <div className="w-0 md:w-64"></div>
        )
    }

    return (
        <div className='hidden lg:block w-[350px] flex-shrink-0 mx-6 my-4'>
            <div className='bg-[#0c0d12]/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 sticky top-4 shadow-xl shadow-black/40'>
                <p className='font-bold text-lg mb-3'>Who to follow</p>
                <div className='flex flex-col gap-4'>
                    {
                        isLoading && (
                            <>
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                            </>
                        )
                    }
                    {
                        !isLoading &&
                        suggestedUsers?.map((user) =>
                            <Link to={`/profile/${user.userName}`} className='flex items-center justify-between gap-4' key={user._id}>
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img src={user.profileImg || "/avatar-placeholder.png"} alt="" />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold tracking-tight truncate w-28'>{user.fullName}</span>
                                        <span className='text-sm text-slate-500'>@{user.userName}</span>
                                    </div>
                                </div>
                                <div>
                                    <button className='text-black bg-white rounded-full btn hover:bg-white hover:opacity-90 btn-sm ' onClick={(e) => {
                                        e.preventDefault()
                                        follow(user._id)
                                    }}>
                                        {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                                    </button>
                                </div>
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default RightPanel