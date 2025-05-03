-- USERS
CREATE TABLE Users (
    user_id AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    role varchar(100),
    institution varchar(255),
    qualification varchar(255),
    interests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROJECTS
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link_image TEXT
);

-- COLLABORATORS
CREATE TABLE Collaborators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collaborator_id INT REFERENCES Users(user_id)  ON DELETE CASCADE, 
    project_id INT REFERENCES Projects(project_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROJECT DATA
CREATE TABLE ProjectData (
    data_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT REFERENCES Projects(project_id) ON DELETE CASCADE,
    title VARCHAR(255),
    link_image TEXT,
    data_type VARCHAR(50), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    funds DOUBLE(13,4),
    funds_spent DOUBLE(13,4), 
    start_date DATE,
    end_date DATE
);

-- TAGS (Classification System)
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- PROJECT-TAG RELATIONSHIP (Many-to-Many)
CREATE TABLE ProjectTags (
    project_id INT REFERENCES Projects(project_id) ON DELETE CASCADE,
    tag_id INT REFERENCES Tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);
