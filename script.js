let chessboard = document.getElementById("chessboard");
let message;

let colorTurn = "white";
let squares = [];
let idSquare = 0;
let piece;
let idBlackPiece = 0;
let idWhitePiece = 0;
let listBlackPieceMove = [];
let listBlackCheckMove = [];
let listWhitePieceMove = [];
let listWhiteCheckMove = [];
let listBlackPiece = [];
let listWhitePiece = [];
let isWhiteKingCheck = false;
let isBlackKingCheck = false;
let checkingKingPiece;
let listInterceptSquare;
let listBlackBlockingPiece;
let castle = false;
let lastPawnMove;
let promotingPawn;
let listPromotionPieces;

function newgame() {

  chessboard = document.getElementById("chessboard");
  chessboard.textContent = "";
  message = document.getElementById("message");
  message.textContent = "";
  listPromotionPieces = document.getElementById("white_pieces");
  listPromotionPieces.style.display = "none";
  listPromotionPieces = document.getElementById("black_pieces");
  listPromotionPieces.style.display = "none";
  
  colorTurn = "white";
  squares = [];
  idSquare = 0;
  piece;
  idBlackPiece = 0;
  idWhitePiece = 0;
  listBlackPieceMove = [];
  listBlackCheckMove = [];
  listWhitePieceMove = [];
  listWhiteCheckMove = [];
  listBlackPiece = [];
  listWhitePiece = [];
  isWhiteKingCheck = false;
  isBlackKingCheck = false;
  checkingKingPiece;
  listInterceptSquare;
  listBlackBlockingPiece;
  castle = false;
  lastPawnMove;
  promotingPawn;
  
  for (i = 0; i < 8; i++) {
    // * Création d'une ligne de l'échiquier
    let squareRow = [];
  
    for (j = 0; j < 8; j++) {
      // * Création d'un carré de l'échiquier
      let newSquare = document.createElement("div");
      newSquare.classList.add("square");
      newSquare.dataset.x = j;
      newSquare.dataset.y = i;
      newSquare.dataset.clickevent = true;
  
      // * Détermination de la couleur du carré courant
      if ((j + i + 1) % 2 == 0) {
        newSquare.classList.add("black");
      } else {
        newSquare.classList.add("white");
      }
  
      // * Création de l'évènement de click du carré courant
      newSquare.addEventListener("click", onClickSquareHandler);
  
      // * Création des pièces à leur position de départ
      if ([0, 1, 6, 7].includes(i)) {
        createPieces(newSquare);
      }
  
      // * Ajout du carré courant à la ligne courante
      squareRow[j] = newSquare;
      // * Ajout du carré à l'échiquier
      chessboard.appendChild(newSquare);
    }
  
    // * Ajout de la ligne courante à la liste de carrés
    squares[i] = squareRow;
  }
  updateListMove(listWhitePiece, "white");
  updateListMove(listBlackPiece, "black");
}

function onClickSquareHandler(event) {
  onClickSquare(event.currentTarget);
}

function onClickSquare(square) {
  piece = square.firstChild;
  if (piece && piece.dataset.color == colorTurn && !castle) {
    // * Si une pièce possédant la couleur qui joue sur ce tour existe sur ce carré,
    // * récupère ces mouvements possibles
    setMoveAvailableSquare(square);
  } else if (square.classList.contains("move_possible")) {
    // * Si le carré est un mouvement possible de la pièce sélectionnée,
    // * déplace la pièce
    movePiece(square);
  } else {
    // * Sinon, vide les carrés
    clearSquares();
  }
}

/**
 * Création des pièces à leur position de départ
 *
 * @param {*} square
 *        Le carré
 */
function createPieces(square) {
  squareX = square.dataset.x;
  squareY = square.dataset.y;

  // * Création des pions noirs
  if (squareY == 1) {
    addPiece(square, "black_pawn");
  }
  // * Création des tours noires
  if (squareY == 0 && (squareX == 0 || squareX == 7)) {
    addPiece(square, "black_rook");
  }
  // * Création des cavaliers noirs
  if (squareY == 0 && (squareX == 1 || squareX == 6)) {
    addPiece(square, "black_knight");
  }
  // * Création des fous noirs
  if (squareY == 0 && (squareX == 2 || squareX == 5)) {
    addPiece(square, "black_bishop");
  }
  // * Création de la reine noire
  if (squareY == 0 && squareX == 3) {
    addPiece(square, "black_queen");
  }
  // * Création du roi noir
  if (squareY == 0 && squareX == 4) {
    addPiece(square, "black_king");
  }

  // * Création des pions blancs
  if (squareY == 6) {
    addPiece(square, "white_pawn");
  }
  // * Création des tours blanches
  if (squareY == 7 && (squareX == 0 || squareX == 7)) {
    addPiece(square, "white_rook");
  }
  // * Création des cavaliers blancs
  if (squareY == 7 && (squareX == 1 || squareX == 6)) {
    addPiece(square, "white_knight");
  }
  // * Création des fous blancs
  if (squareY == 7 && (squareX == 2 || squareX == 5)) {
    addPiece(square, "white_bishop");
  }
  // * Création de la reine blanche
  if (squareY == 7 && squareX == 3) {
    addPiece(square, "white_queen");
  }
  // * Création du roi blanc
  if (squareY == 7 && squareX == 4) {
    addPiece(square, "white_king");
  }
}

