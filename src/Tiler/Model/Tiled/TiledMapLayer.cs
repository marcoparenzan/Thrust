namespace Tiler.Model.Tiled
{
    using System;
    using System.Linq;
    using System.Text;
    using System.Xml;
    using System.Xml.Schema;
    using System.Xml.Serialization;

    public class TiledMapLayer : IXmlSerializable
    {
        public string Name
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

        public TiledMapLayerDataEncoding Encoding
        {
            get;
            set;
        }

        public short[] Tiles
        {
            get;
            set;
        }

        XmlSchema IXmlSerializable.GetSchema()
        {
            throw new NotImplementedException();
        }

        void IXmlSerializable.ReadXml(XmlReader reader)
        {
            Name = reader.GetAttribute("name");
            Width = short.Parse(reader.GetAttribute("width"));
            Height = short.Parse(reader.GetAttribute("height"));
            reader.Read();
            reader.ReadStartElement("data");
            var data = reader.ReadContentAsString();
            Tiles = data.Split('\r', '\n', ',', ' ').Where(xx => !string.IsNullOrWhiteSpace(xx)).Select(xx => short.Parse(xx)).ToArray();
            reader.ReadEndElement();
            reader.ReadEndElement();
        }

        void IXmlSerializable.WriteXml(XmlWriter writer)
        {
            writer.WriteAttributeString("name", Name);
            writer.WriteAttributeString("width", Width.ToString());
            writer.WriteAttributeString("height", Height.ToString());
            writer.WriteStartElement("data");
            writer.WriteAttributeString("encoding", Encoding.ToString().ToLower());
            StringBuilder sb = new StringBuilder();
            int x = 0;
            for (int i = 0; i < Tiles.Length; i++)
            {
                sb.Append($"{Tiles[i] + 1:000},");
                if (++x == Width)
                {
                    x = 0;
                    sb.AppendLine();
                }
            }
            string data2 = sb.ToString().Trim();
            data2 = data2.Substring(0, data2.Length - 1);
            writer.WriteString(data2);
            writer.WriteEndElement();
        }
    }

    public enum TiledMapLayerDataEncoding
    {
        [XmlEnum("csv")]
        CSV
    }
}
