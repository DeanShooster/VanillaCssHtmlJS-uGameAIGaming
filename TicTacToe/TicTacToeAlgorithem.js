const about = document.getElementById('about');
const closeAbout = document.getElementById('close-about-modal');
const rules = document.getElementById('rules');

/**
 * Opens the 'About' modal.
 */
about.addEventListener('click',()=>{
    document.getElementById('about-modal').className = '';
});
/**
 * Closes the 'About' modal.
 */
closeAbout.addEventListener('click', ()=>{
    document.getElementById('about-modal').className = 'hidden';
});

/**
 * Opens 'wiki' TicTacToe page.
 */
rules.addEventListener('click',()=>{
    window.open('https://en.wikipedia.org/wiki/Tic-tac-toe');
});

/**
 * Defines the TicTacToe algorithm game.
 */
class TicTacToeBoard
{
    constructor ()
    {   // Matrix defines TicTacToe board.
        this.matrix = [ 
            ['','',''],
            ['','',''],
            ['','','']];
        this.moves = 0;
    }

    GetMatrix() { return this.matrix; }
    MakePlayerMove(x,y) { this.matrix[x][y] = 'X'; this.moves++; }
    MakeAIMove(x,y) { this.matrix[x][y] = 'O'; }

    /**
     * Checks if player move is legal by checking occupation of a box.
     * @param {Row number} x 
     * @param {Col number} y 
     * @returns true if legal otherwise false.
     */
    IsLegalMove(x,y)
    {
        if( this.matrix[x][y] === '' )
            return true;
        else
            return false;
    }

    /**
     * Checks if there is a win condition on board defines by sign value.
     * @param {X/O sign} sign 
     * @returns true if player/AI won.
     */
    IsWon(sign)
    {
        if( 
        (this.matrix[0][0] === sign && this.matrix[0][1] === sign && this.matrix[0][2] === sign) ||
        (this.matrix[1][0] === sign && this.matrix[1][1] === sign && this.matrix[1][2] === sign) ||
        (this.matrix[2][0] === sign && this.matrix[2][1] === sign && this.matrix[2][2] === sign) ||
        (this.matrix[0][0] === sign && this.matrix[1][1] === sign && this.matrix[2][2] === sign) ||
        (this.matrix[0][2] === sign && this.matrix[1][1] === sign && this.matrix[2][0] === sign) ||
        (this.matrix[0][0] === sign && this.matrix[1][0] === sign && this.matrix[2][0] === sign) || 
        (this.matrix[0][1] === sign && this.matrix[1][1] === sign && this.matrix[2][1] === sign) || 
        (this.matrix[0][2] === sign && this.matrix[1][2] === sign && this.matrix[2][2] === sign))
            return true;
        else
            return false;
    }

    /**
     * Checks if game is drawn by checking if there are available moves.
     * @returns true if game is drawn.
     */
    IsDraw()
    {
        if( this.moves >= 9 )
            return true;
        else
            return false;
    }

    /**
     * Checks which one of the 9 possible victory path was met and returns the path as an array.
     * @param {X/O Sign} sign 
     * @returns array which contains the victory path.
     */
    GetVictoryPath(sign)
    {
        if( this.matrix[0][0] === sign && this.matrix[0][1] === sign && this.matrix[0][2] === sign )
            return ['00','01','02'];
        if( this.matrix[1][0] === sign && this.matrix[1][1] === sign && this.matrix[1][2] === sign )
            return ['10','11','12'];
        if( this.matrix[2][0] === sign && this.matrix[2][1] === sign && this.matrix[2][2] === sign )
            return ['20','21','22'];
        if( this.matrix[0][0] === sign && this.matrix[1][0] === sign && this.matrix[2][0] === sign )
            return ['00','10','20'];
        if( this.matrix[0][1] === sign && this.matrix[1][1] === sign && this.matrix[2][1] === sign )
            return ['01','11','21'];
        if( this.matrix[0][2] === sign && this.matrix[1][2] === sign && this.matrix[2][2] === sign )
            return ['02','12','22'];
        if( this.matrix[0][0] === sign && this.matrix[1][1] === sign && this.matrix[2][2] === sign )
            return ['00','11','22'];
        if( this.matrix[0][2] === sign && this.matrix[1][1] === sign && this.matrix[2][0] === sign )
            return ['02','11','20'];
    }

