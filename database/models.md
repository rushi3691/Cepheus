Registered_Users (
    id SERIAL PRIMARY KEY,
    user_uuid VARCHAR(30),  
    user_name VARCHAR(50),
    college VARCHAR(50),
    grade INTEGER,
    mobile VARCHAR(12),
    email VARCHAR(50) NOT NULL UNIQUE,
    image_url VARCHAR(255),
    registered BOOLEAN NOT NULL DEFAULT false
)

Team (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(50),
    team_code VARCHAR(10) UNIQUE,
    event_id INTEGER,
    constraint fk_event_id
        foreign key (event_id) 
            REFERENCES Event (id)
        ON DELETE CASCADE
)

Event (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(50) UNIQUE,
    min_grade INTEGER, 
    max_grade INTEGER,
    max_mates INTEGER,
    active boolean
)


EventTeam (
    id SERIAL PRIMARY KEY,
    team_id INTEGER,
    event_id INTEGER,
    user_id INTEGER,
    constraint fk_team_id
        foreign key (team_id) 
            REFERENCES Team (id)
        ON DELETE CASCADE,
    constraint fk_event_id
        foreign key (event_id) 
            REFERENCES Event (id)
        ON DELETE CASCADE,
    constraint fk_user_id
        foreign key (user_id) 
            REFERENCES Registered_Users (id)
        ON DELETE CASCADE
)