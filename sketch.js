let X, Y, Z;

let frontButton, topButton, sideButton;

let canvasSize = 700
let boxSize = canvasSize * 0.3;
let beaconLength = 1000;

let key1, key2, key3;

let freq1, freq2, freq3;

let playing1, playing2, playing3;

let oct = 12 * 1;

let cnv;

function setup() {
    cnv = createCanvas(canvasSize, canvasSize, WEBGL);

    // serial stuff
    serial = new p5.SerialPort();
    serial.list();
    serial.open('/dev/tty.usbmodem2101');
    serial.on('connected', serverConnected);
    serial.on('list', gotList);
    serial.on('data', gotData);
    serial.on('error', gotError);
    serial.on('open', gotOpen);
    serial.on('close', gotClose);

    // sound stuff
    key1 = new p5.Oscillator('sine');
    key2 = new p5.Oscillator('sine');
    key3 = new p5.Oscillator('sine');

    freq1 = midiToFreq(60);
    freq2 = midiToFreq(64);
    freq3 = midiToFreq(67);

}

function draw() {

    cnv.parent('soundbox');

    background(60);

    // rotation consts
    var splitData = split(latestData, ',');
    X = Number(splitData[0]);
    Y = Number(splitData[2]);
    Z = Number(splitData[4]);

    frontButton = Number(splitData[1]);
    topButton = Number(splitData[3]);
    sideButton = Number(splitData[5]);

    // button pressed
    if ((sideButton == 1) && !(playing1)) {
        print('side pressed');
        //playing1 = true;
        buttonPressed();
    } if ((topButton == 1) && !(playing2)) {
        print('front pressed');
        //playing2 = true;
        buttonPressed();
    } if ((frontButton == 1) && !(playing3)) {
        print('top pressed');
        //playing3 = true;
        buttonPressed();
    }

    // button released
    if ((sideButton == 0) && (playing1)) {
        print('side pressed');
        //playing1 = false;
        buttonReleased();
    } if ((topButton == 0) && (playing2)) {
        print('front pressed');
        //playing2 = false;
        buttonReleased();
    } if ((frontButton == 0) && (playing3)) {
        print('top pressed');
        //playing1 = false;
        buttonReleased();
    }

    // mapping for rotation
    mappedX = -map(X, -10, 10, -90, 90);
    mappedY = map(Y, -10, 10, -90, 90);
    mappedZ = map(Z, -10, 10, -90, 90);

    rotateX(radians(mappedZ));
    rotateY(radians(mappedX));
    /*
    if (Z > 0){
        rotateY(radians(-mappedX));
    } else if (Z < 0){
        rotateX(90 + radians(mappedX));
    */
    // rotateZ(radians(mappedX));
    //rotateZ(radians(-45));

    // mapping for sound
    freq1 = midiToFreq(60 + oct) + mappedX / 2;
    freq2 = midiToFreq(64 + oct) + mappedY / 2;
    freq3 = midiToFreq(67 + oct) + mappedZ / 2;

    if (playing1) {
        // smooth the transitions by 0.1 seconds
        // key on the X axis
        key1.freq(freq1, 0.1);
        key1.amp(0.5);

        push();
        translate((beaconLength/2 + boxSize/2), 0, 0);
        fill(255, 130, 130, 40);
        noStroke();
        box(beaconLength, boxSize, boxSize);
        pop();

    } if (playing2) {
        // key on the Y axis
        key2.freq(freq2, 0.1);
        key2.amp(0.5);

        push();
        translate(0,  - (beaconLength/2 + boxSize/2), 0);
        fill(130, 174, 255, 40);
        noStroke();
        box(boxSize, beaconLength, boxSize);
        pop();
    } if (playing3) {
        // key on the Z axis
        key3.freq(freq3, 0.1);
        key3.amp(0.5);

        push();
        translate(0, 0, beaconLength/2 + boxSize/2);
        fill(218, 130, 255, 40);
        noStroke();
        box(boxSize, boxSize, beaconLength);
        pop();
    }


    stroke(0);
    fill(66, 245, 194);
    box(boxSize);
}

//////////////////////////
//     sound functions  //
//////////////////////////

function buttonPressed() {
    if (sideButton == 1) {
        print('1 pressed');
        // ramp amplitude to 0 over 0.1 seconds
        key1.start();
        key1.amp(1, 0.1);
        playing1 = true;
    } if (topButton == 1) {
        key2.start();
        key2.amp(1, 0.1);
        playing2 = true;
    } if (frontButton == 1) {
        key3.start();
        key3.amp(1, 0.1);
        playing3 = true;
    }
}

function buttonReleased() {
    if (frontButton == 0) {
        // ramp amplitude to 0 over 0.5 seconds
        key1.amp(0, 0.5);
        playing1 = false;
    } if (topButton == 0) {
        key2.amp(0, 0.5);
        playing2 = false;
    } if (sideButton == 0) {
        key3.amp(0, 0.5);
        playing3 = false;
    }
}


//////////////////////////
// serial communication //
//////////////////////////

let serial;
let latestData = '0,0,0';

function serverConnected() {
    print("Connected to Server");
}

function gotList(thelist) {
    print("List of Serial Ports:");

    for (let i = 0; i < thelist.length; i++) {
        print(i + " " + thelist[i]);
    }
}

function gotOpen() {
    print("Serial Port is Open");
}

function gotClose(){
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
}

function gotError(theerror) {
    print(theerror);
}

function gotData() {
    let currentString = serial.readLine();
    trim(currentString);
    if (!currentString) return;
    console.log(currentString);
    latestData = currentString;
}
