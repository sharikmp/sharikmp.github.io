const w = window.innerWidth * 0.8;
const h = window.innerHeight * 0.9;

const canva = document.querySelector("#canva");
const cam_pos_x = document.querySelector('#cam_pos_x');
const cam_pos_y = document.querySelector('#cam_pos_y');
const cam_pos_z = document.querySelector('#cam_pos_z');
const continueAnimationRadio = document.querySelector('#animateContinue');
const planet_speed_slider = document.querySelector('#planet_speed');

cam_pos_x.addEventListener("input", handleCameraPositionChange);
cam_pos_y.addEventListener("input", handleCameraPositionChange);
cam_pos_z.addEventListener("input", handleCameraPositionChange);
continueAnimationRadio.addEventListener("change", handleAnimateControl);
planet_speed_slider.addEventListener("input", handleSpeedControl);

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('dblclick', onDoubleClick, false);





// Planets with different radii, distances, colors, initial angle, ring details [hasRing, ringWidth], moon details [hasMoon, numberOfMoons]
//  Only well know moons
const planetData = [
    [1.0, 25, 0xB6B6B6, randomAngle(), [false, 0], [false, 0]],         // Mercury
    [2.4, 35, 0xE2B557, randomAngle(), [false, 0], [false, 0]],         // Venus
    [2.6, 45, 0x2E74B5, randomAngle(), [false, 0], [true, 1]],          // Earth
    [1.4, 50, 0xE0502F, randomAngle(), [false, 0], [true, 2]],          // Mars
    [5.0, 65, 0xD1A95C, randomAngle(), [true, 0.2], [true, 4]],         // Jupiter
    [3.0, 75, 0xD3B57D, randomAngle(), [true, 1.0], [true, 7]],         // Saturn
    [4.0, 85, 0x77A5E1, randomAngle(), [true, 0.2], [true, 5]],         // Uranus
    [3.6, 95, 0x368AD3, randomAngle(), [true, 0.2], [true, 2]]          // Neptune
];

const planets = [];



//Global variables
var cam_pos_x_value = 0;
var cam_pos_y_value = 25;
var cam_pos_z_value = 125;

var continueAnimation = true;
var planet_speed = 100;



//Scene and Camera and light setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(cam_pos_x_value, cam_pos_y_value, cam_pos_z_value);

var viewpointLight = new THREE.DirectionalLight(0xffffff, 1.0); 
viewpointLight.position.set(0, 0, 1); 
scene.add(viewpointLight);
var redLight = new THREE.DirectionalLight("red", 0.5);
redLight.position.set(1, 1, 0);
scene.add(redLight);
var greenLight = new THREE.DirectionalLight("green", 0.5);
greenLight.position.set(1, 0, 1);
scene.add(greenLight);
var blueLight = new THREE.DirectionalLight("blue", 0.5);
blueLight.position.set(0, 1, 1);
scene.add(blueLight);



const textureLoader = new THREE.TextureLoader();
let backgroundTexture;

textureLoader.load('./images/bg.jpg', (texture) => {
    backgroundTexture = texture;
    backgroundTexture.wrapS = THREE.RepeatWrapping;
    backgroundTexture.wrapT = THREE.RepeatWrapping;
    backgroundTexture.repeat.set(4, 4); // Adjust the repeat values as needed
    const backgroundGeometry = new THREE.PlaneGeometry(w, h); // Use the width and height of your scene
    const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture, side: THREE.DoubleSide });
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    scene.add(backgroundMesh);
});



camera.position.set(cam_pos_x_value, cam_pos_y_value, cam_pos_z_value);
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Point the camera towards the center of the scene




// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
canva.appendChild(renderer.domElement);




