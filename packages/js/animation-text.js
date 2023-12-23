const textElement = document.getElementById('text-container');
const textsToType = ['Web Developer', 'Graphic Designer', 'Photographer'];
let textIndex = 0;
const cursorElement = document.createElement('span');
cursorElement.className = 'blinking-cursor';
textElement.appendChild(cursorElement);

function typeAndEraseText() {
    let index = 0;
    let isTyping = true;
    let currentText = textsToType[textIndex];
    let startTime = null;
    const typingSpeed = 1200; // Kecepatan mengetik (dalam milidetik) untuk 50 wpm

    function animateText(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }
        const elapsedTime = timestamp - startTime;

        if (isTyping) {
            index = Math.floor((elapsedTime / typingSpeed) * currentText.length);
            if (index >= currentText.length) {
                index = currentText.length;
                isTyping = false;
                startTime = null;
                setTimeout(() => {
                    isTyping = false;
                    requestAnimationFrame(animateText);
                }, 2000); // Jeda setelah selesai mengetik
            }
        } else {
            index = currentText.length - Math.floor((elapsedTime / typingSpeed) * currentText.length);
            if (index <= 0) {
                index = 0;
                isTyping = true;
                startTime = null;
                textIndex = (textIndex + 1) % textsToType.length;
                currentText = textsToType[textIndex]; // Memperbarui teks yang akan diketik
                setTimeout(() => {
                    isTyping = true;
                    requestAnimationFrame(animateText);
                }, 2000); // Jeda setelah selesai menghapus
            }
        }

        textElement.textContent = currentText.slice(0, index);
        cursorElement.style.left = `${textElement.offsetWidth}px`;

        if (isTyping || index > 0) {
            requestAnimationFrame(animateText);
        }
    }

    requestAnimationFrame(animateText);
}

// Start the initial typing
typeAndEraseText();
