const continueButton = document.getElementById('continue');
const gameContainer = document.getElementsByClassName('game-container')[0];
const musicControl = document.getElementById('music-control');
const aboutButton = document.getElementById('about');
const aboutCloseButton = document.getElementById('about-close');

/**
 * Removes intro Div upon clicking on 'continue'.
 * Turns on lobby background music and lobby game video intro.
 */
 aboutCloseButton.addEventListener('click',async ()=>{
   document.getElementById('header').style.position = 'fixed';
   let lobbyMusic = document.getElementById('lobby-music');
   let lobbyVideo = document.getElementById('lobby-video');
   lobbyVideo.controls = false;
   try{
      await lobbyMusic.play(); 
      await lobbyVideo.play();  
      lobbyMusic.volume = 0.2;
   }
   catch(e){
      throw Error( {Message: 'Failed to play lobby music.'} );}
});

/**
 * Effect on over game images hover.
 */
gameContainer.addEventListener('mouseover',(e) =>{
   if( e.target.className === 'mouse-over-img')
   {
      let DivGameImg = e.target.firstElementChild; // Hidden text shows.
      DivGameImg.className = 'not-hidden';
   }
});
/**
 * Effect off after leaving game images.
 */
gameContainer.addEventListener('mouseout', (e)=>{
   if( e.target.className === 'mouse-over-img')
   {
      let DivGameImg = e.target.firstElementChild; // Hidden text disappears.
      DivGameImg.className = 'hide';
   }
});

/**
 * Shows 'About' modal.
 */
aboutButton.addEventListener('click',()=>{
   document.getElementById('guides').className = 'not-hidden';
});

/**
 * Hides 'About' modal.
 */
aboutCloseButton.addEventListener('click',()=>{
   document.getElementById('guides').className = 'hide';
});

/**
 * Controls the lobby music background track.
 */
musicControl.addEventListener('click',()=>{
   let lobbyMusic = document.getElementById('lobby-music');
   try{
      if( lobbyMusic.volume === 0 )
      {
         lobbyMusic.volume = 0.2;
         musicControl.innerHTML = 'Music:On';
      }
      else
      {
         lobbyMusic.volume = 0;
         musicControl.innerHTML = 'Music:Off';
      }
   }
   catch(e){
      throw Error( {Message: 'Failed to control lobby music.'}); }
});