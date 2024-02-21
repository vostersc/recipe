const {parseFile} = require('../util');
const {translateFromSafeUrl} = require('../util');

function routes(app){
    app.post('/api/courses', (req, res) => {
        if(!req.body?.courseIds?.length) return res.send({status: false, message: 'send array of courseId strings as key courseIds'});
        const courseSummaries = req.body.courseIds.map(courseId => parseFile(`./courses/${courseId}/index.json`));
        if(!courseSummaries) return res.send({status: false, message: 'fail'});

        res.send(courseSummaries);
    });

    app.post('/api/courses/:courseId/details', (req, res) => {
        if(!req.body.url) return res.send({status: false, message: 'send array of courseId strings as key courseIds'});
        const safeUrl = translateFromSafeUrl(req.body.url);
        const courseSummary = parseFile(`./courses/${safeUrl}.json`);
        if(!courseSummary) return res.send({status: false, message: 'fail'});

        res.send(courseSummary);
    });

    app.get('/api/courses/:courseId', (req, res) => {
        if(!req.params.courseId) return res.send({status: false, message: 'send array of courseId strings as key courseIds'});
        const courseSummary = parseFile(`./courses/${req.params.courseId}/index.json`);
        if(!courseSummary) return res.send({status: false, message: 'fail'});

        res.send(courseSummary);
    });
}

module.exports = routes;