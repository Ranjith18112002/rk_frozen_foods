
// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
// import { loginAdmin } from "../../services/adminAuthService";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const successMessage = location.state?.message;

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!formData.email.trim() || !formData.password) {
//       setError("Please enter your email and password");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await loginAdmin({
//         email: formData.email.trim(),
//         password: formData.password,
//       });

//       const { token, data } = response;

//       if (!token) {
//         throw new Error("Login token was not received");
//       }

//       localStorage.setItem("adminToken", token);

//       if (data) {
//         localStorage.setItem("adminProfile", JSON.stringify(data));
//       }

//       navigate("/", { replace: true });
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Login failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4 py-8">
//       <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">

      

//         {/* Login Form */}
//         <div className="px-8 py-8">
//           <div className="mb-7 text-center">
//             <h2 className="text-2xl font-bold text-[#111111]">
//               Welcome Back!
//             </h2>

//             <p className="mt-2 text-sm text-[#111111]/60">
//               Sign in to your admin account
//             </p>
//           </div>

//           {successMessage && (
//             <div className="mb-5 rounded-lg border border-[#65C92E]/30 bg-[#65C92E]/10 px-4 py-3 text-sm text-[#347F19]">
//               {successMessage}
//             </div>
//           )}

//           {error && (
//             <div className="mb-5 rounded-lg border border-[#111111]/10 bg-[#111111]/5 px-4 py-3 text-sm text-[#111111]">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-[#111111]">
//                 Email Address
//               </label>

//               <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
//                 <Mail className="ml-4 shrink-0 text-[#111111]/50" size={19} />

//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   autoComplete="username"
//                   className="w-full rounded-lg bg-transparent px-3 py-3.5 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-[#111111]">
//                 Password
//               </label>

//               <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
//                 <LockKeyhole className="ml-4 shrink-0 text-[#111111]/50" size={19} />

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   autoComplete="current-password"
//                   className="w-full min-w-0 rounded-lg bg-transparent px-3 py-3.5 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="mr-4 text-[#111111]/50 transition hover:text-[#65C92E]"
//                   aria-label="Toggle password visibility"
//                 >
//                   {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="flex w-full items-center justify-center rounded-lg bg-[#65C92E] px-4 py-3.5 text-sm font-bold text-[#111111] transition-all duration-200 hover:bg-[#65C92E]/90 hover:shadow-lg hover:shadow-[#65C92E]/20 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? "Signing In..." : "Sign In"}
//             </button>
//           </form>

//           {/* <div className="mt-7 border-t border-[#111111]/10 pt-6 text-center">
//             <p className="text-sm text-[#111111]/60">
//               First time here?{" "}
//               <Link
//                 to="/register"
//                 className="font-bold text-[#347F19] transition hover:text-[#65C92E]"
//               >
//                 Create Account
//               </Link>
//             </p>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { ADMIN_CREDENTIALS } from "../../config/adminCredentials";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);

    const enteredEmail = formData.email;
    const enteredPassword = formData.password;

    const correctEmail = ADMIN_CREDENTIALS.email;
    const correctPassword = ADMIN_CREDENTIALS.password;

    // Exact case-sensitive comparison
    if (
      enteredEmail === correctEmail &&
      enteredPassword === correctPassword
    ) {
      localStorage.setItem("adminToken", "frontend-demo-session");

      localStorage.setItem(
        "adminProfile",
        JSON.stringify({
          name: "Super Administrator",
          email: correctEmail,
          role: "Super Administrator",
        })
      );

      navigate("/", { replace: true });
    } else {
      setError("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
        <div className="px-8 py-8">
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-bold text-[#111111]">
              Welcome Back!
            </h2>

            <p className="mt-2 text-sm text-[#111111]/60">
              Sign in to your admin account
            </p>
          </div>

          {successMessage && (
            <div className="mb-5 rounded-lg border border-[#65C92E]/30 bg-[#65C92E]/10 px-4 py-3 text-sm text-[#347F19]">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-[#111111]/10 bg-[#111111]/5 px-4 py-3 text-sm text-[#111111]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111111]">
                Email Address
              </label>

              <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
                <Mail className="ml-4 shrink-0 text-[#111111]/50" size={19} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  className="w-full rounded-lg bg-transparent px-3 py-3.5 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111111]">
                Password
              </label>

              <div className="flex items-center rounded-lg border border-[#111111]/15 transition focus-within:border-[#65C92E] focus-within:ring-2 focus-within:ring-[#65C92E]/15">
                <LockKeyhole className="ml-4 shrink-0 text-[#111111]/50" size={19} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full min-w-0 rounded-lg bg-transparent px-3 py-3.5 text-sm text-[#111111] outline-none placeholder:text-[#111111]/40"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-4 text-[#111111]/50 transition hover:text-[#65C92E]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[#65C92E] px-4 py-3.5 text-sm font-bold text-[#111111] transition-all duration-200 hover:bg-[#65C92E]/90 hover:shadow-lg hover:shadow-[#65C92E]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