    /**
     * Resets the board to the original form for the next game.
     */
    Reset()
    {
        for(let i = 0; i < 3; i++)
            for(let j = 0; j < 3; j++)
                this.matrix[i][j] = '';
        this.moves = 0;
    }

    /**
     * AI algorithm for TicTacToe.
     * This AI is beatable in certain ways ( randomized ).
     * @returns Array which holds the AI target cell move as i,j indexes.
     */
    AIMove()
    {
        let targetCell = 0;
        if( this.moves === 1 ) // Handles first moves.
        {
            if( this.matrix[1][1] === 'X' ) // Targets corner is player played center.
            {
                while( targetCell != 1 && targetCell != 3 && targetCell != 7 && targetCell != 9 )
                    targetCell = Math.floor( Math.random() * 9 ) + 1;
                let cell = this.CellToIndexConvertor(targetCell);
                this.matrix[cell[0]][cell[1]] = 'O'; this.moves++;
                return cell;
            }
            else // Targets center if player targets anything else.
            {
                this.matrix[1][1] = 'O'; this.moves++;
                return [1,1];
            }
        }
        else
        {
            let victory = this.IsAbleToWin('O');
            if( victory.length > 0 ) // AI Wins if possible.
            {
                this.matrix[victory[0]][victory[1]] = 'O'; this.moves++;
                return victory;
            }
            victory = this.IsAbleToWin('X');
            if( victory.length > 0 ) // AI Blocks player if player can win.
            {
                this.matrix[victory[0]][victory[1]] = 'O'; this.moves++;
                return victory;
            }

            targetCell = Math.floor( Math.random() * 9 ) + 1;
            let cell = this.CellToIndexConvertor(targetCell);
            while( this.matrix[cell[0]][cell[1]] != '' ) // Random move if none of the above is applied in order to make a winning chance.
            {
                targetCell = Math.floor( Math.random() * 9 ) + 1;
                cell = this.CellToIndexConvertor(targetCell);
            }
            this.matrix[cell[0]][cell[1]] = 'O'; this.moves++;
            return cell;
        }
    }

    /**
     * Checks if player or AI can win the game.
     * @param {X/O Player sign.} sign 
     * @returns Array which holds the target cell which claims the victory.
     */
    IsAbleToWin(sign)
    {
        for(let i = 0; i < 3; i++ ) // Handles rows and columns.
        {
            let rowCounter = 0, colCounter = 0;
            for(let j = 0; j < 3; j++ )
            {
                if( this.matrix[i][j] === sign )
                    rowCounter++;
                if( this.matrix[j][i] === sign )
                    colCounter++;
            }
            if( rowCounter === 2 )
                for( let j = 0; j < 3; j++ )
                    if( this.matrix[i][j] === '' )
                        return [i,j];
            if( colCounter === 2 )
                for( let j = 0; j < 3; j++ )
                    if( this.matrix[j][i] === '' )
                        return [j,i];
        }
        let topToBottomDiagonal = 0, bottomToTopDiagonal = 0;
        for( let i = 0; i < 3; i++) // Handles diagonals.
        {
            if( this.matrix[i][i] === sign )
                topToBottomDiagonal++;
            if( this.matrix[2-i][i] === sign )
                bottomToTopDiagonal++;
        }
        if( topToBottomDiagonal === 2)
            for( let i = 0; i < 3; i++)
                if( this.matrix[i][i] === '' )
                    return [i,i];
        if( bottomToTopDiagonal === 2 )
            for( let i = 0; i < 3; i++)
                if( this.matrix[2-i][i] === '' )
                    return [2-i,i];
        return []; // Returns empty if there is no possible winning path.
    }

    /**
     * Gets a matrix cell number and converts into an array which holds i,j indexes.
     * @param {Matrix cell number 1-9.} cellNum 
     * @returns Array which holds the matrix target cell index.
     */
    CellToIndexConvertor(cellNum)
    {
        switch(cellNum)
        {
            case 1:
                return [0,0];
            case 2:
                return [0,1];
            case 3:
                return [0,2];
            case 4:
                return [1,0];
            case 5:
                return [1,1];
            case 6:
                return [1,2];
            case 7:
                return [2,0];
            case 8:
                return [2,1];
            case 9:
                return [2,2];
        }
    }
}

