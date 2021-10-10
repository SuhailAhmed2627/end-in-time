if (timeOuts == undefined) {
   var timeOuts = [];
}

chrome.storage.sync.get(["endTime"], (result) => {
   if (timeOuts) {
      for (let i = 0; i < timeOuts.length; i++) {
         clearTimeout(timeOuts[i]);
      }
   }
   const endTime = +result.endTime;
   const submitForm = () => {
      chrome.storage.sync.set({ endTime: "" });
      [...document.querySelectorAll('[role="button"]')].forEach((div) => {
         if (
            div.innerHTML.includes(">Submit</span>") &&
            Date.now() - endTime >= 0 &&
            Date.now() - endTime <= 5000
         ) {
            div.click();
         }
      });
   };
   timeOuts.push(setTimeout(submitForm, endTime - Date.now()));
});
