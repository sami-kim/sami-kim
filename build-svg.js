let fs = require('fs')
let https = require('https');

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = new Date();
const dayOfWeek = daysOfWeek[today.getDay()];

const AIR_API_KEY = process.env.AIR_API_KEY;

https.get('https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?returnType=json&numOfRows=100&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0&serviceKey=' + AIR_API_KEY, (response) => {
    let data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        const parsedData = JSON.parse(data);
        const filteredData = parsedData.response.body.items.filter(item => item.stationName === '금천구');

        console.log('data : ' + JSON.stringify(filteredData));

        let grade = '';
        switch (filteredData[0].khaiGrade) {
            case '1':
                grade = 'GOOD'
                break;
            case '2':
                grade = 'NORMAL'
                break;
            case '3':
                    grade = 'BAD'
                break;
            case '4':
                grade = 'DANGER'
                break;
            default:
                grade = 'NORMAL'
        }

        fs.readFile('template.svg', 'utf-8', (error, data) => {
            if (error) {
                console.error(error)
                return
            }

            data = data.replace('{name}', 'Sami')
            data = data.replace('{grade}', grade)

            data = data.replace('{today}', dayOfWeek);

            data = fs.writeFile('chat.svg', data, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        })

    });
}).on("error", (error) => {
    console.log("Error: " + error.message);
});


