const{JSDOM} = require('jsdom');

//this function will recursively crawl from the base URL
//until it either reaches external links or
//until it runs out of links on the website
async function crawlPage(baseURL, currentURL, pages){
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    
    if(baseURLObj.hostname !== currentURLObj.hostname){
        return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);

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
    const urls = []
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    
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
    const urlObject = new URL(urlStr);
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`

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