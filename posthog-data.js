document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      const frame = document.querySelector("#posthog-frame");
      const actualUrl = frame.getAttribute("data-src");
      frame.setAttribute("src", actualUrl);
    }, 500);
  });