# IonicQrCodeLector

    npm install -g @ionic/cli  
<!--  -->
    cmd
<!--  -->
    ionic
<!--  -->
    ionic start <Nombre> blank     # Cambiar por el nombre del proyecto
<!--  -->
    Seleccionar: Angular , NgModules
<!--  -->
    debe de estar librerías con capacitor
<!--  -->
    ionic serve      # inicia el proyecto
<!--  -->
    ionic generate    # Sirve para crear componentes
<!--  -->
    ionic generate page nombrePagina
<!--  -->
    ionic g page nombrePagina
<!--  -->
    npm install @ionic/storage

## Android

- instalar android
  
        npm install @capacitor/android

- agregar android
  
        npx cap add android

- sincronizar
  
        npx cap sync

- abrir
  
        npx cap open android

## QrCode

- Scanner

        npm install @capacitor-mlkit/barcode-scanning

- Generador
  
        npm install angularx-qrcode --save

## Jsonserver

npm install -g json-server

### crear carpeta jsonserver

#### Crear archivo db.json

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

json-server --watch db.json

## Geolocalización

### (Opcional)

        npm install @ionic-native/geolocation
<!--  -->

        npm install @ionic-native/core
<!--  -->

        npm install @ionic-native/google-maps

