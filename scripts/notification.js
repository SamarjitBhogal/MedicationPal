document.getElementById("toggleNotifications").addEventListener('click', (e) => {
    document.getElementById("bannerCheck").toggleAttribute("disabled");
    document.getElementById("smsCheck").toggleAttribute("disabled");
    document.getElementById("emailCheck").toggleAttribute("disabled");
    document.getElementById("save-btn").toggleAttribute("disabled");
});

document.getElementById("smsCheck").addEventListener('click', (e) => {
    document.getElementById("phoneNum").toggleAttribute("disabled");
});

document.getElementById("emailCheck").addEventListener('click', (e) => {
    document.getElementById("email").toggleAttribute("disabled");
});