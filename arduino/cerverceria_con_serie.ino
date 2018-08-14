#include <Wire.h>  
#include <OneWire.h>                
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>

//#define DEBUG(a) Serial.println(a);

#define I2C_ADDR    0x27

LiquidCrystal_I2C             lcd(I2C_ADDR,2, 1, 0, 4, 5, 6, 7);

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
 0b00000000
 };
 
 
 int compre0=7;
 int compre1=8;
 int compre2=9;
 int compre3=10;
 
byte ledstatus0 = LOW;
byte ledstatus1 = LOW;
byte ledstatus2 = LOW;
byte ledstatus3 = LOW;
byte reinicio = LOW;

float val0=23.0;
float val1=24.0;
float val2=25.0;
float val3=26.0;

String str = "";
const char separator = 'X';
const int dataLength = 3;
int data[dataLength];

int ferment=0; 
float datotemp=0;





OneWire ourWire(2);                //Se establece el pin 2  como bus OneWire
 
DallasTemperature sensors(&ourWire); //Se declara una variable u objeto para nuestro sensor

DeviceAddress address1 = {0x28, 0x24, 0x0A, 0x28, 0x00, 0x00, 0x80, 0x29};//dirección del sensor 1
DeviceAddress address2 = {0x28, 0x5E, 0x19, 0x28, 0x00, 0x00, 0x80, 0x4C};//dirección del sensor 2
//DeviceAddress address3 = {0x28, 0xFF, 0x23, 0x19, 0x1, 0x16, 0x4, 0xD9};//dirección del sensor 3

//declaro funciones
void leer(void);
void chequear(float tem,float valor, float compre, byte *led);
void valoresserie(void);
void valoreslcd(void);
void recibedatos(int op,float f);

 



// 3-DESARROLLO DE FUNCIONES ***************************************************
// Función Nº1 ------------------------------------------------------------- 
void leer(void){ 
       
 sensors.requestTemperatures();   //envía el comando para obtener las temperaturas
float temp0= sensors.getTempC(address1);//Se obtiene la temperatura en °C del sensor 1
float temp1= sensors.getTempC(address2);//Se obtiene la temperatura en °C del sensor 2
//float temp2= sensors.getTempC(address3);//Se obtiene la temperatura en °C del sensor 3*/
//float temp3= sensors.getTempC(address3);//Se obtiene la temperatura en °C del sensor 3*/
float temp2=0.0;
float temp3=0.0;
//Serial.print(" ");     
Serial.print(temp0);
Serial.print("; ");
//delay(300);
Serial.print(temp1);
Serial.print("; ");
//delay(300);
Serial.print(temp2);
Serial.print("; ");
//delay(300);
Serial.print(temp3);
Serial.print("; ");
delay(300);

lcd.setCursor(0,0);
lcd.print("TEMP.F1:");
lcd.print(temp0);
lcd.write(1); 
lcd.print("C ");
delay(50);


lcd.setCursor(0,1);
lcd.print("TEMP.F2:");
lcd.print(temp1);
lcd.write(1); 
lcd.print("C ");
delay(50); 

/*
lcd.setCursor(0,0);
lcd.print("TEMP.F3:");
lcd.print(temp2);
lcd.write(1); 
lcd.print("C ");
//delay(1000); 

lcd.setCursor(0,1);
lcd.print("TEMP.F4:");
lcd.print(temp3);
lcd.write(1); 
lcd.print("C ");
delay(1000); 
*/

chequear(temp0,val0,compre0,&ledstatus0);
delay(50);
chequear(temp1,val1,compre1,&ledstatus1);
delay(50);
chequear(temp0,val2,compre2,&ledstatus2);// OJOTA AK!!! CAMBIAR x temp2
delay(50);
chequear(temp1,val3,compre3,&ledstatus3);// OJOTA AK!!! CAMBIAR x temp3
delay(50);
 Serial.println(" ");    
 delay(50);                  
  }
// Función Nº2 ------------------------------------------------------------- 
void chequear(float tem,float valor, float compre, byte *led){ 
           
        if (tem>valor)
            {
             digitalWrite(compre, HIGH);      
             *led = HIGH;
               }       
                  else if(tem<(valor-1.5))
                   {                    
                    digitalWrite(compre, LOW);
                    *led = LOW; 
                       }
                     
                         Serial.print(*led);
                         Serial.print("; ");
                         delay(50);    
                        
  }
// Función Nº3 ------------------------------------------------------------- 
void valoresserie(void)
{
  
Serial.print(val0);
Serial.print("; ");
//delay(500);
Serial.print(val1);
Serial.print("; ");
//delay(500);
Serial.print(val2);
Serial.print("; ");
//delay(500);
Serial.print(val3);
Serial.print("; ");
//delay(500);
//Serial.println(" ");
delay(300);
}

