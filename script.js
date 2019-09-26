'use strict';

const apiKey = 'PsCnSqxHU5NSKnrxXDpP07yWQSgzBO67RIQeTXGd'
const searchURL = 'https://developer.nps.gov/api/v1/parks'

function emptyContents() {
	$('#result-list').empty();
	$('#results h2').empty();
}

function formatQuery(params) {
	const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
	return queryItems.join('&')
} 

function displayParks(response) {
	emptyContents();
	console.log(response.data[0])
	$('#js-error-message').empty();
	$('#results').prepend(`<h2>Search results</h2>`)
	for (let i=0; i < response.data.length; i++) {
		$('#result-list').append(`<li><h3 class="park-name">${response.data[i].fullName}</h3><p class="park-address">Address: ${response.data[i].addresses[1].line1}, ${response.data[i].addresses[1].city},  ${response.data[i].addresses[1].stateCode} ${response.data[i].addresses[1].postalCode}</p><img src="${response.data[i].images[0].url}" alt="${response.data[i].images[0].altText}" class="park-image"><p class="park-description">${response.data[i].description}</p><a href="${response.data[i].url}" target="_blank" class="park-website">Visit Website</a></li>`)
	}
	$('#results').removeClass('hidden');
}

function getParks(states, limit=10) {
	const params = {
		stateCode: states,
		limit,
		fields: ['addresses', 'images'],
		api_key: apiKey
	}
	const queryString = formatQuery(params);
	const url = `${searchURL}?${queryString}`;
	fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then(responseJson => displayParks(responseJson))
		.catch(err => {
			emptyContents();
			$('#js-error-message').text(`Something went wrong: ${err.message}`)
		});
}

function watchForm() {
	$('form').submit(event => {
		event.preventDefault();
		const locations = $('#location').val();
		const count = $('#count').val();
		getParks(locations, count)
	})
}

$(watchForm)