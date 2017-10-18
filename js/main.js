var KEY = "4e2d39067985110a7f972c278974032a";
var HASH ="f827fedd176899a2f0b451976592bc54"
$(document).ready( () =>{

	$('#searchForm').on('submit', event => {
		let searchText = $('#searchText').val();
		getComics(searchText)
		event.preventDefault();
	});

});

function getComics(searchText){
	axios.get("https://gateway.marvel.com/v1/public/characters?ts=1&nameStartsWith="+searchText+"&limit=100&apikey="+ KEY+"&hash=" + HASH)
		.then ((response) => {
			console.log(response);
			let characters = response.data.data.results;
			let output = ' ';
			/*JQ loop, ` ` are for template strings*/
			$.each(characters,(index, chara) => {
				output += `
					<div class="col-md-3">
						<div class="well text-center" >
							<img src="${chara.thumbnail.path + "." + chara.thumbnail.extension}" >
							<h5>${chara.name}</h5>
							<a onclick = "characterSelected('${chara.id}')" class="btn btn-primary" href = "#" > Character Details</a>
						</div>
					</div>
				`;
			});
			$('#characters').html(output);

		})

		.catch( (err) => {
			console.log(err);
		});
}

function characterSelected(id) {
	//Session storage clears after browser closes
	sessionStorage.setItem('charId',id);
	window.location = 'character.html';
	return false;
}

function getCharacter(){
	let characterId = sessionStorage.getItem('charId');
	axios.get("https://gateway.marvel.com/v1/public/characters/"+characterId+"?ts=1&apikey="+ KEY+"&hash=" + HASH)
		.then((response) => {
			console.log(response);
			let character = response.data.data.results["0"];
			let series = character.series.items;
			let output = `
				<div class="row">
					<div class="col-md-4">
						<img class = "thumbnail" alt = "${character.name}" src="${character.thumbnail.path + "." + character.thumbnail.extension}">
					</div>

					<div class="col-md-8">
						<h2>${character.name}</h2>
						<h3><br /> Appearances:</h3>
						<ul class="list-group">	`;
			$.each(series,(index,item) => {
				output += `
					<li class="list-group-item"> ${item.name}</li>`;
				if(index == 19){
					output += `
					<li class="list-group-item active">See more at links below</li>`;
				}

			});



				output += `
						</ul>
					</div>
				</div>
				<div class="row">
					<div class="well">
						<h3 >Description</h3>
						<blockquote>${character.description}</blockquote>
						
						<hr>
						<a href="${character.urls[1].url}" target="_blank" class="btn btn-primary">Marvel Wiki Page</a>
						<a href="${character.urls[2].url}" target="_blank" class="btn btn-primary">See Comics Featured In</a>
						<a href="index.html" class="btn btn-default">Return Home</a>
					</div>
				</div>
				`;
			

			$('#character').html(output);

		})
		.catch((err) => {
			console.log(err);
		});
}