// get all the projects that haven't reached their end_date
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

// post donation to a project
export async function donate_to_project({ reviewer_id, project_id, donated_amt }) {
  const response = await fetch('/projects/donate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewer_id, project_id, donated_amt }),
  });
  if (!response.ok) {
    throw new Error('Donation failed');
  }
  return await response.json();
}

// Get all projects reviewed by the current reviewer
export async function get_my_reviews(reviewer_id) {
  const response = await fetch(`/projects/my-reviews/${reviewer_id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch my reviews');
  }
  return await response.json();
}