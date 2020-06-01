# Arjan Audit
Arjan audit is a simple node module that helps automate the auditing process of static sites during the dev process using Google’s lighthouse 6. 

## Intro
Often times when building a site the page speed test is one of the last things we do. Sometiems theres a surprise and the score is not that good.. To avoid these surprises you can use arjan audit in your dev process or even integrate it into your tests.

## How it works
Arjan audit  uses [express](https://expressjs.com/) to serve your site and google [chrome-launcher](https://github.com/GoogleChrome/chrome-launcher) to make a headless launch of google chrome and retrieve the audits from lighthouse 6. Arjan then parses the results returned by lighthouse and return an ~~organized subset~~ of the results. When used from the CLI, arjan returns a ~~neatly formatted report.~~


## Getting Started 
1. install the arjan CLI globally. `npm i -g arjan-cli`
2. inside your proejct direcotry, initialize arja `arjan init`
3. run an audit `arjan audit`


## Programmatic use
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



## CLI Commands
    USAGE
      $ arjan audit
    
    OPTIONS
      -d, --dir=dir              Directory path to serve. default is root (relative to the path in which you run the command)
    
      -f, --file=file            Path of the page you want to audit. default is index.html
    
      -p, --port=port            Port used for the test server. Default is 8080.
    
      -t, --threshold=threshold  Integer value from 0 to 1 that represents what you consider to be an acceptable lighthouse score for your site. Its very similar to what you would consider an acceptable school test grade.





## The Audit Report

the audit report is a subset of data from the JSON response of lighthouse 6. for more information on the parameters of lighthouse 6 see this [link](https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md#audit-properties)


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


## Lighthouse 5 score
| Audit                                                             | Weight |
| ----------------------------------------------------------------- | ------ |
| [First Contentful Paint](https://web.dev/first-contentful-paint/) | 20%    |
| [Speed Index](https://web.dev/speed-index/)                       | 27%    |
| [First Meaningful Paint](https://web.dev/first-meaningful-paint/) | 7%     |
| [Time to Interactive](https://web.dev/interactive/)               | 33%    |
| [First CPU Idle](https://web.dev/first-cpu-idle/)                 | 13%    |

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

## Main Metrics
- first-contentful-paint
- speed-index
- largest-contentful-paint
- total-blocking-time
- interactive
- cumulative-layout-shift
- first-meaningful-paint
- first-cpu-idle
- notification-on-start
## Improvements
- largest-contentful-paint-element
- critical-request-chains : 
- layout-shift-elements: 
- robots-txt
- canonical
- color-contrast
- label
- redirects
- content-width
- image-aspect-ratio
- image-size-responsive
- deprecations
- mainthread-work-breakdown
- bootup-time
- uses-rel-preload
- uses-rel-preconnect
- font-display
- aria-allowed-attr
- aria-hidden-body
- aria-hidden-focus
- aria-valid-attr-value
- aria-valid-attr
- button-name
- bypass
- document-title
- duplicate-id-active
- duplicate-id-aria
- frame-title
- heading-order
- html-has-lang
- html-lang-valid
- image-alt
- link-name
- list
- listitem
- meta-viewport
- video-caption
- video-description
- uses-long-cache-ttl
- total-byte-weight
- offscreen-images
- render-blocking-resources
- unminified-css
- unminified-javascript
- unused-css-rules
- unused-javascript
- uses-webp-images
- uses-optimized-images
- uses-text-compression
- uses-responsive-images
- efficient-animated-content
- appcache-manifest
- doctype
- charset
- dom-size
- external-anchors-use-rel-noopener
- no-document-write
- no-vulnerable-libraries
- js-libraries
- password-inputs-can-be-pasted-into
- uses-passive-event-listeners
- meta-description
- http-status-code
- font-size
- link-text
- is-crawlable
- tap-targets
- hreflang
- plugins
