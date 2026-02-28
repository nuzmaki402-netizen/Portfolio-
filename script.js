document.addEventListener("DOMContentLoaded", () => {

  /* Typing */

  const text = document.querySelector(".text h1 span");

  if (text) {

    const words = ["about it!", "with passion!", "every day!", "to inspire!"];

    let w = 0, c = 0, del = false;

    function type() {

      const word = words[w];

      if (!del) {

        text.textContent = word.slice(0, c++);
        if (c > word.length) {
          del = true;
          setTimeout(type, 800);
          return;
        }

      } else {

        text.textContent = word.slice(0, c--);

        if (c < 0) {
          del = false;
          w = (w + 1) % words.length;
        }

      }

      setTimeout(type, del ? 60 : 100);
    }

    type();
  }


  /* Scroll Animation */

  const items = document.querySelectorAll(
    ".poster, .contact-form, .contact-info, .icon img, .text, .btn"
  );

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(e => {

      if (e.isIntersecting) {
        e.target.classList.add("show");
        e.target.classList.remove("hide");
      }

    });

  }, { threshold: 0.2 });

  items.forEach(el => {
    el.classList.add("hide");
    observer.observe(el);
  });

});




// button click
 const getInTouchBtn = document.getElementById("contactBtn");
const downloadBtn = document.getElementById("downloadBtn");


  getInTouchBtn.addEventListener("click", () => {
    alert("Thanks for reaching out! Scroll down to the contact section 👇");
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
  });

  downloadBtn.addEventListener("click", () => {
    alert("Your CV is being prepared for download!");
    // Example: Replace with actual file link
    window.open("cv.pdf", "_blank");
  });

// theme button
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme");
}

let btn = document.getElementById("themebtn");
btn.addEventListener("click", () => {
  document.body.classList.toggle("ligth-theme");
  if (btn.innerText === "Light-Mode") {
    btn.innerText = "Dark-Mode";
     localStorage.setItem("theme", "light");
  } else {
    btn.innerText = "Light-Mode";
     localStorage.setItem("theme", "dark");
  }
});












