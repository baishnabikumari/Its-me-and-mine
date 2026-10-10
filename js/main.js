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
if (projects.length <= showFirst){
    moreBtn.style.display = "none";
}
moreBtn.addEventListener("click", function () {
    list.classList.toggle("open");
    if(list.classList.contains("open")){
        moreBtn.textContent = "show less";
    } else {
        moreBtn.textContent = "show more";
    }
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
       document.querySelectorAll(".card").forEach(function (card){
        if(cat === "All" || card.getAttribute("data-category") === cat){
            card.classList.remove("hidden");
        } else{
            card.classList.add("hidden");
        }
       });
    });
    filterBar.appendChild(tab);
});

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