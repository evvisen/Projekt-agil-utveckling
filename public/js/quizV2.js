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