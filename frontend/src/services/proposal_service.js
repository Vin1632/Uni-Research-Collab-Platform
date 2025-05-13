
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase'; 

export async function proposal_service(id, title, description, link_image, start_date, end_date) {
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
            link_image: link_image,
            start_date: start_date, 
            end_date : end_date
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


export async function insert_projectData(project_id, title, requirements, link_image, funding, funding_source, start_date, end_date) {
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
            funds: funding,
            link_image: link_image,
            funding_source : funding_source, 
            start_date : start_date, 
            end_date : end_date
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


export async function get_image_url(image) {

  if (!image) {
    console.log("No image provided.");
    return "";
  }

  try {
    const storageRef = ref(storage, `files/${image.name}`);
    const metadata = {
      contentType: image.type,
    };

    const uploadTask = uploadBytesResumable(storageRef, image, metadata);

    const downloadURL = await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });

    return downloadURL;

  } catch (error) {
    console.error("Upload failed:", error);
    return "";
  }
}


