

const words=[
    ["cat"," mat"," hat"," rat","bat","fat"],
    ["frog","dog","log",],
    ["bee","three","tree",],
    ["goat","boat","coat"],
    ["hug","jug","mug"],
    ["cot","dot","hot"],
    ["jam","ham","ram"],
    ["cap","map","lap"],
    ["moon","spoon","cartoon"],
    ["win","tin","pin"],
    ["snake","rake","cake"],
    ["claw","paw","saw"],
    ["nut","hut","cut"],
    ["tag","rag","bag"],
    ["bear","pear","chair"],
    ["fan","man","van"],
    ["sock","rock","clock"],
    ["peg","leg","egg"],
    ["whale","snail","pail"],
    ["look","book","hook"],
    ["nest","vest","chest"],
    ["king","string","ring"],
    ["shoe","blue","glue"],
    ["mice","dice","rice"],
    ["lip","rip","dip"],
    ["sun","pun","run"],
    ["bell","well","shell"],
]
let Target=document.querySelector(".target");
let Solution=document.querySelector(".Solution");
let options=document.querySelector(".options");
let notes=document.querySelector(".notes");
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let currentElement=null
let originalPosition = { left: 0, top: 0 };
const logo = document.querySelector(".navbar .logo");
console.log(logo)
logo.onmouseenter=function(e) {
    logo.classList.add("hover")
}
logo.onmouseleave=function(e) {
    logo.classList.remove("hover")
}


let newX,newY,startX,startY=0;


function shuffle(arr){
  return arr
    .map(v => ({v, r: Math.random()}))
    .sort((a,b)=>a.r-b.r)
    .map(o=>o.v);
}

function pickRandom(arr, n){
  const copy = shuffle(arr.slice());
  return copy.slice(0, n);
}

const MAX_ROUNDS = 10;
let rounds = [];
let usedBaseWords = new Set();      // Track chosen “base” word
// If you also want unique groups: let usedGroupIndex = new Set();

function generateRounds(){
  const groupIndices = shuffle([...Array(words.length).keys()]);
  
  // We’ll iterate groups in random order and build rounds
  for(const gi of groupIndices){
    if (rounds.length >= MAX_ROUNDS) break;
    const group = words[gi].map(w => w.trim()); // clean (you have a leading space on " mat")
    if (group.length < 3) continue; // need at least 3 to form base + 2 correct
    
    // Pick a base word not yet used
    const shuffledGroup = shuffle(group);
    let base = null;
    for (const candidate of shuffledGroup){
      if(!usedBaseWords.has(candidate)){
        base = candidate;
        break;
      }
    }
    if(!base) continue; // all used (unlikely here)
    
    const otherGroupWords = group.filter(w => w !== base);
    if(otherGroupWords.length < 2) continue;
    
    const correct = pickRandom(otherGroupWords, 2);
    
    // Collect pool for distractors (words not in this group)
    const otherWordsFlat = words
        .flat()
        .map(w=>w.trim())
        .filter(w => !group.includes(w));
    if (otherWordsFlat.length < 3) continue;
    const distractors = pickRandom(otherWordsFlat, 3);
    
    usedBaseWords.add(base);
    rounds.push({
      base,
      correct,
      distractors
    });
    
    if (rounds.length >= MAX_ROUNDS) break;
  }
}

generateRounds();

 function createImageElement(word) {
        const img = document.createElement("img");
        img.src = `Images/WordImages/${word}.png`;
        img.alt = word;
        img.className = "word-image";
        img.addEventListener("mousedown", (e) => {
                e.preventDefault();
                speakWord(word)
        });
        return img;
}

let currentRoundIndex = 0;

function loadRound(){
  if (currentRoundIndex >= rounds.length){
     // Game finished
     Target.innerHTML = "<h2 style='font-family:CabinSketch'>Great Job!</h2>";
     Solution.innerHTML = "";
     options.innerHTML = "";
     return;
  }
  
  const { base, correct, distractors } = rounds[currentRoundIndex];
  
  // Keep a global so drop logic can validate:
  window.currentBaseGroup = [base, ...correct]; // allowed correct set
  
  // Build target
  Target.innerHTML = "";
  const targetImage = document.createElement("div");
  targetImage.className="target-image";
  const targetImg = createImageElement(base);
  const targetWord = document.createElement("div");
  targetWord.className="target-word";
  targetWord.textContent = base;
  targetImage.appendChild(targetImg);
  Target.appendChild(targetImage);
  Target.appendChild(targetWord);
  
  // Build solution boxes (2)
  Solution.innerHTML="";
  for (let i=0;i<2;i++){
    const boxSolution=document.createElement("div");
    boxSolution.className="box-solution";
    const box=document.createElement("div");
    box.className="box";
    box.textContent="?";
    const solutionWord=document.createElement("div");
    solutionWord.className="solution-word";
    solutionWord.textContent="---";
    boxSolution.appendChild(box);
    boxSolution.appendChild(solutionWord);
    Solution.appendChild(boxSolution);
  }
  
  // Build shuffled options (2 correct + 3 distractors)
  options.innerHTML="";
  const allOptions = shuffle([...correct, ...distractors]);
  allOptions.forEach((word, index) => {
     const Option=document.createElement("div");
     Option.className="option";
     Option.dataset.word = word;
     Option.style.left = `${index * 180}px`;
     Option.style.top = "0px";
     
     const OptionImage=document.createElement("div");
     OptionImage.className="optionImage";
     const image = createImageElement(word);
     const labelOption=document.createElement("div");
     labelOption.className="target-word";
     labelOption.textContent = word;
     
     OptionImage.appendChild(image);
     Option.appendChild(OptionImage);
     Option.appendChild(labelOption);
     
     Option.addEventListener('mousedown', handleMousedown);
     options.appendChild(Option);
  });
}
loadRound();


