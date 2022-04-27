const triviaRules = document.getElementById('rules');
const about = document.getElementById('about');
const closeAbout = document.getElementById('close_about_modal');
const startGame = document.getElementById('start_game');
const resetGame = document.getElementById('play_again');

/**
 * Opens a wiki page for Trivia rules.
 */
triviaRules.addEventListener('click',()=>{
    window.open('https://en.wikipedia.org/wiki/Trivia');
});

/**
 * Opens the 'About' modal.
 */
about.addEventListener('click',()=>{
    document.getElementById('about_modal').className = 'modal';
});

/**
 * Closes the 'About' modal.
 */
closeAbout.addEventListener('click',()=>{
    document.getElementById('about_modal').className = 'hidden';
});

/**
 * Starts the Trivia game flow.
 */
startGame.addEventListener('click',()=>{
    closeAbout.click();
    const game = document.getElementById('game_container');
    game.className = 'intro';
    startGame.className = 'hidden'
    
    const trivia = new MathTrivia();
    trivia.GameOn();
});

/**
 * Resets the page.
 */
resetGame.addEventListener('click',()=>{
    location.reload();
});

/**
 * Controls the game flow.
 */
class MathTrivia
{
    constructor()
    {
        this.trivia = new QnA().QuestionsAnswers;
        this.AnswerSection = document.getElementById('answers');
        this.QuestionSection = document.getElementById('question');
        this.QuestionNumber = document.getElementById('question_number');
        this.points = 0;  this.timer = 0;
        this.correctAnswer = '';
    }

    /**
     * Game Manager: Controls the flow. Reads the question and answers to the user.
     */
    GameOn()
    {
        this.AnswerSection.addEventListener('click',(event)=>{
            const playerAnswer = event.target.innerHTML;
            document.getElementById('wall').className = 'blocking_wall';
            clearInterval(clock);
            if( playerAnswer == this.correctAnswer ){
                event.target.className = 'right_answer';
                this.UpdatePoints(this.timer);
            }
            else{
                event.target.className = 'wrong_answer';
            }
            setTimeout( ()=>{
                event.target.classList.remove('right_answer','wrong_answer');
                document.getElementById('wall').className = 'hidden';
                clock = this.SetQuestionAnswer();
            },4000 )
        });

        let clock = this.SetQuestionAnswer(); // Sets up the first question.
    }

    /**
     * Chooses randomly the question/answers and submits them to the HTML.
     */
    SetQuestionAnswer()
    {
        if( this.trivia.length === 0 ){
            document.getElementById('wall').className = 'blocking_wall';
            document.getElementById('game_over').classList.remove('hidden');
            document.getElementById('end_game_total_points').innerHTML = this.points;
            return;
        }
        const index = Math.floor(Math.random() * this.trivia.length );
        const question = this.trivia[index].question; // Random question.

        this.correctAnswer = this.trivia[index].answers[0];
        let answers = this.trivia[index].answers;
        // Updating the question number.
        this.QuestionSection.innerHTML = question;
        this.QuestionNumber.innerHTML = parseInt(this.QuestionNumber.innerHTML) + 1;
        // Randomly present the answers to the question above.
        
        this.trivia.splice(index,1); // Removes the question from the data.

        let i = 0;
        while( answers.length > 0 ){
            let index = Math.floor(Math.random() * answers.length );
            this.AnswerSection.children[i].innerHTML = answers[index];
            answers.splice(index,1);
            i++;
        }
        this.timer = 180;
        return this.SetTimer();
    }

    /**
     * Creates a timer effect.
     * @returns Interval ID
     */
    SetTimer()
    {
        const timer = document.getElementById('timer');
        return setInterval(() => {
            timer.innerHTML = this.timer;
            this.timer--;
        }, 1000);
    }

    /**
     * Adds points to the points board.
     * @param {Time left on the clock} time 
     */
    UpdatePoints(time)
    {
        this.points += parseInt((time * 2.5));
        const boardPoints = document.getElementById('current_points');
        boardPoints.className = 'gained_points';
        setTimeout(() => {
            if( this.points < 1000)
                boardPoints.innerHTML = '0' + this.points;
            else
                boardPoints.innerHTML = this.points; 
            boardPoints.classList.remove('gained_points');
        }, 700);
    }
}

/**
 * Holds the data struct of all the math trivia question and answers.
 * IMPORTANT - The right answer is always the first one.
 */
