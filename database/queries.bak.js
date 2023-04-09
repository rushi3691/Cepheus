const { sql } = require('./db');

const getUser = async (user_uuid) => {
    // const {user_uuid} = req.body;
    const user = await sql`
    SELECT * FROM Registered_Users
    WHERE 
        user_uuid=${user_uuid}
    `
    return user
}

const getTeam = async (team_code) => {
    const team = await sql`
    SELECT * FROM Team
    WHERE
        team_code = ${team_code}
    `
    return team
}

const getEvent = async (event_id) => {
    const event = await sql`
    SELECT * FROM Event
    WHERE 
        id = ${event_id}
    `
    return event
}




const createUser = async (user_uuid, email, user_name) => {
    {
        const user = await getUser(user_uuid);
        if (user.length !== 0) {
            const res = {
                user: user[0],
                message: "user already present"
            }
            return res
        }
    }
    try {
        const user = await sql`
        INSERT INTO Registered_Users 
            (user_uuid, user_name, email)
        VALUES 
            (${user_uuid}, ${user_name}, ${email})
        RETURNING 
            id, user_uuid, user_name, email, registered
        `
        return {
            user: user[0],
            message: "user created"
        }
    } catch (err) {
        return err
    }
}



const registerUser = async (id, user_name, college, grade, mobile, image_url) => {
    try {
        if (!image_url) {
            // console.log("here1")
            const user = await sql`
            UPDATE Registered_Users
            SET
                user_name = ${user_name}, college = ${college}, grade = ${grade}, mobile = ${mobile}, registered = true 
            WHERE
                id = ${id}
            RETURNING 
                id, user_uuid, user_name, email, college, grade, mobile, image_url
            `
            return user[0]
        } else {
            // console.log("here2")
            const user = await sql`
            UPDATE Registered_Users
            SET
                user_name = ${user_name}, college = ${college}, grade = ${grade}, mobile = ${mobile}, image_url=${image_url}, registered = true 
            WHERE
                id = ${id}
            RETURNING 
                id, user_uuid, user_name, email, college, grade, mobile, image_url
            `
            return user[0]

        }
    } catch (err) {
        return err
    }
}


const addEvent = async ({ event_name, min_grade, max_grade, max_mates }) => {
    try {
        const event = await sql`
        INSERT INTO Event
            (event_name, min_grade, max_grade, max_mates)
        VALUES
            (${event_name}, ${min_grade}, ${max_grade}, ${max_mates})
        RETURNING 
            id, event_name
        `
        return event[0]
    } catch (err) {
        return err
    }

}

const createTeam = async (req, res) => {
    var { team_name, event_id } = req.body;
    if (!team_name || !event_id) {
        return res.status(500).json({
            "message": "missing params"
        })
    }
    team_name = team_name.toLowerCase()

    try {
        // const result = await sql`
        // INSERT INTO Team 
        //     (team_name) 
        // VALUES 
        //     (${team_name}) 
        // RETURNING id
        // `
        const result = await sql`
        INSERT INTO Team
            (team_name, event_id) 
        SELECT ${team_name}, ${event_id}
        WHERE NOT EXISTS (
            SELECT 1 FROM Team WHERE team_name=${team_name} AND event_id=${event_id}
        )
        RETURNING id
        `
        if (result.length == 0) {
            return res.status(500).json({
                "message": "team name is already taken"
            })
        }
        // req.ini = 5
        // console.log(result)
        // return res.json(result)
        const team_id = result[0].id
        const team_code = `CP${team_id}${req.ini}`

        const team = await sql`
        UPDATE Team 
        SET 
            team_code = ${team_code}
        WHERE 
            id = ${team_id}
        RETURNING team_code
        `

        return res.json(team[0])
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "team name not unique"
        })
    }
}

const getUserByID = async (user_id) => {
    const user = await sql`
    SELECT grade FROM Registered_Users
    WHERE 
        id=${user_id}
    `
    return user
}

