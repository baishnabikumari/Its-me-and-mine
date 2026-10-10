const list = document.getElementById("project-list");
const moreBtn= document.getElementById("more-btn");
const showFirst = 6;

projects.forEach(function (p, i) {
    const card = document.createElement("div");
    card.className = "card";

    if(i >= showFirst){
        card.classList = "card";
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
    html += '<div class="links">';
    html += '<a href="' + p.repo + '" target="_blank">repo</a>';
    if(p.live){
        html += '<a href="' + p.live + '" target="_blank">live</a>';
    }
    html += "</div>";

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

const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav-links a");
const section = document.querySelectorAll("header[id] section[id]");

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
}, { rootMargin: "-40% 0px -55px 0px" });

section.forEach(function(s){
    observer.observe(s);
})