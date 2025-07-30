using System.Collections.Generic;
using System.Drawing;
using System.IO;
using Tiler;
using Tiler.Model;
using Tiler.Model.Tiled;

var folderName = @"D:\MarcoSoft\MapExperiments\Assets\Thrust\Levels";
var name = "Level06";
var bitmap = (Bitmap)Image.FromFile(Path.Combine(folderName, $"{name}.png"));

//var tiledSetName = Path.Combine(folderName, $"{name}.tsx");
//var tiledSet = TiledSet.Parse(File.OpenRead(tiledSetName));
//var tileSetBitmapName = Path.Combine(Path.GetDirectoryName(tiledSetName), tiledSet.Image.Source);
//var tileSetBitmapBytes = File.ReadAllBytes(tileSetBitmapName);
//var tileSetBitmapStream = new MemoryStream(tileSetBitmapBytes);
//var tileSetBitmap = (Bitmap)Bitmap.FromStream(tileSetBitmapStream);

//var tileSetDefs = TileSetDef.Parse(tileSetBitmap, "name", tiledSet.TileWidth, tiledSet.TileHeight);

var tileSetDefs = new TileSetDef
{
    Name = name,
    TileWidth = 8,
    TileHeight = 8
};

var tileMaps = new List<MapDef>();

//foreach (var (i, bitmap1) in bitmap.Images2())
//{
//    var tileMap = MapDef.Parse(bitmap1, tileSetDefs, $"Level{i:0000}" , height: 28);
//    tileMaps.Add(tileMap);
//}

var i = 6;
var tileMap = MapDef.Parse(bitmap, tileSetDefs, $"Level{i:0000}");
tileMaps.Add(tileMap);


var tiledSet = tileSetDefs.ExportToFolder(folderName);

tileMaps.ExportToFolder(tiledSet, folderName);