const registerEventUser = async (req, res) => {
    const { event_id, team_code } = req.body
    // const {id} = req.body
    // req.id = id
    if (!team_code || !event_id) {
        return res.status(500).json({
            "message": "missing params"
        })
    }

    // 1st call
    const team = await getTeam(team_code)

    if (team.length == 0) {
        return res.status(500).json({
            "message": "team code not found"
        })
    }
    const team_id = team[0].id
    if (event_id != team[0].event_id) {
        return res.status(500).json({
            "message": "team code is not applicable for this event"
        })
    }

    const user = await getUserByID(req.id)
    if (user.length == 0) {
        return res.status(500).json({
            "message": "user not found"
        })
    }

    // 2nd call
    const event = await getEvent(event_id)
    if (event.length == 0) {
        return res.status(500).json({
            "message": "event not found"
        })
    }

    // 3rd call
    if (user[0].grade < event[0]['min_grade'] || user[0].grade > event[0]['max_grade']) {
        return res.status(500).json({
            "message": "this event is not meant for your grade"
        })
    }

    const user_exists = await sql`
    SELECT COUNT(*) 
    FROM EventTeam
    WHERE 
        event_id=${event_id} AND user_id=${req.id}
    `

    // 4th call
    if (user_exists[0].count > 0) {
        return res.status(500).json({
            "message": "user is already registered",
            "code": 1
        })
    }

    // 5th call
    const result = await sql`
    SELECT COUNT(*) 
    FROM EventTeam
    WHERE 
        event_id=${event_id} AND team_id=${team_id}
    `
    const team_count = result[0].count



    if (team_count == event[0]['max_mates']) {
        return res.status(500).json({
            "error": "team is full"
        })
    }
    try {
        // 6th call
        const reg_user = await sql`
        INSERT INTO EventTeam
            (user_id, event_id, team_id)
        VALUES
            (${req.id}, ${event[0]['id']}, ${team[0]['id']})
        RETURNING
            id
        `
        if (reg_user.length) {
            return res.json({
                "message": "registered",
                "team_code": team_code
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            "message": "couldn't register user",
            "error": err
        })
    }
}

const removeEventUser = async (req, res) => {
    const { event_id } = req.body
    // const {id} = req.body;
    // req.id = id;
    // const user = await getUser(req.user_uuid)

    // if (user.length == 0) {
    //     return res.status(500).json({
    //         "message": "user not found"
    //     })
    // }
    if (!event_id) {
        return res.status(500).json({
            "message": "missing params"
        })
    }
    try {
        const err = await sql`
        DELETE FROM EventTeam
        WHERE
            user_id = ${req.id} AND event_id = ${event_id}
        `
        return res.json({
            "message": "success"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            err: err
        })
    }
}

const getRegEvents = async (req, res) => {
    // req.id = req.body.id
    const result = await sql`
    SELECT event_id FROM EventTeam
    WHERE
        user_id = ${req.id} 
    `
    const rest = [];
    result.forEach((val) => {
        rest.push(val.event_id)
    })
    // console.log(rest)
    return res.json({ regevents: rest })
}

const getMates = async (req, res) => {
    const { event_id } = req.body;
    if (!event_id) {
        return res.status(500).json({
            "message": "pass event_id"
        })
    }
    const user_id = req.id;
    try {
        const result = await sql`
        SELECT user_name, email FROM Registered_Users as r WHERE r.id IN (
            SELECT user_id FROM eventteam WHERE team_id in (
                SELECT team_id FROM eventteam where user_id=${user_id} AND event_id=${event_id}
            )
        )
        `
        // console.log(result)
        return res.json({ data: result })
    } catch (e) {
        return res.status(500).json(e)
    }
}


module.exports = {
    getUser, createUser, registerUser, createTeam, registerEventUser, removeEventUser, getRegEvents, getMates
}
