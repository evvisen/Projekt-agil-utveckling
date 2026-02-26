async function test(params) {
    await fetch("http://localhost:3000/api/ekonomiquiz")
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            console.log(result[0].svarsalternativ1[0]);

        })
};

test();

async function test2(params) {
    await fetch("http://localhost:3000/api/questions")
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            console.log(result.questions[5].correct_option);

        })
};

test2();

/* fetch('https://api.spacexdata.com/v5/launches')
    .then((response) => response.json())
    .then((result) => {
        console.log(result)

        for (i = 0; i < 10; i++) {
            let j = i + 1;
            launchInfoContainers[j].children[0].innerHTML = result[i].name
            launchInfoContainers[j].children[1].innerHTML = result[i].id
            launchInfoContainers[j].children[2].innerHTML = result[i].flight_number
            launchInfoContainers[j].children[3].innerHTML = result[i].date_local
        }

    }) */