function updateListMove(listSquare, color) {
  if (color === "white") {
    listWhitePieceMove = [];
    listWhiteCheckMove = [];
    listBlackBlockingPiece = [];
  } else {
    listBlackPieceMove = [];
    listBlackCheckMove = [];
    listWhiteBlockingPiece = [];
  }

  for (curSquare of listSquare) {
    let curPiece = curSquare.firstChild;

    if (curPiece) {
      // * Récupération des informations de la pièce sélectionnée
      let xPiece = parseInt(curSquare.dataset.x);
      let yPiece = parseInt(curSquare.dataset.y);
      let idPiece = curPiece.dataset.id;
      let squarePiece = curPiece.dataset.piece;
      let pieceColor = curPiece.dataset.color;
      let isStarting = curPiece.dataset.start;

      if (pieceColor === "white") {
        listWhitePieceMove[idPiece] = [];
      } else {
        listBlackPieceMove[idPiece] = [];
      }
      let listPossibleMove = [];

      let potentialPiece;

      // * Trouve de quel type de pièce il s'agit
      if (squarePiece === "white_pawn") {
        if (
          checkEdge(xPiece, yPiece - 1) &&
          !squares[yPiece - 1][xPiece].firstChild
        ) {
          listPossibleMove.push(squares[yPiece - 1][xPiece]);
        }
        if (
          checkEdge(xPiece, yPiece - 2) &&
          isStarting &&
          !squares[yPiece - 2][xPiece].firstChild
        ) {
          listPossibleMove.push(squares[yPiece - 2][xPiece]);
        }
        if (checkEdge(xPiece - 1, yPiece - 1)) {
          potentialPiece = squares[yPiece - 1][xPiece - 1].firstChild;
          if (potentialPiece && potentialPiece.dataset.color === "black") {
            listPossibleMove.push(squares[yPiece - 1][xPiece - 1]);
          }
          listWhiteCheckMove.push(squares[yPiece - 1][xPiece - 1]);
        }
        if (checkEdge(xPiece + 1, yPiece - 1)) {
          potentialPiece = squares[yPiece - 1][xPiece + 1].firstChild;
          if (potentialPiece && potentialPiece.dataset.color === "black") {
            listPossibleMove.push(squares[yPiece - 1][xPiece + 1]);
          }
          listWhiteCheckMove.push(squares[yPiece - 1][xPiece + 1]);
        }
        if (yPiece == 3) {
          if (checkEdge(xPiece - 1, yPiece)) {
            potentialPiece = squares[yPiece][xPiece - 1].firstChild;
            if (potentialPiece && potentialPiece.dataset.piece.includes("black_pawn")) {
              if (lastPawnMove.dataset) {
                if (parseInt(potentialPiece.parentElement.dataset.y) - parseInt(lastPawnMove.dataset.y) == 2) {
                  listPossibleMove.push(squares[yPiece - 1][xPiece - 1]);
                  squares[yPiece - 1][xPiece - 1].dataset.enpassant = true;
                }
              }
            }
          }
          if (checkEdge(xPiece + 1, yPiece)) {
            potentialPiece = squares[yPiece][xPiece + 1].firstChild;
            if (potentialPiece && potentialPiece.dataset.piece.includes("black_pawn")) {
              if (lastPawnMove.dataset) {
                if (parseInt(potentialPiece.parentElement.dataset.y) - parseInt(lastPawnMove.dataset.y) == 2) {
                  listPossibleMove.push(squares[yPiece - 1][xPiece + 1]);
                  squares[yPiece - 1][xPiece + 1].dataset.enpassant = true;
                }
              }
            }
          }
        }
      } else if (squarePiece === "black_pawn") {
        if (
          checkEdge(xPiece, yPiece + 1) &&
          !squares[yPiece + 1][xPiece].firstChild
        ) {
          listPossibleMove.push(squares[yPiece + 1][xPiece]);
        }
        if (
          checkEdge(xPiece, yPiece + 2) &&
          isStarting &&
          !squares[yPiece + 2][xPiece].firstChild
        ) {
          listPossibleMove.push(squares[yPiece + 2][xPiece]);
        }
        if (checkEdge(xPiece - 1, yPiece + 1)) {
          potentialPiece = squares[yPiece + 1][xPiece - 1].firstChild;
          if (potentialPiece && potentialPiece.dataset.color === "white") {
            listPossibleMove.push(squares[yPiece + 1][xPiece - 1]);
          }
          listBlackCheckMove.push(squares[yPiece + 1][xPiece - 1]);
        }
        if (checkEdge(xPiece + 1, yPiece + 1)) {
          potentialPiece = squares[yPiece + 1][xPiece + 1].firstChild;
          if (potentialPiece && potentialPiece.dataset.color === "white") {
            listPossibleMove.push(squares[yPiece + 1][xPiece + 1]);
          }
          listBlackCheckMove.push(squares[yPiece + 1][xPiece + 1]);
        }
        if (yPiece == 4) {
          if (checkEdge(xPiece - 1, yPiece)) {
            potentialPiece = squares[yPiece][xPiece - 1].firstChild;
            if (potentialPiece && potentialPiece.dataset.piece.includes("white_pawn")) {
              if (lastPawnMove.dataset) {
                if (parseInt(lastPawnMove.dataset.y) - parseInt(potentialPiece.parentElement.dataset.y) == 2) {
                  listPossibleMove.push(squares[yPiece + 1][xPiece - 1]);
                  squares[yPiece + 1][xPiece - 1].dataset.enpassant = true;
                }
              }
            }
          }
          if (checkEdge(xPiece + 1, yPiece)) {
            potentialPiece = squares[yPiece][xPiece + 1].firstChild;
            if (potentialPiece && potentialPiece.dataset.piece.includes("white_pawn")) {
              if (lastPawnMove.dataset) {
                if (parseInt(lastPawnMove.dataset.y) - parseInt(potentialPiece.parentElement.dataset.y) == 2) {
                  listPossibleMove.push(squares[yPiece + 1][xPiece + 1]);
                  squares[yPiece + 1][xPiece + 1].dataset.enpassant = true;
                }
              }
            }
          }
        }
      } else if (squarePiece.includes("rook")) {
        let topFound = false;
        let topPiece;
        let bottomFound = false;
        let bottomPiece;
        let leftFound = false;
        let leftPiece;
        let rightFound = false;
        let rightPiece;

        for (i = 1; i < 8; i++) {
          if (checkEdge(xPiece, yPiece - i)) {
            potentialPiece = squares[yPiece - i][xPiece].firstChild;
            if (
              !topFound &&
              (!potentialPiece || potentialPiece.dataset.color != pieceColor)
            ) {
              listPossibleMove.push(squares[yPiece - i][xPiece]);
            } else {
              if (topFound) {
                let topPieceName = topPiece.dataset.piece;
                if (topPiece.dataset.color != pieceColor) {
                  if (topPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece - i][xPiece]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece - i][xPiece]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(topPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(topPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece - i][xPiece]);
                } else {
                  listBlackCheckMove.push(squares[yPiece - i][xPiece]);
                }
              }
            }
            if (!topFound && potentialPiece) {
              topFound = true;
              topPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece, yPiece + i)) {
            potentialPiece = squares[yPiece + i][xPiece].firstChild;
            if (
              !bottomFound &&
              (!potentialPiece || potentialPiece.dataset.color != pieceColor)
            ) {
              listPossibleMove.push(squares[yPiece + i][xPiece]);
            } else {
              if (bottomFound) {
                let bottomPieceName = bottomPiece.dataset.piece;
                if (bottomPiece.dataset.color != pieceColor) {
                  if (bottomPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece + i][xPiece]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece + i][xPiece]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(bottomPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(bottomPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece + i][xPiece]);
                } else {
                  listBlackCheckMove.push(squares[yPiece + i][xPiece]);
                }
              }
            }
            if (!bottomFound && potentialPiece) {
              bottomFound = true;
              bottomPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece - i, yPiece)) {
            potentialPiece = squares[yPiece][xPiece - i].firstChild;
            if (!leftFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece][xPiece - i]);
              }
            } else {
              if (leftFound) {
                let leftPieceName = leftPiece.dataset.piece;
                if (leftPiece.dataset.color != pieceColor) {
                  if (leftPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece][xPiece - i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece][xPiece - i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(leftPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(leftPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece][xPiece - i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece][xPiece - i]);
                }
              }
            }
            if (!leftFound && potentialPiece) {
              leftFound = true;
              leftPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece + i, yPiece)) {
            potentialPiece = squares[yPiece][xPiece + i].firstChild;
            if (!rightFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece][xPiece + i]);
              }
            } else {
              if (rightFound) {
                let rightPieceName = rightPiece.dataset.piece;
                if (rightPiece.dataset.color != pieceColor) {
                  if (rightPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece][xPiece + i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece][xPiece + i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(rightPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(rightPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece][xPiece + i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece][xPiece + i]);
                }
              }
            }
            if (!rightFound && potentialPiece) {
              rightFound = true;
              rightPiece = potentialPiece;
            }
          }
        }
        if (pieceColor == "white") {
          listWhiteCheckMove = listWhiteCheckMove.concat(listPossibleMove);
        } else {
          listBlackCheckMove = listBlackCheckMove.concat(listPossibleMove);
        }
      } else if (squarePiece.includes("knight")) {
        if (checkEdge(xPiece - 1, yPiece - 2)) {
          potentialPiece = squares[yPiece - 2][xPiece - 1].firstChild;
          if (!potentialPiece || (potentialPiece && potentialPiece.dataset.color != pieceColor)) {
            listPossibleMove.push(squares[yPiece - 2][xPiece - 1]);
          }
        }
        if (checkEdge(xPiece + 1, yPiece - 2)) {
          potentialPiece = squares[yPiece - 2][xPiece + 1].firstChild;
          if (!potentialPiece || (potentialPiece && potentialPiece.dataset.color != pieceColor)) {
            listPossibleMove.push(squares[yPiece - 2][xPiece + 1]);
          }
        }
        if (checkEdge(xPiece + 2, yPiece - 1)) {
          potentialPiece = squares[yPiece - 1][xPiece + 2].firstChild;
          if (!potentialPiece || (potentialPiece && potentialPiece.dataset.color != pieceColor)) {
            listPossibleMove.push(squares[yPiece - 1][xPiece + 2]);
          }
        }
        if (checkEdge(xPiece + 2, yPiece + 1)) {
          potentialPiece = squares[yPiece + 1][xPiece + 2].firstChild;
          if (!potentialPiece || (potentialPiece && potentialPiece.dataset.color != pieceColor)) {
            listPossibleMove.push(squares[yPiece + 1][xPiece + 2]);
          }
        }
        if (checkEdge(xPiece + 1, yPiece + 2)) {
          potentialPiece = squares[yPiece + 2][xPiece + 1].firstChild;
          if (!potentialPiece || (potentialPiece && potentialPiece.dataset.color != pieceColor)) {
            listPossibleMove.push(squares[yPiece + 2][xPiece + 1]);
          }
        }
        if (checkEdge(xPiece - 1, yPiece + 2)) {
          potentialPiece = squares[yPiece + 2][xPiece - 1].firstChild;
          if (!potentialPiece || (potentialPiece && potentialPiece.dataset.color != pieceColor)) {
            listPossibleMove.push(squares[yPiece + 2][xPiece - 1]);
          }
        }
        if (checkEdge(xPiece - 2, yPiece + 1)) {
          potentialPiece = squares[yPiece + 1][xPiece - 2].firstChild;
          if (!potentialPiece || (potentialPiece && potentialPiece.dataset.color != pieceColor)) {
            listPossibleMove.push(squares[yPiece + 1][xPiece - 2]);
          }
        }
        if (checkEdge(xPiece - 2, yPiece - 1)) {
          potentialPiece = squares[yPiece - 1][xPiece - 2].firstChild;
          if (!potentialPiece || (potentialPiece && potentialPiece.dataset.color != pieceColor)) {
            listPossibleMove.push(squares[yPiece - 1][xPiece - 2]);
          }
        }

        if (pieceColor == "white") {
          listWhiteCheckMove = listWhiteCheckMove.concat(listPossibleMove);
        } else {
          listBlackCheckMove = listBlackCheckMove.concat(listPossibleMove);
        }

      } else if (squarePiece.includes("bishop")) {
        let topRightFound = false;
        let topRightPiece;
        let topLeftFound = false;
        let topLeftPiece;
        let bottomRightFound = false;
        let bottomRightPiece;
        let bottomLeftFound = false;
        let bottomLeftPiece;

        for (i = 1; i < 8; i++) {
          if (checkEdge(xPiece + i, yPiece - i)) {
            potentialPiece = squares[yPiece - i][xPiece + i].firstChild;
            if (!topRightFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece - i][xPiece + i]);
              }
            } else {
              if (topRightFound) {
                let topRightPieceName = topRightPiece.dataset.piece;
                if (topRightPiece.dataset.color != pieceColor) {
                  if (topRightPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece - i][xPiece + i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece - i][xPiece + i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(topRightPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(topRightPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece - i][xPiece + i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece - i][xPiece + i]);
                }
              }
            }
            if (!topRightFound && potentialPiece) {
              topRightFound = true;
              topRightPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece - i, yPiece - i)) {
            potentialPiece = squares[yPiece - i][xPiece - i].firstChild;
            if (!topLeftFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece - i][xPiece - i]);
              }
            } else {
              if (topLeftFound) {
                let topLeftPieceName = topLeftPiece.dataset.piece;
                if (topLeftPiece.dataset.color != pieceColor) {
                  if (topLeftPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece - i][xPiece - i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece - i][xPiece - i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(topLeftPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(topLeftPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece - i][xPiece - i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece - i][xPiece - i]);
                }
              }
            }
            if (!topLeftFound && potentialPiece) {
              topLeftFound = true;
              topLeftPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece + i, yPiece + i)) {
            potentialPiece = squares[yPiece + i][xPiece + i].firstChild;
            if (!bottomRightFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece + i][xPiece + i]);
              }
            } else {
              if (bottomRightFound) {
                let bottomRightPieceName = bottomRightPiece.dataset.piece;
                if (bottomRightPiece.dataset.color != pieceColor) {
                  if (bottomRightPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece + i][xPiece + i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece + i][xPiece + i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(bottomRightPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(bottomRightPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece + i][xPiece + i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece + i][xPiece + i]);
                }
              }
            }
            if (!bottomRightFound && potentialPiece) {
              bottomRightFound = true;
              bottomRightPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece - i, yPiece + i)) {
            potentialPiece = squares[yPiece + i][xPiece - i].firstChild;
            if (!bottomLeftFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece + i][xPiece - i]);
              }
            } else {
              if (bottomLeftFound) {
                let bottomLeftPieceName = bottomLeftPiece.dataset.piece;
                if (bottomLeftPiece.dataset.color != pieceColor) {
                  if (bottomLeftPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece + i][xPiece - i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece + i][xPiece - i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(bottomLeftPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(bottomLeftPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece + i][xPiece - i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece + i][xPiece - i]);
                }
              }
            }
            if (!bottomLeftFound && potentialPiece) {
              bottomLeftFound = true;
              bottomLeftPiece = potentialPiece;
            }
          }
        }
        if (pieceColor == "white") {
          listWhiteCheckMove = listWhiteCheckMove.concat(listPossibleMove);
        } else {
          listBlackCheckMove = listBlackCheckMove.concat(listPossibleMove);
        }
      } else if (squarePiece.includes("queen")) {
        let topFound = false;
        let topPiece;
        let bottomFound = false;
        let bottomPiece;
        let leftFound = false;
        let leftPiece;
        let rightFound = false;
        let rightPiece;
        let topRightFound = false;
        let topRightPiece;
        let topLeftFound = false;
        let topLeftPiece;
        let bottomRightFound = false;
        let bottomRightPiece;
        let bottomLeftFound = false;
        let bottomLeftPiece;

        for (i = 1; i < 8; i++) {
          if (checkEdge(xPiece, yPiece - i)) {
            potentialPiece = squares[yPiece - i][xPiece].firstChild;
            if (
              !topFound &&
              (!potentialPiece || potentialPiece.dataset.color != pieceColor)
            ) {
              listPossibleMove.push(squares[yPiece - i][xPiece]);
            } else {
              if (topFound) {
                let topPieceName = topPiece.dataset.piece;
                if (topPiece.dataset.color != pieceColor) {
                  if (topPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece - i][xPiece]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece - i][xPiece]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(topPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(topPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece - i][xPiece]);
                } else {
                  listBlackCheckMove.push(squares[yPiece - i][xPiece]);
                }
              }
            }
            if (!topFound && potentialPiece) {
              topFound = true;
              topPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece, yPiece + i)) {
            potentialPiece = squares[yPiece + i][xPiece].firstChild;
            if (
              !bottomFound &&
              (!potentialPiece || potentialPiece.dataset.color != pieceColor)
            ) {
              listPossibleMove.push(squares[yPiece + i][xPiece]);
            } else {
              if (bottomFound) {
                let bottomPieceName = bottomPiece.dataset.piece;
                if (bottomPiece.dataset.color != pieceColor) {
                  if (bottomPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece + i][xPiece]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece + i][xPiece]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(bottomPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(bottomPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece + i][xPiece]);
                } else {
                  listBlackCheckMove.push(squares[yPiece + i][xPiece]);
                }
              }
            }
            if (!bottomFound && potentialPiece) {
              bottomFound = true;
              bottomPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece - i, yPiece)) {
            potentialPiece = squares[yPiece][xPiece - i].firstChild;
            if (!leftFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece][xPiece - i]);
              }
            } else {
              if (leftFound) {
                let leftPieceName = leftPiece.dataset.piece;
                if (leftPiece.dataset.color != pieceColor) {
                  if (leftPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece][xPiece - i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece][xPiece - i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(leftPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(leftPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece][xPiece - i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece][xPiece - i]);
                }
              }
            }
            if (!leftFound && potentialPiece) {
              leftFound = true;
              leftPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece + i, yPiece)) {
            potentialPiece = squares[yPiece][xPiece + i].firstChild;
            if (!rightFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece][xPiece + i]);
              }
            } else {
              if (rightFound) {
                let rightPieceName = rightPiece.dataset.piece;
                if (rightPiece.dataset.color != pieceColor) {
                  if (rightPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece][xPiece + i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece][xPiece + i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(rightPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(rightPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece][xPiece + i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece][xPiece + i]);
                }
              }
            }
            if (!rightFound && potentialPiece) {
              rightFound = true;
              rightPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece + i, yPiece - i)) {
            potentialPiece = squares[yPiece - i][xPiece + i].firstChild;
            if (!topRightFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece - i][xPiece + i]);
              }
            } else {
              if (topRightFound) {
                let topRightPieceName = topRightPiece.dataset.piece;
                if (topRightPiece.dataset.color != pieceColor) {
                  if (topRightPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece - i][xPiece + i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece - i][xPiece + i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(topRightPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(topRightPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece - i][xPiece + i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece - i][xPiece + i]);
                }
              }
            }
            if (!topRightFound && potentialPiece) {
              topRightFound = true;
              topRightPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece - i, yPiece - i)) {
            potentialPiece = squares[yPiece - i][xPiece - i].firstChild;
            if (!topLeftFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece - i][xPiece - i]);
              }
            } else {
              if (topLeftFound) {
                let topLeftPieceName = topLeftPiece.dataset.piece;
                if (topLeftPiece.dataset.color != pieceColor) {
                  if (topLeftPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece - i][xPiece - i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece - i][xPiece - i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(topLeftPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(topLeftPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece - i][xPiece - i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece - i][xPiece - i]);
                }
              }
            }
            if (!topLeftFound && potentialPiece) {
              topLeftFound = true;
              topLeftPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece + i, yPiece + i)) {
            potentialPiece = squares[yPiece + i][xPiece + i].firstChild;
            if (!bottomRightFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece + i][xPiece + i]);
              }
            } else {
              if (bottomRightFound) {
                let bottomRightPieceName = bottomRightPiece.dataset.piece;
                if (bottomRightPiece.dataset.color != pieceColor) {
                  if (bottomRightPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece + i][xPiece + i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece + i][xPiece + i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(bottomRightPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(bottomRightPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece + i][xPiece + i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece + i][xPiece + i]);
                }
              }
            }
            if (!bottomRightFound && potentialPiece) {
              bottomRightFound = true;
              bottomRightPiece = potentialPiece;
            }
          }
          if (checkEdge(xPiece - i, yPiece + i)) {
            potentialPiece = squares[yPiece + i][xPiece - i].firstChild;
            if (!bottomLeftFound) {
              if (
                !potentialPiece ||
                potentialPiece.dataset.color != pieceColor
              ) {
                listPossibleMove.push(squares[yPiece + i][xPiece - i]);
              }
            } else {
              if (bottomLeftFound) {
                let bottomLeftPieceName = bottomLeftPiece.dataset.piece;
                if (bottomLeftPiece.dataset.color != pieceColor) {
                  if (bottomLeftPieceName.includes("king")) {
                    if (
                      !potentialPiece ||
                      potentialPiece.dataset.color == pieceColor
                    ) {
                      if (pieceColor == "white") {
                        listWhiteCheckMove.push(squares[yPiece + i][xPiece - i]);
                      } else {
                        listBlackCheckMove.push(squares[yPiece + i][xPiece - i]);
                      }
                    }
                  } else {
                    if (
                      potentialPiece &&
                      potentialPiece.dataset.piece.includes("king")
                    ) {
                      if (potentialPiece.dataset.color == "white") {
                        listWhiteBlockingPiece.push(bottomLeftPiece.parentElement);
                      } else {
                        listBlackBlockingPiece.push(bottomLeftPiece.parentElement);
                      }
                    }
                  }
                }
              } else if (potentialPiece.dataset.color == pieceColor) {
                if (pieceColor == "white") {
                  listWhiteCheckMove.push(squares[yPiece + i][xPiece - i]);
                } else {
                  listBlackCheckMove.push(squares[yPiece + i][xPiece - i]);
                }
              }
            }
            if (!bottomLeftFound && potentialPiece) {
              bottomLeftFound = true;
              bottomLeftPiece = potentialPiece;
            }
          }
        }
        if (pieceColor == "white") {
          listWhiteCheckMove = listWhiteCheckMove.concat(listPossibleMove);
        } else {
          listBlackCheckMove = listBlackCheckMove.concat(listPossibleMove);
        }
      } else if (squarePiece.includes("king")) {
        // * cas où il s'agit d'un roi
        if (checkEdge(xPiece, yPiece - 1)) {
          potentialPiece = squares[yPiece - 1][xPiece].firstChild;
          if (
            !potentialPiece ||
            (potentialPiece && potentialPiece.dataset.color !== pieceColor)
          ) {
            listPossibleMove.push(squares[yPiece - 1][xPiece]);
          }
          if (pieceColor === "white") {
            listWhiteCheckMove.push(squares[yPiece - 1][xPiece]);
          } else {
            listBlackCheckMove.push(squares[yPiece - 1][xPiece]);
          }
        }
        if (checkEdge(xPiece + 1, yPiece - 1)) {
          potentialPiece = squares[yPiece - 1][xPiece + 1].firstChild;
          if (
            !potentialPiece ||
            (potentialPiece && potentialPiece.dataset.color !== pieceColor)
          ) {
            listPossibleMove.push(squares[yPiece - 1][xPiece + 1]);
          }
          if (pieceColor === "white") {
            listWhiteCheckMove.push(squares[yPiece - 1][xPiece + 1]);
          } else {
            listBlackCheckMove.push(squares[yPiece - 1][xPiece + 1]);
          }
        }
        if (checkEdge(xPiece + 1, yPiece)) {
          potentialPiece = squares[yPiece][xPiece + 1].firstChild;
          if (
            !potentialPiece ||
            (potentialPiece && potentialPiece.dataset.color !== pieceColor)
          ) {
            listPossibleMove.push(squares[yPiece][xPiece + 1]);
          }
          if (pieceColor === "white") {
            listWhiteCheckMove.push(squares[yPiece][xPiece + 1]);
          } else {
            listBlackCheckMove.push(squares[yPiece][xPiece + 1]);
          }
        }
        if (checkEdge(xPiece + 1, yPiece + 1)) {
          potentialPiece = squares[yPiece + 1][xPiece + 1].firstChild;
          if (
            !potentialPiece ||
            (potentialPiece && potentialPiece.dataset.color !== pieceColor)
          ) {
            listPossibleMove.push(squares[yPiece + 1][xPiece + 1]);
          }
          if (pieceColor === "white") {
            listWhiteCheckMove.push(squares[yPiece + 1][xPiece + 1]);
          } else {
            listBlackCheckMove.push(squares[yPiece + 1][xPiece + 1]);
          }
        }
        if (checkEdge(xPiece, yPiece + 1)) {
          potentialPiece = squares[yPiece + 1][xPiece].firstChild;
          if (
            !potentialPiece ||
            (potentialPiece && potentialPiece.dataset.color !== pieceColor)
          ) {
            listPossibleMove.push(squares[yPiece + 1][xPiece]);
          }
          if (pieceColor === "white") {
            listWhiteCheckMove.push(squares[yPiece + 1][xPiece]);
          } else {
            listBlackCheckMove.push(squares[yPiece + 1][xPiece]);
          }
        }
        if (checkEdge(xPiece - 1, yPiece + 1)) {
          potentialPiece = squares[yPiece + 1][xPiece - 1].firstChild;
          if (
            !potentialPiece ||
            (potentialPiece && potentialPiece.dataset.color !== pieceColor)
          ) {
            listPossibleMove.push(squares[yPiece + 1][xPiece - 1]);
          }
          if (pieceColor === "white") {
            listWhiteCheckMove.push(squares[yPiece + 1][xPiece - 1]);
          } else {
            listBlackCheckMove.push(squares[yPiece + 1][xPiece - 1]);
          }
        }
        if (checkEdge(xPiece - 1, yPiece)) {
          potentialPiece = squares[yPiece][xPiece - 1].firstChild;
          if (
            !potentialPiece ||
            (potentialPiece && potentialPiece.dataset.color !== pieceColor)
          ) {
            listPossibleMove.push(squares[yPiece][xPiece - 1]);
          }
          if (pieceColor === "white") {
            listWhiteCheckMove.push(squares[yPiece][xPiece - 1]);
          } else {
            listBlackCheckMove.push(squares[yPiece][xPiece - 1]);
          }
        }
        if (checkEdge(xPiece - 1, yPiece - 1)) {
          potentialPiece = squares[yPiece - 1][xPiece - 1].firstChild;
          if (
            !potentialPiece ||
            (potentialPiece && potentialPiece.dataset.color !== pieceColor)
          ) {
            listPossibleMove.push(squares[yPiece - 1][xPiece - 1]);
          }
          if (pieceColor === "white") {
            listWhiteCheckMove.push(squares[yPiece - 1][xPiece - 1]);
          } else {
            listBlackCheckMove.push(squares[yPiece - 1][xPiece - 1]);
          }
        }
        if (isStarting) {
          let rook1 = squares[yPiece][0].firstChild;
          if (rook1 && rook1.dataset.start) {
            listPossibleMove.push(squares[yPiece][0]);
          }

          let rook2 = squares[yPiece][7].firstChild;
          if (rook2 && rook2.dataset.start) {
            listPossibleMove.push(squares[yPiece][7]);
          }
        }
      }

      if (pieceColor === "white") {
        listWhitePieceMove[idPiece] = listPossibleMove;
      } else {
        listBlackPieceMove[idPiece] = listPossibleMove;
      }
    }
  }
}

