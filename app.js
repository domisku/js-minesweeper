const gameboardSize = 9;
const mines = gameboardSize;
let mineCoords = [];

renderGameboard();

function renderGameboard() {
  const modal = document.getElementById('modal');
  if (!modal.classList.contains('hidden')) closeModal();
  const gameboard = document.getElementById("gameboard");
  gameboard.innerHTML = '';
  mineCoords = [];
  generateMines();

  for (let i = 1; i <= gameboardSize ** 2; i++) {
    const gameSquare = document.createElement("div");
    gameSquare.className = "game-square hidden-block";
    gameSquare.id = i;
    gameSquare.addEventListener("click", revealSquare);
    gameSquare.addEventListener("contextmenu", flagSquare);

    function flagSquare(event) {
      event.preventDefault();
      if (event.target.classList.contains("flagged"))
        event.target.classList.remove("flagged");
      else if (event.target.classList.contains("hidden-block"))
        event.target.classList.add("flagged");
    }

    function revealSquare(event) {
      const eventClassList = event.target.classList;

      if (eventClassList.contains("flagged")) return;

      eventClassList.remove("hidden-block");
      if (eventClassList.contains("mine")) {
        document.querySelectorAll(".game-square").forEach((square) => {
          square.classList.remove("hidden-block");
          if (square.classList.contains("flagged"))
            square.classList.remove("flagged");
        });
        showModal('You lost!');
      }

      if (event.target.textContent === "") revealExtraSquares(i);

      checkIfGameOver();

      function checkIfGameOver() {
        let counter = 0;
        document.querySelectorAll(".game-square").forEach((square) => {
          if (square.classList.contains("hidden-block")) counter++;
        });

        if (counter === 9) showModal('You won!');
      }

      function revealExtraSquares(i) {
        const squaresToCheck = findSquaresToCheck(i);
        document.querySelectorAll(".game-square").forEach((square) => {
          if (
            squaresToCheck.includes(+square.id) &&
            square.classList.contains("hidden-block")
          ) {
            if (square.classList.contains("flagged"))
              square.classList.remove("flagged");
            square.classList.remove("hidden-block");
            if (square.textContent === "") {
              revealExtraSquares(parseInt(square.id));
            }
          }
        });
      }
    }

    if (mineCoords.includes(i)) gameSquare.classList.add("mine");
    else {
      const minesAroundSquare = countMinesAroundSquare();
      if (minesAroundSquare) {
        gameSquare.textContent = String(minesAroundSquare);
        switch (minesAroundSquare) {
          case 1:
            gameSquare.classList.add("one");
            break;
          case 2:
            gameSquare.classList.add("two");
            break;
          case 3:
            gameSquare.classList.add("three");
            break;
          default:
            gameSquare.classList.add("four-plus");
            break;
        }
      }
    }

    function findSquaresToCheck(i) {
      let coordsAroundSquareToCheck = [];
      const dirs = {
        right: i + 1,
        left: i - 1,
        top: i - gameboardSize,
        bot: i + gameboardSize,
        topLeft: i - gameboardSize - 1,
        topRight: i - gameboardSize + 1,
        botLeft: i + gameboardSize - 1,
        botRight: i + gameboardSize + 1,
      };

      if (i % 9 === 0) {
        coordsAroundSquareToCheck = [
          dirs.left,
          dirs.bot,
          dirs.top,
          dirs.botLeft,
          dirs.topLeft,
        ];
      } else if ((i - 1) % 9 === 0) {
        coordsAroundSquareToCheck = [
          dirs.right,
          dirs.bot,
          dirs.top,
          dirs.botRight,
          dirs.topRight,
        ];
      } else {
        coordsAroundSquareToCheck = [
          dirs.right,
          dirs.left,
          dirs.bot,
          dirs.top,
          dirs.botRight,
          dirs.botLeft,
          dirs.topRight,
          dirs.topLeft,
        ];
      }

      return coordsAroundSquareToCheck;
    }

    function countMinesAroundSquare() {
      let squaresToCheck = findSquaresToCheck(i);

      let counter = 0;
      squaresToCheck.forEach((coordinate) =>
        isMine(coordinate) ? counter++ : null
      );

      function isMine(coordinate) {
        if (mineCoords.includes(coordinate)) return true;
        else return false;
      }

      return counter;
    }
    gameboard.appendChild(gameSquare);
  }
}

function generateMines() {
  for (let i = 0; i < mines; i++) {
    const mineCoord = Math.ceil(Math.random() * gameboardSize ** 2);
    if (mineCoords.includes(mineCoord)) {
      i--;
      continue;
    }
    mineCoords.push(mineCoord);
  }
}

function showModal(message) {
  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modal-overlay');

  modal.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');

  const msg = document.createElement('h2');
  const msgText = document.createTextNode(message);
  msg.appendChild(msgText);

  modal.appendChild(msg);

  const btn = document.createElement('button');
  btn.className = 'modal__btn';
  const btnText = document.createTextNode('Play again?');
  btn.appendChild(btnText);

  btn.addEventListener('click', renderGameboard);

  modal.appendChild(btn);
}

function closeModal() {
  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modal-overlay');
  modal.innerHTML = '';

  modal.classList.add('hidden');
  modalOverlay.classList.add('hidden');
}
