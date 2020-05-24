const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const express = require('express')
const app = express()
const recommendations = require('./recommendations')

const threshhold = {
  unacceptable: .7,
  acceptable: .8,
  good: .9,
  recommendations: .7
}

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

function main(dir, index, port, threshhold){
  return new Promise((resolve, reject)=> {
    app.use(express.static(dir))
    var server = app.listen(port, () => console.log(`serving static site located at ${dir} in port ${port}`))
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
      formatted.main_metrics["first-contentful-paint"] = {
        title: audit["first-contentful-paint"].title,
        score: audit["first-contentful-paint"].score,
        description: audit["first-contentful-paint"].description
      }
      formatted.main_metrics["speed-index"] = {
        title: audit["speed-index"].title,
        score: audit["speed-index"].score,
        description: audit["speed-index"].description
      }
      formatted.main_metrics["largest-contentful-paint"] = {
        title: audit["largest-contentful-paint"].title,
        score: audit["largest-contentful-paint"].score,
        description: audit["largest-contentful-paint"].description
      }
      formatted.main_metrics["total-blocking-time"] = {
        title: audit["total-blocking-time"].title,
        score: audit["total-blocking-time"].score,
        description: audit["total-blocking-time"].description
      }
      formatted.main_metrics["interactive"] = {
        title: audit["interactive"].title,
        score: audit["interactive"].score,
        description: audit["interactive"].description
      }
      formatted.main_metrics["cumulative-layout-shift"] = {
        title: audit["cumulative-layout-shift"].title,
        score: audit["cumulative-layout-shift"].score,
        description: audit["cumulative-layout-shift"].description
      }
      formatted.main_metrics["first-meaningful-paint"] = {
        title: audit["first-meaningful-paint"].title,
        score: audit["first-meaningful-paint"].score,
        description: audit["first-meaningful-paint"].description
      }
      formatted.main_metrics["first-cpu-idle"] = {
        title: audit["first-cpu-idle"].title,
        score: audit["first-cpu-idle"].score,
        description: audit["first-cpu-idle"].description
      }
      //recommendations
      for(let r of recommendations){
        switch(audit[r].scoreDisplayMode){
          case 'binary':
            if(audit[r].score === 0){
              formatted.recommendations[r] = {
                title: audit[r].title,
                score: audit[r].score,
                description: audit[r].description,
              }
              if(audit[r].details) formatted.recommendations[r].details = audit[r].details
            }
            break;
          case 'numeric':
            if(audit[r].score < threshhold.recommendations){
              formatted.recommendations[r] = {
                title: audit[r].title,
                score: audit[r].score,
                description: audit[r].description,
              }
              if(audit[r].details) formatted.recommendations[r].details = audit[r].details
            }
            break;
          default:
            console.log(`Error scoreDisplayMode ${audit[r].scoreDisplayMode} not recognized`)
        }
      }
      server.close('Closed server in port ' + port)
      resolve(formatted)
    }).catch(err => {
      server.close('Error... Closed server in port ' + port)
      reject(err)
    })
  })
}

main('output', 'index.html', 8080, threshhold).then(data=> console.log(data)).catch(err=>console.log(err))