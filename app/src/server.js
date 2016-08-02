import Express from 'express';
import path from 'path';
// import PrettyError from 'pretty-error';
import http from 'http';
import morgan from 'morgan';

import bodyParser from 'body-parser';
// import fetch from 'node-fetch';

import config from './config';

const exec = require('child_process').exec;

// const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);

// Express Logging Middleware
if (global.__DEVELOPMENT__)
  app.use(morgan('combined'));
else
  app.use(morgan('[:date[clf]]: :method :url :status :res[content-length] - :response-time ms'));

app.use(bodyParser.json());
app.use('/static', Express.static(path.join(__dirname, '..', 'static')));

// app.get('/create-user', (req, res) => {
//   fetch('https://httpbin.org/ip').then(
//     (response) => {
//       response.text().then((data) => {
//         console.log(data);
//         const ip = JSON.parse(data);
//         res.send(ip.origin);
//       });
//     },
//     (error) => {
//       console.error(error);
//       res.status(500).send('something went wrong');
//     });
// });

app.post('/create-user', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  exec(`./create_ssh_user1.sh ${username} ${password}`, (error, stdout, stderr) => {
    if (!error) {
      res.send('User created!!');
      console.log('User created', username, password);
      if (stdout) {
        console.log(`stdout : ${stdout}`);
      }
      if (stderr) {
        console.log(`stderr : ${stderr}`);
      }
    } else {
      console.log('User not created!!');
      console.log('Error: ', error);
      res.send('Internal error occured executing the script useradd!!');
    }
  });
});

app.post('/delete-user', (req, res) => {
  const username = req.body.username;
  exec(`./delete_ssh_user.sh ${username}`, (error, stdout, stderr) => {
    if (!error) {
      console.log('User deleted', username);
      res.send('User deleted Successfully');
    } else {
      console.log('User not deleted');
      console.log('Error: ', error);
      res.send('Internal error during command executing  userdel!!')
    }
  });
});

app.post('/update-ssh-password', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  exec(`./update_ssh_password.sh ${username} ${password}`, (error, stdout, stderr) => {
    if (!error) {
      console.log('User password updated Successfully', username);
      res.send('User password updated Successfully');
    } else {
      console.log('Failed to update password');
      console.log('Error: ', error);
      res.send('Internal error during command executing passwd')
    }
  });
});

app.post('/update-ssh-password', (req, res) => {
  res.send('Password Updated Successfully!!');
});

// Listen at the server
if (config.port) {
  server.listen(config.port, config.host, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server.', config.app.title);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
