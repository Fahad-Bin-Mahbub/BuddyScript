"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await login(email, password);
			router.push("/feed");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-scroll bg-bg1">
			{/* Background Shapes */}
			<div className="absolute top-0 left-0 z-0">
				<Image
					src="/images/shape1.svg"
					alt=""
					width={100}
					height={100}
					className="w-[150]"
					priority
				/>
			</div>
			<div className="absolute top-0 right-5 z-0">
				<Image
					src="/images/shape2.svg"
					alt=""
					width={200}
					height={200}
					className="w-[450]"
				/>
			</div>
			<div className="absolute bottom-[-100] right-[-257] -translate-x-1/2 z-0">
				<Image src="/images/shape3.svg" alt="" width={200} height={200} className="w-[500]" />
			</div>

			<div className="container mx-auto px-8 lg:px-0 relative z-10">
				<div className="flex justify-between items-center flex-col lg:flex-row">
					{/* Left - Image */}
					<div className="w-full lg:w-8/12 mb-8 mt-10 lg:mt-20 lg:mb-0">
						<div className="flex max-w-158">
							<Image
								src="/images/login.png"
								alt="Login illustration"
								width={600}
								height={500}
								className="w-full h-auto"
								priority
							/>
						</div>
					</div>

					{/* Right - Form */}
					<div className="w-full lg:max-w-108 lg:w-4/12 lg:mt-26">
						<div className="bg-bg2 rounded-md p-7 lg:p-12">
							{/* Logo */}
							<div className="flex flex-col items-center">
								<div className="mb-7">
									<Image
										src="/images/logo.svg"
										alt="Buddy Script"
										width={180}
										height={40}
										className="w-38.75 h-auto"
									/>
								</div>

								<div className="text-dark2 text-md font-normal mb-2">
									Welcome back
								</div>
								<h4 className="text-dark2 text-3xl font-medium leading-normal mb-12.5">
									Login to your account
								</h4>
							</div>
							{/* Google Button */}
							<button
								type="button"
								className="w-full flex items-center justify-center gap-2 border border-border1 rounded-md py-3 px-4 mb-10 bg-transparent hover:shadow-sm transition-shadow text-[14px] text-dark4 font-normal"
							>
								<Image
									src="/images/google.svg"
									alt="Google"
									width={20}
									height={20}
									className="w-5 h-5"
								/>
								<span className="text-md font-semibold">
									Or sign-in with google
								</span>
							</button>

							{/* Or Divider */}
							<div className="relative text-center mb-10">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-light"></div>
								</div>
								<span className="relative bg-bg2 px-4 text-[14px] text-gray-light">
									Or
								</span>
							</div>

							{/* Error Message */}
							{error && (
								<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-[13px]">
									{error}
								</div>
							)}

							{/* Form */}
							<form onSubmit={handleSubmit}>
								<div className="mb-3.5">
									<label className="block text-md font-medium text-dark2 mb-2">
										Email
									</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full h-11.5 px-4 border border-border1 rounded-md text-[14px] bg-bg2 focus:border-primary transition-colors"
										required
										autoComplete="email"
									/>
								</div>

								<div className="mb-3.5">
									<label className="block text-md font-medium text-dark2 mb-2">
										Password
									</label>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full h-11.5 px-4 border border-border1 rounded-md text-[14px] bg-bg2 focus:border-primary transition-colors"
										required
										autoComplete="current-password"
									/>
								</div>

								<div className="flex items-center justify-between mb-0">
									<div className="flex items-center gap-2">
										<input
											type="radio"
											id="rememberMe"
											className="w-4 h-4 accent-primary"
										/>
										<label htmlFor="rememberMe" className="text-sm font-medium">
											Remember me
										</label>
									</div>
									<div className="text-sm text-primary font-medium cursor-pointer">
										Forgot password?
									</div>
								</div>

								<div className="mt-10 mb-15">
									<button
										type="submit"
										disabled={isLoading}
										className="w-full py-3 bg-primary text-white rounded-md font-medium text-[16px] border-0 hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
									>
										{isLoading ? (
											<span className="flex items-center justify-center gap-2">
												<svg
													className="animate-spin h-5 w-5"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
														fill="none"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
													/>
												</svg>
												Logging in...
											</span>
										) : (
											"Login now"
										)}
									</button>
								</div>
							</form>

							<div className="text-center">
								<div className="flex gap-2 text-sm text-gray">
									<div>Don't have an account?</div>
									<Link
										href="/register"
										className="text-primary hover:underline"
									>
										Create New Account
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
