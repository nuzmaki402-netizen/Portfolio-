
// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     Smooth Scroll Navigation
  --------------------------*/
  document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
});

  /* -------------------------
     Smooth Typing Animation
  --------------------------*/
  const text = document.querySelector(".text h1 span");

if (!text) return; // safety

  
 const words = [
    "about it!",
     "with passion!",
      "every day!",
      "to inspire others!"
      ];
  
   let wordindex =0;
   let charindex =0;
   let deleting = false;

function typeEffect() {
  let currentword = words[wordindex];

if (!deleting) {
  text.textContent = currentword.slice(0,charindex +1);
  charindex++;


if (charindex === currentword.length) {
  setTimeout(()=> deleting=true,1000);
}
}

else{
  text.textContent = currentword.slice(0, charindex-1);
  charindex--;

  if (charindex === 0) {
    deleting= false;
    wordindex = (wordindex + 1)% words.length;
  }
}
setTimeout(() => {
  deleting = true;
}, 1000);

}

typeEffect();
  


  /* -------------------------
     Button Click Effects
  --------------------------*/
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

  /* -------------------------
     Premium Scroll Animations
  --------------------------*/
  const Elements = document.querySelectorAll(
  ".poster, .contact-form, .contact-info, .icon img, .text, .btn"
);

 
  const scrollobserver = new IntersectionObserver(
    entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        entry.target.classList.remove("hide")
      }
      else{
        entry.target.classList.remove("show")
        entry.target.classList.add("hide")
      }
    });
  }, { threshold: 0.2 });

  Elements.forEach(el =>{
    el.classList.add("hide");
    scrollobserver.observe(el);
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












