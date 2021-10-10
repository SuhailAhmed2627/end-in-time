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
};

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
   chrome.storage.sync.set(
      { endTime: JSON.stringify(endTime.getTime()) },
      injectScript
   );
};

document.getElementById("set").addEventListener("click", setEndTime);
