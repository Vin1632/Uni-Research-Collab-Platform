const pool = require('../db');

async function insert_proposals(user_id, title, descripton, link_image) {

    try {
        const result = pool.query("INSERT INTO Project(user_id, title, description, link_image) VALUES (?, ?, ?, ?)", [user_id,title, descripton, link_image])
        return result;
    } catch (error) {
        console.error("failed to insert into Project table in the database", error);
        throw new Error(error);
    }
    
}

async function insert_projectData(project_id, title, requirements, link_image, funding, funding_source) {
    try {
        const result = pool.query("INSERT INTO ProjectData(project_id, title, requirements, link_image, funding, funding_source) VALUES (?, ?, ?, ?, ?, ?)", 
            [project_id,title, requirements, link_image, funding, funding_source ]);
        return result;

    } catch (error) {
        console.error("Failed To insert into Projectdata", error);
        throw new Error(error);
    }
}

module.exports = {insert_proposals, insert_projectData}