function checkEdge(xPiece, yPiece) {
  return xPiece >= 0 && xPiece < 8 && yPiece >= 0 && yPiece < 8;
}

/**
 * Mise en place des indications visuelles pour les mouvements possibles d'une pièce
 *
 * @param {*} selectedSquare
 *        Le carré sélectionné
 */
function setMoveAvailableSquare(selectedSquare) {
  clearSquares();
  let listMove;
  let listEnnemyMove;
  let listBlockingPiece;
  let king;
  let isKingCheck;
  let selectedPiece = selectedSquare.firstChild;

  if (selectedPiece.dataset.color === "white") {
    king = document.querySelectorAll("[data-piece = 'white_king']")[0]
      .parentElement;
    listMove = listWhitePieceMove[selectedPiece.dataset.id];
    listEnnemyMove = listBlackCheckMove;
    listBlockingPiece = listWhiteBlockingPiece;
    isKingCheck = isWhiteKingCheck;
  } else {
    king = document.querySelectorAll("[data-piece = 'black_king']")[0]
      .parentElement;
    listMove = listBlackPieceMove[selectedPiece.dataset.id];
    listEnnemyMove = listWhiteCheckMove;
    listBlockingPiece = listBlackBlockingPiece;
    isKingCheck = isBlackKingCheck;
  }

  selectedSquare.dataset.selected = true;

  let kingX = king.dataset.x;
  let kingY = king.dataset.y;
  let diffX;
  let diffY;

  if (listMove) {
    // itèration sur la liste des mouvements
    for (curSquare of listMove) {
      if (selectedPiece.dataset.piece.includes("king")) {
        if (listEnnemyMove.includes(curSquare)) {
          continue;
        }
      } else {
        if (isKingCheck) {
          let checkingKingPieceName = checkingKingPiece.firstChild.dataset.piece;
          if (
            (checkingKingPieceName.includes("pawn") ||
              checkingKingPieceName.includes("knight")) &&
            curSquare != checkingKingPiece
          ) {
            continue;
          } else {
            if (
              !checkingKingPieceName.includes("pawn") &&
              !checkingKingPieceName.includes("knight") &&
              curSquare != checkingKingPiece &&
              !listInterceptSquare.includes(curSquare)
            ) {
              continue;
            }
          }
        } else if (listBlockingPiece.includes(selectedSquare)) {
          diffX = parseInt(kingX) - selectedSquare.dataset.x;
          diffY = parseInt(kingY) - selectedSquare.dataset.y;

          if (diffX != 0 && diffY != 0 && Math.abs(diffX) != Math.abs(diffY)) {
            continue;
          }
          if (diffX == 0) {
            if (curSquare.dataset.x != kingX) {
              continue;
            }
          } else if (diffY == 0) {
            if (curSquare.dataset.y != kingY) {
              continue;
            }
          } else if (Math.abs(diffX) == Math.abs(diffY)) {
            if (
              Math.abs(parseInt(curSquare.dataset.x) - kingX) !=
              Math.abs(parseInt(curSquare.dataset.y) - kingY)
            ) {
              continue;
            }
          }
        }
      }
      if (curSquare.firstChild) {
        if (
          selectedPiece.dataset.piece.includes("king") &&
          curSquare.firstChild.dataset.piece.includes("rook")
        ) {
          checkCastleMove(curSquare, selectedSquare);
          if (!castle) {
            continue;
          }
        }
      }

      curSquare.classList.add("move_possible");
    }
  }
  
}

