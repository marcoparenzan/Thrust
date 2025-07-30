namespace Tiler.Model
{
    // Tiler.Tile
    using System.Drawing;

    public class TileDef
    {
        public short X
        {
            get;
            set;
        }

        public short Y
        {
            get;
            set;
        }

        public Bitmap Bitmap
        {
            get;
            set;
        }

        public string Key
        {
            get;
            set;
        }

        public short? Index
        {
            get;
            set;
        }
    }
}
