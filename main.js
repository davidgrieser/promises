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
    return article;
}
const setButtons = (parentElement, state) => {
    for(let button of parentElement.querySelectorAll('button')){
        button.disabled = state;
    }
}

const createPromise = () => {
    const question = createQuestion();
    document.querySelector('.questions').appendChild(question);
    return new Promise((resolve, reject) => {
        const startTime = new Date();
        if (document.querySelector('#throwToggle').checked) {
            throw "What do you mean you don't know?";
        }
        setButtons(question, false)
        question.querySelector('.yes').addEventListener('click', () => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: true, id: question.getAttribute('id') }
            resolve(result); // Important Bit
        });
        question.querySelector('.no').addEventListener('click', () => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: false, id: question.getAttribute('id')  }
            reject(result); // Important Bit
        })
    });

}

document.body.querySelector('#createPromise').addEventListener('click', () => {
    let promise = createPromise();
    console.log("Promise Created")
    console.log(promise);
    promise.then(
        function(success) {
            const resultElement = document.getElementById(success['id']).querySelector('.result')
            resultElement.innerText = success['timeTaken']
            resultElement.classList.add('success');
            setButtons(resultElement.parentElement, true)
        },
        function(error) {
            if(typeof(error) === 'string') {
                console.error(error)
            } else {
                const resultElement = document.getElementById(error['id']).querySelector('.result')
                resultElement.innerText = error['timeTaken']
                resultElement.classList.add('error');
                setButtons(resultElement.parentElement, true)
            }
        }
    )
})