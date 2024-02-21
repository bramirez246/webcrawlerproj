//this function will sort the pages in descending order
//based on its frequency
function sortPages(pages){
    const pagesArray = Object.entries(pages);
    pagesArray.sort((a, b) => b[1] - a[1]);

    return pagesArray;
}

//this function displays a report of all links crawled
//and how frequently it was linked
function printReport(pages){
    //print formatting lines and title
    console.log("========================");
    console.log("REPORT FROM WEB CRAWL");
    console.log("========================");

    //sort the pages
    const sortedPages = sortPages(pages);

    //loop through pages and store url and page counter
    for(const sortedPage in sortedPages){
        let url = sortedPages[sortedPage][0];
        let hits = sortedPages[sortedPage][1];
        console.log(`Found ${hits} link(s) to page: ${url}`);
    }

    //print formatting lines and end title
    console.log("========================");
    console.log("END OF REPORT");
    console.log("========================");
}

module.exports = {
    sortPages,
    printReport
}