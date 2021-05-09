const express = require('express');
const WorkOS = require('@workos-inc/node');
const app = express();
const cors = require('cors');
const path = require('path');
const { json, urlencoded } = require('body-parser');

const port = process.env.PORT || 3000;
const workos = new WorkOS.default('sk_Vikw2akqGIEkoCyeOKK0yiKuc');
const clientID = 'client_01F52442XJR25BACZGTZC5VT1K';

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/auth', (_req, res) => {
  const domain = 'foo-corp.com';
  const redirectURI = 'https://serene-castle-94417.herokuapp.com/callback';

  const authorizationURL = workos.sso.getAuthorizationURL({
    domain,
    redirectURI,
    clientID,
  });

  console.log('authorizationURL', authorizationURL);
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

app.get('/fomo', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`> Up and listening at https://serene-castle-94417.herokuapp.com/`);
});

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', function (reason) {
  console.error('Unhandled rejection', reason);
});
