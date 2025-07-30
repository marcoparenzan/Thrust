using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using Tiler.Model.Tiled;

namespace Tiler.Model
{
    public class TileSetDef
    {
        public string Name
        {
            get;
            set;
        }

        public List<TileDef> Tiles
        {
            get;
            set;
        } = new List<TileDef>();

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

        public static TileSetDef Parse(Bitmap bitmap, string name, short tileWidth, short tileHeight)
        {
            var tileSetDef = new TileSetDef
            {
                Name = name,
                TileHeight = tileHeight,
                TileWidth = tileWidth,
            };

            var hh = bitmap.Height / tileHeight;
            var ww = bitmap.Width / tileWidth;

            short index = 0;
            for (short y = 0; y < hh; y++)
            {
                short y2 = (short)(y * tileSetDef.TileHeight);
                for (short x = 0; x < ww; x++)
                {
                    short x2 = (short)(x * tileSetDef.TileWidth);

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
                    var key = Convert.ToBase64String(bytes);
                    var existingTile = tileSetDef.Tiles.SingleOrDefault(xx => xx.Key == key);
                    if (existingTile == null)
                    {
                        tileSetDef.Tiles.Add(new TileDef
                        {
                            X = x2,
                            Y = y2,
                            Bitmap = bitmap,
                            Index = index,
                            Key = key
                        });
                    }
                    else
                    {
                        
                    }

                    index++;
                }
            }
            return tileSetDef;
        }
    }
}