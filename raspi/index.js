const request = require('superagent');

const config = require('./config');
const ECHOPF = require('./ECHO.min');

ECHOPF.initialize(
  config.domain,
  config.applicationId,
  config.applicationKey
);

(async () => {
  const result = await ECHOPF.Members.login(
    config.memberInstanceId,
    config.login_id,
    config.password
  );
  setInterval(async () => {
    try {
      const results = await ECHOPF.Databases.find(config.databaseInstanceId);
      for (const entry of results) {
        switch (entry.get('contents.device')) {
        case 'cooler':
          const value = entry.get('contents.switch') === 1;
          const response = await request
            .put('http://192.168.0.30:51826/characteristics')
            .set('Content-Type', 'Application/json')
            .set('authorization', '031-45-154')
            .send({
              "characteristics": [
                {
                  "aid": 5,
                  "iid": 11,
                  "value": value
                }
              ]
            });
          await entry.delete();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, 5000)
})();
