class EmptyCell{}

class CheckersPiece
{
    constructor(c,k) { this.color = c; this.king = k; }
    SetKing(k) { this.king = k; }
    IsKing() { return this.king; }
    GetColor() { return this.color; }
    SetColor(c) { this.color = c; }
}

class VisualBoard
{
    constructor(element)
    {
        this.visualBoard = document.getElementById(element);
        this.startGame = document.getElementById('start-game');
        this.gameRules = document.getElementById('rules');
        this.about = document.getElementById('about')
        this.aboutClose = document.getElementById('close_about_modal');
        let isWhite = true, gameStarted = false; this.preX = 0; this.preY = 0;
        for (let i = 0; i < 8; i++)
        {
            if (i % 2 == 0) isWhite = true;
            else isWhite = false;
            for (let j = 0; j < 8; j++) 
            {
                let div = document.createElement('div'); div.id = i + "," + j; // Creates div inside element with id of matrix position.
                if (isWhite) { div.className = "white"; this.visualBoard.appendChild(div) }
                else { div.className = "black"; this.visualBoard.appendChild(div) }
                isWhite = !isWhite;
            }
        }
    }

    /**
     * Renders a selected player piece visually and removed the previous selected piece if exist.
     * @param {Row number of selected piece} x 
     * @param {Col number of selected piece} y 
     */
    RenderSelectedPiece(x,y)
    {
        if( this.preX === x && this.preY === y )
            return;
        let piece = document.getElementById('p'.concat(x).concat(',').concat(y));
        piece.classList.add('selected-piece');
        if( this.preX != 0 || this.preY != 0 ) // Removes select effect from previous selected pieces.
        {
            piece = document.getElementById('p'.concat(this.preX).concat(',').concat(this.preY));
            piece.classList.remove('selected-piece');
        }
    }
    /**
     * Visually renders the movement of a piece on board.
     * @param {Row number start point} xStart 
     * @param {Col number start point} yStart 
     * @param {Row number end point} xEnd 
     * @param {Col number end point} yEnd 
     */
    RenderPiece(xStart,yStart,xEnd,yEnd)
    {
        let div = document.getElementById(xEnd.concat(',').concat(yEnd) );
        let piece = document.getElementById('p'.concat(xStart).concat(',').concat(yStart));
        piece.id = 'p'.concat(xEnd).concat(',').concat(yEnd);
        if( xEnd == 0 && piece.children.length === 0 ){ // Implement king visual for a checker piece.
            let king = document.createElement('div');
            king.className = 'king'
            piece.appendChild(king);
        }
        div.appendChild(piece);
        piece.classList.remove('selected-piece');
        if( (Math.abs(xStart-xEnd) === 2) )
        {
            let yCaptured = 0;
            let xCaptured = "";
            if( xStart > xEnd )
                xCaptured += xStart-1;
            else
                xCaptured += parseInt(xStart)+1;
            if( yStart > yEnd )
                yCaptured = yStart-1;
            else
                yCaptured = yEnd- 1;
            let div = document.getElementById(xCaptured.concat(',').concat(yCaptured));
            div.removeChild(document.getElementById('p'.concat(xCaptured).concat(',').concat(yCaptured)));
        }
    }

    /**
     * Renders the AI move in the visual board.
     * @param {AI move coordinates} move 
     */
    AIRender(move)
    {
        const startX = move[0]; const startY = move[1]; const endX = "" + move[2]; const endY = move[3];
        let div = document.getElementById(endX.concat(',').concat(endY) );
        let piece = document.getElementById('p'.concat(startX).concat(',').concat(startY));
        piece.id = 'p'.concat(endX).concat(',').concat(endY);
        if( endX == 7 && piece.children.length === 0 ){ // Implement king visual for a checker piece.
            let king = document.createElement('div');
            king.className = 'king'
            piece.appendChild(king);
        }
        div.appendChild(piece);
        if( endX - startX > 1){
            let capturedY;
            let capturedX = "" + parseInt(startX+1);
            if( startY > endY )
                capturedY = (startY)-1;
            else
                capturedY = (endY) -1;
            let capturedCell = document.getElementById(capturedX.concat(',').concat(capturedY));
            let capturedPiece = document.getElementById('p'.concat(capturedX).concat(',').concat(capturedY));
            capturedCell.removeChild(capturedPiece);
        }
        if( startX - endX === 2){
            let capturedY;
            let capturedX = "" + (startX-1);
            if( startY > endY )
                capturedY = (startY)-1;
            else
                capturedY = (endY) -1;
            let capturedCell = document.getElementById(capturedX.concat(',').concat(capturedY));
            let capturedPiece = document.getElementById('p'.concat(capturedX).concat(',').concat(capturedY));
            capturedCell.removeChild(capturedPiece);
        }
    }

