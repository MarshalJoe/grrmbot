"use strict";

const config = require('./config.js');
const Twit = require('twit');
const fs = require('fs');
const Bot = new Twit(config);
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.minute = 33;

var j = schedule.scheduleJob(rule, composePost);

function tweet (content) {
	Bot.post('statuses/update', { status: content }, function(err, reply){
		if (err) {
			console.log(err);
			return;	
		}
	})
};

function composeTweet(content) {
	return " " + content + " #grrmbot"; 
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
	if (clean_phrase.length < 130) {
		tweet(composeTweet(clean_phrase));
	} else {
		composePost()
	}
}












