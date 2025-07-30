using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Xml.Serialization;

namespace Tiler.Model.Tiled
{
    public static class TiledMapExtension
    {
        public static void ExportToFolder(this IEnumerable<MapDef> tileMaps, TiledSet tiledSet, string folderName)
        {
            foreach (var tileMap in tileMaps)
            {
                tileMap.ExportToFolder(tiledSet, folderName);
            }
        }

        public static void ExportToFolder(this MapDef tileMap, TiledSet tiledSet, string folderName)
        {
            if (!Directory.Exists(folderName))
            {
                Directory.CreateDirectory(folderName);
            }
            var tiledMapFileName = $"{tileMap.Name}.tmx";
            var tiledMapPathName = Path.Combine(folderName, tiledMapFileName);
            try
            {
                var tiledMap = new TiledMap
                {
                    RenderOrder = TiledMapRenderOrder.RightDown,
                    Width = tileMap.Width,
                    Height = tileMap.Height,
                    TileWidth = tileMap.TileWidth,
                    TileHeight = tileMap.TileHeight,
                    TileSet = new TiledSetReference
                    {
                        Source = $"{tiledSet.Name}.tsx"
                    }
                };
                var layer = new TiledMapLayer();
                layer.Name = tileMap.Name;
                layer.Width = tileMap.Width;
                layer.Height = tileMap.Height;
                layer.Encoding = TiledMapLayerDataEncoding.CSV;
                
                layer.Tiles = tileMap.Tiles.Select(xx => xx.Index.Value).ToArray();

                tiledMap.Layers = new[] { layer };
                XmlSerializer tiledMapSerializer = new XmlSerializer(typeof(TiledMap));
                FileStream tiledMapStream = new FileStream(tiledMapPathName, FileMode.Create);
                tiledMapSerializer.Serialize(tiledMapStream, tiledMap);
                tiledMapStream.Close();
            }
            catch (Exception ex)
            {
                if (File.Exists(tiledMapPathName))
                {
                    File.Delete(tiledMapPathName);
                }
            }
            finally
            {
            }
        }
    }
}
