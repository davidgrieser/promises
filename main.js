let promises = [];
let promiseCounter = 0;
const elapsedTime = (t1, t2) => {
    return t2 - t1;
}
const createPromiseElement = () => {
    const disabledButtons = true;
    promiseCounter++;
    const article = document.createElement('article');
    article.classList.add('promise');
    article.setAttribute('id', `promise${promiseCounter}`)
    const promiseText = document.createElement('span');
    promiseText.innerText = `Promise ${promiseCounter}`;
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
    const status = document.createElement('span');
    status.classList.add('status')
    article.appendChild(promiseText);
    article.appendChild(resolveButton);
    article.appendChild(rejectButton);
    article.appendChild(result);
    article.appendChild(status);
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

const updateStatus = (id, status) => {
    console.log('Updating: ', id, ' with ', status)
    const statusElement = document.getElementById(id).querySelector('.status')
    statusElement.innerText = status;
}

const createAutomatedPromise = () => {
    const promiseElement = createPromiseElement();
    return new Promise((resolve, reject) => {
        const startTime = new Date();
        updateStatus(promiseElement.getAttribute('id'), 'pending')
        if (document.querySelector('#throwToggle').checked) {
            throw Error("What do you mean you don't know?");
        }
        setTimeout(() => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: true, id: promiseElement.getAttribute('id') }
            updateStatus(promiseElement.getAttribute('id'), 'fulfilled(resolve)')
            resolve(result); // Important Bit
        }, getRandomArbitrary(1000, 10000));

        setTimeout(() => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: false, id: promiseElement.getAttribute('id')  }
            updateStatus(promiseElement.getAttribute('id'), 'rejected(reject)')
            reject(result); // Important Bit
        }, getRandomArbitrary(1000, 10000));
    });

}

const createManualPromise = () => {
    const promiseElement = createPromiseElement();
    document.querySelector('.promiseList').appendChild(promiseElement);
    return new Promise((resolve, reject) => {
    const startTime = new Date();
    updateStatus(promiseElement.getAttribute('id'), 'pending')
    if (document.querySelector('#throwToggle').checked) {
        throw "What do you mean you don't know?";
    }
    setButtons(promiseElement, false);
    promiseElement.querySelector('.resolve').addEventListener('click', () => {
        const result = { timeTaken: elapsedTime(startTime, new Date()), answer: true, id: promiseElement.getAttribute('id') }
        updateStatus(promiseElement.getAttribute('id'), 'fulfilled(resolve)')
        resolve(result);
    });
    promiseElement.querySelector('.reject').addEventListener('click', () => {
        const result = { timeTaken: elapsedTime(startTime, new Date()), answer: false, id: promiseElement.getAttribute('id')  }
        updateStatus(promiseElement.getAttribute('id'), 'rejected(reject)')
        reject(result);
        })
    });
}

document.body.querySelector('#createPromise').addEventListener('click', () => {
    const promiseMethod = document.querySelector('#automatedPromise').checked ? createAutomatedPromise : createManualPromise;
    let promise = promiseMethod();
    let promise2;

    console.log("Promise Created")
    console.log(promise);

    promise.then((success) => {
        processSuccess(success);
        console.log('First Then:', promise);
        promise2 = promiseMethod();
        return promise2;
    }).then((success) => {
        processSuccess(success);
        console.log('Second Then:', promise2);
    }).catch((error) => {
        console.log('Catch 1: ', promise);
        console.log('Catch 2: ', promise2);
        console.log('Error: ', error);
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