using System.Diagnostics;

namespace MapsLib;

[DebuggerDisplay("{Type}")]
public struct MapTile
{
    public static implicit operator MapTile(byte type) => new MapTile { Type = type };
    public byte Type { get; set; }
}
