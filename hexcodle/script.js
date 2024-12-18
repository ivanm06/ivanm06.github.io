var playing = true;
const emojis = ["✅", "⏬", "⏫", "🔼", "🔽"]
const target = document.getElementsByClassName("color")[0]
const guess = document.getElementsByClassName("color")[1]
const guessCont = document.getElementById("guesscont");
const inputField = document.getElementById('inpt');
const status = document.getElementById('status');
const arr = ['0','1','2','3','4','5','6','7','8','9','A', 'B', 'C', 'D', 'E', 'F']
var generated = ['0','0','0','0','0','0']
var round = 1;
var totalResNum = 0;

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const code = params.get('code')

if (!code) generateNew();
else getCodeFromUrl();

function getCodeFromUrl(){
    let ar = atob(code).toUpperCase().split("");
    if (ar.length != 6) return generateNew();
    if (ar.filter(i => i.length > 1 || arr.indexOf(i) == -1).length > 0) return generateNew();
    generated = ar;
    target.style.backgroundColor = `#${generated.join('')}`;
}

function generateNew(){
    for (i = 0; i< 5; i++) generated[i] = arr[Math.round(Math.random() * 15)];
    target.style.backgroundColor = `#${generated.join('')}`;
}
function getRes(){
    if (!playing) return;
    let user = inputField.value.toUpperCase().split('').slice(1);
    if (user.length != 6) return;
    if (user.filter(i => i.length > 1 || arr.indexOf(i) == -1).length > 0) return;
    let resultado = []
    let resNum = 0;


    guess.style.backgroundColor = `#${user.join('')}`;
    for (i = 0; i < 6; i++){
        let ind = arr.indexOf(user[i])
        let ind2 = arr.indexOf(generated[i])
        let res = ind2-ind
        resNum += Math.abs(res);
        totalResNum += Math.abs(res);
        console.log(totalResNum, res)
        if (res > 3) resultado.push('⏫️');
        else if (res > 0) resultado.push('🔼');
        else if (res == 0) resultado.push('✅');
        else if (res > -3) resultado.push('🔽');
        else resultado.push('⏬️');
    }

    let inner = `<div class="guess">`
    for (i = 0; i <= 5; i++) inner += `<div style="border-color: #${user.join('')};"><p>${user[i]}</p><p>${resultado[i]}</p></div>`;

    guessCont.innerHTML += inner + `</div>`
    if (resNum == 0){
        console.log(totalResNum, (totalResNum*100)/450)
        status.innerHTML = `You guessed it! Your score is ${Math.abs(100 - Math.ceil((totalResNum*100)/450))}%.`
        playing = false;
        return
    }
    let ar = ['Almost there!', 'Almost there!', 'Meh,', 'Meh,', 'Not quite!', 'Not quite!', 'Not quite!', 'Not quite!']
    
    status.innerHTML = `${ar[Math.floor((resNum*3)/96)]} ${5-round} guesses left.`
    inputField.value = '#'
    round++;
    
    if (round > 5){
        playing = false;
        status.innerHTML = `You failed :(, the code was ${generated.join('')}.`
    }
}

document.addEventListener('keydown', e => {
    if (e.key == "Enter") getRes();
})
inputField.addEventListener('input', () => {
    if (inputField.value.split("")[0] !== "#") inputField.value = "#" + inputField.value;
});

const copyContent = async () => {
    try {
        let text = window.location.protocol + '//' + window.location.hostname + '/?code=' + btoa(generated.join(''));
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}