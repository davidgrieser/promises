let promises = [];
const elapsedTime = (t1, t2) => {
    return t2 - t1;
}

const createPromise = () => {
    return new Promise((resolve, reject) => {
        const startTime = new Date();
        if (document.querySelector('#throwToggle').checked) {
            throw "What do you mean you don't know?";
        }
        document.querySelector('.yes').addEventListener('click', () => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: true }
            resolve(result);
        });
        document.querySelector('.no').addEventListener('click', () => {
            const result = { timeTaken: elapsedTime(startTime, new Date()), answer: false }
            reject(result);
        })
    });

}
document.body.querySelector('#createPromise').addEventListener('click', () => {
    console.log("Promise Created")
    let promise = createPromise();
    promises.push(promise);
    console.log(promise);
    console.log(promises);
    // promise.then((successMessage) => {
    //     console.log(promise);
    //     console.log(successMessage);
    // }).then((result) => {
    //     console.info(`Before Catch: <${result}>`);
    // }).catch((error) => {
    //     console.log(promise);
    //     console.error(error)
    // }).then(() => {
    //     console.info("Extra Call")
    // }).finally(() => {
    //     console.log(promise);
    //     console.log('Promise Finished');
    // });
})

document.querySelector('#resolveAll').addEventListener('click', () => {
    Promise.all(promises).then((results) => {
        for(let result of results) {
            const answer = document.createElement('p');
            answer.innerText = result['answer']
            const timeTaken = document.createElement('p');
            timeTaken.innerText = result['timeTaken']
            document.querySelector('#correct').appendChild(answer);
            document.querySelector('#times').appendChild(timeTaken);
        }
        promises = [];
    }).catch((error) => {

    })
})

window.addEventListener('load', () => {
    document.body.style.background = '#c0c0c0';
})