/**
 * Déplacement d'une pièce
 *
 * @param {*} targetedSquare
 *        Le carré cible
 */
function movePiece(targetedSquare) {
  // * Récupération du carré de départ
  let startingSquare = document.querySelectorAll("[data-selected = true]")[0];

  let piece = startingSquare.firstChild;

  delete piece.dataset.start;
  if (targetedSquare.firstChild) {
    if (piece.dataset.color == "white") {
      listBlackPiece[targetedSquare.firstChild.dataset.id] = "";
    } else {
      listWhitePiece[targetedSquare.firstChild.dataset.id] = "";
    }
    targetedSquare.removeChild(targetedSquare.firstChild);
  } else if (targetedSquare.dataset.enpassant && piece.dataset.piece.includes("pawn")) {
    let enPassantX = parseInt(targetedSquare.dataset.x);
    let enPassantY = parseInt(targetedSquare.dataset.y);
    let enemyPawnSquare;
    if (piece.dataset.color == "white") {
      listBlackPiece[squares[enPassantY + 1][enPassantX].firstChild.dataset.id] = "";
      enemyPawnSquare = squares[enPassantY + 1][enPassantX];
    } else {
      listWhitePiece[squares[enPassantY - 1][enPassantX].firstChild.dataset.id] = "";
      enemyPawnSquare = squares[enPassantY - 1][enPassantX];      
    }
    enemyPawnSquare.removeChild(enemyPawnSquare.firstChild);
  }
  targetedSquare.appendChild(startingSquare.firstChild);

  lastPawnMove = "";
  let colorPiece = piece.dataset.color;
  if (piece.dataset.piece.includes("pawn")) {
    lastPawnMove = startingSquare;
  }
  
  // * Ajout de la pièce au carré cible
  if (colorPiece === "white") {
    listWhitePiece[piece.dataset.id] = targetedSquare;
  } else {
    listBlackPiece[piece.dataset.id] = targetedSquare;
  }
  // * Vide les carrés
  clearSquares();

  if (piece.dataset.piece.includes("pawn") && (targetedSquare.dataset.y == 0 || targetedSquare.dataset.y == 7)) {
    pawnPromotion(targetedSquare);
  } else {

    console.log(listBlackPiece);
    // * Mise à jour de la liste des mouvements
    updateListMove(listWhitePiece, "white");
    updateListMove(listBlackPiece, "black");
    // * Vérification des statuts des rois
    checkKingStatus();
    // * Changement de tour
    changeColorTurn();
  }
}

