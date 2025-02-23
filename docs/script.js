const contenedorPregs = document.getElementById('question-container');
const elementoPreg = document.getElementById('question');
const btnRespuestaElemento = document.getElementById('answer-buttons');
const nextBtn = document.getElementById('next-btn');
const puntuac = document.getElementById('score');
const highpuntuac = document.getElementById('high-score');

let posicionPreg, respuestaOk, score, paisesUsados;

if (localStorage.getItem('highScore')) {
    highpuntuac.innerText = localStorage.getItem('highScore');
} else {
    localStorage.setItem('highScore', 0);
}

nextBtn.addEventListener('click', () => {
    posicionPreg++;
    siguientePreg();
});

empezarJuego();

function empezarJuego() {
    score = 0;
    posicionPreg = 0;
    paisesUsados = [];
    siguientePreg();
}

function siguientePreg() {
    resetState();
    fetchQuestion().then(data => {
        showPreg(data);
    });
}

function showPreg(data) {
    elementoPreg.innerText = `¿Cuál es la bandera de ${data.name.common}?`;
    const answers = [data.flags.png];
    respuestaOk = data.flags.png;
    paisesUsados.push(data.name.common);

    // Add three more random flags
    for (let i = 0; i < 3; i++) {
        const randomFlag = randomPreg(respuestaOk);
        answers.push(randomFlag);
    }

    answers.sort(() => Math.random() - 0.5).forEach(flag => {
        const button = document.createElement('button');
        button.innerHTML = `<img src="${flag}" alt="flag" class="flag">`;
        button.classList.add('btn');
        button.addEventListener('click', selectAnswer);
        btnRespuestaElemento.appendChild(button);
    });
}

function resetState() {
    nextBtn.classList.add('hide');
    while (btnRespuestaElemento.firstChild) {
        btnRespuestaElemento.removeChild(btnRespuestaElemento.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target.closest('button');
    const correct = selectedButton.querySelector('img').src === respuestaOk;
    if (correct) {
        score++;
        puntuac.innerText = score;
    }
    if (posicionPreg >= 9) { // Max 10 attempts
        endGame();
    } else {
        nextBtn.classList.remove('hide');
    }
}

function endGame() {
    if (score > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', score);
        highpuntuac.innerText = score;
    }
    alert(`!!!Juego terminado!!! Tu puntuación es ${score}`);
}

async function fetchQuestion() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();
    let paisRandom;
    do {
        paisRandom = countries[Math.floor(Math.random() * countries.length)];
    } while (paisesUsados.includes(paisRandom.name.common));
    return paisRandom;
}

function randomPreg(excludeFlag) {
    const flags = [
        'https://flagcdn.com/w320/de.png',
        'https://flagcdn.com/w320/us.png',
        'https://flagcdn.com/w320/fr.png',
        'https://flagcdn.com/w320/jp.png',
        'https://flagcdn.com/w320/it.png',
        'https://flagcdn.com/w320/ca.png',
        'https://flagcdn.com/w320/gb.png',
        'https://flagcdn.com/w320/au.png',
        'https://flagcdn.com/w320/br.png',
        'https://flagcdn.com/w320/za.png'
    ];

    let randomFlag;
    do {
        randomFlag = flags[Math.floor(Math.random() * flags.length)];
    } while (randomFlag === excludeFlag);

    return randomFlag;
}