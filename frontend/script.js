//server stuff
const socket = io("https://whispering-fortress-89061.herokuapp.com/");
const code = document.getElementById('code');
const submitBtn = document.getElementById('submitBtn');
const codeInput = document.getElementById('codeInput');
const id = makeid(5);
let answer;
let defaultValue;
let user;
let userImage;
let questionObj;

submitBtn.addEventListener('click', () => {
    const value = codeInput.value.toUpperCase();
    console.log(value);
    socket.emit('joinARoom', value);
    socket.emit('gameStarted');
    code.innerText = value;
    questionsSection.style.display = 'none';
    questionsSection.classList.add('fadingOut');
    codingSection.style.display = 'grid';
    codingSection.classList.add('fadingIn');
    setTimeout(() => {
        questionsSection.classList.remove('fadingOut');
        codingSection.classList.remove('fadingIn');
    }, 500)
});

//getting the question
socket.on('startingGameData', (data) => {
    questionObj = data;
    document.getElementById('title').innerText = data.name;
    document.getElementById('by').innerText = data.by;
    document.getElementById('Question').innerHTML = data.description;
    document.getElementById('example').innerHTML = data.example;
    defaultValue = data.startingCode;
    editor.setValue(defaultValue);
    answer = data.answer;
    testCase = data.testCase;
});

//DOM manipulating
const joinBtn = document.getElementById('joinBtn');
const createBtn = document.getElementById('createBtn');
const joinChunk = document.getElementById('joinChunk');
const createChunk = document.getElementById('createChunk');
const choices = document.getElementsByClassName('choices');
const questionsSection = document.querySelector('.questions');
const codingSection = document.querySelector('.coding');
const back = document.getElementById('back');
const theConsole = document.getElementById('theConsole');
const theQuestion = document.getElementById('theQuestion');
const theconsole = document.getElementById('theconsole');
const thequestion = document.getElementById('thequestion');
const success = document.querySelector('.success');
const failure = document.querySelector('.failure');
const message = document.querySelector('.message');
const score = document.getElementById('score');
const userName = document.getElementById('userName');
const nameChunk = document.getElementById('nameChunk');
const resultTable = document.getElementById('resultTable');
const userNameSubmitButton = document.getElementById('userNameSubmitButton');
const resultSection = document.getElementById('result');
const reloadBtn = document.getElementById('reloadBtn');
const image = document.getElementById('image');
const review = document.getElementById('review');
const resultsBtn = document.getElementById('results');

userNameSubmitButton.addEventListener('click', () => {
    joinBtn.classList.remove('fadingIn');
    createBtn.classList.remove('fadingIn');
    nameChunk.classList.remove('fadingOut');
    socket.emit('username', userName.value);
    nameChunk.classList.add('fadingOut');
    setTimeout(() => {
        nameChunk.style.display = 'none';
        joinBtn.classList.add('fadingIn');
        joinBtn.style.display = 'block';
        createBtn.classList.add('fadingIn');
        createBtn.style.display = 'block';
    }, 500)
});

joinBtn.addEventListener('click', () => {
    joinBtn.style.display = 'none';
    joinBtn.classList.add('fadingOut');
    createBtn.style.display = 'none';
    createBtn.classList.add('fadingOut');
    joinChunk.style.display = 'block';
    joinChunk.classList.add('fadingIn');
    back.style.display = 'block';
    setTimeout(() => {
        joinBtn.classList.remove('fadingOut');
        createBtn.classList.remove('fadingOut');
        joinChunk.classList.remove('fadingIn');
    }, 300);
});

createBtn.addEventListener('click', () => {
    questionsSection.style.display = 'none';
    questionsSection.classList.add('fadingOut');
    codingSection.style.display = 'grid';
    codingSection.classList.add('fadingIn');
    setTimeout(() => {
        questionsSection.classList.remove('fadingOut');
        codingSection.classList.remove('fadingIn');
    }, 500)
    //server stuff
    socket.emit('createARoom', id);
    socket.emit('gameStarted');
    code.innerHTML = id;
});

back.addEventListener('click', () => {
    joinChunk.style.display = 'none';
    joinBtn.style.display = 'block';
    createBtn.style.display = 'block';
    back.style.display = 'none';
    createChunk.style.display = 'none';
    createChunk.classList.add('fadingOut');
    joinChunk.classList.add('fadingOut');
    joinBtn.classList.add('fadingIn');
    createBtn.classList.add('fadingIn');
    setTimeout(() => {
        joinChunk.classList.remove('fadingOut');
        joinBtn.classList.remove('fadingIn');
        createBtn.classList.remove('fadingIn');
        createChunk.classList.remove('fadingOut');
    }, 500);
});

theConsole.addEventListener('click', () => {
    theQuestion.classList.remove('active');
    theConsole.classList.add('active');
    thequestion.style.display = 'none';
    theconsole.style.display = 'block';
});

theQuestion.addEventListener('click', () => {
    theConsole.classList.remove('active');
    theQuestion.classList.add('active');
    theconsole.style.display = 'none';
    thequestion.style.display = 'block';
});

review.addEventListener('click', () => {
    getBackToIDE();
    editor.setReadOnly(true);
    submit.style.display = 'none';
    reset.style.display = 'none';
    resultsBtn.style.display = 'block';
});

reloadBtn.addEventListener('click', () => {
    socket.emit('reqNewQ');
    getBackToIDE();
    resultsBtn.style.display = 'none';
    reset.style.display = 'block';
    submit.style.display = 'block';
    resultTable.innerHTML = '<tr><th><h1>Username</h1></th><th><h1>TimeScore</h1></th></tr>';
    editor.setReadOnly(false);
    timer.innerHTML = 0;
    startingTimer();
});

resultsBtn.addEventListener('click', () => {
    codingSection.classList.add('fadingOut');
    resultSection.classList.add('fadingIn');
    setTimeout(() => {
        codingSection.style.display = 'none';
        resultSection.style.display = 'block';
    }, 500);
});

function getBackToIDE() {
    codingSection.classList.remove('fadingOut');
    resultSection.classList.remove('fadingIn');
    codingSection.classList.add('fadingIn');
    resultSection.classList.add('fadingOut');
    setTimeout(() => {
        codingSection.classList.remove('fadingIn');
        resultSection.classList.remove('fadingOut');
    }, 500)
    resultSection.style.display = 'none';
    codingSection.style.display = 'grid';
    theQuestion.classList.add('active');
    theConsole.classList.remove('active');
    thequestion.style.display = 'block';
    theconsole.style.display = 'none';
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//google auth stuff
function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    userName.value = profile.getName();
    userNameSubmitButton.click();
    userImage = profile.getImageUrl();
    image.innerHTML = `<img src="${userImage}" height="30px" width="30px">`;
}
function onFailure(error) {
    console.log(error);
}
function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

//getting the final result
socket.on('finalResult', (data) => {
    let usersArray = Object.keys(data);
    let timeScoreArray = Object.values(data);
    resultTable.innerHTML += `<tr><td><img src="${timeScoreArray[timeScoreArray.length - 1][1]}" class="playerImage">${usersArray[usersArray.length - 1]}</td><td>${timeScoreArray[timeScoreArray.length - 1][0]}</td></tr>`;
});

//for deleting elements
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}