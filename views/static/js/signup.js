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
    console.log(response);
}

submit.addEventListener('click', submitData);