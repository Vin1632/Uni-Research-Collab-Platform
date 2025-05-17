
export async function get_profile_data(email) {
  try {
    const response = await fetch(`/profiles/profile?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile data');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to get profile data");
  }
}

export async function update_profile_data(profile) {
  try {

    const response = await fetch(`/profiles/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
}