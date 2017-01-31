import Express from 'express';
import path from 'path';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';

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

const validate = (req) => {
  const authHeader = req.get('Authorization');
  console.log(authHeader);
  console.log(process.env.UBUNTU);
  if (authHeader !== 'Bearer ' + process.env.UBUNTU) {
    return false;
  }
  return true;
};

app.use((req, res, next) => {
  if (validate(req)) {
    next();
  } else {
    res.status(403).send('no-auth-token');
  }
});

app.get('/test-server', (req, res) => {
  console.log('**********  Server running!  ***************');
  console.log(process.env.UBUNTU);
  res.send(JSON.stringify({ message:'Server running!' }));
});

app.post('/create-ssh-user', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  exec(`./create_ssh_user.sh ${username} ${password}`, (error, stdout, stderr) => {
    console.log(__dirname);
    if (!error) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ message:'user created.' }));
      console.log('User created: ', username, password);
      if (stdout) {
        console.log(`stdout : ${stdout}`);
      }
      if (stderr) {
        console.log(`stderr : ${stderr}`);
      }
    } else {
      console.log('user not created', username);
      console.log('error: ', error);
      res.status(500).send({ message : 'Internal error useradd' });
    }
  });
});

app.post('/create-database', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  exec(`./setup_user_db.sh ${username} ${password}`, (error, stdout, stderr) => {
    console.log(__dirname);
    if (!error) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ message:'user database created.' }));
      console.log('User database created: ', username, password);
      if (stdout) {
        console.log(`stdout : ${stdout}`);
      }
      if (stderr) {
        console.log(`stderr : ${stderr}`);
      }
    } else {
      console.log('user database not created', username);
      console.log('error: ', error);
      res.status(500).send({ message : 'Internal error' });
    }
  });
});

app.post('/delete-ssh-user', (req, res) => {
  const username = req.body.username;
  exec(`./delete_ssh_user.sh ${username}`, (error, stdout, stderr) => {
    if (!error) {
      console.log('user deleted', username);
      res.send(JSON.stringify({ message : 'user deleted successfully' }));
      if (stdout) {
        console.log(`stdout : ${stdout}`);
      }
      if (stderr) {
        console.log(`stderr : ${stderr}`);
      }
    } else {
      console.log('user not deleted', username);
      console.log('error: ', error);
      res.status(500).send(JSON.stringify({ message : 'Internal error userdel' }));
    }
  });
});

app.post('/delete-user-db', (req, res) => {
  const username = req.body.username;
  exec(`./delete_user_db.sh ${username}`, (error, stdout, stderr) => {
    if (!error) {
      console.log('user db deleted', username);
      res.send(JSON.stringify({ message : 'user db deleted successfully' }));
      if (stdout) {
        console.log(`stdout : ${stdout}`);
      }
      if (stderr) {
        console.log(`stderr : ${stderr}`);
      }
    } else {
      console.log('user db not deleted', username);
      console.log('error: ', error);
      res.status(500).send(JSON.stringify({ message : 'Internal error' }));
    }
  });
});


app.post('/update-ssh-password', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  exec(`./update_ssh_password.sh ${username} ${password}`, (error, stdout, stderr) => {
    if (!error) {
      console.log('user password updated successfully', username);
      res.send(JSON.stringify({ message:'user password updated successfully' }));
      if (stdout) {
        console.log(`stdout : ${stdout}`);
      }
      if (stderr) {
        console.log(`stderr : ${stderr}`);
      }
    } else {
      console.log('Failed to update password', username);
      console.log('error: ', error);
      res.status(500).send(JSON.stringify({ message:'Internal error passwd' }));
    }
  });
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

console.log(process.env.UBUNTU);
