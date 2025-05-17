import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { get_profile_data, update_profile_data } from "../services/profileService";
import Header from "../components/Header"; 
import "../styles/profile.css";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    institution: "",
    qualification: "",
    interests: ""
  });
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState({
    name: false,
    institution: false,
    qualification: false,
    interests: false
  });
  const [errors, setErrors] = useState({
    name: "",
    institution: "",
    qualification: "",
    interests: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  useEffect(() => {
    if (!email) return;
    get_profile_data(email)
      .then(data => {
        setForm({
          name: data.name || "",
          institution: data.institution || "",
          qualification: data.qualification || "",
          interests: data.interests || ""
        });
      })
      .catch(err => console.error("Failed to fetch profile:", err));
  }, [email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = { name: "", institution: "", qualification: "", interests: "" };

    if (!form.name || form.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }
    if (!form.institution) {
      newErrors.institution = "Institution is required.";
    }
    if (!form.qualification) {
      newErrors.qualification = "Qualification is required.";
    }
    if (!form.interests || form.interests.length < 5) {
      newErrors.interests = "Interests must be at least 5 characters.";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email is required.");
      return;
    }

    if (!validateForm()) {
      setMessage("Please correct the errors in the form.");
      return;
    }

    update_profile_data({ ...form, email })
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error updating profile."));
  };

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEditMode({
      name: false,
      institution: false,
      qualification: false,
      interests: false
    });
    handleSubmit(e);
  };

  return (
    <>
      <Header />
      <section className="form-container" style={{ width: "100%", maxWidth: "700px", margin: "0 auto", padding: "30px" }}>
        <div className="text-center mb-4">
          <FaUserCircle size={100} color="#c6e3ff" />
          <h3 className="edit-profile" color="#c6e3ff" >Edit Profile</h3>
        </div>
        <Form onSubmit={handleSave}>
          {["name", "institution", "qualification", "interests"].map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <FaPencilAlt
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                  onClick={() => handleEdit(field)}
                />
              </Form.Label>
              <Form.Control
                as={field === "interests" ? "textarea" : "input"}
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                disabled={!editMode[field]}
                isInvalid={!!errors[field]}
              />
              <Form.Control.Feedback type="invalid">
                {errors[field]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <Button className="mt-3" type="submit" disabled={!Object.values(editMode).includes(true)}>
            Save Changes
          </Button>
          {message && <Alert className="mt-3">{message}</Alert>}
        </Form>
      </section>
    </>
  );
};

export default Profile;
