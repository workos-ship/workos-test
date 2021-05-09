const express = require('express');
const WorkOS = require('@workos-inc/node');
const app = express();
const cors = require('cors');
const { join } = require('path');

const workos = new WorkOS.default(process.env.WORKOS_API_KEY);
const clientID = process.env.WORKOS_CLIENT_ID;
const domain = process.env.DOMAIN;
const redirectURI = process.env.REDIRECTURI;
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (_, res) => {
  res.status(200).sendFile(join(__dirname, 'views/index.html'));
});

app.get('/auth', async (_, res) => {
  const authorizationURL = await workos.sso.getAuthorizationURL({
    domain,
    redirectURI,
    clientID,
  });

  res.redirect(authorizationURL);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  const profile = await workos.sso.getProfile({
    code,
    clientID,
  });

  res.status(200).send(`<style>body {display: flex;flex-direction: column;justify-content: center;
      align-items: center;} span, h2 {font-size: 45px;font-family: Arial;}</style>
      <span> Keep calm. You are in! 🧚</span> <br>
      <div> ${Object.entries(profile)
        .map((x) => `    <li>${x}</li>`)
        .join('')} 
      <div><br><h2>
					Looks like you found 
				</h2>
				<span className="djkhaled">
					<iframe
						style={{ width: 560, height: 400, left: 0, top: 0, zIndex: 99999 }}
						title="khaled"
						width="560"
						height="400"
						src="https://www.youtube.com/embed/qMHCW1RIqBk?rel=0;fs=0;cc_load_policy=1;modestbranding=1;&autoplay=1"
						allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					></iframe>
				</span>`);
});

app.listen(port, () => {
  console.log(`> Up and listening`);
});

process.on('uncaughtException', (err) => {
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason);
});
