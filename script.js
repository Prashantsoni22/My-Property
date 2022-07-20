$(document).ready(function () {

  $.ajax({

    url: "http://localhost:3000/getPlots",
    type: "GET",
    success: function (response) {
      loadCards(response.response)
    }

  });

  $("#btn").click(async function (e) {

    e.preventDefault();
    let pSize = document.getElementById("plotSize").value;
    let pArea = document.getElementById("plotArea").value;
    let addr = document.getElementById("address").value;
    let price = document.getElementById("price").value;
    let rooms = document.getElementById("rooms").value;

    var formData = [];
    var total_files = document.getElementById('batchfile').files.length;
    if (total_files == -0){
      alert ("please select atleast one image");
      return;
    }
    for (var i = 0; i < total_files; i++) {
      let base64Data = await toBase64(document.getElementById('batchfile').files[i])
      if (base64Data.status == 200) {
        formData.push(base64Data.data)
      }
      else {
        formData.push("")
      }
    }
    addNewAddress(pSize, pArea, addr, price, rooms, formData);

  })

  $("#btn1").click(async function (e) {

    e.preventDefault();
    let sText = document.getElementById("searchText").value;
    searchPlots(sText);

  })

})

function loadCards(address) {
  address.forEach((result, idx) => {
    const imageData = document.getElementById("gallery");
    const carouselImage = document.getElementById("pop");
    let content = 
   
    `
    
      <div class="column" data-toggle="modal" data-target="#exampleModal${idx}">
        <img class="w-100" src=${result.images[0]} alt="First slide" data-target="#carouselExample${idx}" data-slide-to=${idx}>
      </div>

      <div class='delete'>
      <button class="btn" onclick="deletePlot(${idx})"> delete </button>
    </div>
      
      `
    imageData.innerHTML += content;

    let insideCarousel = `
    <div class="modal fade" id="exampleModal${idx}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
    <div class="modal-content">
    <div class="modal-header">

    </div>
    <div class="modal-body">
        <div id="carouselExample${idx}" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
    `;

    for (let i = 0; i < result.images.length; i++) {
      if (i == 0) {
        insideCarousel += `<li data-target="#carouselExample${idx}" data-slide-to="0" class="active"></li>`
      }
      else {
        insideCarousel += `<li data-target="#carouselExample${idx}" data-slide-to="${i}"></li>`
      }
    }

    insideCarousel += `
    </ol>
    <div class="carousel-inner" id="carouselImages${idx}">
    `
    for (let j = 0; j < result.images.length; j++) {
      if (j == 0) {
        insideCarousel += `
            <div class="carousel-item active">
              <img class="d-block w-100" src=${result.images[j]} alt="First slide">
            </div>
          `;
      }
      else {
        insideCarousel += `
            <div class="carousel-item">
              <img class="d-block w-100" src=${result.images[j]} alt="First slide">
            </div>
          `;
      }
    }

    insideCarousel += `
    </div>
        <a class="carousel-control-prev" href="#carouselExample${idx}" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExample${idx}" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
        </div>
    </div>
    <div class="modal-footer">
        <div id="info${idx}">
    `
    content = `
    <table align="left">
    <tr><td>Plot Size</td><td>${result.plotSize}</td><td>Plot Area</td><td>${result.plotSize}</td></tr>
    <tr><td>Address</td><td>${result.address}</td></tr>
    <tr><td>Price</td><td>${result.price}</td><td>Total Rooms</td><td>${result.rooms}</td></tr>
    </table>
    `
    insideCarousel += content
    insideCarousel += `
        </div>
        <div >
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
    </div>
    </div>
    </div>
    </div>
    `

    carouselImage.innerHTML += insideCarousel;

  });
}

function addNewAddress(pSize, pArea, pAddr, price, rooms, images) {

  $.ajax({
    url: "http://localhost:3000/addNewPlot",
    type: "POST",
    data: {
      plotSize: pSize,
      plotArea: pArea,
      address: pAddr,
      price: price,
      rooms: rooms,
      plotImages: images
    },
    success: function (response) {
      location.reload()
    }
  });

}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve({ status: 200, data: reader.result });
  reader.onerror = error => reject({ status: 400, data: "" });
});

function searchPlots(text) {

  $.ajax({
    url: "http://localhost:3000/getSearchPlot",
    type: "POST",
    data: {
      search: text
    },
    success: function (response) {
      $('#gallery').empty()
      $('#pop').empty()
      loadCards(response.response);
    }
  });

}

function deletePlot(index) {

  $.ajax({
    url: "http://localhost:3000/deletePlot",
    type: "POST",
    data: {
      index: index
    },
    success: function (response) {
      location.reload()
    }
  });

}

function togglePopup(){
  document.getElementById('popup-1').classList.toggle('active');
}
// togglePopup();