import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Home.css";

const Home = () => {
    const [isLogin, setIsLogin] = useState(true);

    const navigate = useNavigate();
    // Signup states
    const [Uname, setUname] = useState("");
    const [Uemail, setUemail] = useState("");
    const [Upass, setUpass] = useState("");

    // Login states
    const [Uemail1, setUemail1] = useState("");
    const [Upass1, setUpass1] = useState("");

    // Signup Handler
    const handlesignup = async (e) => {
        e.preventDefault();

        try {
            const resp = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    Uname,
                    Uemail,
                    Upass
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                alert(data.message || data.Error || "Registration failed");
                return;
            }

            alert(data.message || "Registration successful!");

            navigate("/dashboard");

            setUname("");
            setUemail("");
            setUpass("");

            setIsLogin(true);

        } catch (err) {
            console.error("Signup Error:", err);
            alert("Unable to connect to server");
        }
    };

    // Login Handler
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const resp = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    Uemail1,
                    Upass1
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                alert(data.Error || data.message || "Login failed");
                return;
            }

            alert(data.Success || "Login successful!");

            navigate("/dashboard");

            setUemail1("");
            setUpass1("");

            console.log("User Logged In");

            // navigate("/dashboard");

        } catch (err) {
            console.error("Login Error:", err);
            alert("Unable to connect to server");
        }
    };

    return (
        <div className="container">
            
            <div className="left-section">

                <h1 className="logo">
                    Lead Manager
                </h1>

                <div className="content">

                    <h1>
                        Effortlessly Manage Your Leads And Sales Pipeline
                    </h1>

                    <p>
                        Track leads, manage customer interactions,
                        update statuses and grow your business
                        from one dashboard.
                    </p>

                    <div className="features">
                        <div>✅ Add New Leads</div>
                        <div>✅ Search & Filter Leads</div>
                        <div>✅ Update Lead Status</div>
                        <div>✅ Dashboard Analytics</div>
                        <div>✅ Authentication & Security</div>
                    </div>

                </div>

            </div>

            <div className="right-section">

                <div className="form-card">

                    {isLogin ? (

                        <>
                            <h2>Welcome Back 👋</h2>

                            <p>
                                Login to access your CRM dashboard
                            </p>

                            <form onSubmit={handleLogin}>

                                <div className="input-group">
                                    <label>Email</label>

                                    <input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        value={Uemail1}
                                        onChange={(e) =>
                                            setUemail1(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Password</label>

                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        value={Upass1}
                                        onChange={(e) =>
                                            setUpass1(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                >
                                    Login
                                </button>

                            </form>

                            <p className="switch-text">
                                Don't have an account?

                                <span
                                    onClick={() => setIsLogin(false)}
                                >
                                    Sign Up
                                </span>
                            </p>
                        </>

                    ) : (

                        <>
                            <h2>Create Account 🚀</h2>

                            <p>
                                Register to start managing leads
                            </p>

                            <form onSubmit={handlesignup}>

                                <div className="input-group">
                                    <label>Name</label>

                                    <input
                                        type="text"
                                        placeholder="Enter Name"
                                        value={Uname}
                                        onChange={(e) =>
                                            setUname(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Email</label>

                                    <input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        value={Uemail}
                                        onChange={(e) =>
                                            setUemail(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Password</label>

                                    <input
                                        type="password"
                                        placeholder="Create Password"
                                        value={Upass}
                                        onChange={(e) =>
                                            setUpass(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                >
                                    Sign Up
                                </button>

                            </form>

                            <p className="switch-text">
                                Already have an account?

                                <span
                                    onClick={() => setIsLogin(true)}
                                >
                                    Login
                                </span>
                            </p>
                        </>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Home;
