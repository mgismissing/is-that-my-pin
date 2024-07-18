console.log("loaded script")

var i = 0;

const codes = {
    "Andrea Graziani"   : ["swipe", null,                        "17/07/2024", true,  "his", "he" ],
    "Gabriele Graziani" : ["pin",   "2010",                      "18/07/2024", true,  "his", "he" ],
    "Ivonne Marchi"     : ["swipe", null,                        "12/07/2024", true,  "her", "she"],
    "Maila Quaresima"   : ["swipe", null,                        "18/07/2024", true,  "her", "she"],
    "Stefano Quaresima" : ["swipe", null,                        "12/07/2024", true,  "his", "he" ],
    "Sofia Graziani"    : ["pass",  "sushi",                     "18/07/2024", false, "her", "she"],
    "Thomas Bonera"     : ["comb",  [2, 5, 8, 7, 6],             "16/07/2024", true,  "his", "he" ],
};

document.getElementById("pinForm").addEventListener("submit", function(e) {
    clearDiv("grid");
    
    e.preventDefault();
    const fullName = document.getElementById("name").value.trim();

    const result = document.getElementById("result-text");
    const footer = document.getElementById("footer-text");
    const desc = document.getElementById("desc-text");
    if (codes[fullName]) {
        result.innerText = `${fullName}'s code as of ${codes[fullName][2]} is:`;
        desc.innerText = "";
        footer.innerText = "It has not been changed since then."
        if (!codes[fullName][3]) {
            footer.innerText = `This is not ${codes[fullName][4]} code anymore because ${codes[fullName][5]} changed it.`
        }
        if (codes[fullName][0] == "swipe") {
            desc.innerText = "None. Swipe and you're in.";
        }
        if (codes[fullName][0] == "comb") {
            createGrid("grid", codes[fullName][1]);
        }
        if (codes[fullName][0] == "pin") {
            desc.innerText = "ㅤ";
            typeWriter(codes[fullName][1], desc, 50);
        }
        if (codes[fullName][0] == "pass") {
            desc.innerText = "ㅤ";
            typeWriter(codes[fullName][1], desc, 50);
        }
        
    } else {
        result.innerText = `No pin found for ${fullName}`;
        footer.innerText = "We don't know it, yet...";
        desc.innerText = "";
    }
});


function createGrid(containerId, combination) {
    console.log("grid create request")
    const container = document.getElementById(containerId);
    if (!container) return;
    
    console.log("passed container is valid")

    // Create 3x3 grid of dots
    console.log("creating grid")
    for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        container.appendChild(dot);
    }
    
    // Create canvas for drawing lines
    console.log("creating canvas")
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.top = container.getBoundingClientRect().top
    canvas.style.left = container.getBoundingClientRect().left
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Coordinates of the dots
    console.log("getting dot coordinates")
    const dotPositions = Array.from(container.getElementsByClassName('dot')).map(dot => {
        const rect = dot.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - parentRect.left,
            y: rect.top + rect.height / 2 - parentRect.top,
        };
    });

    // Function to animate the drawing of lines
    function animateCombination(combination) {
        console.log("animating combination")
        let index = 0;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();

        function drawLine(doFinish) {
            console.log("drawing line")
            if (index >= combination.length - 1) {
                return;
            }
            const start = dotPositions[combination[index]];
            const end = dotPositions[combination[index + 1]];
            
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            index++;
            setTimeout(drawLine, 250); // Delay between lines
        }

        drawLine();
    }
    
    animateCombination(combination);
}

function clearDiv(elementID) {
    console.log("clearing div")
    document.getElementById(elementID).innerHTML = "";
}

function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function typeWriter(text, element, delay) {
    const letters = text.split("");
    let i = 0;
    let textBuf = "";
    
    while(i < letters.length) {
        await waitForMs(delay);
        textBuf += letters[i];
        element.innerText = textBuf;
        i++;
    }
    return;
}