using System;
using System.Collections.Generic;

namespace Tiler.Model
{
    public static class TileSetDefExtension
	{
        public static void Calculate(this TileSetDef tileSetDef, short tileWidth, short tileHeight, string name)
        {
            short tiledSetBitmapWidth = 256;
            short tiledSetColumns = (short)(tiledSetBitmapWidth / tileWidth);
            short tiledSetBitmapHeight = (short)(Math.Ceiling((double)tileSetDef.Tiles.Count / tiledSetColumns) * tileHeight);
            if (tiledSetBitmapHeight == 0)
            {
                tiledSetBitmapHeight = tileHeight;
            }
            short targetX = 0;
            short targetY = 0;
            short tileCount = 0;
            foreach (TileDef tile in tileSetDef.Tiles)
            {
                targetX += tileWidth;
                if (targetX >= tiledSetBitmapWidth)
                {
                    targetX = 0;
                    targetY += tileHeight;
                }
                tile.Index = tileCount;
                tileCount++;
            }
        }
    }
}