// Función Nº4 ------------------------------------------------------------- 
void valoreslcd(void)
{
lcd.setCursor(0,0);
lcd.print("L.F1 < ");
lcd.print(val0);
lcd.write(1); 
lcd.print("C ");
//delay(1000);

lcd.setCursor(0,1);
lcd.print("L.F2 < ");
lcd.print(val1);
lcd.write(1); 
lcd.print("C ");
delay (500);  

lcd.setCursor(0,0);
lcd.print("L.F3 < ");
lcd.print(val2);
lcd.write(1); 
lcd.print("C ");
//delay(1000);

lcd.setCursor(0,1);
lcd.print("L.F4 < ");
lcd.print(val3);
lcd.write(1); 
lcd.print("C ");
delay(500);

  }
// Función Nº5 ------------------------------------------------------------- 
void recibedatos(int op,float f)
{

switch(op)
   {
    case 1:{
                //Serial.print("LF1 > "); 
                val0=f;
                //Serial.println(val0); 
                delay (50);
                lcd.setCursor(0,0);
                lcd.print("   LIMITES         ");
                lcd.setCursor(0,1);
                lcd.print("   MODIFICADOS    ");
                delay(500);
                //valoreslcd();
                break;  
              }
    case 2:{
                //Serial.print("LF2 > "); 
                val1=f;
                //Serial.println(val1); 
                delay (50);
                lcd.setCursor(0,0);
                lcd.print("   LIMITES         ");
                lcd.setCursor(0,1);
                lcd.print("   MODIFICADOS    ");
                delay(500);
                //valoreslcd();
                break;  
              }
    
    case 3:{
               //Serial.print("LF3 > ");
                val2=f;
                //Serial.println(val2); 
                delay (50);
                lcd.setCursor(0,0);
                lcd.print("   LIMITES         ");
                lcd.setCursor(0,1);
                lcd.print("   MODIFICADOS    ");
                delay(500);
                //valoreslcd();
                break;
              }
    case 4:{    
                //Serial.print("LF4 > ");  
                val3=f;
                //Serial.println(val3); 
                delay (50);
                lcd.setCursor(0,0);
                lcd.print("   LIMITES         ");
                lcd.setCursor(0,1);
                lcd.print("   MODIFICADOS    ");
                delay(500);
                //valoreslcd();
                break;
                }
                
     /*default :{
                //Serial.print("ERROR"); 
                //delay (50);
              }*/
   }
 
}




void setup() {
//delay(100);
Serial.begin(9600);
sensors.begin();   //Se inicia el sensor
sensors.setResolution(address1, 9); // resolución de 9-12 bits
sensors.setResolution(address2, 9); // resolución de 9-12 bits
lcd.setBacklightPin(3,POSITIVE);
lcd.setBacklight(HIGH);
lcd.begin(16,2);   // initialize the lcd for 16 chars 2 lines, turn on backlight
lcd.createChar(1, grado);//caracter especial "º"
lcd.backlight(); //  backlight on */ 

pinMode(compre0, OUTPUT);
pinMode(compre1, OUTPUT);
pinMode(compre2, OUTPUT);
pinMode(compre3, OUTPUT);

reinicio = HIGH; 
Serial.println(" ");
//Serial.print(reinicio);
//Serial.print("; ");
delay(50);
//Serial.println(" ");
lcd.setCursor(0,0);
lcd.print("REINICIANDO...");
delay(500);
//valoreslcd();
//delay(100);

  

}
 
void loop() 
{
 
 Serial.print(reinicio);
 Serial.print("; ");
 reinicio = LOW; 
 valoresserie();
  leer();
  
   if (Serial.available())
   {
      
     str = Serial.readStringUntil('E');
     if(str.startsWith("S",0))
     {
       //Serial.print("DATO CORRECTO");
      //delay(500); 
     
      for (int i = 0; i < dataLength ; i++)
        {
         int index = str.indexOf(separator);
         
         data[i] = str.substring(1, index).toInt();
         ferment= data[0];         
         //Serial.println(data[i]);
         //delay(1000);                 
         str = str.substring(index + 1);        
         datotemp= data[1];
         //Serial.println(data[i]);
         //delay(1000);
        }
     //DEBUG_ARRAY(data);
        recibedatos(ferment,datotemp);
        /* Serial.println(ferment);
         delay(1000);
         Serial.println(datotemp);
         delay(1000);*/
         
     } 
   valoreslcd();
   delay(500);  
   }

}

