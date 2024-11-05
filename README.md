# IonicQrCodeLector

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

```sh
npx cap sync
```

- abrir
  
```sh
npx cap open android
```

## QrCode

- Scanner
  
```sh
npm install @capacitor-mlkit/barcode-scanning
```

- Generador
  
```sh
npm install angularx-qrcode --save
```

## Jsonserver

```sh
npm install -g json-server
```

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

```sh
json-server --watch db.json
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
