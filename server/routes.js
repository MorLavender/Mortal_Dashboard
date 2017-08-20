const jobsService = require('./jobs.service');
const machineStatusService = require('./machine-status.service');


module.exports = function (app) {
    /* API */
    app.get('/api/jobs', function (req, res) {
        jobsService.getJobsData()
            .then((data) => {
                res.send(data);
            });
    });

    app.get('/api/machine-status', function (req, res) {
        machineStatusService.getStatus()
            .then((data) => {
                res.send(data);
            });
    });

    /* APPLICATION */
    app.get('*', function (req, res) {
        // load index.html otherwise
        res.sendfile(app.public + '/index.html');
    });
};