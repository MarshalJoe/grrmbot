"use strict";

const config = require('./config.js');
const Twit = require('twit');
const fs = require('fs');
const Bot = new Twit(config);
var cron = require('node-cron');
 
cron.schedule('*/15 * * * *', composePost);
//cron.schedule('*/9 * * * *', searchAndLike);

function tweet (content) {
	Bot.post('statuses/update', { status: content }, function (err, reply) {
		if (err) {
			console.log(err);
			return;	
		}
	})
};

function composeTweet(content) {
	return content + " #GoT"; 
}

function openText () {
	return fs.readFileSync('soiaf.txt', 'utf8');
}

function writeText(string) {
	fs.writeFileSync('soiaf.txt', string, 'utf8');
}

function removeString(string, text) {
	return text.replace(string, "");
}

function pullContent() {
	let text = openText();
	let sentences = text.split('.');
	let sentence = sentences.shift();
	let finalText = sentences.join('.');
	writeText(finalText);
	return sentence;
}

function composePost() {
	let phrase = pullContent()
	let clean_phrase = phrase.replace('\n', '').trim();
	if (clean_phrase.length < 135) {
		tweet(composeTweet(clean_phrase));
	} else {
		composePost()
	}
}

function searchAndLike() {
	Bot.get('search/tweets', { q: "Game of Thrones" }, function (err, reply) {
		if (err) {
			console.log(err);
			return;
		}
	}).then(function(response) {
		let commentId = response.data['statuses'][0]['id_str'];
		Bot.post('favorites/create', { id: commentId }, function (err, reply) {
			if (err) {
				console.log(err);
				return;
			}
			console.log('Liked a tweet from ' + reply['user']['screen_name']);
		});
	});
}









