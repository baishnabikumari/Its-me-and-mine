const list = document.getElementById("project-list");
const moreBtn= document.getElementById("more-btn");
const showFirst = 6;

projects.forEach(function (p, i) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-index", i);
    card.setAttribute("data-category", p.category);

    if(i >= showFirst){
        card.classList.add("extra");
    }

    let html = '<div class="card-top">';
    html += "<h3>" + p.name + "</h3>";
    html += '<span class="hours">' + p.hours + "h</span>";
    html += "</div>";
    if(p.desc){
        html += "<p>" + p.desc + "</p>";
    }
    if(p.stack.length){
        html += '<div class="tags">';
        p.stack.forEach(function (s){
            html += "<span>" + s + "</span>";
        });
        html += "</div>";
    }
    // html += '<div class="links">';
    // html += '<a href="' + p.repo + '" target="_blank">repo</a>';
    // if(p.live){
    //     html += '<a href="' + p.live + '" target="_blank">live</a>';
    // }
    // html += "</div>";

    card.innerHTML = html;
    list.appendChild(card);
});

let currentFilter = "All";
let showMoreOpen = false;

function updateCardVisibility(){
    let extraMatchCount = 0;

    document.querySelectorAll(".card").forEach(function (card){
        const matchesFilter = currentFilter === "All" || card.getAttribute("data-category") === currentFilter;
        const isExtra = card.classList.contains("extra");

        if(matchesFilter && isExtra){
            extraMatchCount++;
        }
        const shouldShow = matchesFilter && (!isExtra || showMoreOpen);
        card.classList.toggle("hidden", !shouldShow);
    });
    moreBtn.style.display = extraMatchCount > 0 ? "" : "none";
    moreBtn.textContent = showMoreOpen ? "show less" : "show more";
}

moreBtn.addEventListener("click", function () {
    showMoreOpen = !showMoreOpen;
    updateCardVisibility();
});

const filterBar = document.getElementById("filters");
const categories = ["All"];

projects.forEach(function (p){
    if(categories.indexOf(p.category) === -1){
        categories.push(p.category);
    }
});
categories.forEach(function (cat, i){
    const tab = document.createElement("div");
    tab.className = "filter-tab" + (i === 0 ? " active" : "");
    tab.textContent = cat;
    tab.addEventListener("click", function (){
       document.querySelectorAll(".filter-tab").forEach(function (t){
        t.classList.remove("active");
       });
       tab.classList.add("active");

       currentFilter = cat;
       showMoreOpen = false;
       updateCardVisibility();
       });
    filterBar.appendChild(tab);
});
updateCardVisibility();

const overlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

document.querySelectorAll(".card").forEach(function (card){
    card.addEventListener("click", function (){
        const p = projects[card.getAttribute("data-index")];
        openModal(p);
    });
});

function openModal(p){
    let html = "<h3>" + p.name + "</h3>";
    if(p.desc){
        html += "<p>" + p.desc + "</p>";
    }
    html += '<p class="meta">' + p.hours + "h · " + p.category + "</p>";
    html += '<div class="links">';
    html += '<a href="' + p.repo + '" target="_blank">repo</a>';
    if(p.live){
        html += '<a href="' + p.live + '" target="_blank">live</a>';
    }
    html += "</div>";

    modalBody.innerHTML = html;
    overlay.classList.add("open");
}

function closeModal(){
    overlay.classList.remove("open");
}
modalClose.addEventListener("click", closeModal);

overlay.addEventListener("click", function (e) {
    if(e.target === overlay){
        closeModal();
    }
});

document.addEventListener("keydown", function (e) {
    if(e.key === "Escape" && overlay.classList.contains("open")){
        closeModal();
    }
})

const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav-links a");
const section = document.querySelectorAll("header[id], section[id]");

