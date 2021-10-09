[...document.querySelectorAll('[role="button"]')].forEach((div) => {
   if (div.innerHTML.includes(">Submit</span>")) {
      div.click();
   }
});
