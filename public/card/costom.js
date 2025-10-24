// document.addEventListener("DOMContentLoaded", function () {
//   const flipCard = document.querySelector(".flip-card");
//   let isFlipped = false; // Track the current state of the card

//   // Flip the card 1 second after the page loads
//   setTimeout(function () {
//     flipCard.querySelector(".flip-card__front-side").style.transform =
//       "rotateX(180deg)";
//     flipCard.querySelector(".flip-card__back-side").style.transform =
//       "rotateX(0deg)";

//     // Flip it back after another 1 second
//     setTimeout(function () {
//       flipCard.querySelector(".flip-card__front-side").style.transform =
//         "rotateX(0deg)";
//       flipCard.querySelector(".flip-card__back-side").style.transform =
//         "rotateX(-180deg)";
//     }, 1000); // 1-second delay before flipping back
//   }, 1000); // 1-second delay before first flip

//   // Add touch event listener
//   // flipCard.addEventListener("touchstart", function () {
//   //   console.log("yess it touched");
//   //   // if (isFlipped) {
//   //   //   flipCard.querySelector(".flip-card__front-side").style.transform =
//   //   //     "rotateX(0deg)";
//   //   //   flipCard.querySelector(".flip-card__back-side").style.transform =
//   //   //     "rotateX(-180deg)";
//   //   // } else {
//   //   //   flipCard.querySelector(".flip-card__front-side").style.transform =
//   //   //     "rotateX(180deg)";
//   //   //   flipCard.querySelector(".flip-card__back-side").style.transform =
//   //   //     "rotateX(0deg)";
//   //   // }
//   //   // isFlipped = !isFlipped; // Toggle the flip state
//   // });
//   // Function to handle the flip action
//   // Function to handle the flip action
//   function handleFlip() {
//     console.log("Flipping card...");
//     const frontSide = flipCard.querySelector(".flip-card__front-side");
//     const backSide = flipCard.querySelector(".flip-card__back-side");

//     if (isFlipped) {
//       frontSide.style.transform = "rotateY(0deg)";
//       backSide.style.transform = "rotateY(180deg)";
//     } else {
//       frontSide.style.transform = "rotateY(-180deg)";
//       backSide.style.transform = "rotateY(0deg)";
//     }
//     isFlipped = !isFlipped; // Toggle the flip state
//   }

//   // Add event listeners for both click and touchstart
//   flipCard.addEventListener("click", function () {
//     console.log("Clicked!");
//     handleFlip();
//   });

//   flipCard.addEventListener(
//     "touchstart",
//     function (e) {
//       e.preventDefault(); // Prevents default touch behavior (e.g., scrolling)
//       console.log("Touched!");
//       handleFlip();
//     },
//     { passive: false }
//   );
// });

document.addEventListener("DOMContentLoaded", function () {
  const flipCard = document.querySelector(".flip-card");

  if (!flipCard) return; // Stop execution if the element is not found

  let isFlipped = false; // Track the current state of the card

  // Set the initial state of the card when the page loads (using X-axis for initial flip)
  flipCard.querySelector(".flip-card__front-side").style.transform = "rotateX(0deg)";
  flipCard.querySelector(".flip-card__back-side").style.transform = "rotateX(-180deg)";

  // Flip the card 1 second after the page loads (using X-axis)
  setTimeout(function () {
    flipCard.querySelector(".flip-card__front-side").style.transform = "rotateX(-180deg)";
    flipCard.querySelector(".flip-card__back-side").style.transform = "rotateX(0deg)";

    // Flip it back after another 1 second (using X-axis)
    setTimeout(function () {
      flipCard.querySelector(".flip-card__front-side").style.transform = "rotateX(0deg)";
      flipCard.querySelector(".flip-card__back-side").style.transform = "rotateX(-180deg)";
    }, 1000); // 1-second delay before flipping back
  }, 1000); // 1-second delay before first flip

  // Add touch event listener
  function handleFlip() {
    console.log("Flipping card...");
    const frontSide = flipCard.querySelector(".flip-card__front-side");
    const backSide = flipCard.querySelector(".flip-card__back-side");

    if (isFlipped) {
      // Flip upside down (using X-axis)
      frontSide.style.transform = "rotateX(0deg)";
      backSide.style.transform = "rotateX(-180deg)";
    } else {
      // Flip upside down (using X-axis)
      frontSide.style.transform = "rotateX(180deg)";
      backSide.style.transform = "rotateX(0deg)";
    }
    isFlipped = !isFlipped; // Toggle the flip state
  }

  // Add event listeners for both click and touchstart
  flipCard.addEventListener("click", function () {
    console.log("Clicked!");
    handleFlip();
  });

  flipCard.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault(); // Prevents default touch behavior (e.g., scrolling)
      console.log("Touched!");
      handleFlip();
    },
    { passive: false }
  );
});
