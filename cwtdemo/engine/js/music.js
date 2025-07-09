// A combined class for new age mobile and PC music

// Safari has a bug that causes multiple audio to sound
// more dim depending on when it is loaded. Which is
// fixed when the app is put into rest and loaded (annoying)
// Tried many combinations of loading, but if you want
// to guarantee a crisp sound, use loadSong instead of playSong

const audio = {
  // Holds a temporary burst of all the music
  // getting it ready to play for the big time
  all: [],

  // These are the other holding functions
  music: [],
  playing: [],
  musicref: []
}

// This is for prepping all the songs and effects
var tapped = function() {
  // Prepare all the audios
  if(audio.all.length > 0) {
    for(let i = 0; i < audio.all.length; i++){
      audio.all[i].play()
      audio.all[i].pause()
      audio.all[i].currentTime = 0
    }
    audio.all = []
  }
}
document.body.addEventListener('click', tapped, false)

// This will add a song to the list
export function addSong(songpath){
  audio.music.push(new Audio(songpath))
  audio.musicref.push(songpath)
  audio.playing.push(-1)

  audio.all.push(audio.music[audio.music.length-1])
}

// This will tell you if a particular song is playing
export function isSongPlaying(song){
  let ind = (typeof song === "string") ? getRef(song) : song;
  if(ind >= 0 && ind < audio.music.length){
    return (audio.playing[ind] > 0)
  }
  return false
}

// This will tell you if any song is on
export function isSongOn(){
  for(let i = 0; i < audio.music.length; i++){
    if(isSongPlaying(i)){
      return true
    }
  }
  return false
}

// This will play a song
export function playSong(song){
  let ind = (typeof song === "string") ? getRef(song) : song;
  if(ind < 0 || ind >= audio.music.length){
    if(typeof song === "string"){
      ind = audio.music.length
      addSong(song)
    }
  }
  if(ind >= 0 && ind < audio.music.length){
    let temptime = audio.playing[ind] < 0 ? 2000 : 0
    // Prevents double ups of songs
    audio.playing[ind] = 1
    setTimeout(function() {
      audio.music[ind].play()
      audio.playing[ind] = 1
      audio.music[ind].onended = function(){
        audio.playing[ind] = 0
      }
    }, temptime)
  }
}

// This will play a song, then force it to load before playing again
// (This may cause some disturbances on Safari, but it guarantees a crisp sound)
export function loadSong(song){
  let ind = (typeof song === "string") ? getRef(song) : song;
  if(ind < 0 || ind >= audio.music.length){
    if(typeof song === "string"){
      ind = audio.music.length
      addSong(song)
    }
  }
  if(ind >= 0 && ind < audio.music.length){
    let temptime = audio.playing[ind] < 0 ? 2000 : 0
    // Prevents double ups of songs
    audio.playing[ind] = 1
    setTimeout(function() {
      audio.music[ind].play()
      audio.playing[ind] = 1
      audio.music[ind].onended = function(){
        audio.music[ind].pause()
        audio.music[ind].load()
        audio.playing[ind] = 0
      }
    }, temptime)
  }
}

// This loops a song over and over again
export function loopSong(song){
  let ind = (typeof song === "string") ? getRef(song) : song;
  if(ind < 0 || ind >= audio.music.length){
    if(typeof song === "string"){
      ind = audio.music.length
      addSong(song)
    }
  }
  if(ind >= 0 && ind < audio.music.length){
    let temptime = audio.playing[ind] < 0 ? 2000 : 0
    // Prevents double ups of songs
    audio.playing[ind] = 1
    setTimeout(function() {
      audio.music[ind].play()
      audio.playing[ind] = 1
      audio.music[ind].onended = function(){
        audio.music[ind].pause()
        audio.music[ind].load()
        audio.music[ind].play()
      }
    }, temptime)
  }
}

// This stops a specific song from playing
export function stopSong(song){
  let ind = (typeof song === "string") ? getRef(song) : song;
  if(ind < 0 || ind >= audio.music.length){
    if(typeof song === "string"){
      ind = audio.music.length
      addSong(song)
    }
  }
  if(ind >= 0 && ind < audio.music.length){
    audio.music[ind].pause()
    audio.music[ind].load()
    audio.playing[ind] = 0
  }
}

// This stops all the songs from playing
export function stopAllSongs(){
  for(let i = 0; i < audio.music.length; i++)
    stopSong(i)
}

