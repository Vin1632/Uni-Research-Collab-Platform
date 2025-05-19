import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { FaPencilAlt, FaCheckCircle, FaExclamationCircle, FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";
import { get_profile_data, update_profile_data } from "../services/profileService";
import Header from "./Header";
import "../styles/profile.css";
import '../styles/Dashboard.css';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const [form, setForm] = useState({
    name: "",
    institution: "",
    qualification: "",
    interests: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shakingField, setShakingField] = useState(null);

  const inputRefs = {
    name: useRef(null),
    institution: useRef(null),
    qualification: useRef(null),
    interests: useRef(null)
  };

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
      .catch(console.error);
  }, [email]);

  const validateField = (field, value) => {
    if (field === "name") {
      if (!value || value.trim().length < 3) return "Name must be at least 3 characters.";
    } else if (field === "institution") {
      if (!value || value.trim() === "") return "Institution is required.";
    } else if (field === "qualification") {
      if (!value || value.trim() === "") return "Qualification is required.";
    } else if (field === "interests") {
      if (!value || value.trim().length < 5) return "Interests must be at least 5 characters.";
    }
    return "";
  };

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    for (const key in formData) {
      newErrors[key] = validateField(key, formData[key]);
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(e => e);
  }, []);
  // eslint-disable-next-line
  const debouncedSave = useCallback(
    debounce(async (formData) => {
      if (!email) return;
      if (!validateForm(formData)) return;

      setSaving(true);
      try {
        const res = await update_profile_data({ ...formData, email });
        toast.success(res.message || "Profile autosaved!");
      } catch {
        toast.error("Autosave failed.");
      } finally {
        setSaving(false);
      }
    }, 1200),
    [email, validateForm]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    debouncedSave({ ...form, [name]: value });
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
    setTouched({});
    if (!editMode) validateForm(form);
  };

  const handlePencilClick = (field) => {
    setShakingField(field);
    setTimeout(() => {
      inputRefs[field].current?.focus();
    }, 100);
    setTimeout(() => setShakingField(null), 600);
  };

  return (
    <main className="dashboard-wrapper">
      <Header />
      <section className="profile-form-container">
        <div className="text-center mb-4">
          <FaUserCircle size={100} color="#c6e3ff" />
          <h3 className="profile-edit-title">
            {editMode ? "Edit Profile" : "Profile Summary"}
          </h3>
          <Button variant={editMode ? "secondary" : "primary"} onClick={toggleEditMode}>
            {editMode ? "View Profile" : "Edit Profile"}
          </Button>
        </div>

        <Form>
          {["name", "institution", "qualification", "interests"].map((field) => {
            const isError = errors[field];
            const isTouched = touched[field];
            const isValid = isTouched && !isError;
            const shakeClass = shakingField === field ? "shake shake-icon" : "";
            return (
              <Form.Group key={field} className="mb-3 position-relative">
                <Form.Label className={`profile-form-label ${shakeClass}`}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <FaPencilAlt
                    onClick={() => handlePencilClick(field)}
                    className={shakeClass}
                    style={{ cursor: "pointer", marginLeft: 8 }}
                    title={`Edit ${field}`}
                  />
                </Form.Label>
                <Form.Control
                  ref={inputRefs[field]}
                  as={field === "interests" ? "textarea" : "input"}
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`profile-input ${shakingField === field ? "profile-input-focus" : ""}`}
                  isInvalid={isTouched && !!isError}
                  isValid={isValid}
                  rows={field === "interests" ? 3 : undefined}
                />
                <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
                {isValid && <FaCheckCircle style={{ position: "absolute", right: 12, top: 38, color: "#28a745" }} />}
                {isTouched && isError && <FaExclamationCircle style={{ position: "absolute", right: 12, top: 38, color: "#dc3545" }} />}
              </Form.Group>
            );
          })}
          {editMode && (
            <Button type="submit" disabled className="profile-submit-btn">
              {saving ? "Saving..." : "All changes are autosaved"}
            </Button>
          )}
        </Form>
      </section>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
      />
    </main>
  );
};

export default Profile;
