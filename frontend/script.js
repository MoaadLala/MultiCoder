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

submitBtn.addEventListener('click', () => {
    const value = codeInput.value.toUpperCase();
    console.log(value);
    socket.emit('joinARoom', value);
    socket.emit('gameStarted');
    code.innerText = value;
    questionsSection.style.display = 'none';
    codingSection.style.display = 'grid';
});

socket.on('startingGameData', (data) => {
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
    codingSection.style.display = 'grid';
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
    }, 300);
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

reloadBtn.addEventListener('click', () => {
    window.location.reload();
});

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
    resultTable.innerHTML += `<tr><td>${usersArray[usersArray.length - 1]}</td><td>${timeScoreArray[timeScoreArray.length - 1]}</td></tr>`;
});