const recipes = [
  {
    code: "A",
    name: "Fruit Yogurt Parfait",
    steps: [
      { id:"yogurt", text:"First, put some yogurt in the bottom of the glass." },
      { id:"banana", text:"Next, add the banana slices on top of the yogurt." },
      { id:"granola", text:"Then, sprinkle some granola over the banana." },
      { id:"strawberry", text:"After that, place the strawberries on top." },
      { id:"honey", text:"Finally, pour a little honey over everything." }
    ],
    distractors:["cream","cornflakes","chocolate"],
    emoji:{yogurt:"🥛",banana:"🍌",granola:"🥣",strawberry:"🍓",honey:"🍯",cream:"🍦",cornflakes:"🌽",chocolate:"🍫"},
    labels:{yogurt:"yogurt",banana:"banana slices",granola:"granola",strawberry:"strawberries",honey:"honey",cream:"whipped cream",cornflakes:"corn flakes",chocolate:"chocolate sauce"}
  },
  {
    code: "B",
    name: "Taco",
    steps: [
      { id:"tortilla", text:"First, put the tortilla on the plate." },
      { id:"beef", text:"Next, put the cooked beef in the center." },
      { id:"lettuce", text:"Then, add some lettuce over the beef." },
      { id:"tomato", text:"After that, add the chopped tomato." },
      { id:"cheese", text:"Finally, sprinkle cheese on top and fold the tortilla." }
    ],
    distractors:["rice","cucumber","jam"],
    emoji:{tortilla:"🫓",beef:"🥩",lettuce:"🥬",tomato:"🍅",cheese:"🧀",rice:"🍚",cucumber:"🥒",jam:"🫙"},
    labels:{tortilla:"tortilla",beef:"cooked beef",lettuce:"lettuce",tomato:"chopped tomato",cheese:"cheese",rice:"rice",cucumber:"cucumber",jam:"strawberry jam"}
  },
  {
    code: "C",
    name: "Avocado Toast",
    steps: [
      { id:"toast", text:"First, put a slice of toast on the plate." },
      { id:"avocado", text:"Next, spread the avocado over the toast." },
      { id:"egg", text:"Then, place a fried egg on top." },
      { id:"salt", text:"After that, add a little salt." },
      { id:"pepper", text:"Finally, sprinkle some black pepper over the egg." }
    ],
    distractors:["butter","ham","sugar"],
    emoji:{toast:"🍞",avocado:"🥑",egg:"🍳",salt:"🧂",pepper:"⚫",butter:"🧈",ham:"🥓",sugar:"🍬"},
    labels:{toast:"toast",avocado:"avocado",egg:"fried egg",salt:"salt",pepper:"black pepper",butter:"butter",ham:"ham",sugar:"sugar"}
  },
  {
    code: "D",
    name: "Mini Pizza",
    steps: [
      { id:"bread", text:"First, put the round bread on the tray." },
      { id:"tomatoSauce", text:"Next, spread tomato sauce over the bread." },
      { id:"cheese", text:"Then, add the cheese." },
      { id:"pepperoni", text:"After that, place the pepperoni slices on top." },
      { id:"basil", text:"Finally, add a few basil leaves." }
    ],
    distractors:["mustard","pineapple","lettuce"],
    emoji:{bread:"🫓",tomatoSauce:"🥫",cheese:"🧀",pepperoni:"🍕",basil:"🌿",mustard:"🟡",pineapple:"🍍",lettuce:"🥬"},
    labels:{bread:"round bread",tomatoSauce:"tomato sauce",cheese:"cheese",pepperoni:"pepperoni",basil:"basil",mustard:"mustard",pineapple:"pineapple",lettuce:"lettuce"}
  },
  {
    code: "E",
    name: "Banana Berry Smoothie",
    steps: [
      { id:"milk", text:"First, pour the milk into the blender." },
      { id:"banana", text:"Next, add the banana." },
      { id:"blueberry", text:"Then, add the blueberries." },
      { id:"yogurt", text:"After that, put in some yogurt." },
      { id:"ice", text:"Finally, add a few ice cubes and blend everything." }
    ],
    distractors:["orange","cola","carrot"],
    emoji:{milk:"🥛",banana:"🍌",blueberry:"🫐",yogurt:"🥣",ice:"🧊",orange:"🍊",cola:"🥤",carrot:"🥕"},
    labels:{milk:"milk",banana:"banana",blueberry:"blueberries",yogurt:"yogurt",ice:"ice cubes",orange:"orange",cola:"cola",carrot:"carrot"}
  }
];

let role = null;
let currentRecipe = null;
let selected = [];

const screens = [...document.querySelectorAll('.screen')];
const show = id => {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};

function shuffled(arr){
  return [...arr].sort(() => Math.random() - 0.5);
}

function setupCodes(){
  const grid = document.getElementById('codeGrid');
  grid.innerHTML = '';
  recipes.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'code-btn';
    btn.textContent = r.code;
    btn.addEventListener('click', () => openRecipe(r.code));
    grid.appendChild(btn);
  });
}

