document.addEventListener('DOMContentLoaded', (e) => {
  $ = (query) => document.querySelector(query);
  $('#form').onsubmit = (e) => {
    e.preventDefault();
    const value = parseInt($('[name="value"]:checked').value);
    const device = $('[name="device"]').value;
    superagent
      .post('/add')
      .send({
        device: device,
        value: value
      })
      .then(res => {
        $('#result').html('登録しました');
      });
  }
});