function pawnPromotion(pawnSquare) {

  listWhitePieceMove = [];
  listBlackPieceMove = [];
  listWhiteCheckMove = [];
  listBlackCheckMove = [];

  if (pawnSquare) {
    let pawn = pawnSquare.firstChild;
    if (pawn) {
      promotingPawn = pawn;
      let colorPawn = pawn.dataset.color;
      if(colorPawn == "white") {
        listPromotionPieces = document.getElementById("white_pieces");
      } else {
        listPromotionPieces = document.getElementById("black_pieces");
      }
      listPromotionPieces.style.display = "block";
    }
  }
}

function promotion(type, color) {
  promotingPawn.src = "img/" + color + "_" + type + ".png";
  promotingPawn.dataset.piece = color + "_" + type;

  let listPromotionPieces;
  if(color == "white") {
    listPromotionPieces = document.getElementById("white_pieces");
  } else {
    listPromotionPieces = document.getElementById("black_pieces");
  }
  listPromotionPieces.style.display = "none";

  // * Mise à jour de la liste des mouvements
  updateListMove(listWhitePiece, "white");
  updateListMove(listBlackPiece, "black");
  // * Vérification des statuts des rois
  checkKingStatus();
  // * Changement de tour
  changeColorTurn();
}

/**
 * Vide les carrés
 */
