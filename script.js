const foods = [
  {
    code: 'A',
    name: 'Borscht',
    country: 'Ukraine / Eastern Europe',
    image: 'assets/borscht.png',
    clueChips: ['deep red soup', 'vegetables', 'white cream on top', 'served in a bowl', 'hot soup'],
    answerClues: 'A deep red beet soup with vegetables, often served with a spoonful of sour cream and herbs.'
  },
  {
    code: 'B',
    name: 'Churros',
    country: 'Spain',
    image: 'assets/churros.png',
    clueChips: ['long fried sticks', 'sugar', 'crispy outside', 'sweet snack', 'chocolate dip'],
    answerClues: 'Long fried dough sticks covered with sugar, often served with chocolate sauce.'
  },
  {
    code: 'C',
    name: 'Laksa',
    country: 'Malaysia / Singapore',
    image: 'assets/Laksa.png',
    clueChips: ['orange soup', 'noodles', 'shrimp', 'bean sprouts', 'lime and herbs'],
    answerClues: 'A spicy noodle soup with a rich orange broth, often served with shrimp, bean sprouts, herbs, and lime.'
  },
  {
    code: 'D',
    name: 'Macarons',
    country: 'France',
    image: 'assets/macarons.png',
    clueChips: ['small round sweets', 'many colors', 'cream inside', 'smooth shells', 'dessert'],
    answerClues: 'Small colorful sandwich cookies with smooth shells and a cream filling in the middle.'
  },
  {
    code: 'E',
    name: 'Moussaka',
    country: 'Greece',
    image: 'assets/moussaka.png',
    clueChips: ['square slice', 'many layers', 'eggplant', 'meat', 'creamy top'],
    answerClues: 'A baked layered dish made with eggplant and meat, with a thick creamy sauce on top.'
  },
  {
    code: 'F',
    name: 'Nachos',
    country: 'Mexico',
    image: 'assets/nachos.png',
    clueChips: ['triangle chips', 'melted cheese', 'green peppers', 'tomatoes', 'shared snack'],
    answerClues: 'Corn chips covered with melted cheese and toppings such as tomatoes and jalapeños.'
  },
  {
    code: 'G',
    name: 'Pad Thai',
    country: 'Thailand',
    image: 'assets/pad thai.png',
    clueChips: ['flat noodles', 'shrimp', 'bean sprouts', 'egg', 'lime and peanuts'],
    answerClues: 'A Thai stir-fried noodle dish often served with shrimp, egg, bean sprouts, peanuts, and lime.'
  },
  {
    code: 'H',
    name: 'Paella',
    country: 'Spain',
    image: 'assets/paella.png',
    clueChips: ['large pan', 'yellow rice', 'shrimp', 'mussels', 'lemon'],
    answerClues: 'A Spanish rice dish cooked in a wide pan, often with seafood, vegetables, and lemon.'
  },
  {
    code: 'I',
    name: 'Pretzel',
    country: 'Germany',
    image: 'assets/pretzel.png',
    clueChips: ['twisted shape', 'brown bread', 'white salt', 'baked', 'snack'],
    answerClues: 'A dark golden-brown baked bread snack with a twisted shape and coarse salt on top.'
  },
  {
    code: 'J',
    name: 'Taco',
    country: 'Mexico',
    image: 'assets/taco.png',
    clueChips: ['folded shell', 'meat', 'lettuce', 'tomato', 'cheese'],
    answerClues: 'A folded corn or flour shell filled with meat, lettuce, tomato, cheese, and sometimes salsa.'
  }
];

let role = null;
let currentFood = null;

const screens = [...document.querySelectorAll('.screen')];
const show = (id) => {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};

