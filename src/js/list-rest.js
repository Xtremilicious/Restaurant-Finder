const cityId = location.href.split('=')[1];
const scrollMe = document.querySelector('body');
const midSection = document.querySelector('#mid-section');
const cityName = document.querySelector('b');
let start = 0;
let count = 10;

function loadRest() {
	const xhr = new XMLHttpRequest();

	xhr.onload = restaurantsDetails;

	xhr.onerror = function() {
		console.log('Error in sending request.');
	}

	xhr.open('GET', `https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&start=${start}&count=${count}`);
	xhr.setRequestHeader('user-key', 'c3d3366545336bba3bcec47786f44130');
	xhr.send();

	function restaurantsDetails() { 
		if (this.status === 200) {
			const data = this.responseText;
			const restaurants = JSON.parse(data)['restaurants'];
			const { liked, unliked } = getData();

			cityName.textContent = restaurants[0].restaurant.location.city;

			for (let details of restaurants) {
				if (liked.indexOf(details.restaurant.id) !== -1) {
					msg = "Liked by you.";
				} else if (unliked.indexOf(details.restaurant.id) !== -1) {
					msg = "Disliked by you.";
				}


				let node = `
				<a href="./restaurant.html?q=${details.restaurant.id}">
			        <div class="restaurants">
			           <div class="rest-img" style="background-image: url(${details.restaurant.thumb}); background-size: 100% 100%">  
			           </div>
			           <div class="rest-info">
			       	    	<p class="rest-name">${details.restaurant.name}</p>
			            	<p class="ratings">
				                <span>&#9733;</span>
				                <span>${details.restaurant.user_rating.aggregate_rating}</span>
				                <span>(${details.restaurant.user_rating.votes})</span>
			            	</p>
			           	</div>
			        </div>
		        </a>
		        <hr>`;

		        midSection.insertAdjacentHTML('beforeend', node);
			}

			start = count;
			count += 10;
		}
	}
}

scrollMe.onscroll = function () {
	if (scrollMe.scrollTop 	+ scrollMe.clientHeight >= scrollMe.scrollHeight) {
		loadRest();
	}0
}

function getData() {
	return {
		liked: localStorage.getItem('liked') ? localStorage.getItem('liked') : "",
		unliked: localStorage.getItem('unliked') ? localStorage.getItem('unliked') : ""
	};
}

loadRest();