
//cursor

document.addEventListener("mousemove", e => {
    const c = document.getElementById("cursor");
    c.style.left = `${e.clientX - 12}px`;
    c.style.top = `${e.clientY - 12}px`;
});


//hamburger menu

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("menuBtn");
    const menu = document.getElementById("mobile-menu");
    const links = document.querySelectorAll("a");
    btn.onclick = () =>{
        menu.classList.toggle("hidden");
    }
    links.forEach(link => {
        link.onclick = () =>{
            menu.classList.add("hidden");
        }
    });
});

//canvas drawing

document.addEventListener("DOMContentLoaded", () => {
    const c = document.getElementById('canvas1');
    const ctx = c.getContext('2d');
    const scale = 5;
    const num_agents = 3;

    let drawing = false;

    const agents = [];
    for(let i = 0; i < num_agents; i++){
        agents.push({
            x: Math.random() * c.width,
            y: Math.random() * c.height,
            color: `hsl(${Math.floor(Math.random() * 361)}, 100%, 50%)`
        });
    }

    const genVelocity = () => {
        let rand = Math.floor(Math.random() * 4);
        switch(rand){
            case 0: return [-scale, 0];
            case 1: return [scale, 0];
            case 2: return [0, -scale];
            case 3: return [0, scale];
        }
    }

    const drawAgent = (agent) => {
        ctx.fillStyle = agent.color;
        let [dx, dy] = genVelocity();
        if(agent.x + dx >= 0 && agent.x + dx <= c.width - scale) agent.x += dx;
        if(agent.y + dy >=0 && agent.y + dy <= c.height - scale) agent.y += dy;
        ctx.fillRect(agent.x, agent.y, scale, scale); 
    }

    const draw = () =>{
        if(drawing){
            for(const agent of agents){
                drawAgent(agent);
            }
        }
        window.requestAnimationFrame(draw);
    }

    draw();

    c.addEventListener('click', ()=> {drawing = true;});
    c.addEventListener('dblclick', ()=> {drawing = false;});
});

document.addEventListener("DOMContentLoaded", () => {
    const c = document.getElementById('canvas2');
    const ctx = c.getContext('2d');
    const scale = 20;
    const gridSize = 20;

    let drawing = false;

    let board = Array.from({length: gridSize}, () => Array(gridSize).fill(0));

    const initPattern = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    for(let i = 0; i < initPattern.length; i++){
        for(let j = 0; j < initPattern[i].length; j++){
            board[i][j] = initPattern[i][j];
        }
    }

    const nextGen = () => {
        const nextBoard = board.map(arr => arr.slice());

        for(let x = 0; x < gridSize; x++){
            for(let y = 0; y < gridSize; y++){
                const state = board[x][y];
                let neighbours = 0;

                for(let i=-1;i<=1;i++){
                    for(let j=-1;j<=1;j++){
                        const col = (x + i + gridSize) % gridSize;
                        const row = (y + j + gridSize) % gridSize;
                        neighbours += board[col][row];
                    }
                }
                neighbours -= board[x][y];

                if(state === 0 && neighbours === 3) nextBoard[x][y] = 1;
                else if(state === 1 && (neighbours < 2 || neighbours > 3)) nextBoard[x][y] = 0;
                else nextBoard[x][y] = state;
            }
        }

        board = nextBoard;
    }

    const drawBoard = () => {
        ctx.clearRect(0, 0, c.width, c.height);
        for(let x = 0; x < gridSize; x++){
            for(let y = 0; y < gridSize; y++){
                if(board[x][y] === 1){
                    ctx.fillStyle = "#333";
                    ctx.fillRect(y*scale, x*scale, scale, scale);
                }
            }
        }
    }

    drawBoard();

    const draw = () =>{
        if(drawing){
            const now = Date.now();
            if(!draw.lastTime || now - draw.lastTime > 300){ 
                drawBoard();
                nextGen();
                draw.lastTime = now;
            }
        }
        window.requestAnimationFrame(draw);
    }

    draw();

    c.addEventListener('click', ()=> {drawing = true;});
    c.addEventListener('dblclick', ()=> {drawing = false;});
});

const toggleNavbar = () => {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navBar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
};

toggleNavbar();