function clearSquares() {
  // * Suppression des indications visuelles de mouvements possibles
  let movePossibleSquares = document.getElementsByClassName("move_possible");
  while (movePossibleSquares.length > 0) {
    movePossibleSquares[0].classList.remove("move_possible");
  }

  // * Suppression du status de sélection
  let selectedSquare = document.querySelectorAll("[data-selected = true]")[0];
  if (selectedSquare) {
    delete selectedSquare.dataset.selected;
    if (!selectedSquare.firstChild) {
      let enPassantSquare = document.querySelectorAll("[data-enpassant = true]")[0];
      if (enPassantSquare) {
        delete enPassantSquare.dataset.enpassant;
      }
    }
  }
  
  
  castle = false;
  let cornerSquare = [squares[0][0], squares[0][7], squares[7][0], squares[7][7]];
  for (corner of cornerSquare) {
    if (!corner.dataset.clickevent) {
      corner.addEventListener("click", onClickSquareHandler);
      corner.dataset.clickevent = true;

      corner.removeEventListener("mouseover", onMouseOverLeftRook);
      corner.removeEventListener("mouseover", onMouseOverRightRook);
      corner.removeEventListener("mouseout", onMouseOutRightRook);
      corner.removeEventListener("mouseout", onMouseOutLeftRook);
      corner.removeEventListener("click", onCastleClick);

      let rookCastleSquare = document.getElementsByClassName("castle_rook");
      if (rookCastleSquare[0]){
        rookCastleSquare[0].classList.remove("castle_rook");
      }
      if (rookCastleSquare[1]) {
        rookCastleSquare[1].classList.remove("castle_rook");
      }
      
      let kingCastleSquare = document.getElementsByClassName("castle_king");
      if (kingCastleSquare[0]){
        kingCastleSquare[0].classList.remove("castle_king");
      }
      if (kingCastleSquare[1]) {
        kingCastleSquare[1].classList.remove("castle_king");
      }
    }
  }

}

