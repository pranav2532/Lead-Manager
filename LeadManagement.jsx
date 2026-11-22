import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./LeadManagement.css";

const API = "http://localhost:4000";

const initialForm = {
    Lname: "",
    Lemail: "",
    Lphone: "",
    Lcomp: "",
    Lsrc: "",
    Lstatus: "New"
};

const LeadManagement = () => {

    const navigate = useNavigate();

    // Lead data
    const [leads, setLeads] = useState([]);

    // Filters
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [source, setSource] = useState("");
    const [sort, setSort] = useState("newest");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);

    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    // Form
    const [form, setForm] = useState(initialForm);

    // Common API response handler
    const readResponse = async (response) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.Error || data.message || "Request failed");
        }

        return data;
    };

    // 1. GET ALL LEADS WITH SEARCH, FILTER, SORT AND PAGINATION
    const getLeads = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(`${API}/filter`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    search,
                    status,
                    source,
                    sort,
                    page,
                    limit: 5
                })
            });

            const data = await readResponse(response);

            setLeads(data.leads || []);
            setTotalPages(data.totalPages || 1);
            setTotalLeads(data.totalLeads || 0);

        } catch (err) {

            console.error("Get Leads Error:", err);
            setError(err.message);
            setLeads([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLeads();
    }, [search, status, source, sort, page]);

    // 2. FORM INPUT HANDLER
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 3. OPEN ADD LEAD MODAL
    const openAddModal = () => {

        setIsEditing(false);
        setSelectedLead(null);
        setForm(initialForm);
        setShowModal(true);
    };

    // 4. CREATE NEW LEAD
    const handleCreate = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(`${API}/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await readResponse(response);

            alert(data.Success || "Lead Created Successfully");

            setShowModal(false);
            setForm(initialForm);
            setPage(1);

            await getLeads();

        } catch (err) {

            console.error("Create Lead Error:", err);
            alert(err.message);
        }
    };

    // 5. GET SINGLE LEAD FOR EDITING
    const handleEdit = async (id) => {

        try {

            const response = await fetch(
                `${API}/singlelead/${id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await readResponse(response);

            const lead = data.Success;

            if (!lead) {
                throw new Error("Lead not found");
            }

            setForm({
                Lname: lead.Name || "",
                Lemail: lead.Email || "",
                Lphone: lead.Phone || "",
                Lcomp: lead.Company || "",
                Lsrc: lead.Source || "",
                Lstatus: lead.Status || "New"
            });

            setSelectedLead(id);
            setIsEditing(true);
            setShowModal(true);

        } catch (err) {

            console.error("Get Single Lead Error:", err);
            alert(err.message);
        }
    };

    // 6. UPDATE LEAD
    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(`${API}/update`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...form,
                    Lid: selectedLead
                })
            });

            const data = await readResponse(response);

            alert(data.Success || data.success || "Lead Updated Successfully");

            setShowModal(false);
            setForm(initialForm);
            setSelectedLead(null);
            setIsEditing(false);

            await getLeads();

        } catch (err) {

            console.error("Update Lead Error:", err);
            alert(err.message);
        }
    };

    // 7. UPDATE LEAD STATUS
    const handleStatusUpdate = async (id, newStatus) => {

        try {

            const response = await fetch(`${API}/statusupdate`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Lid: id,
                    Lstatus: newStatus
                })
            });

            const data = await readResponse(response);

            alert(data.Success || "Status Updated Successfully");

            await getLeads();

        } catch (err) {

            console.error("Status Update Error:", err);
            alert(err.message);
        }
    };

    // 8. DELETE LEAD
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this lead?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(`${API}/leaddelete`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Lid: id
                })
            });

            const data = await readResponse(response);

            alert(data.Success || "Lead Deleted Successfully");

            // If last item on current page was deleted
            if (leads.length === 1 && page > 1) {
                setPage(prev => prev - 1);
            } else {
                await getLeads();
            }

        } catch (err) {

            console.error("Delete Lead Error:", err);
            alert(err.message);
        }
    };

    // 9. RESET FILTERS
    const resetFilters = () => {

        setSearch("");
        setStatus("");
        setSource("");
        setSort("newest");
        setPage(1);
    };

    return (

        <div className="lead-page">

            {/* HEADER */}

            <div className="lead-header">

                <div>
                    <h1>Lead Management</h1>
                    <p>Manage and track your sales pipeline</p>
                </div>

                <div className="header-actions">

                    <button
                        className="home-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        🏠 Dashboard
                    </button>

                    <button
                        className="add-btn"
                        onClick={openAddModal}
                    >
                        + Add Lead
                    </button>

                </div>

            </div>


            {/* STATISTICS */}

            <div className="lead-stats">

                <div className="stat-card">
                    <h3>Total Leads</h3>
                    <h2>{totalLeads}</h2>
                </div>

            </div>

            {/* FILTERS */}

            <div className="filters">

                <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                >

                    <option value="">All Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>

                </select>

                <input
                    type="text"
                    placeholder="Filter by source"
                    value={source}
                    onChange={(e) => {
                        setSource(e.target.value);
                        setPage(1);
                    }}
                />

                <select
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                    }}
                >

                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">Name A-Z</option>
                    <option value="za">Name Z-A</option>

                </select>

                <button
                    className="reset-btn"
                    onClick={resetFilters}
                >
                    Reset
                </button>

            </div>

            {/* TABLE */}

            <div className="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Source</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td colSpan="7">Loading leads...</td>
                            </tr>

                        ) : error ? (

                            <tr>
                                <td colSpan="7">{error}</td>
                            </tr>

                        ) : leads.length === 0 ? (

                            <tr>
                                <td colSpan="7">No leads found</td>
                            </tr>

                        ) : (

                            leads.map((lead) => (

                                <tr key={lead._id}>

                                    <td>{lead.Name}</td>
                                    <td>{lead.Email}</td>
                                    <td>{lead.Phone}</td>
                                    <td>{lead.Company}</td>
                                    <td>{lead.Source}</td>

                                    <td>

                                        <select
                                            className={`status-select ${lead.Status}`}
                                            value={lead.Status}
                                            onChange={(e) =>
                                                handleStatusUpdate(
                                                    lead._id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Qualified">Qualified</option>
                                            <option value="Lost">Lost</option>

                                        </select>

                                    </td>

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(lead._id)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(lead._id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}

            <div className="pagination">

                <button
                    disabled={page <= 1 || loading}
                    onClick={() => setPage(prev => prev - 1)}
                >
                    Prev
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage(prev => prev + 1)}
                >
                    Next
                </button>

            </div>

            {/* ADD / EDIT MODAL */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="lead-modal">

                        <h2>
                            {isEditing ? "Edit Lead" : "Add New Lead"}
                        </h2>

                        <form
                            onSubmit={
                                isEditing ? handleUpdate : handleCreate
                            }
                        >

                            <label>Name</label>

                            <input
                                type="text"
                                name="Lname"
                                value={form.Lname}
                                onChange={handleChange}
                                placeholder="Enter name"
                                required
                            />

                            <label>Email</label>

                            <input
                                type="email"
                                name="Lemail"
                                value={form.Lemail}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />

                            <label>Phone</label>

                            <input
                                type="tel"
                                name="Lphone"
                                value={form.Lphone}
                                onChange={handleChange}
                                placeholder="Enter phone"
                                required
                            />

                            <label>Company</label>

                            <input
                                type="text"
                                name="Lcomp"
                                value={form.Lcomp}
                                onChange={handleChange}
                                placeholder="Enter company"
                                required
                            />

                            <label>Source</label>

                            <input
                                type="text"
                                name="Lsrc"
                                value={form.Lsrc}
                                onChange={handleChange}
                                placeholder="Website, Referral, LinkedIn..."
                                required
                            />

                            <label>Status</label>

                            <select
                                name="Lstatus"
                                value={form.Lstatus}
                                onChange={handleChange}
                            >

                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Lost">Lost</option>

                            </select>

                            <div className="modal-actions">

                                <button
                                    type="submit"
                                    className="add-btn"
                                >
                                    {isEditing ? "Update Lead" : "Create Lead"}
                                </button>

                                <button
                                    type="button"
                                    className="reset-btn"
                                    onClick={() => {
                                        setShowModal(false);
                                        setForm(initialForm);
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default LeadManagement;
