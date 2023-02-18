## More reliable Reolink motion notifications in Home Assistant (or any webhook-based system)

Reolink motion detection (generic, person, vehicle) works pretty well.

However, Home Assistant integrations seem to suffer from the issue that Reolink's ONVIF event notifications are not very stable, or quick.

### Description

Since the FTP upload functionality of the Reolink camera's seems to be much more stable and reliable, this project runs a custom FTP server inside of a Docker container. The purpose of the server is to accept a connection from a Reolink camera and, after a successful login, will call a webhook URL.

In other words: when motion is detected, the camera will try and upload an image/video via FTP. The FTP server contains _just_ enough logic to accept the FTP login and to call the webhook URL. No files will be accepted, or saved. If you want to use the FTP feature of the camera for its actual purpose, this project isn't for you.

### Configuration

Create a file `.env` in the project directory (next to the `docker-compose.yaml` file):
```
FTP_PORT=2121
FTP_USERNAME=some-username
FTP_PASSWORD=some-password
WEBHOOK_URL=some-webhook-url
WEBHOOK_METHOD=POST
```

Explanation:
* `FTP_PORT`: the _external_ port on which the FTP server will be listening. This is the port that needs to be configured on the Reolink camera as for FTP server port.
* `FTP_USERNAME`: the username the camera should log in as with FTP.
* `FTP_PASSWORD`: the password the camera should log in with.
* `WEBHOOK_URL`: URL that will be retrieved when there's a successful login with the aforementioned FTP username/password combination.
* `WEBHOOK_METHOD`: the HTTP method to use to retrieve `$WEBHOOK_URL`. For Home Assistant, this should be `POST`, `PUT` or `DELETE` (_not_ `GET`).

### Downloading, Building and Running

Clone the project to a local directory:
```
$ git clone https://github.com/robertklep/reolink-ftp-webhook
$ cd reolink-ftp-webhook
```

Building (once to get started, and whenever you change any of the files):
```
$ docker-compose build
```

Running:
```
$ docker-compose up -d
```

(optionally leave out `-d` to run the container in the foreground, useful for debugging)

### Caveats

When configuring the FTP setup on the camera, running a test will always show that the camera was unable to log in due to invalid credentials. If everything is configured correctly, this isn't the case. Even though the test fails, it should trigger the webhook.
