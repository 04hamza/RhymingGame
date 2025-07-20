

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
let ArraySet=[]
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let currentElement=null
let originalPosition = { left: 0, top: 0 };

let newX,newY,startX,startY=0;


function CurrentWordF(){
   ArraySet=words[Math.floor(Math.random()*words.length)]
   let CurrentWord=ArraySet[Math.floor(Math.random()*ArraySet.length)]
   let ArrayWithOut = ArraySet.filter((ele)=>{ return ele!=CurrentWord})

   let CorrectOptions=[]
   let DefautOptions=[]
   while(CorrectOptions.length<2){
       let word=ArrayWithOut[Math.floor(Math.random()*ArrayWithOut.length)]
       CorrectOptions.push(word)
       ArrayWithOut = ArrayWithOut.filter((ele)=>{ return ele!=word})
   }

   let newWord=words.filter((ele,index)=>{
       return index!= words.indexOf(ArraySet)
   })
   
  while (DefautOptions.length<3) {
    let newArray=newWord[Math.floor(Math.random()*newWord.length)]
    let IndexArray=newWord.indexOf(newArray)
    let Defaultword=newArray[Math.floor(Math.random()*newArray.length)]
    DefautOptions.push(Defaultword)
    newWord=newWord.filter((ele,index)=>{ return index != IndexArray})
  }
  

    return {CurrentWord,CorrectOptions,DefautOptions}
      
}
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


function loadNewWord() {
           
            let {CurrentWord,CorrectOptions,DefautOptions}=CurrentWordF()
            // Create target word display
            Target.innerHTML = "";
            const targetImage = document.createElement("div");
            targetImage.className="target-image"
            const targetImg = createImageElement(CurrentWord);
            
            const targetWord = document.createElement("div");
            targetWord.className = "target-word";
            targetWord.textContent = CurrentWord;
            
            targetImage.appendChild(targetImg);
            Target.appendChild(targetImage);
            Target.appendChild(targetWord);
            
            //Create Boxes Solutions
            Solution.innerHTML="";
            for (let i = 0; i < 2; i++) {
                const boxSolution=document.createElement("div")
                boxSolution.className="box-solution"
                const box=document.createElement("div")
                box.className="box"
                box.innerHTML="?"
                const solutionWord=document.createElement("div")
                solutionWord.className="solution-word"
                solutionWord.innerHTML="---"
                boxSolution.appendChild(box)
                boxSolution.appendChild(solutionWord)
                Solution.appendChild(boxSolution)
            }
            // Create options
            options.innerHTML = "";
            let AllOptions=CorrectOptions.concat(DefautOptions)
            let shuffleArray=[]
            while(shuffleArray.length<5){
                let indexWord=Math.floor(Math.random()*AllOptions.length)
                let Word=AllOptions[indexWord]
                shuffleArray.push(Word)
                AllOptions.splice(indexWord,1)
            }
            const gap = 180;
            shuffleArray.forEach((ele,index)=>{
                let Option=document.createElement("div")
                Option.className="option"
                Option.dataset.word=ele
                Option.style.left = `${index * gap}px`;
                Option.style.top="0px";
                let OptionImage=document.createElement("div")
                OptionImage.className="optionImage"
                let image= createImageElement(ele)
                let labelOption=document.createElement("div")
                labelOption.className="target-word"
                labelOption.textContent=ele
 
                OptionImage.appendChild(image)
                Option.appendChild(OptionImage)
                Option.appendChild(labelOption)
                Option.addEventListener('mousedown',handleMousedown)

                
                options.appendChild(Option)
            })

        }

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
                 elementRect.top < boxRectOne.bottom-20
                
            ) {
                
               if(ArraySet.includes(currentElement.dataset.word) && !boxeOne.classList.contains("fulled")){
                    // Snap to box center

                const optionsRect = options.getBoundingClientRect(); // parent container

                currentElement.style.left = (boxRectOne.left - optionsRect.left + (boxRectOne.width - elementRect.width) / 2) + 'px';
                currentElement.style.top = (boxRectOne.top - optionsRect.top + (boxRectOne.height - elementRect.height) / 2) + 'px';
                boxeOne.classList.add("fulled")
                droppedInBox = true;
               }
            }
          else if(
               elementRect.right > boxRectTwo.left+20 &&
                elementRect.left < boxRectTwo.right-20 &&
                elementRect.bottom > boxRectTwo.top+20 &&
                 elementRect.top < boxRectTwo.bottom-20
          ){
             if(ArraySet.includes(currentElement.dataset.word) && !boxeTwo.classList.contains("fulled")){
                const optionsRect = options.getBoundingClientRect(); // parent container

                currentElement.style.left = (boxRectTwo.left - optionsRect.left + (boxRectTwo.width - elementRect.width) / 2) + 'px';
                currentElement.style.top = (boxRectTwo.top - optionsRect.top + (boxRectTwo.height - elementRect.height) / 2) + 'px';
                boxeTwo.classList.add("fulled")
                droppedInBox = true;
             }
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

loadNewWord()

