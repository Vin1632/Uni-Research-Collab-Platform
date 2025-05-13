export async function login_service(full_name, email, role, institution, qualification, interests) {
    try {
      const response = await fetch('/users/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: full_name,
          email: email,
          role: role,
          institution: institution,
          qualification : qualification,
          interests : interests
        }),
      });
  
      if (!response.ok) {

        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      return await response.json(); 
    } catch (error) {
      console.error('Error during login:', error);
      throw error; 
    }
  }

// GET: Fetch user by email
export async function get_Users(email) {
  try {
    const response = await fetch(`/users/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email : email})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}