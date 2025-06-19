document.addEventListener('DOMContentLoaded', () => {
    const bookElement = document.getElementById('book');
    const fontSizeLinks = document.querySelectorAll('.font-size');
    const textColorLinks = document.querySelectorAll('.color[data-text-color]');
    const backgroundColorLinks = document.querySelectorAll('.color[data-bg-color]');

    fontSizeLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            fontSizeLinks.forEach(link => link.classList.remove('font-size_active'));
            link.classList.add('font-size_active');
            bookElement.classList.remove('book_fs-small', 'book_fs-big');

            if (link.dataset.size === 'small') {
                bookElement.classList.add('book_fs-small');
            } else if (link.dataset.size === 'big') {
                bookElement.classList.add('book_fs-big');
            }
        });
    });

    textColorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            textColorLinks.forEach(link => link.classList.remove('color_active'));
            link.classList.add('color_active');

            bookElement.classList.remove('book_color-black', 'book_color-gray', 'book_color-whitesmoke');
            bookElement.classList.add(`book_color-${link.dataset.textColor}`);
        });
    });

    backgroundColorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            backgroundColorLinks.forEach(link => link.classList.remove('color_active'));
            link.classList.add('color_active');

            bookElement.classList.remove('book_bg-black', 'book_bg-gray', 'book_bg-white');
            bookElement.classList.add(`book_bg-${link.dataset.bgColor}`);
        });
    });
});