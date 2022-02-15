let promises = [];
let promiseCounter = 0;
const elapsedTime = (t1, t2) => {
    return t2 - t1;
}
const createEntry = () => {
    const disabledButtons = true;
    promiseCounter++;
    const article = document.createElement('article');
    article.classList.add('promise');
    article.setAttribute('id', `promise${promiseCounter}`)
    const questionText = document.createElement('span');
    questionText.innerText = `Promise ${promiseCounter}`;
    const resolveButton = document.createElement('button');
    resolveButton.classList.add('resolve');
    resolveButton.innerText = 'Resolve';
    resolveButton.disabled = disabledButtons;
    const rejectButton = document.createElement('button');
    rejectButton.classList.add('reject');
    rejectButton.innerText = 'Reject';
    rejectButton.disabled = disabledButtons;
    const result = document.createElement('span');
    result.classList.add('result')
    article.appendChild(questionText);
    article.appendChild(resolveButton);
    article.appendChild(rejectButton);
    article.appendChild(result);
    document.querySelector('.promiseList').appendChild(article);
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

const createAutomatedPromise = () => {
    const promiseElement = createEntry();
    return new Promise((resolve, reject) => {
        const startTime = new Date();
        if (document.querySelector('#throwToggle').checked) {
            throw Error("What do you mean you don't know?");
        }
        setTimeout(() => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: true, id: promiseElement.getAttribute('id') }
            resolve(result); // Important Bit
        }, getRandomArbitrary(1000, 10000));

        setTimeout(() => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: false, id: promiseElement.getAttribute('id')  }
            reject(result); // Important Bit
        }, getRandomArbitrary(1000, 10000));
    });

}

const createManualPromise = () => {
    const promiseElement = createEntry();
    document.querySelector('.promiseList').appendChild(promiseElement);
    return new Promise((resolve, reject) => {
    const startTime = new Date();
    if (document.querySelector('#throwToggle').checked) {
        throw "What do you mean you don't know?";
    }
    setButtons(promiseElement, false);
    promiseElement.querySelector('.resolve').addEventListener('click', () => {
        const result = { timeTaken: elapsedTime(startTime, new Date()), answer: true, id: promiseElement.getAttribute('id') }
        resolve(result);
    });
    promiseElement.querySelector('.reject').addEventListener('click', () => {
        const result = { timeTaken: elapsedTime(startTime, new Date()), answer: false, id: promiseElement.getAttribute('id')  }
        reject(result);
        })
    });
}

document.body.querySelector('#createPromise').addEventListener('click', () => {
    const promiseMethod = document.querySelector('#automatedPromise').checked ? createAutomatedPromise : createManualPromise;
    let promise = promiseMethod();

    console.log("Promise Created")
    console.log(promise);

    promise.then((success) => {
        processSuccess(success);
        return promiseMethod();
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