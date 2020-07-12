<img src="https://github.com/arjan-tools/site/blob/master/img/arjan_audit_logo.svg" alt="Arjan Localize" width="200" style="max-width:100%;">

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://gkpty.mit-license.org)

# Arjan Audit

Audit you website's performance and SEO using Lighthouse 6. Often times, when building a site, the page speed test is one of the last things we do. To avoid any surprise surprise, you can use Arjan Audit in your development process or even integrate it into your tests.


## How it works
Arjan audit  uses [express](https://expressjs.com/) to serve your site and google [chrome-launcher](https://github.com/GoogleChrome/chrome-launcher) to make a headless launch of google chrome and retrieve the audits from lighthouse 6. Arjan then parses the results returned by Lighthouse and return an organized subset of the results. Also it saves all the audit reports locally by date.  


## Getting Started 
1. install the arjan CLI globally. `npm i -g arjan-cli`
2. inside your proejct direcotry, initialize arja `arjan init`
3. run an audit `arjan audit`


## Programmatic use example
    const Audit = require('arjan-audit')
    Audit('./', 'index.html', 8080, .7)
    .then(data=> console.log(data))
    .catch(err=>console.log(err))

## API
### main 

**description**:
**params**: (dir, index, port, threshhold)

     **dir**: string
     **index**: string
     **port**: int
    **treshhold**: float: number between 0 and 1

**returns**: Promise(resolve, reject)

    **resolve**: string: formatted
    **reject**: error


## The Audit Report

The audit report is a subset of data from the JSON response of lighthouse 6. for more information on the parameters of lighthouse 6 see this [link](https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md#audit-properties)


    {
      "lh5_score":float,
      "lh6_score":float,
      "main_metrics":{
        "metric":{
          "title":"string",
          "score":float,
          "description":"string"
        }
      },
      "improvements":{
        "improvement":{
          "title":"title",
          "score":float,
          "description":"description",
          "details":{}
        }
      }
    }

## Lighthouse 6 score

Google recently recalculated the score of what they consdier a healthy fast site. The new LCP metric was introduced and the score weights and metrics were changed. for more information check out Google’s [Web Vitals](https://web.dev/vitals/) 

| Audit                                                                  | Weight |
| ---------------------------------------------------------------------- | ------ |
| [First Contentful Paint](https://web.dev/first-contentful-paint/)      | 15%    |
| [Speed Index](https://web.dev/speed-index/)                            | 15%    |
| [Largest Contentful Paint](https://web.dev/lcp/)                       | 25%    |
| [Time to Interactive](https://web.dev/interactive/)                    | 15%    |
| [Total Blocking Time](https://web.dev/lighthouse-total-blocking-time/) | 25%    |
| [Cumulative Layout Shift](https://web.dev/cls/)                        | 5%     |

#### For more info read the [docs](https://arjan.tools/docs) 
