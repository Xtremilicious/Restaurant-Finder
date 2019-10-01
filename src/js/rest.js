const restId = location.href.split('=')[1];
const midSection = document.querySelector('#mid-section');
const span = document.querySelectorAll('.update');

const xhr = new XMLHttpRequest();

xhr.onload = restaurantsDetails;

xhr.onerror = function() {
	console.log('Error in sending request.');
}

xhr.open('GET', 'https://developers.zomato.com/api/v2.1/restaurant?res_id='+restId);
xhr.setRequestHeader('user-key', 'c3d3366545336bba3bcec47786f44130');
xhr.send();

function restaurantsDetails() { 
	if (this.status === 200) {
		const data = this.responseText;
		const restaurant = JSON.parse(data);

		getReviews(restaurant, showData);
	}
}

function getReviews(restaurant, showData) {
	const req = new XMLHttpRequest();

	req.onload = function () {
		if (this.status === 200) {
			const reviews = JSON.parse(this.responseText);
			showData(restaurant, reviews);
		}
	}

	req.onerror = function () {
		console.log('Cannot able to fetch reviews.');
	}

	req.open('GET', `https://developers.zomato.com/api/v2.1/reviews?res_id=${restaurant.id}`);
	req.setRequestHeader('user-key', 'c3d3366545336bba3bcec47786f44130');
	req.send();
}

function showData(restaurant, reviews) {
	document.querySelector('.result-res-image').style.backgroundImage = `url(${restaurant.featured_image})`;
	document.querySelector('.rest-name').textContent = restaurant.name;
	span[0].textContent = restaurant.user_rating.aggregate_rating;
	span[1].textContent = restaurant.user_rating.votes;
	span[2].textContent = `${reviews.reviews_count} reviews`;

	if(getData().liked.indexOf(restaurant.id) !== -1) {
		span[3].style.fontWeight = 'bold';
	}

	if(getData().unliked.indexOf(restaurant.id) !== -1) {
		span[4].style.fontWeight = 'bold';
	}

	document.querySelector('.cost-for-two').textContent = `Rs. ${restaurant.average_cost_for_two}`;
 	document.querySelector('.rest-address-info').textContent = restaurant.location.address;  
 	document.querySelector('.rest-photos-info').innerHTML = `<a href="${restaurant.photos_url}" target="_blank">Click here</a> to see photos.`;
 	document.querySelector('.rest-reviews-info').innerHTML = `<a href="${restaurant.menu_url}" target="_blank">Click here</a> to see menu.`;

 	const userReviews = document.querySelector('.user-reviews-info');

 	for(let review of reviews.user_reviews) {
 		userReviews.innerHTML += `
 		<div class="user-bar">	
            <div class="user-image" style="background-image: url(${review.review.user.profile_image})"></div>
          </div>
            <div class="user-information-bar">
              <div class="user-name">
                <p>${review.review.user.name}</p>
              </div>
              <div class="user-star">
                ${review.review.rating} out of 5 ratings
              </div>
              <div class="user-comment">
                <p>
                  ${review.review.review_text}
                </p>
              </div>
            </div>`
 	}
}

function logData() {
	console.log(getData());
}

function getData() {
	return {
		liked: localStorage.getItem('liked') ? localStorage.getItem('liked') : "",
		unliked: localStorage.getItem('unliked') ? localStorage.getItem('unliked') : ""
	};
}
getData();