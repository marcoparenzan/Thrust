using System;
using System.Drawing;
using System.Linq;

namespace Tiler.Model
{
    public class MapDef
    {
        public string Name
        {
            get;
            set;
        }

        public TileDef[] Tiles
        {
            get;
            set;
        }

        public short Width
        {
            get;
            set;
        }

        public short Height
        {
            get;
            set;
        }

        public short TileWidth
        {
            get;
            set;
        }

        public short TileHeight
        {
            get;
            set;
        }

        public static MapDef Parse(Bitmap bitmap, TileSetDef tileSetDef, string name, short? width = null, short? height = null)
        {
            var tileMap = new MapDef
            {
                Name = name,
                TileHeight = tileSetDef.TileHeight,
                TileWidth = tileSetDef.TileWidth,
                Width = width ?? ((short)(bitmap.Width / tileSetDef.TileWidth)),
                Height = height ?? ((short)(bitmap.Height / tileSetDef.TileHeight))
            };
            tileMap.Tiles = new TileDef[tileMap.Height * tileMap.Width];
            var t = 0;
            for (short y = 0; y < tileMap.Height; y++)
            {
                short y2 = (short)(y * tileSetDef.TileHeight);
                for (short x = 0; x < tileMap.Width; x++)
                {
                    short x2 = (short)(x * tileSetDef.TileWidth);
                    TileDef tile = new TileDef();
                    tile.X = x2;
                    tile.Y = y2;
                    tile.Bitmap = bitmap;

                    var bytes = new byte[4 * tileSetDef.TileWidth * tileSetDef.TileHeight];
                    int i = 0;
                    for (int yy = 0; yy < tileSetDef.TileHeight; yy++)
                    {
                        for (int xx = 0; xx < tileSetDef.TileWidth; xx++)
                        {
                            int y3 = y2 + yy;
                            int x3 = x2 + xx;
                            var pixel = bitmap.GetPixel(x3, y3);
                            bytes[i++] = pixel.R;
                            bytes[i++] = pixel.B;
                            bytes[i++] = pixel.G;
                            bytes[i++] = pixel.A;
                        }
                    }
                    tile.Key = Convert.ToBase64String(bytes);
                    var existingTile = tileSetDef.Tiles.SingleOrDefault(xx => xx.Key == tile.Key);
                    if (existingTile != null)
                    {
                        tileMap.Tiles[t++] = existingTile;
                    }
                    else
                    {
                        tileMap.Tiles[t++] = tile;
                        tileSetDef.Tiles.Add(tile);
                    }
                }
            }
            return tileMap;
        }
    }
}