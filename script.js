const CONFIG = {
    gridSize: 4,
    totalTiles: 12,
    winState: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0]
};

let tiles = [...CONFIG.winState];
let isPlaying = false;
let timerId = null;
let time = 0;
let steps = 0;
let moveCount = 1; 
const history = [];
const el = {
    board: document.getElementById("board"),
    startBtn: document.getElementById("startBtn"),
    timer: document.getElementById("timer"),
    winText: document.getElementById("winText"),
    history: document.getElementById("history")
};

const renderBoard = () => {
    el.board.innerHTML = "";
    tiles.forEach(num => {
        const div = document.createElement("div");
        const baseClass = "w-24 h-24 flex items-center justify-center rounded text-xl font-bold";
        const colorClass = num === 0 ? "bg-black" : "bg-green-100 text-green-800";
        
        div.className = `${baseClass} ${colorClass}`;
        div.textContent = num || "";
        el.board.appendChild(div);
    });
};
const shuffleTiles = () => {
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * CONFIG.totalTiles);
        const b = Math.floor(Math.random() * CONFIG.totalTiles);
        [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
    }
    renderBoard();
};

const handleTimer = (action) => {
    if (action === 'start') {
        clearInterval(timerId);
        time = 0;
        el.timer.textContent = "00:00";
        timerId = setInterval(() => {
            time++;
            const m = String(Math.floor(time / 60)).padStart(2, "0");
            const s = String(time % 60).padStart(2, "0");
            el.timer.textContent = `${m}:${s}`;
        }, 1000);
    } else {
        clearInterval(timerId);
    }
};

const updateUI = (state) => {
    if (state === 'playing') {
        el.startBtn.textContent = "Kết thúc";
        el.startBtn.classList.replace("bg-green-500", "bg-red-500");
    } else {
        el.startBtn.textContent = "Bắt đầu";
        el.startBtn.classList.replace("bg-red-500", "bg-green-500");
    }
};

const saveRecord = () => {
    const record = {
        order: moveCount++,
        steps: steps,
        time: el.timer.textContent
    };
    history.push(record);
    const row = `<tr class="text-center border">
        <td>${record.order}</td>
        <td>${record.steps}</td>
        <td>${record.time}</td>
    </tr>`;
    el.history.insertAdjacentHTML('beforeend', row);
};

const checkWin = () => {
    const isWin = tiles.every((val, i) => val === CONFIG.winState[i]);
    
    if (isWin) {
        handleTimer('stop');
        saveRecord();
        isPlaying = false;
        el.winText.textContent = "YOU WIN!";
        updateUI('idle');

        setTimeout(() => {
            tiles = [...CONFIG.winState];
            renderBoard();
            el.winText.textContent = "";
        }, 2200);
    }
};

function moveTile(dir) {
    if (!isPlaying) return;
    const emptyIdx = tiles.indexOf(0);
    let targetIdx = -1;
    if (dir === "left" && emptyIdx % 4 !== 3) targetIdx = emptyIdx + 1;
    if (dir === "right" && emptyIdx % 4 !== 0) targetIdx = emptyIdx - 1;
    if (dir === "up" && emptyIdx >= 4) targetIdx = emptyIdx - 4;
    if (dir === "down" && emptyIdx <= 7) targetIdx = emptyIdx + 4;

    if (targetIdx !== -1) {
        [tiles[emptyIdx], tiles[targetIdx]] = [tiles[targetIdx], tiles[emptyIdx]];
        steps++;
        renderBoard();
        checkWin();
    }
}

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === 'arrowleft' || key === 'a') moveTile("left");
    if (key === 'arrowright' || key === 'd') moveTile("right");
    if (key === 'arrowup' || key === 'w') moveTile("up");
    if (key === 'arrowdown' || key === 's') moveTile("down");
});

el.startBtn.onclick = () => {
    if (!isPlaying) {
        shuffleTiles();
        steps = 0;
        isPlaying = true;
        updateUI('playing');
        handleTimer('start');
        el.winText.textContent = "";
    } else {
        handleTimer('stop');
        saveRecord();
        isPlaying = false;
        updateUI('idle');
    }
};
renderBoard();