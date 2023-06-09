let fs = require('fs')
let https = require('https');

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const now = new Date();
const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
const koreaTimeDiff = 9 * 60 * 60 * 1000;
const today = new Date(utcNow + koreaTimeDiff);

const dayOfWeek = daysOfWeek[today.getDay()];

const AIR_API_KEY = process.env.AIR_API_KEY;

https.get('https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?returnType=json&numOfRows=100&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0&serviceKey='
        + AIR_API_KEY
 , (response) => {
    let data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {

        const parsedData = JSON.parse(data);
        const filteredData = parsedData.response.body.items.filter(item => item.stationName === '금천구');

        let grade = '';
        switch (filteredData[0].khaiGrade) {
            case '1':
                grade = '좋음'
                break;
            case '2':
                grade = '보통'
                break;
            case '3':
                grade = '나쁨'
                break;
            case '4':
                grade = '위험'
                break;
            default:
                grade = '보통'
        }

        fs.readFile('template.svg', 'utf-8', (error, data) => {
            if (error) {
                console.error(error)
                return
            }

            data = data
                        .replace('{name}', 'Sami')
                        .replace('{grade}', grade)
                        .replace('{today}', dayOfWeek + '요일');

            data = fs.writeFile('chat.svg', data, (err) => {
                if (err) {
                    console.log('failure');
                    console.error(err)
                    return
                }
            })

            console.log('success');
            console.log('data : ' + JSON.stringify(filteredData));

        })

    });
}).on("error", (error) => {
    console.log("Error: " + error.message);
});


