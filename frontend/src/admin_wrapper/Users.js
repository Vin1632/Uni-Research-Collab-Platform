import React, { useEffect, useState } from "react";
import "../styles/Users.css";
import { get_all_users } from "../services/admin_service"; // Adjust the path if needed

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await get_all_users();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="users-page">
      <div className="users-controls">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="reviewer">Reviewer</option>
          <option value="researcher">Researcher</option>
        </select>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Institution</th>
            <th>Qualification</th>
            <th>Interests</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.user_id}>
              <td>{index + 1}</td>
              <td>{user.name || "-"}</td>
              <td>{user.email}</td>
              <td>{user.role || "-"}</td>
              <td>{user.institution || "-"}</td>
              <td>{user.qualification || "-"}</td>
              <td className="interests-cell">{user.interests || "-"}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
