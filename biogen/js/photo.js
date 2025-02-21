// photo.js

function setupPhotoUpload() {
    document.getElementById('uploadPhoto')?.addEventListener('change', handlePhotoUpload);
}

async function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file || !validateImageFile(file)) {
        alert('Please upload a valid image file.');
        event.target.value = '';
        return;
    }

    const imageData = await readFileAsDataURL(file);
    processImage(imageData);
}

function validateImageFile(file) {
    return file.type.startsWith('image/');
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function processImage(imageData) {
    const img = new Image();
    img.src = imageData;

    img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 1000;

        const { width, height } = scaleImage(img.width, img.height, maxWidth);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressedData = await compressImage(canvas);
        displayImage(compressedData);
    };
}

function scaleImage(width, height, maxWidth) {
    if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
    }
    return { width, height };
}

async function compressImage(canvas) {
    const targetSize = 2 * 1024 * 1024;
    let quality = 0.9;
    let compressedBlob = await createBlob(canvas, quality);

    while (compressedBlob.size > targetSize && quality > 0.1) {
        quality -= 0.1;
        compressedBlob = await createBlob(canvas, quality);
    }

    return readBlobAsDataURL(compressedBlob);
}

function createBlob(canvas, quality) {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
    });
}

function readBlobAsDataURL(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function displayImage(imageData) {
    const photoPlaceholder = document.querySelector('.photo-placeholder');
    if (photoPlaceholder) {
        Object.assign(photoPlaceholder.style, {
            backgroundImage: `url(${imageData})`,
            backgroundSize: 'cover',
            width: '150px',
            height: '150px',
            border: 'none'
        });
        photoPlaceholder.innerHTML = '';
    }

    const fullPhoto = document.getElementById('fullPhoto');
    if (fullPhoto) fullPhoto.src = imageData;

    document.querySelector('.view-photo')?.classList.add('d-block');
    document.querySelector('.photos-container')?.classList.add('d-block');
}
