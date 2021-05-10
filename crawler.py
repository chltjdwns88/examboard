from selenium import webdriver
import time
# 현재 chrome 버전과, chrome driver 버전을 맞추어 주어야 한다.

searchWords = ['Toeic', 'ToeicSpeaking', 'ToeicBridge', 'JPT', 'GOSI']
#searchUri = ['https://exam.toeic.co.kr/', 'https://www.toeicswt.co.kr/', 'https://www.jpt.co.kr/', 'https://www.gosi.kr/']
search_language_Uri = ['https://exam.toeic.co.kr/', 'https://www.toeicswt.co.kr/', 'https://www.jpt.co.kr/']
search_gois_Uri = ['https://www.gosi.kr/']
gosi_index = ['2021년 원서접수', '시험일', '합격자 발표', '시험일', '합격자 발표', '면접시험', '최종합격자 발표']
chromedriver = '/mnt/e/examboard/chromedriver_win32/chromedriver.exe'
driver = webdriver.Chrome(chromedriver)

uriXpaths = {
    'https://exam.toeic.co.kr/' : {
        'xpaths' : ["//span[@class='date']/em[@class='roboto']", "//span[@class='date']/span[@class='time']/em[@class='color_01']", "//ul[@class='schedule_banner_slide']/li/a/span[@class='info']"],
        'limit' : 3
    },
    'https://www.toeicswt.co.kr/' : {
        'xpaths' : ["//span[@class='date']/em[@class='roboto']", "//span[@class='date']/span[@class='time']/em[@class='color_01']", "//ul[@class='schedule_banner_slide_s']/li/a/span[@class='info']"],
        'limit' : 3
    },
    'https://www.jpt.co.kr/' : {
        'xpaths' : ["//span[@class='date']/em[@class='roboto']", "//span[@class='date']/span[@class='time']/em[@class='color_01']", "//ul[@class='schedule_banner_slide_s']/li/a/span[@class='info']"],
        'limit' : 3
    }
}


def find_language_uri():
    global searchWords
    global search_language_Uri
    global uriXpaths
    global driver

    for uri in search_language_Uri:
        driver.get(uri)
        #xpath는 경로를 지정하여 html을 크롤링하는 작업을 의미한다.
        xpaths = uriXpaths[uri]['xpaths']
        for xpath in xpaths:
            infos = driver.find_elements_by_xpath(xpath)
            #DB에 저장할때는 다 STRING으로 넣어준다.
            for idx, info in enumerate(infos):
                if idx >= uriXpaths[uri]['limit'] : break 
                print(str(idx) + " " + info.text)
        #너무 빠르게 돌면서 크롤링의 오류를 막기 위해, 2초의 딜레이를 준다.
        time.sleep(2)

#박스를 클릭하면서 긁어온다.
def find_gosi_uri():
    global search_gois_Uri
    global uriXpaths
    global driver
    change = False
    for uri in search_gois_Uri:
        driver.get(uri)
        name = "box"; limit = 11
        buttons = driver.find_elements_by_xpath("//ul[@class='slidetab']/li/button[@class='tab-item']")
        for idx, button in enumerate(buttons):
            if idx > 5 and change == False :
                nxtbtn = driver.find_element_by_xpath("//div[@class='slidebox']/div[@class='btn_area']/button[@class='btn_next']")
                nxtbtn.click(); time.sleep(1)
                change = True
            button.click(); time.sleep(1)
            dates = driver.find_elements_by_xpath("//div[@class='section2']/div[@class='content']/div[@class='box2_m']/div[@id='boxes']/div[@id='box1']/table[@class='main_tbl']/tbody/tr/td")
            for idx_, date in enumerate(dates):
                print(gosi_index[idx_] + " " + date.text)

find_language_uri()
find_gosi_uri()