class QnA
{
    constructor ()
    {
        this.QuestionsAnswers = [
            {
                question: 'f(x)= -x^4 + bx^3  | b>1 . This function defines a mountain. How the mountain behaves when b -> 1?',
                answers: [
                    'The peek gets smaller and lower.',
                    'The mountain grows bigger.',
                    'b does not effect the mountain.',
                    'The peek gets bigger and higher'
                ]
            },
            {
                question: 'Givens 3 lines: y=x+1 , y=-x+2, y=2x. Calculate the perimeter of the triangle.',
                answers: [
                    'P(Triangle) = 1.688',
                    'P(Triangle) = 1.5',
                    'P(Triangle) = 1.788',
                    'P(Triangle) = 1.89'
                ]
            },
            {
                question: 'Integrate: [ 3x^2 * ln(x) ].',
                answers: [
                    'x^3 * ln(x) - x^3 / 3 + C',
                    'x^3 * ln(x) - x^3 + C',
                    '3x^3 * ln(x) - x^3 / 3 + C',
                    'There is no solution.'
                ]
            },
            {
                question: 'Calculate the limit of: (x^2 + 1)^(1/lnx)  , x->infinite',
                answers: [
                    'e^2',
                    'e',
                    'infinite',
                    '1'
                ]
            },
            {
                question: 'Integrate: [cos(x)^3 dx].',
                answers: [
                    'sin(x) - sin(x)^3 / 3 + C',
                    'sin(x)^3 + C',
                    'sin(x)^4 / 4 + C',
                    'Undefined'
                ]
            },
            {
                question: 'What is the taylor series of f(x)= e^3x',
                answers: [
                    '1 + 3x + 4.5x^2 + 4.5x^3....',
                    '1 + 3x + 4x^2 + 5x^3....',
                    '1 + 2x + 4.5x^2 + 5x^3...',
                    '1 + 2x + 4x^2 + 5x^3....'
                ]
            },
            {
                question: 'Find the peek of f(x)= ln(x-a) / x-a .',
                answers: [
                    'e + a',
                    'e - a',
                    'e',
                    'a'
                ]
            },
            {
                question: 'Let S be set of all squares in the world and R set of al rectangles in the world. Let s be a finite subset of S and r a finite subset of R. For each x in s there is a single y in r which P(x) = P(y). True/False: S(s) >= S(r).',
                answers: [
                    'True. When P of squares equals to rectangles his area is always greater.',
                    'False. It is the opposite.',
                    'Might be, it depends on the size of the squares and rectangles.',
                    'Unknown.'
                ]
            },
            {
                question: 'A sniper shoots a target 3 times. The first shot is defined by his skill and he has a 90% chance to hit the target. The next shots are defined by his previous success. Upon hit his chance stays the same and upon failure it drops to 80%. In order to pass a sniper test he needs to hit at least 2 times. Calculate his success rate to pass the test.',
                answers: [
                    '0.954',
                    '0.9',
                    '0.854',
                    '0.8'
                ]
            },
            {
                question: 'Given the series: 0,1,0,2,0,3,0,4... 0,k.  Find k if the sum of the series is equal to 210.',
                answers: [
                    '20',
                    '15',
                    '25',
                    'Undefined.'
                ]
            },
            {
                question: '4x*arctan(2x) >= ln(1 + 4x^2).',
                answers: [
                    'True for every x in R.',
                    'False',
                    'True for some x but not for every x in R.',
                    'False for finite number of x.'
                ]
            },
            {
                question: 'A is a series A->L. B is a series with no limit. What can we conclude about A + B.',
                answers: [
                    'A + B diverges.',
                    'A + B has a limit.',
                    'A + B undefined, could be both.',
                    'We cannot conclude anything.'
                ]
            },
            {
                question: 'Calculate the limit of: (2-x)^( tan(pix/2) ) when x-> 0.',
                answers: [
                    '1',
                    'pi',
                    '0',
                    'undefined'
                ]
            },
            {
                question: 'Given y^2 = 4x^2. What is the shape of this struct?',
                answers: [
                    'X',
                    'Mirrored parabola',
                    'Parabola',
                    'undefined'
                ]
            },
            {
                question: 'Given a circle: (x - 3)^2 + (y - 3)^2 = 16 and a line: y= 3x + 6. Find the shared points if exist.',
                answers: [
                    '(-1,3) , (-0.2,5.4)',
                    '(0,3) , (-1,5)',
                    '(3,-1) , (7,3)',
                    'There are no shared points.'
                ]
            }
        ]
    }
}