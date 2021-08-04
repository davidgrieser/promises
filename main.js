let promises = [];
let questionCounter = 0;
const elapsedTime = (t1, t2) => {
    return t2 - t1;
}
const createQuestion = () => {
    questionCounter++;
    const article = document.createElement('article');
    article.classList.add('question');
    article.setAttribute('id', `question${questionCounter}`)
    const questionText = document.createElement('span');
    questionText.innerText = `Question ${questionCounter}`;
    const yesButton = document.createElement('button');
    yesButton.classList.add('yes');
    yesButton.innerText = 'Yes';
    const noButton = document.createElement('button');
    noButton.classList.add('no');
    noButton.innerText = 'No';
    const questionResult = document.createElement('span');
    questionResult.classList.add('result')
    article.appendChild(questionText);
    article.appendChild(yesButton);
    article.appendChild(noButton);
    article.appendChild(questionResult);
    return article;
}

const createPromise = () => {
    const question = createQuestion();
    document.querySelector('.questions').appendChild(question);
    return new Promise((resolve, reject) => {
        const startTime = new Date();
        if (document.querySelector('#throwToggle').checked) {
            throw "What do you mean you don't know?";
        }
        question.querySelector('.yes').addEventListener('click', () => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: true, id: question.getAttribute('id') }
            resolve(result);
        });
        question.querySelector('.no').addEventListener('click', () => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: false, id: question.getAttribute('id')  }
            reject(result);
        })
    });

}

const processThen = (success) => {
    document.getElementById(success['id']).querySelector('.result').innerText = success['timeTaken']
    const resultElement = document.getElementById(success['id']).querySelector('.result')
    resultElement.innerText = success['timeTaken']
    resultElement.classList.add('success');
}

document.body.querySelector('#createPromise').addEventListener('click', () => {
    console.log("Promise Created")
    let promise = createPromise();
    console.log(promise);
    promise.then((success) => {
        processThen(success)
    }).catch((error) => {
        if(error['name'] === 'Error') {
            console.error(error)
        } else {
            const resultElement = document.getElementById(error['id']).querySelector('.result')
            resultElement.innerText = error['timeTaken']
            resultElement.classList.add('error');
        }
    }).finally(() => {
        console.log(promise)
        console.log('Promise Finished');
    });
})