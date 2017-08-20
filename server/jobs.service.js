const cheerio = require("cheerio");
const request_service_1 = require("./request.service");
let requestSvc = new request_service_1.RequestService();

var _projectsMetadata = {};

var jobsService = function () {
};

function extractText(htmlElement) {
    let text = '';
    if (htmlElement[0] && htmlElement[0].children[0]) {
        text = htmlElement[0].children[0].data.trim();
    }
    return text;
}
function extractLinkHref(htmlLinkElement) {
    let href = '';
    if (htmlLinkElement && htmlLinkElement.attribs && htmlLinkElement.attribs.href) {
        href = htmlLinkElement.attribs.href;
    }
    return href.indexOf('..') < 0 || href.indexOf('.') < 0 ? href : null;
}

function extractHostsListFromXML(xmlUrl) {
    let self = this;
    return requestSvc.get(xmlUrl)
        .then((response) => {
            const $ = cheerio.load(response, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            let environmentName = extractText($('environmentName'));
            const hostsSelector = $('Host');
            let hosts = [];
            hostsSelector.each((index, host) => {
                let hostElement = cheerio.load(host, {
                    normalizeWhitespace: true,
                    xmlMode: true
                });
                let hostName = extractText(hostElement('name'));
                hosts.push({
                    name: hostName,
                    Description: extractText(hostElement('Description')),
                    InstalledOS: extractText(hostElement('InstalledOS'))
                });
            });
            return {
                environmentName: environmentName,
                hosts: hosts
            };
        });
}

function getXMLListInDirectory(group, dirUrl) {
    let self = this;
    return requestSvc.get(dirUrl)
        .then((response) => {
            const $ = cheerio.load(response);
            let linksArr = $('a');
            let href;
            _projectsMetadata[group] = [];
            linksArr.each((index, link) => {
                href = extractLinkHref(link);
                if (href && href.indexOf('.xml') > -1) {
                    _projectsMetadata[group].push({
                        url: dirUrl + href,
                        environmentName: '',
                        hosts: []
                    });
                }
            });
            return true;
        });
}

function getProductsJobsXMLsList() {
    let self = this;
    const serverListUrl = "https://csvn1-pro.il.hpecorp.net:19181/svn/tsg-bto-apps-lt-ops/trunk/app/BuildManager/ALMToolsGlobal/Reports/Deployment";
    return requestSvc.get(serverListUrl)
        .then((response) => {
            _projectsMetadata = {};
            let dirListPromises = [];
            const $ = cheerio.load(response);
            let dirsArr = $('a');
            dirsArr.each((index, dir) => {
                let href = extractLinkHref(dir);
                if (href) {
                    let dirUrl = `${serverListUrl}/${extractLinkHref(dir)}`;
                    dirListPromises.push(getXMLListInDirectory(href.replace('/', ''), dirUrl));
                }
            });
            return Promise.all(dirListPromises)
                .then(() => {
                    return _projectsMetadata;
                });
        });
}

jobsService.prototype.getJobsData = function () {

    return new Promise((resolve, reject) => {
        var jobs, urlSplit, hostsPromises = [];


        getProductsJobsXMLsList()
            .then((xmlData) => {
                //console.log(xmlData);
                Object.keys(xmlData).forEach((productName) => {

                    jobs = xmlData[productName];


                    jobs.forEach((job) => {
                        urlSplit = job.url.split('/');
                        job.name = urlSplit[urlSplit.length - 1].split('.xml')[0];
                        hostsPromises.push(extractHostsListFromXML(job.url)
                            .then((hostData) => {
                                job.hosts = hostData['hosts'];
                                job.environmentName = hostData['environmentName'];
                            }));
                    });


                    // console.log(productName);
                    // console.log(jobs);


                });

                Promise.all(hostsPromises)
                    .then(() => {
                        resolve(xmlData);
                    });


            })
    })
}

module.exports = new jobsService();