    /**
     * Changes the turn sign text.
     * @param {Player/AI} color 
     */
    RenderTurnSign(color)
    {
        let sign = document.getElementById('sign');
        if( color )
            sign.innerHTML = 'White Turn';
        else
            sign.innerHTML = 'PC Turn';
    }

    /**
     * Shows the winner on the game sign message.
     * @param {Player/AI} color 
     */
    RenderWin(color)
    {
        let sign = document.getElementById('sign');
        if( color )
            sign.innerHTML = 'Player Wins! :)';
        else
            sign.innerHTML = 'PC Wins! :(';
        sign.className = 'game_won';
    }

    SetGame(board)
    {
        /**
         * Controls and handles all board events by the user.
         */
        this.visualBoard.addEventListener('click',(e)=>{
            let targetID = e.target.id;
            if ( (e.target.id[0] != 'p' && e.target.className != 'king') && this.preX == 0 && this.preY == 0) return; // Ignores random board clicking.
            if( e.target.id[0] === 'p' || e.target.className === 'king' ) // Handles selected piece render.
            {
                let x = 0; let y = 0;
                if( e.target.className === 'king' ){
                    targetID = e.target.parentElement.id;
                    x = e.target.parentElement.id[1];
                    y = e.target.parentElement.id[3];
                }
                else{
                    targetID = e.target.id;
                    x = e.target.id[1];
                    y = e.target.id[3];
                }
                if( board.GetBoard()[x][y].GetColor() )
                {
                    this.RenderSelectedPiece(x,y);
                    this.preX = x; this.preY = y;
                }
            }
            if( targetID[0] != 'p' && (this.preX != 0 || this.preY != 0) ) // Handles selected piece movement.
            {
                let xTarget = targetID[0], yTarget = targetID[2];
                if( board.IsLegalMove(this.preX,this.preY,xTarget,yTarget, true) ) // Handles movement/capture pieces.
                {
                    board.MovePiece(this.preX,this.preY,xTarget,yTarget,true); // Moves the piece in the logic board.
                    this.RenderPiece(this.preX,this.preY,xTarget,yTarget); // Renders the piece on the visual board.
                    document.getElementById('block_move').className = ''; // Blocks spam clicking bugs.
                    this.preX = 0; this.preY = 0;
                    this.RenderTurnSign(false);
                    if( board.IsGameWon(false) ){
                        this.RenderWin(true);
                        this.startGame.classList.remove('hidden');
                        return;
                    }

                    // Timeout for AI in order to create the illusion of thinking.
                    let time = Math.floor( Math.random()* 2 );
                    time *= 1000; time+= 500;

                    setTimeout(() => {
                        const MoveAI = board.AIMove();  // AI move.
                        this.AIRender(MoveAI);  // Renders the AI move.
                        this.RenderTurnSign(true);
                        board.IsGameWon(true);
                        document.getElementById('block_move').className = 'hidden';
                        if( board.IsGameWon(true) ){
                            document.getElementById('block_move').className = '';
                            this.RenderWin(false);
                            this.startGame.classList.remove('hidden');
                            return;
                        }
                    }, time);
                }
            }
        });

        this.startGame.addEventListener('click',()=>{
            if(this.gameStarted)
                location.reload();
            this.gameStarted = true;
            for(let i = 0; i < 3; i++)
                for(let j = 0; j < 8; j++)
                {
                    if( !(board.GetBoard()[i][j] instanceof(EmptyCell)))
                    {
                        let redChecker = document.createElement('div');
                        redChecker.id = 'p' + i + ',' + j; redChecker.className = 'red-checker';
                        document.getElementById(i+','+j).appendChild(redChecker);
                    }
                    if( !(board.GetBoard()[7-i][j] instanceof(EmptyCell)))
                    {
                        let whiteChecker = document.createElement('div');
                        whiteChecker.id = 'p' + (7-i) + ',' + j; whiteChecker.className = 'white-checker';
                        document.getElementById((7-i)+','+j).appendChild(whiteChecker);
                    }
                }
            document.getElementById('0,0').removeChild(document.getElementById('p0,0'));
            document.getElementById('sign').innerHTML = 'White Turn';
            this.startGame.className = 'hidden';
        });

        /**
         * Opens wiki rules for Checkers.
         */
        this.gameRules.addEventListener('click',()=>{
            window.open('https://en.wikipedia.org/wiki/Checkers');
        });

        /**
         * Opens 'About' modal.
         */
        this.about.addEventListener('click',()=>{
            document.getElementById('about_modal').className = 'modal';
        });

        /**
         * Closes the 'About modal.
         */
        this.aboutClose.addEventListener('click',()=>{
            document.getElementById('about_modal').className = 'hidden';
        });
    }
}

