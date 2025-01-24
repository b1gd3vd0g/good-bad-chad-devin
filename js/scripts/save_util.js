const attemptLogin = async () => {
    const username = document.querySelector('#un-field').value;
    const password = document.querySelector('#pw-field').value;
    const result = await fetch(
        'http://www.goodbadchad.bigdevdog.com:6900/player/login',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ username, password })
        }
    );
    const info = await result.json();
    switch (result.status) {
        case 200:
            const { token } = info;
            localStorage.setItem('player-auth-token', token);
            // This sets the token, but does not refresh the
            // save screen.
            break;
        default:
            console.log(info);
            document.querySelector('#login-fb').innerHTML = 'Login failed.';
    }
};
