const { FTP_USERNAME, FTP_PASSWORD, WEBHOOK_URL, WEBHOOK_METHOD } = process.env;
const { FtpSrv, ftpErrors } = require('ftp-srv');
const ftpServer             = new FtpSrv({ url: `ftp://0.0.0.0:1234`, anonymous: false });

ftpServer.on('login', async ({ username, password }, resolve, reject) => {
  if (username === FTP_USERNAME && password === FTP_PASSWORD) {
    console.log('Motion detected!')
    try {
      await fetch(WEBHOOK_URL, { method : WEBHOOK_METHOD });
    } catch(e) {
      console.error('Unable to retrieve webhook:');
      console.error(e);
    }
    return reject(new ftpErrors.GeneralError('Service not available', 421));
  }
  return reject(new ftpErrors.GeneralError('Invalid username or password', 430));
}).listen().then(() => {
  console.log('FTP server started')
});
