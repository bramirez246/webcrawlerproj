const{JSDOM} = require('jsdom');

//this function will recursively crawl from the base URL
//until it either reaches external links or
//until it runs out of links on the website
async function crawlPage(baseURL, currentURL, pages){
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    
    //first base case, if currentURL is an external link
    if(baseURLObj.hostname !== currentURLObj.hostname){
        return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);

    //second base case, if the page has been visited then increment counter
    if(pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++;
        return pages;
    }

    //initialize count
    pages[normalizedCurrentURL] = 1;

    console.log(`actively crawling: ${currentURL}`);

    try{
        //fetch url
        const resp = await fetch(currentURL);

        //if status code is greater than 399 (error code)
        if(resp.status > 399){
            console.log(`error in fetch with status code: ${resp.status}, on page: ${currentURL}`);
            return pages;
        }
        
        //if content is not html content throw an error
        const contentType = resp.headers.get("content-type");
        if(!contentType.includes("text/html")){
            console.log(`non-html response, content type: ${contentType}, on this page: ${currentURL}`);
            return pages;    
        }
        
        //store html body
        const htmlBody = await resp.text();
        
        //gather urls from current page
        const nextURLs = getURLFromHTML(htmlBody, baseURL);

        //loop through nextURLs array
        for(const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages);
        }
    }
    catch(err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
    }
    return pages;
}

//this function is a utility function that helps crawlPage
//get URLs from the html body
function getURLFromHTML(htmlBody, baseURL){
    const urls = [] //will hold an array of url strings
    const dom = new JSDOM(htmlBody);    //creates new JSDOM object
    const linkElements = dom.window.document.querySelectorAll('a'); //selects all anchor tags from html body
    
    //loop through all linkElements
    for(const linkElement of linkElements) {
        if(linkElement.href.slice(0, 1) === '/'){
            //relative
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            }
            catch(err){
                console.log(`error with relative url: ${err.message}`);
            }
        }
        else{
            //absolute
            try{
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            }
            catch(err){
                console.log(`error with absolute url: ${err.message}`);
            }
        }
    }

    return urls;
}

//this function normalizes the given URL
function normalizeURL(urlStr) {
    const urlObject = new URL(urlStr);  //store url string into a URL object
    
    //this helps get rid of protocol and other unecessary parts of url
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`;  //stores hostpath by concatenating hostname and pathname

    //this helps get rid of trailing slashes
    if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1);
    }

    return hostPath;
}

module.exports = {
    normalizeURL,
    getURLFromHTML,
    crawlPage
}