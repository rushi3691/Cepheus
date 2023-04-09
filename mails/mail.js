const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD
  }},
  {
    from: {
      name: 'Cepheus Technical Festival IIT GOA ',
      address: process.env.MAIL_ADDRESS
    },
  }
);


const indData = (event, user_name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Individual Registration</title>
    </head>
    <body>
      <p>Hey <strong>${user_name}</strong>,</p>
      <p>We’re thrilled to confirm your successful registration for ${event.event_name}.</p>
      ${(event.id === 7)? `
      <p>The contest will begin <b style="color:red;">9th Feb 7:00 PM</b></p>
      <p>Please find the sign up link for it: <a href="https://www.hackerrank.com/fizbuzz-2023">Click here</a></p>
      <p>Also, make sure to fill this <b style="color:red;">google form</b>, if you want to be <b style="color:red;">eligible for prizes</b>.</p>
      <p><b style="color:red;">Form Link:</b> <a href="https://forms.gle/iWwc9V9KfjLNUwGo7">Click here</a></p>
      <p>Kindly, fill the Hackerrank ID in which you would be participating in the contest.</p>
      `:""}

      <p>For any queries or assistance, you can reach out to the Event Head or Co-Head:</p>
      <ol>
        <li>
          <strong>Event Head:</strong> ${event.event_head}, Mobile:
          ${event.event_head_contact}
        </li>
        <li>
          <strong>Event Co-Head:</strong> ${event.event_cohead}, Mobile:
          ${event.event_cohead_contact}
        </li>
      </ol>
      <p>Join our lively community on our <a href="https://discord.gg/jQsfbrtkzG">Discord</a> server to stay updated and connect with other participants.</p>
      <p>Stay in the loop with all the latest event updates by following us on:</p>
      <p>
        <a
          href="https://www.instagram.com/cepheus_iitgoa/?hl=en"
          target="_blank"
          rel="noreferrer"
        >Instagram</a
        ><br />
        <a
          href="https://www.linkedin.com/company/cepheus-iit-goa/"
          target="_blank"
          rel="noreferrer"
        >LinkedIn</a
        ><br />
        <a
          href="https://twitter.com/cepheus_iitgoa"
          target="_blank"
          rel="noreferrer"
        >Twitter</a
      >
      </p>
      <p>Can’t wait to see you at the event!</p>
      <p>Best Regards,<br>Team Cepheus</p>
    </body>
  </html>
    `
}

const createData = (team_code, team_name, event, user_name) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Team Registration</title>
  </head>
  <body>
    <p>Hey <strong>${user_name}</strong>,</p>
    <p>
      We are pleased to inform you that your registration for
      ${event.event_name} has been successful. <br />Your team details are as
      follows:
    </p>
    <dl>
      <dt><strong>Team Details:</strong></dt>
      <dd>Team Name: ${team_name} <br />Team Code: ${team_code}</dd>
    </dl>
    <p>
      Please keep your team name and team code safe for future reference. If you
      have any queries or issues, please contact the Event Head or Co-Head for
      assistance.
    </p>
    <ol>
      <li>
        <strong>Event Head:</strong> ${event.event_head}, Mobile:
        ${event.event_head_contact}
      </li>
      <li>
        <strong>Event Co-Head:</strong> ${event.event_cohead}, Mobile:
        ${event.event_cohead_contact}
      </li>
    </ol>
    <p>
      Please join our
      <a href="https://discord.gg/jQsfbrtkzG">Discord</a> server, where you can
      find all the necessary information and clarification
    </p>
    <p>
      Stay in the loop with all the latest event updates by following us on:
    </p>
    <p>
      <a
        href="https://www.instagram.com/cepheus_iitgoa/?hl=en"
        target="_blank"
        rel="noreferrer"
        >Instagram</a
      ><br />
      <a
        href="https://www.linkedin.com/company/cepheus-iit-goa/"
        target="_blank"
        rel="noreferrer"
        >LinkedIn</a
      ><br />
      <a
        href="https://twitter.com/cepheus_iitgoa"
        target="_blank"
        rel="noreferrer"
        >Twitter</a
      >
    </p>

    <p>We look forward to seeing you at the event!</p>
    <p>
      Best Regards,<br />
      Team Cepheus
    </p>
  </body>
</html>
    `
}

const sendRegisterTeamMail = (to, user_name, team_code, team_name, event) => {
  // console.log(to, team_code, team_name, event_name, user_name)
  var mailOptions = {
    //from: 'techfest@iitgoa.ac.in',
    from: {
      name: 'Cepheus Technical Festival IIT GOA ',
      address: 'techfest@iitgoa.ac.in'
    },
    to: to,
    subject: `Cepheus Registration Confirmation for ${event.event_name}`,
    html: createData(team_code, team_name, event, user_name),
    // attachments: [
    //   { 
    //       filename: 'cepheus.png',
    //       path: 'mails/poster.png'
    //   }
    // ]
  }
  mailTransporter.sendMail(mailOptions, (err, result) => {
    if(err) {
        console.error(err);
    }else {
        console.log(result.response);
    }
  })
}

const sendRegisterIndMail = (to, user_name, event) => {
  var mailOptions = {
    // from: 'techfest@iitgoa.ac.in',
    from: {
      name: 'Cepheus Technical Festival IIT GOA ',
      address: 'techfest@iitgoa.ac.in'
    },
    to: to,
    subject: `Cepheus Registration Confirmation for ${event.event_name}`,
    html: indData(event, user_name),
    // attachments: [
    //   { 
    //       filename: 'cepheus.png',
    //       path: 'mails/poster.png'
    //   }
    // ]
  }
  mailTransporter.sendMail(mailOptions, (err, result) => {
    if(err) {
        console.error(err);
    }else {
        console.log(result.response);
    }
  })
}

module.exports = {
  sendRegisterTeamMail,
  sendRegisterIndMail
}
