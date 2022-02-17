let promiseCounter = 0;
const throwCheckbox = document.querySelector('#throwToggle');
const automateCheckbox = document.querySelector('#automatedPromise');
const promiseList = document.querySelector('.promiseList');

const createTableRow = function(id, addButtons) {
    const row = {
        tr: document.createElement('tr'),
        resolveButton: document.createElement('button'),
        rejectButton: document.createElement('button'),
        timeCell: document.createElement('td'),
        statusCell: document.createElement('td'),
        setTime: function(startTime) {
            this.timeCell.innerText = Date.now() - startTime;
        },
        setStatus: function(status) {
            // Remove any status classes from the TR then add the new one
            this.tr.className = 'promise';
            this.tr.classList.add(status);
            this.statusCell.innerText = status;
        },
        disableButtons: function() {
            if(this.resolveButton) this.resolveButton.disabled = true;
            if(this.rejectButton) this.rejectButton.disabled = true;
        }
    };
    
    row.tr.classList.add('promise');
    row.tr.title = `Promise ${id}`;
    row.tr.setAttribute('id', row.tr.title.replace(' ', '').toLowerCase());

    const nameCell = document.createElement('th');
    nameCell.scope = 'row';
    nameCell.innerText = row.tr.title;
    row.tr.appendChild(nameCell);

    const actionsCell = document.createElement('td');

    if(addButtons) {
        row.resolveButton.classList.add('resolve');
        row.resolveButton.innerText = 'Resolve';
        row.rejectButton.classList.add('reject');
        row.rejectButton.innerText = 'Reject';
        actionsCell.append(row.resolveButton, row.rejectButton);
    } else {
        row.resolveButton = null;
        row.rejectButton = null;
        actionsCell.innerText = 'N/A';
    }
    
    row.tr.appendChild(actionsCell);

    row.timeCell.classList.add('time');
    row.tr.appendChild(row.timeCell);

    row.statusCell.classList.add('status');
    row.tr.appendChild(row.statusCell);
    row.setStatus('pending');

    promiseList.appendChild(row.tr);
    return row;
};

const createPromise = function(resolveButton, rejectButton) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        if(throwCheckbox.checked) {
            throw Error('OOPS! All berries.');
        }

        // If the buttons are not provided, create an automated promise
        if(!resolveButton || !rejectButton) {
            // Number between 1k and 10k
            const delay = Math.random() * (10000 - 1000) + 1000; 

            setTimeout(() => {
                // Automated promises are successful ~50% of the time
                if(Math.random() * 100 < 50) {
                    resolve(startTime);
                } else {
                    reject(startTime);
                }
            }, delay);
        } else {
            resolveButton.addEventListener('click', () => resolve(startTime));
            rejectButton.addEventListener('click', () => reject(startTime));
        }
    });
};

document.body.querySelector('#createPromise').addEventListener('click', () => {
    const automatePromise = automateCheckbox.checked;

    // id = next increment of the promise counter
    // Add buttons if the promise is NOT automated
    const tableRow = createTableRow(++promiseCounter, !automatePromise);

    // The buttons will be null if they were not added at creation
    let promise = createPromise(tableRow.resolveButton, tableRow.rejectButton);

    promise.then((startMS) => {
        tableRow.setTime(startMS);
        tableRow.setStatus('fulfilled');
    })
    .catch((result) => {
        if(typeof result === 'number') {
            tableRow.setTime(result);
            tableRow.setStatus('rejected');
        } else {
            tableRow.timeCell.innerText = 'N/A';
            tableRow.setStatus('exception');
            tableRow.statusCell.innerText = result.message;
        }
    })
    .finally(() => {
        tableRow.disableButtons();
    });
});