# IonicQrCodeLector

El codigo debe de separar las secciones del profe y si inicia el qr de una seccion no debe de poder quedar presente el alumno de otra seccion

actualmente estoy usando mi dominio en algunas partes las que deberán ser cambiadas por la ip de la maquina en la que se ejecute el servidor json

## Índice

- [IonicQrCodeLector](#ionicqrcodelector)
  - [Índice](#índice)
  - [Instalación de dependencias](#instalación-de-dependencias)
  - [Iniciar el proyecto](#iniciar-el-proyecto)
  - [Android](#android)
  - [QrCode](#qrcode)
  - [Jsonserver](#jsonserver)
  - [Geolocalización](#geolocalización)
  - [Pruebas](#pruebas)

## Instalación de dependencias

```sh
npm install
```

## Iniciar el proyecto

```sh
npm install -g @ionic/cli  
```

```sh
cmd
```

```sh
ionic
```

```sh
ionic start <Nombre> blank     
# Cambiar por el nombre del proyecto
```

Seleccionar: Angular , NgModules
debe de estar librerías con capacitor

```sh
ionic serve   # inicia el proyecto
```

```sh
ionic generate  # Sirve para crear componentes
```

```sh
ionic generate page nombrePagina
```

```sh
ionic g page nombrePagina
```

```sh
npm install @ionic/storage
```

## Android

[Instalar Android Studio](https://developer.android.com/studio?hl=es-419)

- instalar android
  
```sh
npm install @capacitor/android
```

- build
  
```sh
ionic build
```

```xml
 <!-- Permissions -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.INTERNET" />
```

- agregar android

```sh
npx cap add android
```

- sincronizar

usar para sincronizar los cambios realizados en el proyecto, de preferencia usar con el projecto apagado

```sh
npx cap sync
```

- abrir
  
```sh
npx cap open android
```

## QrCode

[Video de YouTube sobre QrCode](https://www.youtube.com/watch?v=dhTLpXuYGOI)

- Scanner
  
para poder usar el scaner debe de poner el archivo <a name="BarcodeScanningModalComponent">BarcodeScanningModalComponent </a>
 en la carpeta de la app que lo requiera e importarlo en el archivo que se vaya a usar

```sh
npm install @capacitor-mlkit/barcode-scanning
```

```js
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
```

- Generador
  
```sh
npm install angularx-qrcode --save
```

## Jsonserver

```sh
npm install -g json-server
```
  
```sh
md jsonServer
cd jsonServer
New-Item db.json
# touch db.json # en linux o mac
```

Ejemplo de db.json

```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Producto 1",
      "precio": 100
    },
    {
      "id": 2,
      "nombre": "Producto 2",
      "precio": 200
    },
    {
      "id": 3,
      "nombre": "Producto 3",
      "precio": 300
    }
  ]
}
```

```sh
json-server db.json
```

>[!TIP]
>Puedes ejecutar el servidor JSON en una dirección IP específica y un puerto diferente usando el siguiente comando

```sh
json-server db.json --host 0.0.0.0 --port 3000

```

- Servicio

```sh
ng generate service services/nombreServicio


```

## Geolocalización

(Opcional)

```sh
npm install @ionic-native/geolocation
```

```sh
npm install @ionic-native/core
```

```sh
npm install @ionic-native/google-maps
```

## Pruebas 

```sh
ng test
```
