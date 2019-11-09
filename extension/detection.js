
var images = document.getElementsByTagName('img'); 

for(var i = 0; i < images.length; i++) {
    var src = images[i].src;
    chrome.storage.sync.get('target_url', function(data) {
      console.log("Sending: " + src + " to " + data.target_url);
      const Http = new XMLHttpRequest();
      Http.open("POST", data.target_url);
      Http.send(JSON.stringify({id: "sometag", src: src}));
    });
}
