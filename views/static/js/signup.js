import Prompt from './prompt.js';

const prompt = new Prompt(document.getElementById('prompt_wrapper'));

const submit = document.getElementById('submit');
const nickname = document.getElementById('nickname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('c_password');

async function submitData() {
    prompt.clear();
    const payload = {
        nickname: nickname.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    };
    let response = await Communication.sendMessage('api/signup', payload);
    response = await response.json();
    if(!response.resolved) {
        switch (response.status) {
            case 1:
                prompt.push(null, 'Invalid Request', 'Refresh the page and try again.');
                break;
            case 2:
                prompt.push(null, 'Expired Page', 'Refresh the page and try again.');
                break;
            default:
                prompt.push(null, 'Unexpected Error', 'Try again later.');
                break;
        }
    } else {
        if(response.status === 0) {
            alert('Signed Up Successfully');
            location.href = './';
        }
        if(response.status === 4) {
            prompt.push(null, response.data.title, response.data.content);
            return false;
        }
    }
}

document.querySelectorAll('input').forEach(element => {
    element.addEventListener('keyup', (event) => {
        if(event.keyCode === 13) {
            confirmPassword.blur();
            void submitData();
        }
    });
});

submit.addEventListener('click', submitData);