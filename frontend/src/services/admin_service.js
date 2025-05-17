// Get all flagged projects for admin
export async function get_flagged_projects() {
  try {
    const response = await fetch("/admin/flagged-projects", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const text = await response.text(); 
    try {
      const data = JSON.parse(text); 

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch flagged projects");
      }

      return data;
    } catch (jsonErr) {
      console.error("Expected JSON but got:", text);
      throw new Error("Server did not return valid JSON");
    }
  } catch (error) {
    console.error("Error fetching flagged projects:", error);
    throw error;
  }
}

// Delete (unflag) a flagged project by flag ID
export async function delete_flag(flag_id) {
  try {
    const response = await fetch(`/admin/flagged-projects/${flag_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete flag");
      }

      return data;
    } catch (jsonErr) {
      console.error("Expected JSON but got:", text);
      throw new Error("Server did not return valid JSON");
    }
  } catch (error) {
    console.error("Error deleting flag:", error);
    throw error;
  }
}
export async function delete_project(projectId) {
  try {
    const response = await fetch(`/admin/projects/${projectId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete project");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
// Example API call to get full project details by ID
export async function get_each_project_data(projectId) {
  const response = await fetch(`/admin/projects/${projectId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch project data");
  }

  const data = await response.json();
  return data;
}
// Get all users for admin
export async function get_all_users() {
  try {
    const response = await fetch("/admin/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const text = await response.text(); 
    try {
      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      return data;
    } catch (jsonErr) {
      console.error("Expected JSON but got:", text);
      throw new Error("Server did not return valid JSON");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
