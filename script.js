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
    
    if (c === word.length) {
      del = true;
      setTimeout(type, 1000);
      return;
    }

  } else {

    text.textContent = word.slice(0, c--);

    if (c === 0) {
      del = false;
      w = (w + 1) % words.length;
      setTimeout(type, 300);
      return;
    }

  }

  setTimeout(type, del ? 60 : 100);
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

  } else {

    e.target.classList.remove("show");
    e.target.classList.add("hide");

  }

});


    });

  }, { threshold: 0.2 });

  items.forEach(el => {
    el.classList.add("hide");
    observer.observe(el);
  });


  /* Buttons */

  const getInTouchBtn = document.getElementById("contactBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  if (getInTouchBtn) {

    getInTouchBtn.addEventListener("click", () => {
      document
        .getElementById("contact")
        .scrollIntoView({ behavior: "smooth" });
    });

  }

  if (downloadBtn) {

    downloadBtn.addEventListener("click", () => {
      window.open("cv.pdf", "_blank");
    });

  }


  /* Theme */

  const btn = document.getElementById("themebtn");

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
    btn.textContent = "Dark-Mode";
  }

  btn.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {

      btn.textContent = "Dark-Mode";
      localStorage.setItem("theme", "light");

    } else {

      btn.textContent = "Light-Mode";
      localStorage.setItem("theme", "dark");

    }

  });

});