function chooseRole(nextRole){
  role = nextRole;
  document.getElementById('setupRoleLabel').textContent = role === 'reader' ? 'STUDENT A — READER' : 'STUDENT B — COOK';
  setupCodes();
  show('setupScreen');
}

function openRecipe(code){
  currentRecipe = recipes.find(r => r.code === code);
  selected = [];
  if(role === 'reader') renderReader();
  else renderCook();
}

function renderReader(){
  document.getElementById('readerTitle').textContent = currentRecipe.name;
  document.getElementById('readerCode').textContent = currentRecipe.code;
  const ol = document.getElementById('recipeSteps');
  ol.innerHTML = '';
  currentRecipe.steps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step.text;
    ol.appendChild(li);
  });
  show('readerScreen');
}

function renderCook(){
  document.getElementById('cookCode').textContent = currentRecipe.code;
  selected = [];
  renderIngredients();
  renderDish();
  show('cookScreen');
}

function renderIngredients(){
  const grid = document.getElementById('ingredientGrid');
  grid.innerHTML = '';
  const ids = [...currentRecipe.steps.map(s => s.id), ...currentRecipe.distractors];
  shuffled(ids).forEach(id => {
    const btn = document.createElement('button');
    btn.className = 'ingredient';
    btn.dataset.id = id;
    btn.innerHTML = `<span class="emoji">${currentRecipe.emoji[id]}</span><span class="label">${currentRecipe.labels[id]}</span>`;
    btn.addEventListener('click', () => addIngredient(id));
    grid.appendChild(btn);
  });
}

function addIngredient(id){
  if(selected.length >= currentRecipe.steps.length) return;
  selected.push(id);
  renderDish();
}

function renderDish(){
  const layers = document.getElementById('dishLayers');
  const tray = document.getElementById('sequenceTray');
  layers.innerHTML = '';
  tray.innerHTML = '';
  selected.forEach((id,i) => {
    const token = document.createElement('div');
    token.className = 'dish-token';
    token.style.zIndex = 10+i;
    token.textContent = currentRecipe.emoji[id] || '❓';
    layers.appendChild(token);

    if(i>0){
      const arrow = document.createElement('span');
      arrow.className='seq-arrow';
      arrow.textContent='→';
      tray.appendChild(arrow);
    }
    const pill = document.createElement('span');
    pill.className='seq-pill';
    pill.textContent = `${i+1}. ${currentRecipe.labels[id] || id}`;
    tray.appendChild(pill);
  });
  document.getElementById('stepCounter').textContent = `${selected.length} / ${currentRecipe.steps.length} steps`;
}

function finish(){
  if(selected.length === 0) return;
  const correct = currentRecipe.steps.map(s => s.id);
  const isCorrect = selected.length === correct.length && selected.every((x,i) => x===correct[i]);

  document.getElementById('resultIcon').textContent = isCorrect ? '🎉' : '😵‍💫';
  document.getElementById('resultTitle').textContent = isCorrect ? `Perfect! You made ${currentRecipe.name}!` : 'Something went wrong!';
  document.getElementById('resultText').textContent = isCorrect
    ? 'The ingredients and the order are both correct.'
    : `You made a rather strange version of ${currentRecipe.name}. Compare your order with the recipe.`;

  const resultDish = document.getElementById('resultDish');
  resultDish.innerHTML = selected.map(id => `<span title="${currentRecipe.labels[id]}">${currentRecipe.emoji[id] || '❓'}</span>`).join('');

  const comparison = document.getElementById('comparison');
  comparison.innerHTML = `
    <div class="compare-box ${isCorrect ? 'correct' : 'wrong'}">
      <h4>Your order</h4>
      <ol>${selected.map(id => `<li>${currentRecipe.labels[id] || id}</li>`).join('')}</ol>
    </div>
    <div class="compare-box correct">
      <h4>Correct order</h4>
      <ol>${correct.map(id => `<li>${currentRecipe.labels[id]}</li>`).join('')}</ol>
    </div>`;
  show('resultScreen');
}

function switchRoles(){
  role = role === 'reader' ? 'cook' : 'reader';
  document.getElementById('setupRoleLabel').textContent = role === 'reader' ? 'STUDENT A — READER' : 'STUDENT B — COOK';
  setupCodes();
  show('setupScreen');
}

document.querySelectorAll('[data-role]').forEach(btn => btn.addEventListener('click', () => chooseRole(btn.dataset.role)));
document.getElementById('backHome').addEventListener('click', () => show('homeScreen'));
document.getElementById('readerChange').addEventListener('click', () => { setupCodes(); show('setupScreen'); });
document.getElementById('readerSwitch').addEventListener('click', switchRoles);
document.getElementById('undoBtn').addEventListener('click', () => { selected.pop(); renderDish(); });
document.getElementById('resetBtn').addEventListener('click', () => { selected=[]; renderDish(); });
document.getElementById('finishBtn').addEventListener('click', finish);
document.getElementById('tryAgain').addEventListener('click', renderCook);
document.getElementById('switchAfterResult').addEventListener('click', switchRoles);
