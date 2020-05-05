function buildPrompt(type, title, description) {
    const prompt = document.createElement('div');
    prompt.classList.add('item');
    prompt.classList.add(type);
    const header = document.createElement('h1');
    header.classList.add('header');
    header.textContent = title;
    const content = document.createElement('p');
    header.classList.add('content');
    content.textContent = description;
    prompt.append(header, content);
    return prompt;
}

export default class Prompt {

    constructor(target) {
        this.target = target;
    }

    clear() {
        this.target.innerHTML = '';
    }

    push(type, title, description) {
        const tmp = buildPrompt(type, title, description);
        const lineBreak = document.createElement('br');
        this.target.append(tmp, lineBreak);
    }

}