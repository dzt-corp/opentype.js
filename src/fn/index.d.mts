interface FontFileData {
  data: DataView;
  tableEntries: TableEntry[];
  outlinesFormat: string;
}

interface TableEntry {
  tag: string;
  checksum: number;
  offset: number;
  length: number;
  compression: boolean;
}

interface TableData {
  data: DataView;
  offset: number;
}

interface OS2Table {
  version: number;
  xAvgCharWidth: number;
  usWeightClass: number;
  usWidthClass: number;
  fsType: number;
  ySubscriptXSize: number;
  ySubscriptYSize: number;
  ySubscriptXOffset: number;
  ySubscriptYOffset: number;
  ySuperscriptXSize: number;
  ySuperscriptYSize: number;
  ySuperscriptXOffset: number;
  ySuperscriptYOffset: number;
  yStrikeoutSize: number;
  yStrikeoutPosition: number;
  sFamilyClass: number;
  panose: number[];
  ulUnicodeRange1: number;
  ulUnicodeRange2: number;
  ulUnicodeRange3: number;
  ulUnicodeRange4: number;
  achVendID: string;
  fsSelection: number;
  usFirstCharIndex: number;
  usLastCharIndex: number;
  sTypoAscender: number;
  sTypoDescender: number;
  sTypoLineGap: number;
  usWinAscent: number;
  usWinDescent: number;
  ulCodePageRange1?: number;
  ulCodePageRange2?: number;
  sxHeight?: number;
  sCapHeight?: number;
  usDefaultChar?: number;
  usBreakChar?: number;
  usMaxContent?: number;
}

type Platform =
  | 'unicode'
  | 'macintosh'
  | 'reserved'
  | 'windows'

interface NameTable {
  [key: Platform]: Record<string, Record<string, string>>
}

interface FvarAxis {
  tag: string;
  minValue: number;
  defaultValue: number;
  maxValue: number;
  axisNameID: number;
  name: Record<string, string>
}

interface FvarInstance {
  subfamilyNameID: number;
  name: Record<string, string>
  coordinates: Record<string, number>
  postScriptNameID: number;
  postScriptName: Record<string, string>
}

interface FvarTable {
  axes: FvarAxis[];
  instances: FvarInstance[];
}

export function uncompressTable(
  data: DataView,
  tableEntry: TableEntry
): TableData;

export function getFontFileData(buffer: ArrayBuffer): FontFileData;
export function parseOS2Table(data: DataView, offset: number): OS2Table;
export function parseLtagTable(data: DataView, offset: number): string[];
export function parseNameTable(data: DataView, offset: number, ltag: string[]): NameTable;
export function parseFvarTable(data: DataView, offset: number, names: NameTable): FvarTable;
