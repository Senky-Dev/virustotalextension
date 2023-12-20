chrome.downloads.onCreated.addListener((e) => {
  let urlData = new FormData();
  urlData.append("url", e.url);
  chrome.storage.sync.get(["api"]).then(async (result) => {
    const res = await fetch("https://www.virustotal.com/api/v3/urls", {
      method: "POST",

      headers: {
        "x-apikey": "" + result.api,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlData,
    });
    const data = await res.json();
    const aid = await data["data"]["id"];
    const analysis = await fetch(
      "https://www.virustotal.com/api/v3/analyses/" + (await aid),
      {
        method: "GET",

        headers: {
          "x-apikey": "" + result.api,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const adata = await analysis.json();
    const stats = await adata["data"]["attributes"]["stats"];
    let status = "null";
    if ((await stats["malicious"]) > 0) {
      status = "malicious";
    } else {
      status = "normal";
    }
    console.log(status)
    chrome.storage.sync.set({ status:status }).then(() => {});
    window.open("index.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");

  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.API_KEY != null){  
    chrome.storage.sync.set({ api: request.API_KEY }).then(() => {});

    sendResponse({ success: true });
  }
});




chrome.runtime.onConnect.addListener(function (externalPort) {
    externalPort.onDisconnect.addListener(function() {
        var ignoreError = chrome.runtime.lastError;
        chrome.storage.sync.set({ status:undefined }).then(() => {
          console.log("Cleared Storage")
        });
    });
})