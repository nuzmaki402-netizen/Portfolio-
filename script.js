
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

  /* -------------------------
     Smooth Typing Animation
  --------------------------*/
  const textElement = document.querySelector(".text h1 span");
  const phrases = ["about it!", "with passion!", "every day!", "to inspire others!"];
  let i = 0, j = 0, currentPhrase = [], isDeleting = false;

  function loop() {
    textElement.style.transition = "all 0.5s ease-in-out";
    textElement.textContent = currentPhrase.join("");

    if (i < phrases.length) {
      if (!isDeleting && j <= phrases[i].length) {
        currentPhrase.push(phrases[i][j]);
        j++;
      } else if (isDeleting && j > 0) {
        currentPhrase.pop();
        j--;
      } else if (!isDeleting && j === phrases[i].length) {
        isDeleting = true;
        setTimeout(loop, 1200);
        return;
      } else if (isDeleting && j === 0) {
        isDeleting = false;
        i++;
        if (i === phrases.length) i = 0;
      }
    }

    const speed = isDeleting ? 80 : 120;
    setTimeout(loop, speed);
  }
  loop();

  /* -------------------------
     Button Click Effects
  --------------------------*/
  const getInTouchBtn = document.querySelector(".btn button:first-child");
  const downloadBtn = document.querySelector(".btn button:last-child");

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
  const fadeElements = document.querySelectorAll(".poster, .list, .contact-form, .contact-info, .icon img, .text, .btn");
  fadeElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.8s ease-out";
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeElements.forEach(el => observer.observe(el));

})

// theme button

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