// Create Sun
// Set the sun geometry and material
const sunGeometry = new THREE.SphereGeometry(20, 64, 64);
const sunMaterial = new THREE.MeshPhongMaterial({
    color: 0xf0690e,
    specular: 0x101010,
    shininess: 32,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);





//Create planets

planetData.forEach(p => { createPlanet(p[0], p[1], p[2], p[4], p[5]); });

function createPlanet(radius, distance, color, ring, moon) {
    let xRadius = radius, yRadius = radius, zRadius = radius * 0.8;
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

    for (const vertex of sphereGeometry.vertices) {
        vertex.x *= xRadius;
        vertex.y *= yRadius;
        vertex.z *= zRadius;
    }

    sphereGeometry.computeVertexNormals();

    const planetMaterial = new THREE.MeshPhongMaterial({
        color: color,
        specular: 0x101010,
        shininess: 32,
    });

    const planet = new THREE.Mesh(sphereGeometry, planetMaterial);
    planet.position.set(distance, 0, 0);

    if (ring[0]) createRingForPlanet(planet, radius, ring[1]);

    if (moon[0]) createMoonsForPlanet(planet, moon[1]);

    scene.add(planet);
    planets.push(planet);
}

function createRingForPlanet(planet, radius, ringWidth) {
    const ringGeometry = new THREE.RingGeometry(radius * 1.2, radius * 1.2 + ringWidth, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.05;
    planet.add(ring);
};

function createMoonsForPlanet(planet, numOfMoons, moonRadius = 0.5, moonDistance = 5) {
    const moons = [];

    for (let i = 0; i < numOfMoons; i++) {
        const angle = (i / numOfMoons) * Math.PI * 2;

        const x = moonDistance * Math.cos(angle);
        const z = moonDistance * Math.sin(angle);

        const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);

        moon.position.set(x, 0, z);

        planet.add(moon);

        moons.push(moon);
    }

    return moons; 
};






// Animation function
const animate = () => {
    requestAnimationFrame(animate);

    if (continueAnimation) {
        planets.forEach((planet, index) => {
            const speed = planet_speed * 0.0001 / (index * 0.5 + 1);
            planetData[index][3] += speed;
            const distance = planetData[index][1] //- planetData[index][0] * 2;
            const x = distance * Math.cos(planetData[index][3]);
            const y = 0;
            const z = distance * Math.sin(planetData[index][3]);
            planet.position.set(x, y, z);
        });
    }

    renderer.render(scene, camera);
};

// Start the animation
animate();


// Controls


// Function to handle slider value change
function handleCameraPositionChange() {
    cam_pos_x_value = Number(document.querySelector('#cam_pos_x').value);
    cam_pos_y_value = Number(document.querySelector('#cam_pos_y').value);
    cam_pos_z_value = Number(document.querySelector('#cam_pos_z').value);

    camera.position.set(cam_pos_x_value, cam_pos_y_value, cam_pos_z_value);

    updateCameraPosition();

}

function handleAnimateControl() {
    continueAnimation = animateContinue.checked;
}

function handleSpeedControl() {
    planet_speed = Number(document.querySelector('#planet_speed').value);
}

// Mouse control
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

function isMousePointInScene(x, y) {
    return x >= 0 && x <= w && y >= 0 && y <= h;
}

// Function to handle mouse press
function onMouseDown(event) {
    if (isMousePointInScene(event.clientX, event.clientY)) {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        }
    }
}

// Function to handle mouse release
function onMouseUp(event) {
    if (isMousePointInScene(event.clientX, event.clientY)) {
        isDragging = false;
        updateCameraPosition();
    }
}

// Function to handle mouse movement
function onMouseMove(event) {
    if (isMousePointInScene(event.clientX, event.clientY)) {
        if (!isDragging) return;

        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        camera.rotation.x += deltaMove.y * 0.01;
        camera.rotation.y += deltaMove.x * 0.01;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        updateCameraPosition();
    }
}

function onDoubleClick(event) {
    if (isMousePointInScene(event.clientX, event.clientY)) {
        camera.position.z -= 50;
        console.log("dblclick at: " + event.clientX + ", " + event.clientY);
        updateCameraPosition();
    }
}

function updateCameraPosition() {
    cam_pos_x.value = camera.position.x;
    cam_pos_y.value = camera.position.y;
    cam_pos_z.value = camera.position.z;
    document.querySelector('#cam_pos_x_value').innerHTML = camera.position.x;
    document.querySelector('#cam_pos_y_value').innerHTML = camera.position.y;
    document.querySelector('#cam_pos_z_value').innerHTML = camera.position.z;
}



function randomAngle() { return (Math.random() * Math.PI * 2) };
