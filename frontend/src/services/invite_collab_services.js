export async function invite_collaboration(Email, User, Title) {

    try {
        const response = await fetch('/invite/send-invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toEmail: Email,
              fromUser: User,
              projectTitle: Title
            }),
          });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to Send An Invitation');
        }
    
        return await response.json(); 
      } catch (error) {
        console.error('Error Sending an Invite:', error);
        throw error; 
      }
    
}

export async function email_using_project_id(id) {

  try {
    const response = await fetch(`/invite/send-invite/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed GET through ID');
    }

    return await response.json(); 
  } catch (error) {
    console.error('Error GET through ID:', error);
    throw error; 
  }
  
}