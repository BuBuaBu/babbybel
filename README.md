# Babbybel

[![Greenkeeper badge](https://badges.greenkeeper.io/BuBuaBu/babbybel.svg)](https://greenkeeper.io/) [![Quality Gate](https://sonarqube.com/api/badges/gate?key=bubuabu:babbybel)](https://sonarqube.com/dashboard/index/bubuabu:babbybel)

Runtime transpiler for harmony modules support

## Why
* Add support of harmony modules in node 6
* Kept source line numbers
* Kept symbol names
* Lighter than babel

## Usage

### Install
```Shell
npm install --save babbybel
```

### Within application
Before any use of a source file with import/export
```
require('babbybel')
```

### With Mocha
Add to your mocha command line:
```
--compilers js:babbybel
```

## Supported syntax
* default import
```
import theDefault from 'my-module'
```

* wildcard import
```
import * as allTheStuff from 'my-module'
```

* sparse import
```
import {feature1, faeture2 as feature2} from 'my-module'
```

* mix of import default with feature
```
import defaultExport, {export1, export2}
```
```
import {export1, export2}, defaultExport
```

* default export
```
export default function myDefault = () => 'some thing'
```

* export
```
export const myDefault = () => 'some thing'
```

## Not yet supported syntax
* multi line import / export
