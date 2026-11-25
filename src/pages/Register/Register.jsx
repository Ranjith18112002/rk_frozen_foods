
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   User,
//   Mail,
//   Phone,
//   LockKeyhole,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import {
//   checkAdminExists,
//   registerAdmin,
// } from "../../services/adminAuthService";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [checking, setChecking] = useState(true);
//   const [error, setError] = useState("");

//   // Check whether an admin account already exists
//   useEffect(() => {
//     const checkAdmin = async () => {
//       try {
//         const response = await checkAdminExists();

//         if (response.exists) {
//           navigate("/login", { replace: true });
//         }
//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//             "Unable to check admin account. Please try again."
//         );
//       } finally {
//         setChecking(false);
//       }
//     };

//     checkAdmin();
//   }, [navigate]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const { name, email, phone, password, confirmPassword } = formData;

//     if (!name.trim() || !email.trim() || !password || !confirmPassword) {
//       setError("Please fill all required fields");
//       return;
//     }

//     if (password.length < 8) {
//       setError("Password must contain at least 8 characters");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Password and Confirm Password do not match");
//       return;
//     }

//     try {
//       setLoading(true);

//       await registerAdmin({
//         name: name.trim(),
//         email: email.trim(),
//         phone: phone.trim(),
//         password,
//         confirmPassword,
//       });

//       navigate("/login", {
//         replace: true,
//         state: {
//           message: "Account created successfully. Please login.",
//         },
//       });
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Account creation failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (checking) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#111111]">
//         <p className="text-sm font-medium text-[#65C92E]">
//           Checking admin account...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4 py-8">
//       <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">

//         {/* Header */}
//         <div className="bg-[#111111] px-8 py-7 text-center">
//           <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
//             <img
//               src="/images/rklogo.jpeg"
//               alt="RK Enterprises Logo"
//               className="h-full w-full object-contain"
//             />
//           </div>

//           <h1 className="text-xl font-bold tracking-wide text-white">
//             RK ENTERPRISES
//           </h1>

//           <p className="mt-1 text-sm text-white/60">
//             Nourishing Lives
//           </p>

//           <span className="mt-3 inline-block rounded-md bg-[#65C92E]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#65C92E]">
//             Admin Panel
//           </span>
//         </div>

//         {/* Form */}
//         <div className="px-8 py-7">
//           <div className="mb-6 text-center">
//             <h2 className="text-2xl font-bold text-[#111111]">
//               Create Admin Account
//             </h2>

//             <p className="mt-2 text-sm text-[#111111]/60">
//               Register your first administrator account
//             </p>
//           </div>

//           {error && (
//             <div className="mb-5 rounded-lg border border-[#111111]/10 bg-[#111111]/5 px-4 py-3 text-sm text-[#111111]">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">

//             {/* Name */}
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-[#111111]">
//                 Full Name <span className="text-[#347F19]">*</span>
//               </label>

//               <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
//                 <User className="ml-4 shrink-0 text-[#111111]/50" size={18} />

//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   autoComplete="name"
//                   className="w-full rounded-lg bg-transparent px-3 py-3 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-[#111111]">
//                 Email Address <span className="text-[#347F19]">*</span>
//               </label>

//               <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
//                 <Mail className="ml-4 shrink-0 text-[#111111]/50" size={18} />

//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   autoComplete="email"
//                   className="w-full rounded-lg bg-transparent px-3 py-3 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-[#111111]">
//                 Phone Number
//               </label>

//               <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
//                 <Phone className="ml-4 shrink-0 text-[#111111]/50" size={18} />

//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="Enter your phone number"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   autoComplete="tel"
//                   className="w-full rounded-lg bg-transparent px-3 py-3 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-[#111111]">
//                 Password <span className="text-[#347F19]">*</span>
//               </label>

//               <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
//                 <LockKeyhole className="ml-4 shrink-0 text-[#111111]/50" size={18} />

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Minimum 8 characters"
//                   value={formData.password}
//                   onChange={handleChange}
//                   autoComplete="new-password"
//                   className="w-full min-w-0 rounded-lg bg-transparent px-3 py-3 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="mr-4 text-[#111111]/50 hover:text-[#65C92E]"
//                   aria-label="Toggle password visibility"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-[#111111]">
//                 Confirm Password <span className="text-[#347F19]">*</span>
//               </label>

//               <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
//                 <LockKeyhole className="ml-4 shrink-0 text-[#111111]/50" size={18} />

//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   placeholder="Re-enter your password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   autoComplete="new-password"
//                   className="w-full min-w-0 rounded-lg bg-transparent px-3 py-3 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowConfirmPassword(!showConfirmPassword)
//                   }
//                   className="mr-4 text-[#111111]/50 hover:text-[#65C92E]"
//                   aria-label="Toggle confirm password visibility"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff size={18} />
//                   ) : (
//                     <Eye size={18} />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-3 flex w-full items-center justify-center rounded-lg bg-[#65C92E] px-4 py-3.5 text-sm font-bold text-[#111111] transition-all duration-200 hover:bg-[#65C92E]/90 hover:shadow-lg hover:shadow-[#65C92E]/20 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? "Creating Account..." : "Create Account"}
//             </button>

//           </form>

//           {/* Login Link */}
//           <div className="mt-6 border-t border-[#111111]/10 pt-5 text-center">
//             <p className="text-sm text-[#111111]/60">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="font-bold text-[#347F19] transition hover:text-[#65C92E]"
//               >
//                 Sign In
//               </Link>
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