class GameBoard
{
    constructor()
    {
        this.board = [[new CheckersPiece(false,false),new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false)],
        [new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false),new EmptyCell()],
        [new EmptyCell(),new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false),new EmptyCell(),new CheckersPiece(false,false)],
        [new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell()],
        [new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell(),new EmptyCell()],
        [new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false),new EmptyCell()],
        [new EmptyCell(),new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false)],
        [new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false),new EmptyCell(),new CheckersPiece(true,false),new EmptyCell()]];
    }
    GetBoard() { return this.board;}

    /**
     * Checks if game is won by counting pieces and checking legal moves.
     * @param {Player/AI} color 
     * @returns True if game won false otherwise.
     */
    IsGameWon(color)
    {
        let pieces = 0;
        for(let i = 0; i < 8; i++)
            for(let j = 0; j < 8; j++){
                if( i === 0 && j === 0 ) continue;
                if(this.board[i][j] instanceof EmptyCell || this.board[i][j].GetColor() != color )
                    continue;
                else
                    pieces ++;
            }
        if( pieces === 0 )
            return true;
        else
            return false;
    }

    /**
     * Checks if the piece movement is legal.
     * @param {Row number start point} xStart 
     * @param {Col number start point} yStart 
     * @param {Row number end point} xEnd 
     * @param {Col number end point} yEnd 
     * @param {Color of the piece: true for white false otherwise} color 
     * @returns 
     */
    IsLegalMove( xStart,yStart,xEnd,yEnd, color)
    {
        if (xEnd < 0 || xEnd > 7 || yEnd < 0 || yEnd > 7)  return false; // Out of boundaries.
        if (!(this.board[xEnd][yEnd] instanceof (EmptyCell))) return false;
        if( (Math.abs(xStart-xEnd) === 1) && (Math.abs(yStart-yEnd) === 1) ) // Handles regular advance move.
        {
            if( (xStart > xEnd && color) || (xEnd > xStart && !color) ) // Checks regular checker move validation.
                return true;
            if( this.board[xStart][yStart].IsKing() ) // Handles king movement.
                return true;
            return false;
        }
        if( (Math.abs(xStart-xEnd) === 2) && (Math.abs(yStart-yEnd) === 2) ) // Handles capture movement.
        {
            if(  xStart < xEnd && color && !this.board[xStart][yStart].IsKing() ) // Blocks king move for normal checkers.
                return false;
            let xCaptured = 0, yCaptured = 0;
            if( xStart > xEnd )
                xCaptured = xStart - 1;
            else
                xCaptured = xEnd - 1;
            if( yStart > yEnd )
                yCaptured = yStart - 1;
            else
                yCaptured = yEnd - 1;
            if(  this.board[xCaptured][yCaptured] instanceof CheckersPiece && this.board[xCaptured][yCaptured].GetColor() != color )
                return true;
            else
                return false;
        }
        
        return false;
    }

    /**
     * Updates the logic board according to the pieces movement.
     * @param {Row number start point} xStart 
     * @param {Col number start point} yStart 
     * @param {Row number end point} xEnd 
     * @param {Col number end point} yEnd 
     * @param {*} color 
     */
    MovePiece(xStart,yStart,xEnd,yEnd,color)
    {
        if( this.board[xStart][yStart].IsKing() ) // Moves a king piece.
            this.board[xEnd][yEnd] = new CheckersPiece(color,true);
        else{ // Moves a checker piece and crowns it upon reaching row 0.
            if( (xEnd == 0 && color) || (xEnd == 7 && !color) )
                this.board[xEnd][yEnd] = new CheckersPiece(color,true);
            else
                this.board[xEnd][yEnd] = new CheckersPiece(color,false);
        }
        this.board[xStart][yStart] = new EmptyCell();            
        if( (Math.abs(xStart-xEnd) === 2) )
        {
            let xCaptured = 0; let yCaptured = 0;
            if( xStart > xEnd )
                xCaptured = xStart -1;
            else
                xCaptured = xEnd - 1;
            if( yStart > yEnd )
                yCaptured = yStart-1;
            else
                yCaptured = yEnd- 1;
            this.board[xCaptured][yCaptured] = new EmptyCell();
        }
    }

    /**
     * Checkers basic AI algorithm.
     * 1 - Capture if possible.
     * 2 - Move a piece to edge.
     * 3 - Randomly move a piece on board that will not be in danger of capture.
     * 4 - Randomly move a piece on board if 1,2,3 are not possible.
     */
    AIMove()
    {
        let edge = [];  let move = []; let generalMoves = []; let kingMoves = [];// Edge moves and inner moves coordinates.
        for(let i = 0; i < 8; i++)
        {
            for(let j = 0; j < 8; j++)
            {
                if( this.board[i][j] instanceof EmptyCell || (i === 0 && j === 0) ) continue;
                if( !this.board[i][j].GetColor() )
                {
                    const capture = this.CanAICapture(i,j); // Checks if AI can capture.
                    if( capture ){
                        this.Capture(i,j,capture);
                        return [i,j,capture[0],capture[1]];
                    }
                    if( this.board[i][j].IsKing() ) {
                        if( this.MoveAIKing(i,j) ){
                            kingMoves.push(  this.MoveAIKing(i,j) );
                            continue;
                        }
                    }
                    if( this.CanMoveToEdge(i,j) ) // Collects all edge possible moves into 'edge'.
                        edge.push( this.CanMoveToEdge(i,j) );
                    if( this.CanMoveWithOutBeingCaptured(i,j) ) // Collect all possible moves without a threat of capture afterwards.
                        move.push( this.CanMoveWithOutBeingCaptured(i,j) );
                }
            }
        }
        // If there is no capture/edge/none threat move the AI will sacrifice a piece.
        if( edge.length === 0 && move.length === 0 ){
            generalMoves = this.CanMoveSomeWhere();
            const index = Math.floor( Math.random() * generalMoves.length )
            if( generalMoves ){
                const  finalMove = generalMoves[index];
                this.MovePiece(finalMove[0],finalMove[1],finalMove[2],finalMove[3],false);
                return finalMove;
            }
        }
        // If both inner and edge moves are possible, 50-50 which one would be chosen.
        if( edge.length > 0 && move.length > 0 ){
            const index = Math.floor( Math.random() * 1 );
            if( index === 0 ){
                edge = [];
                if( kingMoves.length > 0 ){
                    const newIndex = Math.floor( Math.random() * 1 );
                    if( newIndex === 0 )
                        move = [];
                    else
                        kingMoves = [];
                }
            }
            else{
                move = [];
                if( kingMoves.length > 0 ){
                    const newIndex = Math.floor( Math.random() * 1 );
                    if( newIndex === 0 )
                        edge = [];
                    else
                        kingMoves = [];
                }
            }  
        }
        if( kingMoves.length > 0 ){
            const index = Math.floor( Math.random()* kingMoves.length );
            const finalMove = kingMoves[index][0];
            this.MovePiece(finalMove[0],finalMove[1],finalMove[2],finalMove[3],false);
            return finalMove;
        }
        // If only an edge move is possible.
        if( edge.length > 0 && move.length === 0 ){ 
            const index = Math.floor( Math.random() * edge.length )
            const finalMove = edge[index];
            this.MovePiece(finalMove[0],finalMove[1],finalMove[2],finalMove[3],false);
            return finalMove;
        }
        // If only an inner move is possible.
        if( edge.length === 0 && move.length > 0 ){ 
            const index = Math.floor(Math.random() * move.length );
            if( move[index].length > 1 ){
                const newIndex = Math.floor(Math.random() * 2);
                const finalMove = move[index][newIndex];
                this.MovePiece(finalMove[0],finalMove[1],finalMove[2],finalMove[3],false);
                return finalMove;
            }
            else{
                const finalMove = move[index][0];
                this.MovePiece(finalMove[0],finalMove[1],finalMove[2],finalMove[3],false);
                return finalMove;
            }        
        }
    }

    /**
     * Checks if AI can capture white piece.
     * @param {Row index} i 
     * @param {Col index} j 
     * @returns False if capture not possible otherwise array of capture coordinate.
     */
    CanAICapture(i,j)
    {
        if( i >= 6 )
            return false;
        if( j < 6) {
            if( this.board[parseInt(i)+2][parseInt(j)+2] instanceof EmptyCell && this.board[parseInt(i)+1][parseInt(j)+1] instanceof CheckersPiece &&
            this.board[parseInt(i)+1][parseInt(j)+1].GetColor() )
                return [parseInt(i)+2,parseInt(j)+2];
        }
        if( j > 1 ){
            if( this.board[parseInt(i)+2][j-2] instanceof EmptyCell && this.board[parseInt(i)+1][j-1] instanceof CheckersPiece &&
            this.board[parseInt(i)+1][j-1].GetColor() )
                return [parseInt(i)+2,j-2];
        }
        return false;
    }

    /**
     * Updates the game board capture move.
     * @param {Row index} i 
     * @param {Col index} j 
     * @param {Cell target} target 
     */
    Capture(i,j,target)
    {
        this.board[i][j] = new EmptyCell();
        if( target[0] == 7 )
            this.board[target[0]][target[1]] = new CheckersPiece(false,true);
        else
            this.board[target[0]][target[1]] = new CheckersPiece(false,false);
        let yCaptured;
        if( j > target[1] )
            yCaptured = j - 1;
        else
            yCaptured = parseInt(j) + 1;
        this.board[parseInt(i)+1][yCaptured] = new EmptyCell();
    }

    /**
     * Checks if AI can move a piece to the edge.
     * @param {Row index} i 
     * @param {Col index} j 
     * @returns False if move is not possible otherwise the coordinates of the possible moves.
     */
    CanMoveToEdge(i,j)
    {
        if( j === 1 ){
            if( this.board[parseInt(i)+1][j-1] instanceof EmptyCell )
                return [i,j,parseInt(i)+1,j-1];
        }
        if( j === 6 ){
            if( this.board[parseInt(i)+1][parseInt(j)+1] instanceof EmptyCell )
                return [i,j,parseInt(i)+1,parseInt(j)+1];
        }
        return false;
    }

    /**
     * Checks if a piece can advance to a cell without being under threat of capture.
     * @param {Row index} i 
     * @param {Col index} j 
     * @returns Array of all possible moves if exist, Otherwise false.
     */
    CanMoveWithOutBeingCaptured(i,j)
    {
        if( i >= 6 ) return false;
        const possibleMoves = [];
        if( j < 6 ){ // Check move to the right.
            if( this.board[parseInt(i)+1][parseInt(j)+1] instanceof EmptyCell ){ // Checks if after move to the right the piece can be captured by any direction.
                if( !(this.board[parseInt(i)+2][parseInt(j)+2] instanceof CheckersPiece && this.board[parseInt(i)+2][parseInt(j)+2].GetColor()) &&
                (this.board[parseInt(i)+2][j] instanceof EmptyCell || !this.board[parseInt(i)+2][j].GetColor() || 
                this.board[i][parseInt(j)+2] instanceof CheckersPiece ) )
                    possibleMoves.push( [i,j,parseInt(i)+1,parseInt(j)+1] );
            }
        }
        if( j > 1 ){ // Checks move to the left.
            if( this.board[parseInt(i)+1][j-1] instanceof EmptyCell ){ // Checks if after move to the right the piece can be captured by any direction.
                if( !(this.board[parseInt(i)+2][j-2] instanceof CheckersPiece && this.board[parseInt(i)+2][j-2].GetColor()) &&
                (this.board[parseInt(i)+2][j] instanceof EmptyCell || !this.board[parseInt(i)+2][j].GetColor() || 
                this.board[i][j-2] instanceof CheckersPiece ) )
                    possibleMoves.push( [i,j,parseInt(i)+1,j-1] );
            }
        }
        if( possibleMoves.length > 0 )
            return possibleMoves;
        else
            return false;
    }

    /**
     * Checks if the AI can move a piece somewhere in the board.
     * @returns Array of all possible moves or false otherwise.
     */
    CanMoveSomeWhere()
    {
        let move = [];
        for(let i = 0; i < 7; i++){
            for( let j = 0; j < 8; j++ ){
                if( this.board[i][j] instanceof EmptyCell  || this.board[i][j].IsKing() || ( i === 0 && j ===0 )) continue;
                if( !this.board[i][j].GetColor() ){
                    if( j < 7 ){ // Checks move to the right.
                        if( this.board[parseInt(i)+1][parseInt(j)+1] instanceof EmptyCell  ) // Regular checker/king move.
                            move.push( [i,j,parseInt(i)+1,parseInt(j)+1]);
                    }
                    if( i > 0 ){ // Checks move to the left.
                        if(  this.board[parseInt(i)+1][j-1] instanceof EmptyCell )
                            move.push( [i,j,parseInt(i)+1,j-1]);
                    }
                }
            }
        }
        if( move.length > 0 )
            return move;
        else
            return false;
    }

    /**
     * Calculates possible backward moves for the AI kings.
     * @param {Row index} i 
     * @param {Col index} j 
     * @returns Array of possible AI King moves.
     */
    MoveAIKing(i,j)
    {
        let move = [];
        if( j < 6 ){
            if( i > 1 )
            {
                if( this.board[i-1][parseInt(j)+1] instanceof CheckersPiece && this.board[i-1][parseInt(j)+1].GetColor() &&
                this.board[i-2][parseInt(j)+2] instanceof EmptyCell )
                    move.push( [i,j,i-2,parseInt(j)+2] );
            }
        }
        if( j > 1 ){
            if( i > 1 ){
                if( this.board[i-1][j-1] instanceof CheckersPiece && this.board[i-1][j-1].GetColor() &&
                this.board[i-2][j-2] instanceof EmptyCell )
                    move.push( [i,j,i-2,j-2] );
            }
        }
        if( move.length > 0 )
            return move;
        if( i > 0 && j > 0 ){
            if( this.board[i-1][j-1] instanceof EmptyCell )
                move.push( [i,j,i-1,j-1] );
        }
        if( i > 0 && j < 7 ){
            if( this.board[i-1][parseInt(j)+1] instanceof EmptyCell )
                move.push( [i,j,i-1,parseInt(j)+1] );
        }

        if( move.length > 0 )
            return move;
        else
            return false;
    }
}

class CheckersGame
{
    constructor(element)
    {
        this.gameBoard = new GameBoard(); // Sets the board data with checkers and empty cells.
        this.visualBoard = new VisualBoard(element); // Visually paints the board on the div: element.
    }

    GameOn()
    {
        this.visualBoard.SetGame(this.gameBoard);
    }
}

new CheckersGame('board').GameOn();