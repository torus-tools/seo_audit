const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const express = require('express')
const app = express()

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr)
    });
  });
}

const opts = {
  chromeFlags: ['--show-paint-rects', '--headless']
};

function main(index, port){
  return new Promise((resolve, reject)=> {
    app.use(express.static('output'))
    var server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
    let fileurl = 'http://localhost:8080/'+index
    launchChromeAndRunLighthouse(fileurl, opts).then(results => {
      //format audits then return formatted audits
      let formatted = {
        lh5_score:"",
        lh6_score:"",
        main_metrics:{},
        recommendations:{}
      }
      const audit = results.audits
      //lighthouse 5 score
      formatted.lh5_score = .2*audit["first-contentful-paint"].score + .27*audit["speed-index"].score + .07*audit["first-meaningful-paint"].score + .33*audit["interactive"].score + .13*audit["first-cpu-idle"].score;
      //lighthouse 6 score
      formatted.lh6_score = .15*audit["first-contentful-paint"].score + .15*audit["speed-index"].score + .25*audit["largest-contentful-paint"].score + .15*audit["interactive"].score + .25*audit["total-blocking-time"].score +.05*audit["cumulative-layout-shift"].score;
      //main metrics
      formatted.main_metrics["first-contentful-paint"] = audit["first-contentful-paint"]
      //recommendations
      server.close('Closed server in port ' + port)
      resolve(formatted)
    }).catch(err => {
      server.close('Error... Closed server in port ' + port)
      reject(err)
    })
  })
}

main('index.html', 8080).then(data=> console.log(data)).catch(err=>console.log(err))