function handleMousedown(e){
  //if(e.target.classList.contains("optionImage")){
  document.querySelectorAll(".option").forEach((ele)=>{
    ele.style.zIndex = 0;
  })
  currentElement = e.target.closest(".option");
  currentElement.style.zIndex = 1000;
  isDragging = true;
  const rect = currentElement.getBoundingClientRect();
  const parentRect = options.getBoundingClientRect();

  // Store original position relative to parent
  
  originalPosition.left = rect.left - parentRect.left;
  originalPosition.top = rect.top - parentRect.top;

  currentElement.style.left = originalPosition.left + "px";
  currentElement.style.top = originalPosition.top + "px";


  
  currentElement.style.transition = 'none';
  startX=e.clientX
  startY=e.clientY
  

  // Optional: Smooth transition cancel
 

  document.addEventListener('mousemove',onMouseMove);
  document.addEventListener('mouseup',onMouseUp);
  //}
}

function onMouseMove(e) {
  currentElement.classList.add("moving");
  newX=startX-e.clientX
  newY=startY-e.clientY

  startX=e.clientX
  startY=e.clientY

  // Move the element
  currentElement.style.left = (currentElement.offsetLeft-newX)+"px";
  currentElement.style.top = (currentElement.offsetTop-newY)+"px";
}

function onMouseUp(e) {
  // document.removeEventListener('mousemove', onMouseMove);
  // document.removeEventListener('mouseup', onMouseUp);
  
   if (isDragging && currentElement) {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        const boxeOne = document.querySelectorAll('.box-solution')[0];
        const boxRectOne = boxeOne.getBoundingClientRect();
        const boxeTwo = document.querySelectorAll('.box-solution')[1];
        const boxRectTwo = boxeTwo.getBoundingClientRect();
        let droppedInBox = false;
        const elementRect = currentElement.getBoundingClientRect();

         if (
                elementRect.right > boxRectOne.left+20 &&
                elementRect.left < boxRectOne.right-20 &&
                elementRect.bottom > boxRectOne.top+20 &&
                 elementRect.top < boxRectOne.bottom-20 &&
                 (window.currentBaseGroup.includes(currentElement.dataset.word) && !boxeOne.classList.contains("fulled"))
                
            ) {
                
                    // Snap to box center

                const optionsRect = options.getBoundingClientRect(); // parent container
                currentElement.style.left = (boxRectOne.left - optionsRect.left + (boxRectOne.width - (elementRect.width)) / 2) + 'px';
                currentElement.style.top = (boxRectOne.top - optionsRect.top + (boxRectOne.height - (elementRect.height)) / 2) + 'px';
                currentElement.children[1].remove()
                boxeOne.children[1].textContent=currentElement.dataset.word
                currentElement.firstChild.style.transform = "scale(1.13)"; 
                currentElement.firstChild.style.transition = "transform 0.3s ease";
       
                boxeOne.classList.add("fulled")
                currentElement.classList.add("correctPosition")
                droppedInBox = true;
                checkRoundComplete();
            
            }
          else if(
               elementRect.right > boxRectTwo.left+20 &&
                elementRect.left < boxRectTwo.right-20 &&
                elementRect.bottom > boxRectTwo.top+20 &&
                 elementRect.top < boxRectTwo.bottom-20 &&
                 (window.currentBaseGroup.includes(currentElement.dataset.word) && !boxeTwo.classList.contains("fulled"))
          ){
             
                const optionsRect = options.getBoundingClientRect(); // parent container

                currentElement.style.left = (boxRectTwo.left - optionsRect.left + (boxRectTwo.width - elementRect.width) / 2) + 'px';
                currentElement.style.top = (boxRectTwo.top - optionsRect.top + (boxRectTwo.height - elementRect.height) / 2) + 'px';
                currentElement.children[1].remove()
                boxeTwo.children[1].textContent=currentElement.dataset.word
                currentElement.firstChild.style.transform = "scale(1.13)"; 
                currentElement.firstChild.style.transition = "transform 0.3s ease";

                boxeTwo.classList.add("fulled")
                droppedInBox = true;
                checkRoundComplete();
             }
          
        ;

        // Return to original position if not dropped in a box
        if (!droppedInBox) {
            currentElement.style.left = originalPosition.left + 'px';
            currentElement.style.top = originalPosition.top + 'px';
        }

        currentElement.style.zIndex = '';
        currentElement.classList.remove("moving");
        currentElement = null;
    }
  
}

function checkRoundComplete(){
   const filled = [...document.querySelectorAll('.box-solution')].filter(b=>b.classList.contains('fulled'));
   if (filled.length === 2){
      // Small delay for user feedback
      setTimeout(()=>{
        currentRoundIndex++;
        loadRound();
      }, 600);
   }
}


loadNewWord()

