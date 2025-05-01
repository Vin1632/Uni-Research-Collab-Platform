export async function proposal_service(id, title, description, link_image) {
    try {
        const response = await fetch('/projects/project', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: id,
            title: title,
            description: description,
            link_image: link_image
          }),
        });
    
        if (!response.ok) {
  
          const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || 'Failed to add Project (endpoint call)');

        }
    
        return await response.json(); 
      } catch (error) {
        console.error('Error during api call endpoint:', error);
        throw error; 
      }
}



export async function insert_projectData(project_id, title, requirements, link_image, funding, funding_source) {
    try {
        const response = await fetch('/projects/projectdata', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: project_id,
            title : title,
            requirements: requirements,
            funding: funding,
            link_image: link_image,
            funding_source : funding_source
          }),
        });
    
        if (!response.ok) {
  
          const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || 'Failed to insert Projectdata (endpoint call)');

        }
    
        return await response.json(); 
      } catch (error) {
        console.error('Error during api call endpoint:', error);
        throw error; 
      }
}

export async function get_project_data(id) {
    try {
        const response = await  fetch(`/projects/recom-projects/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
        });

        if(!response.ok)
        {
            const errorData = await response.json();
            throw new Error(errorData.message || 'failed to fetch projectdata');
        }

        return await response.json();
        
    } catch (error) {
        console.error("Failed to fetch", error);
        throw new Error("Failed to get the project data");
    
    }
}

export async function get_each_project_data(id) {
  try {
      const response = await  fetch(`/projects/projectdata/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
      });

      if(!response.ok)
      {
          const errorData = await response.json();
          throw new Error(errorData.message || 'failed to fetch Projects data');
      }

      return await response.json();
      
  } catch (error) {
      console.error("Failed to fetch", error);
      throw new Error("Failed to get Projects Data");
  
  }
}