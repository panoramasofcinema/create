
// GLOBALS
var tag_http = 'https://tags.panoramasofcinema.ch/tags'

// MODAL CONTAINER
var modal = document.getElementsByClassName("modal")[0];

// MODAL CLOSE
var closeBtn = document.createElement("span");
closeBtn.className = "closeBtn";
closeBtn.innerText = 'X';
closeBtn.onclick = function () {
    modal.style.display = "none";
    modalContent.innerText = '';
}
modal.appendChild(closeBtn);

// MODAL CONTENT
var modalContent = document.createElement("div");
modalContent.className = "modalContent";
modalContent.setAttribute("id", "modal01");
modal.appendChild(modalContent);

// MODAL OPEN
function doModal(element) {
    modal.style.display = "block";
    let which = element.id;
    if (which == 'getUsers') {
        fetch(tag_http + '?action=GET_ALL_USERS')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                thisList = data['body'].sort();
                modalContent.innerText = 'USERS... ' + thisList.join(' | ');
            })
            .catch(function (err) {
                window.alert('something went wrong...');
            });
    }
    if (which == 'getTags') {
        fetch(tag_http + '?action=GET_ALL_TAGS')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                thisList = data['body'].sort();
                modalContent.innerText = 'TAGS... ' + thisList.join(' | ');
            })
            .catch(function (err) {
                window.alert('something went wrong...');
            });
    }
    if (which == 'infoBtn') {
        modalContent.innerHTML =
            "<div class='about'>" +
            "<iframe width='560' height='315' src='https://www.youtube.com/embed/YdODotfGU54' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>" +
            "<p>Panorama🎛App creates panoramic views of images from <a href='https://panoramasofcinema.ch' target='_blank'>Panoramas of Cinema🍿</a>. " +
            "These views show with examples found in movie frames, how an idea, a mood, or a space-to-be looks. " +
            "By implementing Machine Learning techniques, Panorama🎛App automatically arranges hundreds of images in a navigable space where similarities and rarities are easily recognized. " +
            "To create your panorama, visit <a href='https://panoramasofcinema.ch' target='_blank'>PoC🍿</a> and search for the images you want to include or directly upload them from your local drive.</p>" +
            "<p>Panorama🎛App is developed by <a href='https://www.digitalpentecost.online' target='_blank'>DrSc. Jorge Orozco</a> at the <a href='https://www.caad.arch.ethz.ch' target='_blank'>Chair for Digital Architectonics</a> in ETHZ's Department of Architecture.</p>" +
            "<p style='font-size: 0.7em;'>[<a href='https://github.com/panoramasofcinema/create' target='_blank'>GitHub</a>]</p>"
    }
}

// REQUEST PANORMA
function reqPanorama(albumName = "") {
    var thisTag = document.querySelector('#tag-name').value;
    var thisUser = document.querySelector("#user-name").value;
    var dimX = document.querySelector("#sizeX").value;
    var dimY = document.querySelector("#sizeY").value;
    var thisType = document.querySelector("input[name='type']:checked").value;
    var thisOrient = document.querySelector("input[name='orientation']:checked").value;
    var thisSqr = document.querySelector("input[name='squaring']:checked").value;
    var thisRes = document.querySelector("input[name='resolution']:checked").value;

    //var this_query = 'http://poccreatepanorama-env.eba-upy2qcn6.eu-central-1.elasticbeanstalk.com/panorama?'
    var this_query = 'https://make.panoramasofcinema.ch/panorama?'
    this_query = this_query + 'type=' + thisType + '&orientation=' + thisOrient +
        '&images_square=' + thisSqr + '&resolution=' + thisRes + '&grid=' + dimX + ',' + dimY;

    if (albumName.length > 0) {
        this_query = this_query + '&album=' + albumName;
    } else {
        if (thisTag.length > 0) {
            this_query = this_query + '&tag=' + thisTag;
        } else { }
        if (thisUser.length > 0) {
            this_query = this_query + '&user=' + thisUser;
        } else { }
    }

    //console.log(this_query);
    window.open(this_query);
}