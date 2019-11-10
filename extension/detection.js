
// Background script loaded for every site

// Get all image tags
var images = document.getElementsByTagName('img'); 

// Send queries to server for each
for(var i = 0; i < images.length; i++) {
    var src = images[i].src;
    chrome.storage.sync.get('target_url', data => {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', data.target_url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ image_source: src }));
      console.log('Sent query for img ' + src); // TODO: remove debug console logging
    });
}
