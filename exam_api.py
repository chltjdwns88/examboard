from urllib2 import Request, urlopen
from urllib import urlencode, quote_plus

encoded_key = 'aZyc1Eibkz0Spmkj4oqrF%2Bd8k1FK0maWmCZn4bor%2FDTRyfHz3cPaQ1wfh8DBWx8GwBuC4d19onos3Gw6WozScA%3D%3D'
decoded_key = 'aZyc1Eibkz0Spmkj4oqrF+d8k1FK0maWmCZn4bor/DTRyfHz3cPaQ1wfh8DBWx8GwBuC4d19onos3Gw6WozScA=='
url = 'http://apis.data.go.kr/B490007/qualExamSchd/getQualExamSchdList'
queryParams = '?' + urlencode({ quote_plus('ServiceKey') : encoded_key, quote_plus('serviceKey') : '-', quote_plus('numOfRows') : '10', quote_plus('pageNo') : '1', 
quote_plus('dataFormat') : 'xml', quote_plus('implYy') : '2020', quote_plus('qualgbCd') : 'T', quote_plus('jmCd') : '7910' })
request = Request(url + queryParams)
request.get_method = lambda: 'GET'
response_body = urlopen(request).read()
print(response_body)