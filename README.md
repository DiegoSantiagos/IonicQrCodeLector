# IonicQrCodeLector

actualmente estoy usando mi dominio en algunas partes las que deberán ser cambiadas por la ip de la maquina en la que se ejecute el servidor json

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

- instalar android
  
```sh
npm install @capacitor/android
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

- Scanner
  
para poder usar el scaner debe de poner el archivo barcode-scanning.js en la carpeta de la app que lo requiera e importarlo en el archivo que se vaya a usar

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
```s

```sh
json-server db.json

json-server db.json --host 0.0.0.0 --port 8000

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
