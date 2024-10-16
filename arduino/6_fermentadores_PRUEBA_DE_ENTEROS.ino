#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>

// #define DEBUG(a) Serial.println(a);

#define I2C_ADDR 0x27

LiquidCrystal_I2C lcd(I2C_ADDR, 2, 1, 0, 4, 5, 6, 7);

// Declaro Variables

byte grado[8] =
    {
        0b00001100,
        0b00010010,
        0b00010010,
        0b00001100,
        0b00000000,
        0b00000000,
        0b00000000,
        0b00000000};

const int bombaperif = 9;
const int compre0 = 7;
const int compre1 = 10;
const int compre2 = 8;
const int compre3 = 11;
const int compre4 = 5;
const int compre5 = 6;

byte ledstatus0 = LOW;
byte ledstatus1 = LOW;
byte ledstatus2 = LOW;
byte ledstatus3 = LOW;
byte ledstatus4 = LOW;
byte ledstatus5 = LOW;

byte reinicio = LOW;

int val0 = 99;
int val1 = 99;
int val2 = 99;
int val3 = 99;
int val4 = 99;
int val5 = 99;

int t0 = 0;
int t1 = 0;
int t2 = 0;
int t3 = 0;
int t4 = 0;
int t5 = 0;

float temp0 = 0.0;
float temp1 = 0.0;
float temp2 = 0.0;
float temp3 = 0.0;
float temp4 = 0.0;
float temp5 = 0.0;

String str = "";
const char separator = 'X';
const int dataLength = 3;
int data[dataLength];
int ferment = 0;
float datotemp = 0;
unsigned long TiempoAhora = 0;

OneWire ourWire(2); // Se establece el pin 2  como bus OneWire

DallasTemperature sensors(&ourWire); // Se declara una variable u objeto para nuestro sensor

DeviceAddress address1 = {0x28, 0xAA, 0x4A, 0xCD, 0x3F, 0x14, 0x1, 0x75}; // dirección del sensor 1
DeviceAddress address2 = {0x28, 0xAA, 0xB5, 0xBE, 0x3F, 0x14, 0x1, 0x9C}; // dirección del sensor 2
DeviceAddress address3 = {0x28, 0xAA, 0x4A, 0xCD, 0x3F, 0x14, 0x1, 0x75}; // dirección del sensor 1
DeviceAddress address4 = {0x28, 0xAA, 0xB5, 0xBE, 0x3F, 0x14, 0x1, 0x9C}; // dirección del sensor 2
DeviceAddress address5 = {0x28, 0xAA, 0x4A, 0xCD, 0x3F, 0x14, 0x1, 0x75}; // dirección del sensor 1
DeviceAddress address6 = {0x28, 0xAA, 0xB5, 0xBE, 0x3F, 0x14, 0x1, 0x9C}; // dirección del sensor 2

/*DeviceAddress address3 = {0x28, 0xF, 0xF7, 0x79,0x9, 0x0, 0x0, 0x78};//dirección del sensor 3*/
/*DeviceAddress address4 = {0x28, 0x15, 0xDC, 0x79, 0x9, 0x0, 0x0, 0x64};//dirección del sensor 4*/

/*DeviceAddress address1 = {0x28, 0x24, 0x0A, 0x28, 0x00, 0x00, 0x80, 0x29};//dirección del sensor 1
DeviceAddress address2 = {0x28, 0x5E, 0x19, 0x28, 0x00, 0x00, 0x80, 0x4C};//dirección del sensor 2
DeviceAddress address3 = {0x28, 0x15, 0xDC, 0x79, 0x09, 0x00, 0x00, 0x64};//dirección del sensor 3
//DeviceAddress address4 = {0x28, 0xAA, 0x4A, 0xCD, 0x3F, 0x14, 0x1, 0x75,};//dirección del sensor 4*/

void chequear(int tem, int valor, int compresor, byte *led);
void leer(void);
void valoresserie(void);
void valoreslcd(void);
void recibedatos(int op, int f);

