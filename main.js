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
    yesButton.disabled = true;
    const noButton = document.createElement('button');
    noButton.classList.add('no');
    noButton.innerText = 'No';
    noButton.disabled = true;
    const questionResult = document.createElement('span');
    questionResult.classList.add('result')
    article.appendChild(questionText);
    article.appendChild(yesButton);
    article.appendChild(noButton);
    article.appendChild(questionResult);
    document.querySelector('.questions').appendChild(article);
    return article;
}
const setButtons = (parentElement, state) => {
    for(let button of parentElement.querySelectorAll('button')){
        button.disabled = state;
    }
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

const processSuccess = (success) => {
    const resultElement = document.getElementById(success['id']).querySelector('.result')
    resultElement.innerText = success['timeTaken']
    resultElement.classList.add('success');
    setButtons(resultElement.parentElement, true)
}

const processError = (error) => {
    const resultElement = document.getElementById(error['id']).querySelector('.result')
    resultElement.innerText = error['timeTaken']
    resultElement.classList.add('error');
    setButtons(resultElement.parentElement, true)
}

const createPromise = () => {
    const question = createQuestion();
    return new Promise((resolve, reject) => {
        const startTime = new Date();
        if (document.querySelector('#throwToggle').checked) {
            throw Error("What do you mean you don't know?");
        }
        setButtons(question, false)
        setTimeout(() => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: true, id: question.getAttribute('id') }
            resolve(result); // Important Bit
        }, getRandomArbitrary(1000, 10000));

        setTimeout(() => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: false, id: question.getAttribute('id')  }
            reject(result); // Important Bit
        }, getRandomArbitrary(1000, 10000));
    });

}

document.body.querySelector('#createPromise').addEventListener('click', () => {
    let promise = createPromise();

    console.log("Promise Created")
    console.log(promise);

    promise.then((success) => {
        processSuccess(success);
        return createPromise();
    }).then((success) => {
        processSuccess(success);
    }).catch((error) => {
        if(error['name'] === 'Error') {
            console.error(error);
        } else {
            processError(error);
        }
    }).finally(() => {
        console.log('Promise Finished');
        console.log(promise)
    });

})