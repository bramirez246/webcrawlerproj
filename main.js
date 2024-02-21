const {crawlPage} = require("./crawl.js");
const {printReport} = require("./report.js");

async function main(){
    //if number of CL arguments is less than 3 then no website was provided
    if(process.argv.length < 3){
        console.log("no website provided");
        process.exit(1);
    }

    //if number of CL arguments is greater than 3 then more than one website was provided
    if(process.argv.length > 3){
        console.log("too many command line args");
        process.exit(1);
    }

    //set baseURL to the correct argument
    const baseURL = process.argv[2];

    console.log(`starting crawl of ${baseURL}`);

    //store results from crawl
    const pages = await crawlPage(baseURL, baseURL, {});

    //display report
    printReport(pages);
};

main();