void setup()
{
  pinMode(compre0, OUTPUT);
  pinMode(compre1, OUTPUT);
  pinMode(compre2, OUTPUT);
  pinMode(compre3, OUTPUT);
  pinMode(compre4, OUTPUT);
  pinMode(compre5, OUTPUT);
  pinMode(bombaperif, OUTPUT);
  digitalWrite(compre0, HIGH); // pongo bajo xke es rele logica inversa
  digitalWrite(compre1, HIGH);
  digitalWrite(compre2, HIGH);
  digitalWrite(compre3, HIGH);
  digitalWrite(compre4, HIGH);
  digitalWrite(compre5, HIGH);
  digitalWrite(bombaperif, HIGH);
  Serial.begin(9600);
  sensors.begin();                    // Se inicia el sensor
  sensors.setResolution(address1, 9); // resolución de 9-12 bits
  sensors.setResolution(address2, 9); // resolución de 9-12 bits
  sensors.setResolution(address3, 9); // resolución de 9-12 bits
  sensors.setResolution(address4, 9); // resolución de 9-12 bits
  sensors.setResolution(address5, 9); // resolución de 9-12 bits
  sensors.setResolution(address6, 9); // resolución de 9-12 bits

  lcd.setBacklightPin(3, POSITIVE);
  lcd.setBacklight(HIGH);
  lcd.begin(16, 2);         // initialize the lcd for 16 chars 2 lines, turn on backlight
  lcd.createChar(1, grado); // caracter especial "º"
  lcd.backlight();          //  backlight on */
  TiempoAhora = millis();
  reinicio = HIGH;
  Serial.println(" ");
  // Serial.print(reinicio);
  // Serial.print("; ");
  // delay(50);
  while (millis() < TiempoAhora + 50)
  {
  }
  // Serial.println(" ");
  TiempoAhora = millis();
  lcd.setCursor(0, 0);
  lcd.print("REINICIANDO...");
  // delay(500);
  while (millis() < TiempoAhora + 500)
  {
  }
}

void loop()
{
  Serial.print(reinicio); // estado de reinicio de la placa
  Serial.print("; ");
  reinicio = LOW;
  valoresserie();
  leer();
  valoreslcd();

  TiempoAhora = millis();
  Serial.println(" ");
  // delay(50);
  while (millis() < TiempoAhora + 50)
  {
  }
  if (Serial.available())
  {

    str = Serial.readStringUntil('E');
    if (str.startsWith("S", 0))
    {
      // Serial.print("DATO CORRECTO");
      // delay(500);

      for (int i = 0; i < dataLength; i++)
      {
        int index = str.indexOf(separator);

        data[i] = str.substring(1, index).toInt();
        ferment = data[0];
        // Serial.println(data[i]);
        // delay(1000);
        str = str.substring(index + 1);
        datotemp = data[1];
        // Serial.println(data[i]);
        // delay(1000);
      }
      // DEBUG_ARRAY(data);
      recibedatos(ferment, datotemp);
      /* Serial.println(ferment);
       delay(1000);
       Serial.println(datotemp);
       delay(1000);*/
    }
    // valoreslcd();
    // delay(500);
  }
}
// Función Nº1 -------------------------------------------------------------
void chequear(int tem, int valor, int compresor, byte *led)
{

  if (tem > valor)
  {
    TiempoAhora = millis();
    digitalWrite(compresor, LOW);
    *led = HIGH;
    Serial.print(*led);
    Serial.print("; ");
    while (millis() < TiempoAhora + 500)
    {
    }
  }

  else
  {
    TiempoAhora = millis();
    digitalWrite(compresor, HIGH);
    *led = LOW;
    Serial.print(*led);
    Serial.print("; ");
    while (millis() < TiempoAhora + 50)
    {
    }
  }
}

// Función Nº2 -------------------------------------------------------------

