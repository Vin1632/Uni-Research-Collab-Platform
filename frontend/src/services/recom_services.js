export async function get_recom_projects() {

    try {
        const response =  fetch('/recommendations/recom-projects', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
        });

        if(!response.ok)
        {
            const errorData = await response.json();
            throw new Error(errorData.message || 'failed to fetch data-1');
        }

        return await response.json();
        
    } catch (error) {
        console.error("Failed to fetch", error);
        throw new Error("Failes to get the error");
    
    }
    
}