/**
 * Ajout d'une pièce à un carré
 *
 * @param {*} targetedSquare
 *        Le carré cible
 * @param {*} pieceName
 *        Le nom de la pièce
 */
function addPiece(targetedSquare, pieceName) {
  let colorPiece = pieceName.slice(0, 5);
  // * Création de la pièce
  let imgPiece = document.createElement("img");
  imgPiece.src = "./img/" + pieceName + ".png";
  imgPiece.classList.add("piece");
  imgPiece.dataset.piece = pieceName;
  imgPiece.dataset.color = colorPiece;
  imgPiece.dataset.start = true;

  if (colorPiece == "white") {
    imgPiece.dataset.id = idWhitePiece;
    listWhitePiece[idWhitePiece++] = targetedSquare;
  } else {
    imgPiece.dataset.id = idBlackPiece;
    listBlackPiece[idBlackPiece++] = targetedSquare;
  }

  // * Ajout de la pièce au carré
  targetedSquare.appendChild(imgPiece);
}

/**
 * Changement de tour
 */
function changeColorTurn() {
  if (colorTurn === "white") {
    colorTurn = "black";
  } else {
    colorTurn = "white";
  }
}

function checkKingStatus() {
  // * Récupération des rois
  let whiteKing = document.querySelectorAll("[data-piece = 'white_king']")[0]
    .parentElement;
  let blackKing = document.querySelectorAll("[data-piece = 'black_king']")[0]
    .parentElement;

  checkingKingPiece = "";
  listInterceptSquare = [];
  let kingPossibleMove;
  let kingMate = true;
  if (listBlackCheckMove.includes(whiteKing)) {
    isWhiteKingCheck = true;
    getCheckingPiece(whiteKing, listBlackPieceMove, listBlackPiece);
    getInterceptSquare(whiteKing, checkingKingPiece);
    kingPossibleMove = listWhitePieceMove[whiteKing.firstChild.dataset.id];
    if (listInterceptSquare.length > 0) {
      kingMate = false;
    } else {
      for (moveSquare of kingPossibleMove) {
        if (!listBlackCheckMove.includes(moveSquare)) {
          kingMate = false;
          break;
        }
      }
    }
  } else {
    isWhiteKingCheck = false;
  }
  if (listWhiteCheckMove.includes(blackKing)) {
    isBlackKingCheck = true;
    getCheckingPiece(blackKing, listWhitePieceMove, listWhitePiece);
    getInterceptSquare(blackKing, checkingKingPiece);
    kingPossibleMove = listBlackPieceMove[blackKing.firstChild.dataset.id];
    if (listInterceptSquare.length > 0) {
      kingMate = false;
    } else {
      for (moveSquare of kingPossibleMove) {
        if (!listWhiteCheckMove.includes(moveSquare)) {
          kingMate = false;
          break;
        }
      }
    }
  } else {
    isBlackKingCheck = false;
  }
  
  let messageDiv = document.getElementById("message");
  let checkMessage = document.getElementById("checkMessage");
  if (checkMessage) {
    messageDiv.removeChild(checkMessage);
  }
  if (isWhiteKingCheck) {
    checkMessage = document.createElement("h1");
    checkMessage.textContent = "White King Check";
    if (kingMate) {
      checkMessage.textContent = "White King Checkmate";
    }
    checkMessage.id = "checkMessage";
    messageDiv.appendChild(checkMessage);
  }
  if (isBlackKingCheck) {
    checkMessage = document.createElement("h2");
    checkMessage.textContent = "Black King Check";
    if (kingMate) {
      checkMessage.textContent = "Black King Checkmate";
    }
    checkMessage.id = "checkMessage";
    messageDiv.appendChild(checkMessage);
  }
}

function getCheckingPiece(kingSquare, listOfMoveList, listPieces) {
  for (moveList of listOfMoveList) {
    if (moveList) {
      if (moveList.includes(kingSquare)) {
        let idCheckingPiece = listOfMoveList.indexOf(moveList);
        console.log(idCheckingPiece);
        console.log(listPieces);
        console.log(listPieces[idCheckingPiece]);
        checkingKingPiece = listPieces[idCheckingPiece];
      }
    }
  }
}

function getInterceptSquare(kingSquare, checkingPiece) {
  let kingX = parseInt(kingSquare.dataset.x);
  let kingY = parseInt(kingSquare.dataset.y);
  console.log(checkingPiece);
  let checkingPieceX = parseInt(checkingPiece.dataset.x);
  let checkingPieceY = parseInt(checkingPiece.dataset.y);
  let checkingPieceName = checkingPiece.firstChild.dataset.piece;

  let diffX = kingX - checkingPieceX;
  let diffY = kingY - checkingPieceY;

  listInterceptSquare = [];

  if (
    !checkingPieceName.includes("pawn") &&
    !checkingPieceName.includes("knight")
  ) {
    if (diffX == 0 && diffY != 0) {
      if (diffY < 0) {
        for (i = 1; i < Math.abs(diffY); i++) {
          listInterceptSquare.push(squares[kingY + i][kingX]);
        }
      } else if (diffY > 0) {
        for (i = 1; i < Math.abs(diffY); i++) {
          listInterceptSquare.push(squares[kingY - i][kingX]);
        }
      }
    } else {
      if (diffX != 0 && diffY == 0) {
        if (diffX < 0) {
          for (i = 1; i < Math.abs(diffX); i++) {
            listInterceptSquare.push(squares[kingY][kingX + i]);
          }
        } else if (diffX > 0) {
          for (i = 1; i < Math.abs(diffX); i++) {
            listInterceptSquare.push(squares[kingY][kingX - i]);
          }
        }
      } else {
        if (Math.abs(diffX) == Math.abs(diffY)) {
          if (diffX < 0 && diffY < 0) {
            for (i = 1; i < Math.abs(diffX); i++) {
              listInterceptSquare.push(squares[kingY + i][kingX + i]);
            }
          } else if (diffX < 0 && diffY > 0) {
            for (i = 1; i < Math.abs(diffX); i++) {
              listInterceptSquare.push(squares[kingY - i][kingX + i]);
            }
          } else if (diffX > 0 && diffY < 0) {
            for (i = 1; i < Math.abs(diffX); i++) {
              listInterceptSquare.push(squares[kingY + i][kingX - i]);
            }
          } else if (diffX > 0 && diffY > 0) {
            for (i = 1; i < Math.abs(diffX); i++) {
              listInterceptSquare.push(squares[kingY - i][kingX - i]);
            }
          }
        }
      }
    }
  }
}