function escapeHTML(str) {
  return str.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function setupCodes(){
  const grid = document.getElementById('codeGrid');
  grid.innerHTML = '';
  foods.forEach(food => {
    const btn = document.createElement('button');
    btn.className = 'code-btn';
    btn.innerHTML = `<span class="code-letter">${food.code}</span>`;
    btn.addEventListener('click', () => openFood(food.code));
    grid.appendChild(btn);
  });
}

function chooseRole(nextRole){
  role = nextRole;
  document.getElementById('setupRoleLabel').textContent = role === 'reader' ? 'STUDENT A — READER' : 'STUDENT B — DETECTIVE';
  setupCodes();
  show('setupScreen');
}

function openFood(code){
  currentFood = foods.find(f => f.code === code);
  if(role === 'reader') renderReader();
  else renderListener();
}

function makeAnswerCard(){
  return `
    <img src="${currentFood.image}" alt="${currentFood.name}" />
    <h4>${currentFood.name}</h4>
    <p><strong>Country / area:</strong> ${currentFood.country}</p>
    <p>${currentFood.answerClues}</p>
    <div class="answer-meta">
      ${currentFood.clueChips.map(chip => `<span>${chip}</span>`).join('')}
    </div>
  `;
}

function renderReader(){
  document.getElementById('readerCode').textContent = currentFood.code;
  document.getElementById('readerImage').src = currentFood.image;
  const clueBox = document.getElementById('readerClues');
  clueBox.innerHTML = currentFood.clueChips.map(chip => `<span>${chip}</span>`).join('');
  show('readerScreen');
}

function renderListener(){
  document.getElementById('listenerCode').textContent = currentFood.code;
  const input = document.getElementById('noteInput');
  input.value = '';
  updateCharCount();
  updateQueryPreview();
  const promptBox = document.getElementById('promptBox');
  promptBox.classList.add('hidden');
  promptBox.textContent = '';
  const answerCard = document.getElementById('listenerAnswerCard');
  answerCard.classList.add('hidden');
  answerCard.innerHTML = makeAnswerCard();
  show('listenerScreen');
}

function updateCharCount(){
  const len = document.getElementById('noteInput').value.length;
  document.getElementById('charCount').textContent = `${len} characters`;
}

function buildSearchQuery(){
  const input = document.getElementById('noteInput').value.trim();
  if(!input) return 'famous foreign food';
  return `${input} food`;
}

function updateQueryPreview(){
  document.getElementById('queryPreview').textContent = buildSearchQuery();
}

function openSearch(type){
  const q = encodeURIComponent(buildSearchQuery());
  const url = type === 'images'
    ? `https://www.google.com/search?tbm=isch&q=${q}`
    : `https://www.google.com/search?q=${q}`;
  window.open(url, '_blank', 'noopener');
}

function buildAIPrompt(){
  const notes = document.getElementById('noteInput').value.trim();
  const base = notes || 'A famous foreign food described by a student.';
  return `Create a realistic photo-style image of a famous foreign food based only on this description: ${base}\n\nThe image should focus on the food itself, shown clearly on a plate or in a natural serving style. Do not add any text.`;
}

function copyPrompt(){
  const prompt = buildAIPrompt();
  navigator.clipboard.writeText(prompt).catch(() => {});
  const box = document.getElementById('promptBox');
  box.textContent = `AI prompt copied.\n\n${prompt}`;
  box.classList.remove('hidden');
}

function switchRoles(){
  role = role === 'reader' ? 'listener' : 'reader';
  document.getElementById('setupRoleLabel').textContent = role === 'reader' ? 'STUDENT A — READER' : 'STUDENT B — DETECTIVE';
  setupCodes();
  show('setupScreen');
}

document.querySelectorAll('[data-role]').forEach(btn => btn.addEventListener('click', () => chooseRole(btn.dataset.role)));
document.getElementById('backHome').addEventListener('click', () => show('homeScreen'));
document.getElementById('readerChange').addEventListener('click', () => { setupCodes(); show('setupScreen'); });
document.getElementById('listenerChange').addEventListener('click', () => { setupCodes(); show('setupScreen'); });
document.getElementById('readerSwitch').addEventListener('click', switchRoles);
document.getElementById('listenerSwitch').addEventListener('click', switchRoles);
document.getElementById('noteInput').addEventListener('input', () => { updateCharCount(); updateQueryPreview(); });
document.getElementById('clearNotes').addEventListener('click', () => {
  document.getElementById('noteInput').value = '';
  updateCharCount();
  updateQueryPreview();
  document.getElementById('promptBox').classList.add('hidden');
});
document.getElementById('copyPrompt').addEventListener('click', copyPrompt);
document.getElementById('searchWeb').addEventListener('click', () => openSearch('web'));
document.getElementById('searchImages').addEventListener('click', () => openSearch('images'));
document.getElementById('revealListenerAnswer').addEventListener('click', () => document.getElementById('listenerAnswerCard').classList.toggle('hidden'));
