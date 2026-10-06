import assert from 'node:assert/strict';
import {pageBackgroundBounds} from '../Engine/page-background.js';

assert.deepEqual(pageBackgroundBounds(1440,720),{left:80,top:0,right:1360,bottom:720});
assert.deepEqual(pageBackgroundBounds(960,720),{left:0,top:90,right:960,bottom:630});
assert.deepEqual(pageBackgroundBounds(1280,720),{left:0,top:0,right:1280,bottom:720});
console.log('Page background: wide, tall and exact 16:9 bounds passed');

