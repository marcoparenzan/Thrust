using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tiler
{
    public static class BitmapExtension
    {
        public static IEnumerable<(int, Bitmap)> Images(this Bitmap bitmap)
        {
            var w = 256; // bitmap.Width;
            var h = 192; // bitmap.Height;

            short i = 1;
            for (var y = 0; y < 10; y++)
            {
                var y1 = 16 + y * 213 + 3; // 0;
                for (var x = 0; x < 15; x++)
                {
                    var x1 = 16 + x * 277 + 3; // 0;

                    var bitmap1 = (Bitmap)new Bitmap(w, h, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
                    var gb1 = Graphics.FromImage(bitmap1);
                    gb1.InterpolationMode = InterpolationMode.NearestNeighbor;
                    gb1.DrawImage(bitmap, new Rectangle(new Point(0, 0), bitmap1.Size), new Rectangle(x1, y1, w, h), GraphicsUnit.Pixel);

                    yield return (i, bitmap1);

                    i++;
                }
            }
        }

        public static IEnumerable<(int, Bitmap)> Images2(this Bitmap bitmap)
        {
            var w = 320; // bitmap.Width;
            var h = 230; // bitmap.Height;

            short i = 1;
            for (var y = 0; y < 20; y++)
            {
                var y1 = 0 + y * h;
                for (var x = 0; x < 10; x++)
                {
                    var x1 = 3200 + x * w;

                    var bitmap1 = (Bitmap)new Bitmap(w, h, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
                    var gb1 = Graphics.FromImage(bitmap1);
                    gb1.InterpolationMode = InterpolationMode.NearestNeighbor;
                    gb1.DrawImage(bitmap, new Rectangle(new Point(0, 0), bitmap1.Size), new Rectangle(x1, y1, w, h), GraphicsUnit.Pixel);

                    yield return (y*100+x, bitmap1);

                    i++;
                }
            }
        }
    }
}
