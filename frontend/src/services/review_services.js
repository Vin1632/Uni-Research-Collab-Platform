
export async function get_active_projects() {
  try {
    const response = await fetch('/projects/active-projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch active projects');
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch active projects", error);
    throw error;
  }
}