// Función Nº3 -------------------------------------------------------------
void leer(void)
{
  TiempoAhora = millis();
  sensors.requestTemperatures(); // envía el comando para obtener las temperaturas
  while (millis() < TiempoAhora + 10)
  {
  }
  TiempoAhora = millis();
  temp0 = sensors.getTempC(address1); // Se obtiene la temperatura en °C del sensor 1
  t0 = sensors.getTempC(address1);
  while (millis() < TiempoAhora + 10)
  {
  }
  TiempoAhora = millis();
  temp1 = sensors.getTempC(address2); // Se obtiene la temperatura en °C del sensor 2
  t1 = sensors.getTempC(address2);
  while (millis() < TiempoAhora + 10)
  {
  }
  TiempoAhora = millis();
  temp2 = sensors.getTempC(address3); // Se obtiene la temperatura en °C del sensor 3*/
  t2 = sensors.getTempC(address3);
  while (millis() < TiempoAhora + 10)
  {
  }
  TiempoAhora = millis();
  temp3 = sensors.getTempC(address4); // Se obtiene la temperatura en °C del sensor 3*/
  t3 = sensors.getTempC(address4);
  while (millis() < TiempoAhora + 10)
  {
  }
  TiempoAhora = millis();
  temp4 = sensors.getTempC(address5); // Se obtiene la temperatura en °C del sensor 3*/
  t4 = sensors.getTempC(address5);
  while (millis() < TiempoAhora + 10)
  {
  }
  TiempoAhora = millis();
  temp5 = sensors.getTempC(address6); // Se obtiene la temperatura en °C del sensor 3*/
  t5 = sensors.getTempC(address6);
  while (millis() < TiempoAhora + 10)
  {
  }
  TiempoAhora = millis();
  Serial.print(temp0);
  Serial.print("; ");
  // delay(50);
  Serial.print(temp1);
  Serial.print("; ");
  // delay(50);
  Serial.print(temp2);
  Serial.print("; ");
  // delay(50);
  Serial.print(temp3);
  Serial.print("; ");
  Serial.print(temp4);
  Serial.print("; ");
  // delay(50);
  Serial.print(temp5);
  Serial.print("; ");
  while (millis() < TiempoAhora + 500)
  {
  }
  TiempoAhora = millis();
  chequear(t0, val0, compre0, &ledstatus0);
  while (millis() < TiempoAhora + 50)
  {
  }
  // delay(50);
  TiempoAhora = millis();
  chequear(t1, val1, compre1, &ledstatus1);
  // delay(50);
  while (millis() < TiempoAhora + 50)
  {
  }
  TiempoAhora = millis();
  chequear(t2, val2, compre2, &ledstatus2);
  // delay(50);
  while (millis() < TiempoAhora + 50)
  {
  }
  TiempoAhora = millis();
  chequear(t3, val3, compre3, &ledstatus3);
  // delay(50);
  while (millis() < TiempoAhora + 50)
  {
  }
  TiempoAhora = millis();
  chequear(t4, val4, compre4, &ledstatus4);
  // delay(50);
  while (millis() < TiempoAhora + 50)
  {
  }
  TiempoAhora = millis();
  chequear(t5, val5, compre5, &ledstatus5);
  // delay(50);
  while (millis() < TiempoAhora + 50)
  {
  }
  // TiempoAhora = millis();
  // Serial.println(" ");
  // delay(50);*/

  if ((t0 > val0) || (t1 > val1) || (t2 > val2) || (t3 > val3) || (t4 > val4) || (t5 > val5))
  {
    digitalWrite(bombaperif, LOW);
  }
  else
  {
    digitalWrite(bombaperif, HIGH);
  }
}

