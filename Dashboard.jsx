import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalLeads: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        lost: 0
    });

    const [profile, setProfile] = useState({});

    useEffect(() => {

        getDashboard();
        getProfile();

    }, []);

    const getDashboard = async () => {

        try {

            const response = await fetch(
                "http://localhost:4000/dashboard",
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            setStats(data);

        }
        catch (err) {
            console.log(err);
        }
    };

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

    const conversionRate =
        stats.totalLeads > 0
            ? (
                (stats.qualified / stats.totalLeads) * 100
            ).toFixed(1)
            : 0;

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
        <div className="dashboard">
            <div className="profile-card">

                <div className="avatar">
                    {profile?.name?.charAt(0).toUpperCase()}
                </div>

                <h3>{profile?.name}</h3>

                <p>{profile?.email}</p>

                <p>
                    Total Leads:
                    <strong> {profile?.totalLeads}</strong>
                </p>

            </div>
            <div className="dashboard-header">

                <div>
                    <h1>
                        Welcome Back 👋
                    </h1>

                    <p>
                        Manage your leads and monitor your sales pipeline.
                    </p>
                </div>

            </div>

            <div className="stats-container">

                <div className="card total">
                    <h3>Total Leads</h3>
                    <h1>{stats.totalLeads}</h1>
                </div>

                <div className="card new">
                    <h3>New</h3>
                    <h1>{stats.new}</h1>
                </div>

                <div className="card contacted">
                    <h3>Contacted</h3>
                    <h1>{stats.contacted}</h1>
                </div>

                <div className="card qualified">
                    <h3>Qualified</h3>
                    <h1>{stats.qualified}</h1>
                </div>

                <div className="card lost">
                    <h3>Lost</h3>
                    <h1>{stats.lost}</h1>
                </div>

            </div>

            <div className="dashboard-grid">

                <div className="profile-card">

                    <h2>User Profile</h2>

                    <h3>{profile?.name}</h3>

                    <p>{profile?.email}</p>

                    <p>
                        Total Leads :
                        <strong>
                            {" "}
                            {profile?.totalLeads}
                        </strong>
                    </p>

                </div>

                <div className="conversion-card">

                    <h2>Lead Conversion Rate</h2>

                    <div className="conversion-circle">
                        {conversionRate}%
                    </div>

                    <p>
                        Qualified Leads / Total Leads
                    </p>

                </div>

            </div>

            <div className="quick-actions">

                <h2>Quick Actions</h2>

                <div className="actions">

                    <button onClick={() => navigate("/leads")}>
                        + Add Lead
                    </button>

                    <button onClick={() => navigate("/leads")}>
                        View Leads
                    </button>

                    <button onClick={() => navigate("/profile")}>
                        Profile
                    </button>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;