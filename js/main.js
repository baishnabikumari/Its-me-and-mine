const list = document.getElementById("project-list");
projects.forEach(function (p) {
    const card = document.createElement("div");
    card.className = "card";

    let html = "<h3>" + p.name + "</h3>";
    if(p.desc){
        html += "<p>" + p.desc + "</p>";
    }
    let meta = p.hours + "h";
    if(p.stack.length){
        meta += " . " + p.stack.join(", ");
    }
    html += '<p class="meta">' + meta + "</p>";
    html += '<div class="links">';
    html += '<a href="' + p.repo + '" target="_blank">repo</a>';
    if(p.live){
        html += '<a href="' + p.live + '" target="_blank">live</a>';
    }
    html += "</div>";

    card.innerHTML = html;
    list.appendChild(card);
});