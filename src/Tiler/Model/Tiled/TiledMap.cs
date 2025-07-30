using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml.Serialization;

namespace Tiler.Model.Tiled
{
    [XmlRoot("map")]
    public class TiledMap
    {
        public static TiledMap Parse(Stream stream)
        {
            var serializer = new XmlSerializer(typeof(TiledMap));
            var target = (TiledMap)serializer.Deserialize(stream);
            return target;
        }

        [XmlAttribute("version")]
        public string Version
        {
            get;
            set;
        } = "1.0";


        [XmlAttribute("tiledversion")]
        public string TiledVersion
        {
            get;
            set;
        } = "1.0.1";


        [XmlAttribute("orientation")]
        public TiledMapOrientation Orientation
        {
            get;
            set;
        } = TiledMapOrientation.Orthogonal;


        [XmlAttribute("renderorder")]
        public TiledMapRenderOrder RenderOrder
        {
            get;
            set;
        } = TiledMapRenderOrder.RightDown;


        [XmlAttribute("width")]
        public short Width
        {
            get;
            set;
        }

        [XmlAttribute("height")]
        public short Height
        {
            get;
            set;
        }

        [XmlAttribute("tilewidth")]
        public short TileWidth
        {
            get;
            set;
        }

        [XmlAttribute("tileheight")]
        public short TileHeight
        {
            get;
            set;
        }

        [XmlAttribute("nextobjectid")]
        public short NextObjectId
        {
            get;
            set;
        } = 1;


        [XmlElement("tileset")]
        public TiledSetReference TileSet
        {
            get;
            set;
        }

        [XmlElement("layer")]
        public TiledMapLayer[] Layers
        {
            get;
            set;
        }
    }
}
