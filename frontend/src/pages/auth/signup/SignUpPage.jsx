import React from 'react'
import { SignUp } from '@clerk/clerk-react';
import XSvg from '../../../components/svgs/X';

const SignUpPage = () => {
    return (
        <div className='flex h-screen w-screen max-w-none bg-[#030303] overflow-hidden relative justify-center items-center'>
            {/* Ambient Background Glows for Premium Aesthetic */}
            <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none' />
            <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none' />
            
            <div className='flex w-full max-w-5xl h-[85vh] max-h-[700px] border border-white/5 bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 mx-4'>
                {/* Left side: Premium X branding */}
                <div className='flex-1 hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-[#090a0f] to-[#010102] relative border-r border-white/5 overflow-hidden'>
                    <div className='absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-bl from-primary/5 via-transparent to-transparent blur-3xl pointer-events-none' />
                    <div>
                        <XSvg className='w-12 h-12 fill-white hover:scale-105 active:scale-95 transition-all duration-200' />
                    </div>
                    <div className='flex flex-col gap-4 z-10'>
                        <h1 className='text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight leading-tight'>
                            Join today
                        </h1>
                        <p className='text-lg text-slate-400 font-medium max-w-sm'>
                            Create your account to start sharing and exploring what's happening right now.
                        </p>
                    </div>
                    <div className='text-xs text-slate-500 font-medium z-10'>
                        © 2025 X-Social. All rights reserved.
                    </div>
                </div>

                {/* Right side: Clerk SignUp component */}
                <div className='flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto scrollbar-none'>
                    <div className='absolute top-4 left-6 md:hidden'>
                        <XSvg className='w-8 h-8 fill-white' />
                    </div>
                    
                    <div className='w-full max-w-md animate-fade-in py-6'>
                        <SignUp 
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-transparent border-0 shadow-none p-0 w-full",
                                    headerTitle: "text-white text-3xl font-extrabold tracking-tight",
                                    headerSubtitle: "text-slate-400 text-sm font-medium mt-1.5",
                                    socialButtonsBlockButton: "bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all duration-200 py-3",
                                    socialButtonsBlockButtonText: "text-white font-semibold text-sm",
                                    formButtonPrimary: "bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl transition-all duration-200 py-3 text-sm shadow-lg shadow-primary/20",
                                    formFieldLabel: "text-slate-300 font-semibold text-xs mb-1 px-1",
                                    formFieldInput: "bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-primary/50 transition-all duration-200 text-sm p-3.5",
                                    footerActionText: "text-slate-400 font-medium",
                                    footerActionLink: "text-primary hover:text-primary/90 hover:underline font-semibold transition-all duration-200",
                                    dividerLine: "bg-white/10",
                                    dividerText: "text-slate-500 font-semibold text-xs",
                                    identityPreviewText: "text-white font-medium",
                                    identityPreviewEditButtonIcon: "text-primary",
                                    formFieldErrorText: "text-red-500 font-medium text-xs mt-1",
                                }
                            }}
                            signInUrl="/login"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;