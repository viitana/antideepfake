# antideepfake
A very rudimentary hash-based deepfake detection chrome browser extension. Comprises of the extension itself and an [Express.js](https://github.com/expressjs/express) database server.

Uses [image-hash](https://github.com/danm/image-hash) (which in turn uses [blockhash-js](https://github.com/commonsmachinery/blockhash-js)) for perceptual hash generation.

## Basic functionality

The browser extension queries the server for all image tag source URIs on a page. The server fetches the images and performs a perceptual hash, checks a simple sqlite database for matches and returns the result. The extension then applies a warning overlay on the images.

This application is intended for demo purposes only and depends on an existing database of known deepfake content to function in a real-life setting.

## Installation
For intallation instructions, refer to the READMEs in the folders for the respective components:
- [Chrome extension](/extension#readme)
- [Backend hash server](/server#readme)

## License
[MIT](/LICENSE)

*Developed for the Aalto University course SCI-C1001 SCI-Project.*