/**
 * Defines the visualization of the TicTacToe board and controls the flow of the game ( Calls for logic and render ).
 */
class TicTacToeVisual
{
    constructor (boardElement)
    {
        this.visualBoard = document.getElementById(boardElement);
    }

    /**
     * Controls the flow of the game logic and render wise.
     * @param {Logic X/O matrix board.} gameBoard 
     */
    SetBoardLogicEventControl(gameBoard)
    {   
        this.visualBoard.addEventListener('click', (e)=>{
            let xTarget = e.target.id[5], yTarget = e.target.id[6];
            if( gameBoard.IsLegalMove(xTarget,yTarget) )
            {
                gameBoard.MakePlayerMove(xTarget,yTarget);
                this.RenderMove(xTarget,yTarget,'X');
                if( gameBoard.IsWon('X') )
                    return this.FinishGame('X-won',gameBoard.GetVictoryPath('X'),gameBoard);
                if( gameBoard.IsDraw() )
                    return this.FinishGame('',[],gameBoard);
                let AI_Target = gameBoard.AIMove();
                setTimeout(() => {
                    this.RenderMove(AI_Target[0],AI_Target[1],'O');
                }, 1200);
                if( gameBoard.IsWon('O') )
                {
                    setTimeout(() => {
                        return this.FinishGame('O-won',gameBoard.GetVictoryPath('O'),gameBoard);
                    }, 1200);
                } 
            }
        })
    }

    /**
     * Updates the visual board with player/AI signs.
     * @param {row number} x 
     * @param {col number} y 
     * @param {X/O sign} sign 
     */
    RenderMove(x,y,sign)
    {
        let boxTarget = document.getElementById('cell-'.concat(x).concat(y));
        if( sign === 'X')
        {
            document.getElementById('spam-wall').className = '';
            boxTarget.innerHTML = 'X';
        } 
        else
        {
            document.getElementById('spam-wall').className = 'hidden';
            boxTarget.innerHTML = 'O';
        }
    }

    /**
     * Resets the visual board for the next game.
     */
    Reset()
    {
        document.getElementById('cell-00').innerHTML = '';
        document.getElementById('cell-01').innerHTML = '';
        document.getElementById('cell-02').innerHTML = '';
        document.getElementById('cell-10').innerHTML = '';
        document.getElementById('cell-11').innerHTML = '';
        document.getElementById('cell-12').innerHTML = '';
        document.getElementById('cell-20').innerHTML = '';
        document.getElementById('cell-21').innerHTML = '';
        document.getElementById('cell-22').innerHTML = '';
        document.getElementById('spam-wall').className = 'hidden';
    }

    /**
     * Locks the game and shows the path of the winner if exist. Updates the scoreboard and reset the game.
     * @param {Player/AI winner} state 
     * @param {Last winning path if exist} path 
     * @param {W/L/D Info} gameState 
     * @param {Logic board} gameBoard 
     */
    FinishGame(state,path,gameBoard)
    {
        if (state === 'X-won' || state === 'O-won')
            for(let i = 0; i < 3; i++)
                document.getElementById('cell-'.concat(path[i])).classList.add('win-path');
        document.getElementById('spam-wall').className = '';
        setTimeout( () =>{
            gameBoard.Reset(state);
            if( state != '')
                for(let i = 0; i < 3; i++)
                    document.getElementById('cell-'.concat(path[i])).classList.remove('win-path');
            this.Reset();
        },4000);
    }
}

/**
 * Creates an instance of TicTacToe logic board and visual board, Then creates the event/game manager.
 */
class TicTacToeGame
{
    constructor (boardElement)
    {
        this.VisualBoard = new TicTacToeVisual(boardElement);
        this.GameBoard = new TicTacToeBoard();
        this.VisualBoard.SetBoardLogicEventControl(this.GameBoard);
    }
}


new TicTacToeGame('game-container');