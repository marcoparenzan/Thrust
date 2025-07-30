using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Tiler.Model.Tiled
{
    public static class TileSetExtension
    {
        public static TiledSet ExportToFolder(this TileSetDef tileSetDef, string folderName)
        {
            if (!Directory.Exists(folderName))
            {
                Directory.CreateDirectory(folderName);
            }
            var tiledSetBitmapName = $"{tileSetDef.Name}-tiledset.png";
            var tiledSetBitmapPathName = Path.Combine(folderName, tiledSetBitmapName);
            var tiledSetFileName = $"{tileSetDef.Name}.tsx";
            var tiledSetPathName = Path.Combine(folderName, tiledSetFileName);
            try
            {
                short tiledSetBitmapWidth = 256;
                short tiledSetColumns = (short) (tiledSetBitmapWidth / tileSetDef.TileWidth);
                short tiledSetBitmapHeight = (short)(Math.Ceiling((double)tileSetDef.Tiles.Count / tiledSetColumns) * tileSetDef.TileHeight);
                if (tiledSetBitmapHeight == 0)
                {
                    tiledSetBitmapHeight = tileSetDef.TileHeight;
                }
                Bitmap tiledSetBitmap = new Bitmap(tiledSetBitmapWidth, tiledSetBitmapHeight, PixelFormat.Format32bppArgb);
                Graphics tiledSetGraphics = Graphics.FromImage(tiledSetBitmap);
                short targetX = 0;
                short targetY = 0;

                // HERE WE CAN SEPARATE INDEXED AND NOT INDEXED
                short tileCount = 0;
                foreach (TileDef tile in tileSetDef.Tiles)
                {
                    tiledSetGraphics.DrawImage(tile.Bitmap, targetX, targetY, new Rectangle(tile.X, tile.Y, tileSetDef.TileWidth, tileSetDef.TileHeight), GraphicsUnit.Pixel);
                    targetX += tileSetDef.TileWidth;
                    if (targetX >= tiledSetBitmap.Width)
                    {
                        targetX = 0;
                        targetY += tileSetDef.TileHeight;
                    }
                    tile.Index = tileCount;
                    tileCount++;
                }
                tiledSetBitmap.Save(tiledSetBitmapPathName);

                TiledSet tiledSet = new TiledSet
                {
                    Name = tileSetDef.Name,
                    TileWidth = tileSetDef.TileWidth,
                    TileHeight = tileSetDef.TileHeight,
                    TileCount = tileCount,
                    Columns = tiledSetColumns,
                    Image = new TiledSetImage
                    {
                        Width = tiledSetBitmapWidth,
                        Height = tiledSetBitmapHeight,
                        Source = tiledSetBitmapName
                    }
                };


                XmlSerializer tiledSetSerializer = new XmlSerializer(typeof(TiledSet));
                FileStream tiledSetStream = new FileStream(tiledSetPathName, FileMode.Create);
                tiledSetSerializer.Serialize(tiledSetStream, tiledSet);
                tiledSetStream.Close();

                return tiledSet;
            }
            catch (Exception)
            {
                if (File.Exists(tiledSetPathName))
                {
                    File.Delete(tiledSetPathName);
                }
                if (File.Exists(tiledSetBitmapPathName))
                {
                    File.Delete(tiledSetBitmapPathName);
                }
                return null;
            }
            finally
            {
            }
        }
    }
}