function getRef(name){
	for(let i = 0; i < audio.musicref.length; i++){
		if(audio.musicref[i] == name)
			return i;
	}
	return -1
}

// --------------------------------------
// Music Part
// --------------------------------------

export function isMusicPlaying(){
  let pcaudio = document.getElementById("music");
  if(pcaudio){
    return true
  }
  return false
}

// This will play a song on command (maybe)
export function playMusic(songpath){

  // This makes a whole new audio object
  let pcaudio = document.getElementById("music");
  if(pcaudio)
    pcaudio.parentNode.removeChild(pcaudio);
  pcaudio = document.createElement("audio");
  document.body.appendChild(pcaudio);
  pcaudio.setAttribute("id", "music");
  pcaudio.setAttribute("style", "display:none");
  pcaudio.setAttribute("autoplay", "autoplay");
  pcaudio.innerHTML = "<source src='"+songpath+"' type='audio/mpeg' >";
  pcaudio.play();
  pcaudio.onended = function(){
    pcaudio.parentNode.removeChild(pcaudio);
  }
  return pcaudio
}

// This will loop a song on command
export function loopMusic(songpath){
  pcaudio = playMusic(songpath);
  pcaudio.onended = function(){
    pcaudio.load();
    pcaudio.play();
  }
}

// This will stop the music
export function stopMusic(){
  var pcaudio = document.getElementById("music");
  if(pcaudio)
    pcaudio.parentNode.removeChild(pcaudio);
}

// ------------------------------------------
// SoundFX
// ------------------------------------------

export function isSoundPlaying(){
  let pcaudio = document.getElementById("sound");
  if(pcaudio){
    return true
  }

  let bgsound = document.getElementById("iesound");
  if(bgsound){
    return true
  }

  return false
}

export function playSound(soundpath){

  // This makes a whole new audio object
  let pcaudio = document.getElementById("sound");
  if(pcaudio){
    pcaudio.innerHTML = "";
    pcaudio.parentNode.removeChild(pcaudio);
  }
  pcaudio = document.createElement("audio");
  document.body.appendChild(pcaudio);
  pcaudio.setAttribute("id", "sound");
  pcaudio.setAttribute("style", "display:none");
  pcaudio.setAttribute("autoplay", "autoplay");
  pcaudio.innerHTML = "<source src='"+soundpath+"' type='audio/wav' >";
  pcaudio.play();
  pcaudio.onended = function(){
    pcaudio.parentNode.removeChild(pcaudio);
  }

  let bgsound = document.getElementById("iesound");
  if(bgsound)
    bgsound.parentNode.removeChild(bgsound);
  bgsound = document.createElement("bgsound");
  document.body.appendChild(bgsound);
  bgsound.setAttribute("id", "iesound");
  bgsound.setAttribute("style", "display:none");
  bgsound.setAttribute("src", soundpath);
  bgsound.onended = function(){
    bgsound.parentNode.removeChild(bgsound);
  }
}

export function loopSound(soundpath){

  // This makes a whole new audio object
  let pcaudio = document.getElementById("sound");
  if(pcaudio){
    pcaudio.innerHTML = "";
    pcaudio.parentNode.removeChild(pcaudio);
  }
  pcaudio = document.createElement("audio");
  document.body.appendChild(pcaudio);
  pcaudio.setAttribute("id", "sound");
  pcaudio.setAttribute("style", "display:none");
  pcaudio.setAttribute("autoplay", "autoplay");
  pcaudio.innerHTML = "<source src='"+soundpath+"' type='audio/wav' >";
  pcaudio.play();
  pcaudio.onended = function(){
    pcaudio.load();
    pcaudio.play();
  }

  var bgsound = document.getElementById("iesound");
  if(bgsound)
    bgsound.parentNode.removeChild(bgsound);
  bgsound = document.createElement("bgsound");
  document.body.appendChild(bgsound);
  bgsound.setAttribute("id", "iesound");
  bgsound.setAttribute("style", "display:none");
  bgsound.setAttribute("src", soundpath);
  bgsound.setAttribute("loop", "infinite");
}

export function stopSound(){
  let pcaudio = document.getElementById("sound");
  if(pcaudio){
    pcaudio.innerHTML = "";
    pcaudio.parentNode.removeChild(pcaudio);
  }

  let bgsound = document.getElementById("iesound");
  if(bgsound){
    bgsound.setAttribute("src", "");
    bgsound.parentNode.removeChild(bgsound);
  }
}
