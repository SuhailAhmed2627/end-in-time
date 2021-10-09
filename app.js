async function getCurrentTab() {
   let queryOptions = { active: true, currentWindow: true };
   let tab = await chrome.tabs.query(queryOptions);
   return tab;
}

const injectScript = async () => {
   getCurrentTab().then(([tab]) => {
      console.log(tab);
      chrome.scripting.executeScript({
         target: { tabId: tab.id },
         files: ["endInTime.js"],
      });
   });
};

const setEndTime = () => {
   console.log("emmememe");
   injectScript();
};

document.getElementById("set").addEventListener("click", setEndTime);
