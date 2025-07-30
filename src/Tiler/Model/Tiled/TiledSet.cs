namespace Tiler.Model.Tiled
{
using System.IO;
    using System.Xml.Serialization;

    [XmlRoot("tileset")]
    public class TiledSet
    {
        public static TiledSet Parse(Stream stream)
        {
            var serializer = new XmlSerializer(typeof(TiledSet));
            var target = (TiledSet)serializer.Deserialize(stream);
            return target;
        }

        [XmlAttribute("name")]
        public string Name
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

        [XmlAttribute("tilecount")]
        public short TileCount
        {
            get;
            set;
        }

        [XmlAttribute("columns")]
        public short Columns
        {
            get;
            set;
        }

        [XmlElement("image")]
        public TiledSetImage Image
        {
            get;
            set;
        }
    }

}
