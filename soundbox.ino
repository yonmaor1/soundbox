#include <Adafruit_CircuitPlayground.h>

float X, Y, Z;
const int topButton = A1;
const int frontButton = A2;
const int sideButton = A3;

// not used
const int topLED = A6;
const int frontLED = A5;
const int sideLED = A4;

int topState = 0;
int frontState = 0;
int sideState = 0;

void setup() {
  Serial.begin(9600);
  CircuitPlayground.begin();
  
  pinMode(topButton, INPUT);
  pinMode(frontButton, INPUT);
  pinMode(sideButton, INPUT);

  // pinMode(topLED, INPUT);
  // pinMode(frontLED, INPUT);
  // pinMode(sideLED, INPUT);
}

void loop() {
  X = CircuitPlayground.motionX();
  Y = CircuitPlayground.motionY();
  Z = CircuitPlayground.motionZ();

  topState = digitalRead(topButton);
  frontState = digitalRead(frontButton);
  sideState = digitalRead(sideButton);

  Serial.print(X);
  Serial.print(", ");
  Serial.print(topState);
  Serial.print(", ");
  Serial.print(Y);
  Serial.print(", ");
  Serial.print(frontState);
  Serial.print(", ");
  Serial.print(Z);
  Serial.print(", ");
  Serial.println(sideState);

  delay(100);
}
