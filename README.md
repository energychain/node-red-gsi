# node-red-contrib-gsi
GSI (GrünstromIndex) Node for Node-Red.

## Installation
```
cd ~/.node-red
npm install --save node-red-contrib-gsi
```

In der ~/.node-red/settings.js den folgenden Eintrag
```
contextStorage: {
     default: {
         module:"localfilesystem"
     },
 },
```

## Über den GrünstromIndex
Die Technologie hinter dem GrünstromIndex beinhaltet unterschiedlichste Datenquellen, darunter lokale Wetterdaten, der Transport und die Nutzung des Stroms, woraus sich ein entsprechender Preisindex ergibt. Dieser ist die Grundlage für einen variablen Stromtarif, welcher seit dem Jahr 2010 von jedem Stromanbieter obligatorisch angeboten werden muss.

Zusammen mit dem GrünstromIndex wurde das aktive Demand Side Management und damit einbegriffen ein moderner Preisindikator eingeführt. Somit erhalten Verbraucher jederzeit eine professionelle und aktuelle Berechnungsgrundlage, die jederzeit die lokalen und regionalen Gegebenheiten mit einbezieht. Der lokale Strommarkt lässt sich dank dieser Technologie schnell, sicher und zuverlässig anzeigen. Die nachhaltige und ökologische Integration in den Markt, auch bezeichnet als Smart Grid, impliziert ebenfalls, dass verfügbare Übertragungswege gut und gezielt entlastet werden können, da sich auf die Stromerzeugung durch Sonne und Wind konzentriert wird.

## Anleitungs Videos
 - [Grundlagen GSI in Node-Red](https://www.youtube.com/watch?v=ykl3ZhIV4bY)
 - [GrünstromIndex mittels OBIS Kennzahlen Decorator](https://www.youtube.com/watch?v=4INQQXPvWBM)
 - [Discovergy Zählerwerte angereichert mit virutellem Zähler des GSI](https://www.youtube.com/watch?v=-nx7DnPlp8A)

## Unter Module
### MQTT

### KEBA P30 Wallbox
Erlaubt die Nutzung von Preissignalen des GrünstromIndex in Verbindung mit der Ladesteuerrung. Die Node-Red Integration besteht aus zwei Komponenten
 - Decorator 'keba p30 meter'
 - Steuerrung 'keba p30 control'

### VARTA Engion Storage

### Discovergy

## Further Reading (German)
 - https://www.corrently.de/
 - https://www.corrently.de/hintergrund/gruenstromindex/index.html
