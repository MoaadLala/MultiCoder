//getting stuff
const submit = document.getElementById('submit');
const reset = document.getElementById('reset');
const numOfLines = document.getElementById('numOfLines');
const timer = document.getElementById('timer');
let consoleMessages = [];
let startTimer;
let amountOfSeconds;
let testCase;
socket.on('winnerSeconds', (data) => {
    message.style.backgroundColor = '#556B2F';
    message.innerHTML = `someone submitted a working code,<br>he's time score is ${data}`;
    message.classList.remove('fadingOut');
    message.style.display = 'block';
    message.classList.add('fadingIn')
    setTimeout(() => {
        message.style.display = 'none';
        message.classList.remove('fadingIn');
        message.classList.add('fadingOut');
    }, 3500);
});
socket.on('loserSeconds', (data) => {
    message.style.backgroundColor = '#B11E1E';
    message.innerHTML = `somedude submitted a bug, idiot<br>he's time score is ${data}`;
    message.classList.remove('fadingOut');
    message.style.display = 'block';
    message.classList.add('fadingIn');
    setTimeout(() => {
        message.style.display = 'none';
        message.classList.remove('fadingIn');
        message.classList.add('fadingOut');
    }, 3500);
});
socket.on('someoneJoined', (data) => {
    message.style.backgroundColor = '#556B2F';
    message.innerHTML = `${data} has joined the room, the question will change all timers will be set to 0.`;
    message.classList.remove('fadingOut');
    message.style.display = 'block';
    message.classList.add('fadingIn')
    setTimeout(() => {
        message.style.display = 'none';
        message.classList.remove('fadingIn');
        message.classList.add('fadingOut');
    }, 3500);
    reset.click();
});

//setting up the text editor
const editor = ace.edit("ide");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
setInterval(() => {
    numOfLines.innerText = editor.session.getLength();
}, 300);

//running the code
submit.addEventListener('click', () => {
    clearConsoleScreen();
    let userCode = editor.getValue();
    userCode += testCase;
    try {
        new Function(userCode)();
    } catch (e) {
        console.error(e);
    }
    //printing to the console
    printToConsole();
    //switching to the console tab
    theQuestion.classList.remove('active');
    theConsole.classList.add('active');
    thequestion.style.display = 'none';
    theconsole.style.display = 'block';
    clearInterval(startTimer);
    //sending the seconds to the server
    amountOfSeconds = parseInt(timer.innerHTML);
    if(theconsole.innerText == answer) {
        failure.style.display = 'none';
        success.style.display = 'block';
        socket.emit('winnerAmountOfSeconds', [amountOfSeconds, userImage]);
        setTimeout(() => {
            codingSection.style.display = 'none';
            codingSection.classList.add('fadingOut');
            resultSection.style.display = 'block';
            resultSection.classList.add('fadingIn');
        }, 3000);
    }else{
        socket.emit('loserAmountOfSeconds', amountOfSeconds);
        success.style.display = 'none';
        failure.style.display = 'block';
        editor.setValue(defaultValue);
        setTimeout(() => {
            success.style.display = 'none';
            failure.style.display = 'none';
        }, 3000);
        startingTimer();
    }
});

//resetting the code
reset.addEventListener('click', () => {
    editor.setValue(defaultValue);
    //clearing the console
    clearConsoleScreen();
    timer.innerHTML = 0;
});

//creating the console
let console = (function (oldConsole) {
    return {
        formatArgsOutput: function(arg) {
            let outputArgMessage;
            switch (this.getType(arg)) {
                case "string":
                    outputArgMessage = `"${arg}"`;
                    break;
                case "object":
                    outputArgMessage = `Object ${JSON.stringify(arg)}`;
                    break;
                case "array":
                    outputArgMessage = `Array ${JSON.stringify(arg)}`;
                    break;
                default:
                    outputArgMessage = arg;
                    break;
            }
            return outputArgMessage;
        },
        getType: function(arg) {
            if (typeof arg === "string") return "string";
            if (typeof arg === "boolean") return "boolean";
            if (typeof arg === "funtion") return "funtion";
            if (typeof arg === "number") return "number";
            if (typeof arg === "undefined") return "undefined";
            if (typeof arg === "object" && !Array.isArray(arg)) return "object";
            if (typeof arg === "object" && !Array.isArray(arg)) return "array";
        },
        logMultipleArguments: function (arguments) {
            let currentLog = "";
            arguments.forEach(arg => {
                currentLog += this.formatArgsOutput(arg) + " ";
            });
            oldConsole.log.apply(oldConsole, arguments);
            consoleMessages.push({
                message: currentLog,
                class: `log log--defaul`
            });
        },
        logSingleArguments: function(logItem) {
            oldConsole.log(logItem);
            consoleMessages.push({
                message: this.formatArgsOutput(logItem),
                class: `log log--${this.getType(logItem)}`
            });
        },
        log: function(text) {
            let argsArray = Array.from(arguments);
            return argsArray.length != 1 ? this.logMultipleArguments(argsArray) : this.logSingleArguments(text);
        },
        info: function(text) {
            oldConsole.info(text);
        },
        warn: function(text) {
            oldConsole.warn(text);
        },
        error: function(text) {
            oldConsole.error(text);
            consoleMessages.push({
                message: `${err.name}: ${err.message}`,
                class: "log log--error"
            });
        }
    }
})(window.console);

function printToConsole() {
    consoleMessages.forEach(log => {
        const newLogText = document.createElement('pre');
        newLogText.className = log.class;
        newLogText.textContent = `${log.message}`;
        theconsole.appendChild(newLogText);
    });
}

function clearConsoleScreen() {
    consoleMessages.length = 0;
    while(theconsole.firstChild) {
        theconsole.removeChild(theconsole.firstChild);
    }
}

//starting the timer
function startingTimer() {
    startTimer = setInterval(() => {
        if(editor.getValue() != '') {
            timer.innerHTML = parseInt(timer.innerHTML) + 1;
        }
        //showing the time on the screen
        document.getElementById('seconds').innerText = timer.innerHTML;
    }, 1000);
}
startingTimer();

//preventing the editor from pasting
editor.onPaste = function() { return ""; }