void valoreslcd(void)
{

  //-------------visualizacion en lcd--------------
  TiempoAhora = millis();
  lcd.setCursor(0, 0);
  lcd.print("TEMP.F1:");
  lcd.print(temp0);
  lcd.write(1);
  lcd.print("C ");
  // delay(50);
  lcd.setCursor(0, 1);
  lcd.print("TEMP.F2:");
  lcd.print(temp1);
  lcd.write(1);
  lcd.print("C ");
  // delay(3000);
  while (millis() < TiempoAhora + 3000)
  {
  }
  TiempoAhora = millis();
  lcd.setCursor(0, 0);
  lcd.print("TEMP.F3:");
  lcd.print(temp2);
  lcd.write(1);
  lcd.print("C ");
  lcd.setCursor(0, 1);
  lcd.print("TEMP.F4:");
  lcd.print(temp3);
  lcd.write(1);
  lcd.print("C ");
  // delay(3000);
  while (millis() < TiempoAhora + 3000)
  {
  }
  TiempoAhora = millis();
  lcd.setCursor(0, 0);
  lcd.print("TEMP.F5:");
  lcd.print(temp4);
  lcd.write(1);
  lcd.print("C ");
  lcd.setCursor(0, 1);
  lcd.print("TEMP.F6:");
  lcd.print(temp5);
  lcd.write(1);
  lcd.print("C ");
  // delay(3000);
  while (millis() < TiempoAhora + 3000)
  {
  }
}
// Función Nº4 -------------------------------------------------------------
void valoresserie(void)
{
  TiempoAhora = millis();
  Serial.print(val0);
  Serial.print("; ");
  Serial.print(val1);
  Serial.print("; ");
  Serial.print(val2);
  Serial.print("; ");
  Serial.print(val3);
  Serial.print("; ");
  Serial.print(val4);
  Serial.print("; ");
  Serial.print(val5);
  Serial.print("; ");
  // delay(300);
  while (millis() < TiempoAhora + 500)
  {
  }
}

// Función Nº6 -------------------------------------------------------------
void recibedatos(int op, int f)
{

  switch (op)
  {
  case 1:
  {
    TiempoAhora = millis();
    val0 = 0;
    val0 = f;
    while (millis() < TiempoAhora + 50)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 0);
    lcd.print("   LIMITE         ");
    lcd.setCursor(0, 1);
    lcd.print("   MODIFICADO    ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 1);
    lcd.print("L.F1 < ");
    lcd.print(val0);
    lcd.write(1);
    lcd.print("C      ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    break;
  }
  case 2:
  {
    TiempoAhora = millis();
    val1 = 0;
    val1 = f;
    while (millis() < TiempoAhora + 50)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 0);
    lcd.print("   LIMITE         ");
    lcd.setCursor(0, 1);
    lcd.print("   MODIFICADO    ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 1);
    lcd.print("L.F2 < ");
    lcd.print(val1);
    lcd.write(1);
    lcd.print("C      ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    break;
  }

  case 3:
  {
    TiempoAhora = millis();
    val2 = 0;
    val2 = f;
    while (millis() < TiempoAhora + 50)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 0);
    lcd.print("   LIMITE         ");
    lcd.setCursor(0, 1);
    lcd.print("   MODIFICADO    ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 1);
    lcd.print("L.F3 < ");
    lcd.print(val2);
    lcd.write(1);
    lcd.print("C      ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    break;
  }
  case 4:
  {
    TiempoAhora = millis();
    val3 = 0;
    val3 = f;
    while (millis() < TiempoAhora + 50)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 0);
    lcd.print("   LIMITE         ");
    lcd.setCursor(0, 1);
    lcd.print("   MODIFICADO    ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 1);
    lcd.print("L.F4 < ");
    lcd.print(val3);
    lcd.write(1);
    lcd.print("C      ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    // valoreslcd();
    break;
  }
  case 5:
  {
    TiempoAhora = millis();
    val4 = 0;
    val4 = f;
    while (millis() < TiempoAhora + 50)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 0);
    lcd.print("   LIMITE         ");
    lcd.setCursor(0, 1);
    lcd.print("   MODIFICADO    ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 1);
    lcd.print("L.F5 < ");
    lcd.print(val4);
    lcd.write(1);
    lcd.print("C      ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    // valoreslcd();
    break;
  }
  case 6:
  {
    TiempoAhora = millis();
    val5 = 0;
    val5 = f;
    while (millis() < TiempoAhora + 50)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 0);
    lcd.print("   LIMITE         ");
    lcd.setCursor(0, 1);
    lcd.print("   MODIFICADO    ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    TiempoAhora = millis();
    lcd.setCursor(0, 1);
    lcd.print("L.F6 < ");
    lcd.print(val5);
    lcd.write(1);
    lcd.print("C      ");
    while (millis() < TiempoAhora + 1000)
    {
    }
    // valoreslcd();
    break;
  }
    /*default :{
               //Serial.print("ERROR");
               //delay (50);
             }*/
  }
}
