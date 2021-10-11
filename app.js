const messageDOM = document.getElementById("message");
const hhDOM = document.getElementById("hh");
const mmDOM = document.getElementById("mm");
const ssDOM = document.getElementById("ss");
const ampmDOM = document.getElementById("ampm");

async function getCurrentTab() {
   let queryOptions = { active: true, currentWindow: true };
   let tab = await chrome.tabs.query(queryOptions);
   return tab;
}

const injectScript = async () => {
   getCurrentTab().then(([tab]) => {
      chrome.scripting.executeScript({
         target: { tabId: tab.id },
         files: ["endInTime.js"],
      });
   });
   messageDOM.innerText = "Auto Submit Set";
};

chrome.storage.local.get(["endTime"], (result) => {
   if (result.endTime == "" || result.endTime == undefined) {
      return;
   }
   const time = new Date(+result.endTime);
   messageDOM.innerText = `Submit at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
});

const setEndTime = () => {
   if (hhDOM.value > 12 || mmDOM.value > 59 || ssDOM.value > 59) {
      messageDOM.innerText = "Invalid Time";
      return;
   }

   const now = new Date();
   const endTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      +hhDOM.value + (ampmDOM.value == "pm" ? 12 : 0),
      +mmDOM.value,
      +ssDOM.value
   );
   if (endTime - Date.now() <= 2000) {
      messageDOM.innerText = "Select Appropriate Time";
      return;
   }
   chrome.storage.local.set(
      { endTime: JSON.stringify(endTime.getTime()) },
      injectScript
   );
};

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
   let url = tabs[0].url;
   if (!url.startsWith("https://docs.google.com/forms")) {
      messageDOM.innerText = "Not a GForm Page";
      return;
   }
   document.getElementById("set").addEventListener("click", setEndTime);
});
