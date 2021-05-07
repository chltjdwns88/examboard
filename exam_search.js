var request = require('request');
var exam_code = require('./exam_code');

const encoded_key = 'aZyc1Eibkz0Spmkj4oqrF%2Bd8k1FK0maWmCZn4bor%2FDTRyfHz3cPaQ1wfh8DBWx8GwBuC4d19onos3Gw6WozScA%3D%3D'
const decoded_key = 'aZyc1Eibkz0Spmkj4oqrF+d8k1FK0maWmCZn4bor/DTRyfHz3cPaQ1wfh8DBWx8GwBuC4d19onos3Gw6WozScA=='

module.exports = function(router){
    router.route('/searchExam/:exam').all(function(req, res){
        var exam = req.params.exam;
        var url = 'http://apis.data.go.kr/B490007/qualExamSchd/getQualExamSchdList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + encoded_key; /* Service Key*/
        queryParams += '&' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent('-'); /* */
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
        queryParams += '&' + encodeURIComponent('dataFormat') + '=' + encodeURIComponent('json'); /* */
        queryParams += '&' + encodeURIComponent('implYy') + '=' + encodeURIComponent('2020'); /* */
        queryParams += '&' + encodeURIComponent('qualgbCd') + '=' + encodeURIComponent('T'); /* */
        queryParams += '&' + encodeURIComponent('jmCd') + '=' + encodeURIComponent(exam_code[exam]); /* */

        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
            //console.log('Status', response.statusCode);
            if(response.statusCode != 200) {
                res.send({'error_message' : response.statusCode});
            }
            else{
                res.send({'success_message' : body});
            }
        });
    })
}