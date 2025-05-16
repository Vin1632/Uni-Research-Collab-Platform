export async function get_project_data(id) {
    try {
      const response = await fetch(`/milestone/projectdata/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'failed to fetch projectdata');
      }
  
      return await response.json();
  
    } catch (error) {
      console.error("Failed to fetch", error);
  
      // If the error message is from the server (we expect messages like 'Project not found')
      // return that message; otherwise, throw the generic one for network or unexpected errors.
  
      if (error.message && error.message !== 'Network error') {
        throw error;  // preserve server error message
      } else {
        throw new Error("Failed to get the project data");
      }
    }
  }
  