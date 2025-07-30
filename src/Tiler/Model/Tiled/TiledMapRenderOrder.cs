namespace Tiler.Model.Tiled
{
    using System.Xml.Serialization;

    public enum TiledMapRenderOrder
    {
        [XmlEnum("right-up")]
        RightUp,
        [XmlEnum("right-down")]
        RightDown
    }

}