function checkCastleMove(rookSquare, kingSquare) {
  let rook = rookSquare.firstChild;
  let king = kingSquare.firstChild;
  let isKingCheck = false;
  let listEnemyMove;
  if (king.dataset.color == "white") {
    isKingCheck = isWhiteKingCheck;
    listEnemyMove = listBlackCheckMove;
  } else {
    isKingCheck = isBlackKingCheck;
    listEnemyMove = listWhiteCheckMove;
  }

  castle = false;

  if (rook.dataset.color == king.dataset.color) {
    if (rook.dataset.start && king.dataset.start && !isKingCheck) {
      let rookX = parseInt(rookSquare.dataset.x);
      let kingX = parseInt(kingSquare.dataset.x);
      let kingY = parseInt(kingSquare.dataset.y);

      let diffX = kingX - rookX;

      if (diffX > 0) {
        if (
          !squares[kingY][kingX - 1].firstChild &&
          !listEnemyMove.includes(squares[kingY][kingX - 1])
        ) {
          if (
            !squares[kingY][kingX - 2].firstChild &&
            !listEnemyMove.includes(squares[kingY][kingX - 2])
          ) {
            if (!squares[kingY][kingX - 3].firstChild) {
              castle = true;

              rookSquare.addEventListener("mouseover", onMouseOverLeftRook);

              rookSquare.addEventListener("mouseout", onMouseOutLeftRook);

              rookSquare.removeEventListener("click", onClickSquareHandler);
              delete rookSquare.dataset.clickevent;

              rookSquare.addEventListener("click", onCastleClick);              
            }
          }
        }
      } else if (diffX < 0) {
        if (
          !squares[kingY][kingX + 1].firstChild &&
          !listEnemyMove.includes(squares[kingY][kingX + 1])
        ) {
          if (
            !squares[kingY][kingX + 2].firstChild &&
            !listEnemyMove.includes(squares[kingY][kingX + 2])
          ) {
            castle = true;

            rookSquare.addEventListener("mouseover", onMouseOverRightRook);

            rookSquare.addEventListener("mouseout", onMouseOutRightRook);

            rookSquare.removeEventListener("click", onClickSquareHandler);
            delete rookSquare.dataset.clickevent;

            rookSquare.addEventListener("click", onCastleClick);
          }
        }
      }
    }
  }
}

function onMouseOverLeftRook(event) {
  let rook = event.currentTarget;
  let rookX = parseInt(rook.dataset.x);
  let rookY = parseInt(rook.dataset.y);
  squares[rookY][rookX + 3].classList.add("castle_rook");
  squares[rookY][rookX + 2].classList.add("castle_king");
}

function onMouseOutLeftRook(event) {
  let rook = event.currentTarget;
  let rookX = parseInt(rook.dataset.x);
  let rookY = parseInt(rook.dataset.y);  
  squares[rookY][rookX + 3].classList.remove("castle_rook");
  squares[rookY][rookX + 2].classList.remove("castle_king");
}

function onMouseOverRightRook(event) {
  let rook = event.currentTarget;
  let rookX = parseInt(rook.dataset.x);
  let rookY = parseInt(rook.dataset.y);
  squares[rookY][rookX - 2].classList.add("castle_rook");
  squares[rookY][rookX - 1].classList.add("castle_king");
}

function onMouseOutRightRook(event) {
  let rook = event.currentTarget;
  let rookX = parseInt(rook.dataset.x);
  let rookY = parseInt(rook.dataset.y);  
  squares[rookY][rookX - 2].classList.remove("castle_rook");
  squares[rookY][rookX - 1].classList.remove("castle_king");
}

function onCastleClick(event) {
  let rookSquare = event.currentTarget;
  let rookX = parseInt(rookSquare.dataset.x);
  let rookY = parseInt(rookSquare.dataset.y);
  let kingSquare = squares[rookY][4];
  let kingX = parseInt(kingSquare.dataset.x);
  let kingY = parseInt(kingSquare.dataset.y);

  let rookPiece = rookSquare.firstChild;
  let kingPiece = kingSquare.firstChild;

  delete rookPiece.dataset.start;
  delete kingPiece.dataset.start;

  if (rookX == 0) {

    squares[rookY][rookX + 3].appendChild(rookSquare.firstChild);
    squares[kingY][kingX - 2].appendChild(kingSquare.firstChild);
  
    let colorPiece = kingPiece.dataset.color;
    // * Ajout de la pièce au carré cible
    if (colorPiece === "white") {
      listWhitePiece[rookPiece.dataset.id] = squares[rookY][rookX + 3];
      listWhitePiece[kingPiece.dataset.id] = squares[kingY][kingX - 2];
    } else {
      listBlackPiece[rookPiece.dataset.id] = squares[rookY][rookX + 3];
      listBlackPiece[rookPiece.dataset.id] = squares[kingY][kingX - 2];
    }
  } else if (rookX == 7) {

    squares[rookY][rookX - 2].appendChild(rookSquare.firstChild);
    squares[kingY][kingX + 2].appendChild(kingSquare.firstChild);
  
    let colorPiece = kingPiece.dataset.color;
    // * Ajout de la pièce au carré cible
    if (colorPiece === "white") {
      listWhitePiece[rookPiece.dataset.id] = squares[rookY][rookX - 2];
      listWhitePiece[kingPiece.dataset.id] = squares[kingY][kingX + 2];
    } else {
      listBlackPiece[rookPiece.dataset.id] = squares[rookY][rookX - 2];
      listBlackPiece[rookPiece.dataset.id] = squares[kingY][kingX + 2];
    }
    
  }

  // * Vide les carrés
  clearSquares();
  // * Changement de tour
  changeColorTurn();
  // * Mise à jour de la liste des mouvements
  updateListMove(listWhitePiece, "white");
  updateListMove(listBlackPiece, "black");
  // * Vérification des statuts des rois
  checkKingStatus();
}
