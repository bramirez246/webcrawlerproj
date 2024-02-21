function sortPages(pages){
    const pagesArray = Object.entries(pages);
    pagesArray.sort((a, b) => b[1] - a[1]);

    return pagesArray;
}

function printReport(pages){
    console.log("========================");
    console.log("REPORT FROM WEB CRAWL");
    console.log("========================");

    const sortedPages = sortPages(pages);

    for(const sortedPage in sortedPages){
        let url = sortedPages[sortedPage][0];
        let hits = sortedPages[sortedPage][1];
        console.log(`Found ${hits} links to page: ${url}`);
    }

    console.log("========================");
    console.log("END OF REPORT");
    console.log("========================");
}

module.exports = {
    sortPages,
    printReport
}