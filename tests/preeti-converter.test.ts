import {describe,expect,it} from 'vitest';
import {preetiToUnicode,unicodeToPreeti} from '../lib/preeti-converter';

describe('Preeti converter',()=>{
 it('converts common Preeti ASCII sequences to Unicode',()=>{expect(preetiToUnicode('/fd')).toBe('राम');expect(preetiToUnicode('q')).toBe('त्र')});
 it('provides a reverse key-map preview for common Unicode characters',()=>{expect(unicodeToPreeti('राम')).toBe('/fd')});
});
