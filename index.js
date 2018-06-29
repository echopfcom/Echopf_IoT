const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const config = require('./config');
const ECHOPF = require('./ECHO.min');

ECHOPF.initialize(
  config.domain,
  config.applicationId,
  config.applicationKey
);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/add', async function(req, res) {
  const user = await login();
  console.log(req.body)
  const result = await add(req.body.device, req.body.value);
  res.json({result: true});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

const login = async () => {
  const result = await ECHOPF.Members.login(
    config.memberInstanceId,
    config.login_id,
    config.password
  );
  return result;
};

const add = async (device, value) => {
  const entry = new ECHOPF.Databases.RecordObject(config.databaseInstanceId);
  entry.put('refid', Math.random().toString(36).slice(-8));
  entry.put('title', 'From iPhone');
  entry.put('contents', {
    'device': device,
    'switch': value
  });
  try {
    const result = await entry.push();
    return result;
  } catch (e) {
    console.log(e);
  }
};
