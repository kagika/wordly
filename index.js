let screen = document.getElementById('screen')
let button = Array.from(document.getElementsByClassName("button"))

button.map(btn => {
    btn.addEventListener('click', click => {
        switch (click.target.innerText){
            case 'B':
                screen.innerText = screen.innerText.slice(0,-1)
                break
            case 'C':
                screen.innerText = '';
                break
            case '=':
               result = eval(screen.innerText)
               screen.innerText = result
               break
            default:
                screen.innerText += click.target.innerText;
        }
    });
});
