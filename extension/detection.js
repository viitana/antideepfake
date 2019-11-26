
// Background script loaded for every site

const scan = () => {
  // Get all image tag elements
  const elems = document.getElementsByTagName('img'); 
  const imgs = {};

  // Map elems to unique src URIs
  for(const elem of elems) {
    imgs[elem.src] = imgs[elem.src]
      ? imgs[elem.src].concat([elem])
      : [elem];
  }

  // Send query server for each
  const srcs = Object.keys(imgs);
  for(const src of srcs) {
      chrome.storage.sync.get('target_url', data => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.status === 200 & xhr.readyState === 4) {
            handleResponse(xhr.response, imgs);
          }
        }
        xhr.open('POST', data.target_url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ image_source: src }));
      });
  }
};

// Handle responses from server
const handleResponse = (responseStr, mapping) => {
  const response = JSON.parse(responseStr);
  if(response.result) {
    console.log('Detected deepfake: ' + response.src);
    addAlert(mapping[response.src]);
  }
}

// Add overlay to given elements
const addAlert = elems => {
  for(const elem of elems) {
    const overlay = document.createElement("div");
    overlay.classList.add("deepfakeoverlay");

    overlay.style.cssText = elem.style.cssText;
    overlay.style.width = `${elem.clientWidth ? elem.clientWidth - 10 : elem.naturalWidth - 10}px`;
    overlay.style.height = "0px";

    const boldedText = document.createElement("span");
    boldedText.style.paddingLeft = "5px"
    boldedText.appendChild(document.createTextNode("Warning"));
    boldedText.style.textDecoration = "underline";

    const deepfakeText = document.createTextNode(": potential deepfake");

    const closeButton = document.createElement("span");
    closeButton.classList.add("deepfakeoverlay-close");
    closeButton.appendChild(document.createTextNode("Ignore"));
    closeButton.onclick = () => closeButton.parentNode.style.height = "0px";

    overlay.appendChild(boldedText);
    overlay.appendChild(deepfakeText);
    overlay.appendChild(closeButton);

    elem.parentNode.insertBefore(overlay, elem);

    setTimeout(() => {
      overlay.style.height = "40px"; //animate slide-in
    }, 0);

  }
}

const runScan = () => {
  chrome.storage.sync.get('enabled', data => {
    if (data.enabled) scan();
  });
}

window.addEventListener ("load", runScan, false);
