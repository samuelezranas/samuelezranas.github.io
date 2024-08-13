const textElement = document.getElementById('text-container');
const textsToType = ['Web Developer', 'Android Developer', 'UI/UX Designer', 'Graphic Designer', 'Photographer'];
let textIndex = 0;
const cursorElement = document.createElement('span');
cursorElement.className = 'blinking-cursor';
textElement.appendChild(cursorElement);

function typeAndEraseText() {
    let index = 0;
    let isTyping = true;
    let currentText = '';
    let startTime = null;
    const typingSpeed = 1200; // Kecepatan mengetik (dalam milidetik) untuk 50 wpm
    const pauseDuration = 1000; // Jeda setelah selesai mengetik atau menghapus (dalam milidetik)

    function animateText(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }
        const elapsedTime = timestamp - startTime;

        if (isTyping) {
            index = Math.floor((elapsedTime / typingSpeed) * textsToType[textIndex].length);
            if (index >= textsToType[textIndex].length) {
                index = textsToType[textIndex].length;
                isTyping = false;
                startTime = timestamp; // Waktu mulai jeda sebelum menghapus
                setTimeout(() => {
                    isTyping = false;
                    requestAnimationFrame(animateText);
                }, pauseDuration); // Jeda selesai mengetik sebelum menghapus
            }
        } else {
            index = textsToType[textIndex].length - Math.floor((elapsedTime / typingSpeed) * textsToType[textIndex].length);
            if (index <= 0) {
                index = 0;
                isTyping = true;
                startTime = null;
                textIndex = (textIndex + 1) % textsToType.length;
                currentText = ''; // Mengosongkan teks
                setTimeout(() => {
                    isTyping = true;
                    requestAnimationFrame(animateText);
                }, pauseDuration); // Jeda selesai menghapus sebelum memulai mengetik kembali
            }
        }

        currentText = textsToType[textIndex].slice(0, index);
        textElement.textContent = currentText;
        cursorElement.style.left = `${textElement.offsetWidth}px`;

        requestAnimationFrame(animateText);
    }

    requestAnimationFrame(animateText);
}

// Start the initial typing
typeAndEraseText();
