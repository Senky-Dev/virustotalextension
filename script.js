var port = chrome.runtime.connect();
async function sendM(api_key) {
  const response = await chrome.runtime.sendMessage({ API_KEY: api_key });
  if (response.success) {
    document.getElementById("api_key_box").remove();
  }
}

function submit() {
  sendM(document.getElementById("api").value);
}

document.getElementById("submit").addEventListener("click", submit);


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let message = document.createElement("h1");
        message.innerText = request.status;
        document.body.appendChild(message);

        sendResponse({ success: true });
        return true;
    }
);


window.onload = ()=>{
    chrome.storage.sync.get(["status"]).then(async (result) => {
        console.log(result.status)
        if(result.status != undefined){
            let message = document.createElement("h1");
            message.innerText = result.status;
            message.id = "status"
            document.body.appendChild(message);
        }
        else{
            if(document.getElementById("status")!=undefined){
                document.body.removeChild(document.getElementById("status"))
            }    
        }
    })
    console.log("hello")
}

