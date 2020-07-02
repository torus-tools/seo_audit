const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const express = require('express')
const app = express()
const formatReport = require('./formatReport')
const opts = {chromeFlags: ['--show-paint-rects', '--headless']};

/* function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr)
    });
  });
} */

const fs = require('fs');
const log = require('lighthouse-logger');


async function launchChromeAndRunLighthouse(url) {

    log.setLevel('info');
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {output: 'html', port: chrome.port};
    const runnerResult = await lighthouse(url, options);

    // `.report` is the HTML report as a string
    const reportHtml = runnerResult.report;
    fs.writeFileSync('lhreport.html', reportHtml);

    // `.lhr` is the Lighthouse Result as a JS object
    console.log('Report is done for', runnerResult.lhr.finalUrl);
    //console.log(runnerResult.lhr.categories);
    //console.log(runnerResult.lhr.audits);

    await chrome.kill()
    return runnerResult.lhr
}

module.exports = function runAudit(dir, index, port, threshhold){
  return new Promise((resolve, reject)=> {
    app.use(express.static(dir))
    var server = app.listen(port, () => {
      console.log(`Started server in port ${port}`)
      let fileurl = 'http://localhost:8080/'+index
      launchChromeAndRunLighthouse(fileurl, opts).then(results => {
        //format audits then return formatted audits
        var formatted = formatReport(results.audits, threshhold)
        formatted['performance'] = results.categories.performance.score
        formatted['accesibility'] = results.categories.accessibility.score
        formatted['seo'] = results.categories.seo.score
        formatted['best-practices'] = results.categories['best-practices'].score
        server.close('Closed server in port ' + port)
        resolve(formatted)
      }).catch(err => {
        server.close('Error... Closed server in port ' + port)
        reject(err)
      })
    })
  })
}