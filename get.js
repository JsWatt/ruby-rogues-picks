'use strict';
const cheerio = require('cheerio');
const request = require('request');
const outputFilename = './README.md';
const fs = require('fs');
const episodes = [];
const picks = [];

let output = '# Ruby Rogues Pick Links \nFor each episode of the [Ruby Rogues podcast](https://devchat.tv/ruby-rogues) there are a lot of great picks each guest shares. This is a repository of all the great links shared on the show.\n';

request({
    method: 'GET',
    url: 'https://devchat.tv/ruby-rogues/picks'
}, function(err, response, body, callback) {
  if (err) return console.error(err);
  const $ = cheerio.load(body);

  let prevTitle;

  $('.episode-group .episode__body .no-bullets li').each(function(key, callback){
    const title = $(this).parent().parent().parent().find('h5').text();
    const linkText = $(this).text().trim();
    let link = $(this).find('a').attr('href');

    // replace local links
    if(link.charAt(0) === '/'){
      link = 'https://devchat.tv' + link;
    }

    let published = $(this).parent().parent().parent().find('.compact dd').text();
    published = published.split('Duration');
    published = published[0];

    if(prevTitle !== title || prevTitle === undefined){
      prevTitle = title;
      output += `\n##${title}\n`;
      output += `Published: ${published}\n`;
      output += `- [${linkText}](${link})\n`;
    }else{
      output += `- [${linkText}](${link})\n`;
    }
  });

fs.writeFile(outputFilename, output, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('File saved to ' + outputFilename);
    }
  }); 
});