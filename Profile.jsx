import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({});

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {

        try {

            const response = await fetch(
                "http://localhost:4000/profile",
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            setProfile(data.Profile);

        }
        catch (err) {
            console.log(err);
        }
    };

    const handleLogout = async () => {

        try {

            await fetch(
                "http://localhost:4000/logout",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            navigate("/");

        }
        catch (err) {

            console.log(err);

        }
    };

    return (

        <div className="profile-page">

            <div className="profile-nav">

                <button
                    onClick={() => navigate("/dashboard")}
                >
                    🏠 Dashboard
                </button>

                <button
                    onClick={() => navigate("/leads")}
                >
                    📋 Leads
                </button>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </div>

            <div className="profile-card">

                <div className="avatar">

                    {profile?.name?.charAt(0).toUpperCase()}

                </div>

                <h1>{profile?.name}</h1>

                <p className="email">
                    {profile?.email}
                </p>

                <div className="profile-info">

                    <div className="info-box">

                        <h3>Total Leads</h3>

                        <p>
                            {profile?.totalLeads}
                        </p>

                    </div>

                    <div className="info-box">

                        <h3>Joined On</h3>

                        <p>
                            {
                                profile?.createdAt
                                    ?
                                    new Date(
                                        profile.createdAt
                                    ).toLocaleDateString()
                                    :
                                    "N/A"
                            }
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default Profile;