window.addEventListener("scroll", function () {
    if(window.scrollY > 20){
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});
const observer = new IntersectionObserver(function (entries){
    entries.forEach(function (entry){
        if(entry.isIntersecting){
            navLinks.forEach(function (link){
                link.classList.remove("active");
                if(link.getAttribute("href") === "#" + entry.target.id){
                    link.classList.add("active");
                }
            });
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });

section.forEach(function(s){
    observer.observe(s);
})

const hoursList = document.getElementById("hours-list");
const hoursCountEl = document.getElementById("hours-count");
const hoursSection = document.getElementById("hours");

let maxHours = 0;
projects.forEach(function (p){
    if(p.hours > maxHours){
        maxHours = p.hours;
    }
});

projects.forEach(function (p){
    const row = document.createElement("div");
    row.className = "hours-row";
    const pct = (p.hours / maxHours) * 100;
    let html = '<span class="hours-name">' + p.name + '</span>';
    html += '<div class="track"><div class="fill" style="width:0%" data-width="' + pct + '"></div></div>';
    html += '<span class="hours-num">' + p.hours + 'h</span>';

    row.innerHTML = html;
    hoursList.appendChild(row);
});
let hoursPlayed = false;
const hoursObserver = new IntersectionObserver(function (entries){
    entries.forEach(function (entry){
        if(entry.isIntersecting && !hoursPlayed){
            hoursPlayed = true;
            runCounter();
            runBars();
        }
    });
}, { threshold: 0.4 });
hoursObserver.observe(hoursSection);

function runCounter(){
    const duration = 1500;
    const start = performance.now();

    function tick(now){
        let t = (now - start) / duration;
        if(t > 1) t = 1;

        const eased = 1 - Math.pow(1 - t, 3);
        hoursCountEl.textContent = Math.round(eased * totalHours);

        if(t < 1){
            requestAnimationFrame(tick);
        }
    }
    requestAnimationFrame(tick);
}
function runBars(){
    const fills = document.querySelectorAll(".fill");
    fills.forEach(function (fill){
        const target = fill.getAttribute("data-width");
        setTimeout(function () {
            fill.style.width = target + "%";
        }, 50);
    });
}

let audioCtx = null;
let muted = false;

function unlockAudio(){
    if(!audioCtx){
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, duration, volume){
    if(muted || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}
document.body.addEventListener("click", unlockAudio, { once: true });
const hoverTargets = document.querySelectorAll(".card, .btn, .filter-tab, .nav-links a");
hoverTargets.forEach(function (el){
    el.addEventListener("mouseenter", function (){
        playTone(300, 0.08, 0.05);
    });
});

document.addEventListener("click", function (e){
    if(e.target.closest(".card, .btn, .filter-tab")){
        playTone(300, 0.1, 0.08)
    }
});

const muteBtn = document.getElementById("mute-btn");
muteBtn.addEventListener("click", function (){
    muted = !muted;
    muteBtn.textContent = muted ? "🔇" : "🔊";
})

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const hero = document.querySelector(".hero");
window.addEventListener("load", function (){
    hero.classList.add("loaded");
});

const revealEls = document.querySelectorAll("#about h2, #about .about-text, #about .skills, #projects h2, #hours h2, .hours-row");
revealEls.forEach(function (el) {
    el.classList.add("reveal");
});

const fadeEls = document.querySelectorAll(".card:not(.extra)");
fadeEls.forEach(function (el){
    el.classList.add("fade-in");
});

if(reduceMotion){
    revealEls.forEach(function (el){
        el.classList.add("visible");
    });
    fadeEls.forEach(function (el){
        el.classList.add("visible");
    });
} else {
    const revealObserver = new IntersectionObserver(function (entries, obs){
        entries.forEach(function (entry){
            if(entry.isIntersecting){
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    revealEls.forEach(function (el){
        revealObserver.observe(el);
    });
    fadeEls.forEach(function (el){
        revealObserver.observe(el);
    });
}

if(!reduceMotion){
    const magnets = document.querySelectorAll(".btn");
    magnets.forEach(function (btn){
        btn.addEventListener("mousemove", function (e){
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = "translate(" + x * 0.3 + "px," + y * 0.3 + "px)";
        });
        btn.addEventListener("mouseleave", function (){
            btn.style.transform = "translate(0, 0)";
        });
    });
}

if(!reduceMotion && window.matchMedia("(pointer: fine)").matches){
    const ghostEl = document.getElementById("ghost");
    ghostEl.style.display = "block";

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let clicked = false;

    function getMouse(e){
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    window.addEventListener("mousemove", getMouse);
    window.addEventListener("mousedown", function (){ clicked = true; });
    window.addEventListener("mouseup", function (){ clicked = false; });

    function map(num, inMin, inMax, outMin, outMax){
        return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
    const ghost = {
        el: ghostEl,
        mouth: ghostEl.querySelector(".ghost__mouth"),
        eyes: ghostEl.querySelector(".ghost__eyes"),
        pos: {x: mouse.x, y: mouse.y },

        follow: function (){
            const distX = mouse.x - this.pos.x;
            const distY = mouse.y - this.pos.y;
            const velX = distX / 8;
            const velY = distY / 8;

            this.pos.x += distX / 10;
            this.pos.y += distY / 10;

            const skewX = map(velX, 0, 100, 0, -50);
            const scaleY = map(velY, 0, 100, 1, 2.0);
            const scaleEyeX = map(Math.abs(velX), 0, 100, 1, 1.2);
            let scaleEyeY = map(Math.abs(velX * 2), 0, 100, 1, 0.1);
            let scaleMouth = Math.min(
                Math.max(
                    map(Math.abs(velX * 1.5), 0, 100, 0, 10),
                    map(Math.abs(velY * 1.2), 0, 100, 0, 5)
                ),
                2
            );
            if(clicked){
                scaleEyeY = 0.4;
                scaleMouth = -scaleMouth;
            }
            this.el.style.transform = "translate(" + this.pos.x + "px, " + this.pos.y + "px) scale(.7) skew(" + skewX + "deg) rotate(" + -skewX + "deg) scaleY(" + scaleY + ")";
            this.eyes.style.transform = "translateX(-50%) scale(" + scaleEyeX + "," + scaleEyeY + ")";
            this.mouth.style.transform = "translate(" + (-skewX * 0.5 - 10) + "px) scale(" + scaleMouth + ")";
        }
    };
    function renderGhost(){
        requestAnimationFrame(renderGhost);
        ghost.follow();
    }
    renderGhost();
}

const progressBar = document.getElementById("progress-bar");

function updateProgressBar(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
}

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("resize", updateProgressBar);
updateProgressBar();

if(!reduceMotion){
    document.querySelectorAll(".card").forEach(function (card){
        card.addEventListener("mousemove", function (e){
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
            card.style.transform = "perspective(600px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
        });
        card.addEventListener("mouseleave", function (){
            card.style.transform = "";
        });
    });
}

const themeBtn = document.getElementById("theme-btn");
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){
    document.documentElement.setAttribute("data-theme", "light");
    themeBtn.textContent = "☀️";
}

function toggleTheme(){
    unlockAudio();
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if(isLight){
        document.documentElement.removeAttribute("data-theme");
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "light");
    }
    playTone(isLight ? 300 : 500, 0.12, 0.08);
}
themeBtn.addEventListener("click", toggleTheme);
const konamiCode = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"];
let konamiIndex = 0;

document.addEventListener("keydown", function (e){
    if(e.code === konamiCode[konamiIndex]){
        konamiIndex++;
        if(konamiIndex === konamiCode.length){
            konamiIndex = 0;
            toggleTheme();
            if(!reduceMotion){
                document.body.classList.add("konami-flash");
                setTimeout(function (){
                    document.body.classList.remove("konami-flash");
                }, 600);
            }
        }
    } else {
        konamiIndex = 0;
    }
});