# ticTacToe

An implementation of Tic-Tac-Toe.  The user can pick which mark (X or O) he/she wants to be and can play another human opponent or the computer.

### Game Modes

The game has two modes:
* Player vs. Player
* Player vs. Computer

In player vs. player, opponents take turns until a winner is declared or the game ends in a tie.

In player vs. computer, the player will play against a "smart" AI.  The AI for this game is **not** unbeatable, but it will logically play the game (blocking a player's potential win or taking the win, if available).  The game will conclude when someone wins or the game ends in a tie.

Games won are tracked via each respective players's scoreboard.

### Winning

Get 3 in a row (horizontally, vertically, or diagonally).

### Other Notes

At the start of each game, the starting player will be swapped (i.e. Player 1 starts 1st game, Player starts 2nd game...).

The user can reset after a game has finished.  Resetting sets all scores back to zero and allows the user to pick a new mark (X or O) and a new game mode.

Live demo seen here:

[Github Pages](https://m-catha.github.io/ticTacToe/)
