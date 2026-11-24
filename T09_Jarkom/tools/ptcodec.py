"""Pure-Python Twofish + EAX + Packet Tracer (.pkt) codec (pka2xml scheme)."""
import struct
import zlib

M32 = 0xFFFFFFFF


def _mk_q(t):
    def ror4(x, n):
        return ((x >> n) | (x << (4 - n))) & 0xF
    out = []
    for x in range(256):
        a0, b0 = x >> 4, x & 15
        a1 = a0 ^ b0
        b1 = a0 ^ ror4(b0, 1) ^ ((8 * a0) & 15)
        a2, b2 = t[0][a1], t[1][b1]
        a3 = a2 ^ b2
        b3 = a2 ^ ror4(b2, 1) ^ ((8 * a2) & 15)
        a4, b4 = t[2][a3], t[3][b3]
        out.append((b4 << 4) | a4)
    return out


Q0 = _mk_q([[0x8, 0x1, 0x7, 0xD, 0x6, 0xF, 0x3, 0x2, 0x0, 0xB, 0x5, 0x9, 0xE, 0xC, 0xA, 0x4],
            [0xE, 0xC, 0xB, 0x8, 0x1, 0x2, 0x3, 0x5, 0xF, 0x4, 0xA, 0x6, 0x7, 0x0, 0x9, 0xD],
            [0xB, 0xA, 0x5, 0xE, 0x6, 0xD, 0x9, 0x0, 0xC, 0x8, 0xF, 0x3, 0x2, 0x4, 0x7, 0x1],
            [0xD, 0x7, 0xF, 0x4, 0x1, 0x2, 0x6, 0xE, 0x9, 0xB, 0x3, 0x0, 0x8, 0x5, 0xC, 0xA]])
Q1 = _mk_q([[0x2, 0x8, 0xB, 0xD, 0xF, 0x7, 0x6, 0xE, 0x3, 0x1, 0x9, 0x4, 0x0, 0xA, 0xC, 0x5],
            [0x1, 0xE, 0x2, 0xB, 0x4, 0xC, 0x3, 0x7, 0x6, 0xD, 0xA, 0x5, 0xF, 0x9, 0x0, 0x8],
            [0x4, 0xC, 0x7, 0x5, 0x1, 0x6, 0x9, 0xA, 0x0, 0xE, 0xD, 0x8, 0x2, 0xB, 0x3, 0xF],
            [0xB, 0x9, 0x5, 0x1, 0xC, 0x3, 0xD, 0xE, 0x6, 0x4, 0x7, 0xF, 0x2, 0x0, 0x8, 0xA]])


def _gf(a, b, poly):
    r = 0
    while b:
        if b & 1:
            r ^= a
        a <<= 1
        if a & 0x100:
            a ^= poly
        b >>= 1
    return r


MDS = [[0x01, 0xEF, 0x5B, 0x5B], [0x5B, 0xEF, 0xEF, 0x01], [0xEF, 0x5B, 0x01, 0xEF], [0xEF, 0x01, 0xEF, 0x5B]]
RS = [[0x01, 0xA4, 0x55, 0x87, 0x5A, 0x58, 0xDB, 0x9E], [0xA4, 0x56, 0x82, 0xF3, 0x1E, 0xC6, 0x68, 0xE5],
      [0x02, 0xA1, 0xFC, 0xC1, 0x47, 0xAE, 0x3D, 0x19], [0xA4, 0x55, 0x87, 0x5A, 0x58, 0xDB, 0x9E, 0x03]]
MDS_T = [[[_gf(MDS[i][j], x, 0x169) for x in range(256)] for j in range(4)] for i in range(4)]


def rol(x, n):
    return ((x << n) | (x >> (32 - n))) & M32


def ror(x, n):
    return ((x >> n) | (x << (32 - n))) & M32


def _h(x, L):
    y = [(x >> (8 * i)) & 0xFF for i in range(4)]
    k = len(L)
    lb = [[(w >> (8 * i)) & 0xFF for i in range(4)] for w in L]
    if k == 4:
        y = [Q1[y[0]] ^ lb[3][0], Q0[y[1]] ^ lb[3][1], Q0[y[2]] ^ lb[3][2], Q1[y[3]] ^ lb[3][3]]
    if k >= 3:
        y = [Q1[y[0]] ^ lb[2][0], Q1[y[1]] ^ lb[2][1], Q0[y[2]] ^ lb[2][2], Q0[y[3]] ^ lb[2][3]]
    y = [Q1[Q0[Q0[y[0]] ^ lb[1][0]] ^ lb[0][0]],
         Q0[Q0[Q1[y[1]] ^ lb[1][1]] ^ lb[0][1]],
         Q1[Q1[Q0[y[2]] ^ lb[1][2]] ^ lb[0][2]],
         Q0[Q1[Q1[y[3]] ^ lb[1][3]] ^ lb[0][3]]]
    z = 0
    for i in range(4):
        zi = 0
        for j in range(4):
            zi ^= MDS_T[i][j][y[j]]
        z |= zi << (8 * i)
    return z


class Twofish:
    def __init__(self, key):
        k = len(key) // 8
        m = struct.unpack("<%dI" % (2 * k), key)
        me, mo = list(m[0::2]), list(m[1::2])
        s = []
        for i in range(k):
            blk = key[8 * i:8 * i + 8]
            w = 0
            for r in range(4):
                b = 0
                for c in range(8):
                    b ^= _gf(RS[r][c], blk[c], 0x14D)
                w |= b << (8 * r)
            s.append(w)
        self.S = s
        rho = 0x01010101
        self.K = []
        for i in range(20):
            a = _h((2 * i * rho) & M32, me)
            b = rol(_h(((2 * i + 1) * rho) & M32, mo), 8)
            self.K.append((a + b) & M32)
            self.K.append(rol((a + 2 * b) & M32, 9))
        # cache g as 4 lookup tables
        lb = [[(w >> (8 * i)) & 0xFF for i in range(4)] for w in self.S]
        sb = [lambda y: Q1[Q0[Q0[y] ^ lb[1][0]] ^ lb[0][0]],
              lambda y: Q0[Q0[Q1[y] ^ lb[1][1]] ^ lb[0][1]],
              lambda y: Q1[Q1[Q0[y] ^ lb[1][2]] ^ lb[0][2]],
              lambda y: Q0[Q1[Q1[y] ^ lb[1][3]] ^ lb[0][3]]]
        self.G = []
        for j in range(4):
            tab = []
            for x in range(256):
                v = sb[j](x)
                tab.append(sum(MDS_T[i][j][v] << (8 * i) for i in range(4)))
            self.G.append(tab)

    def g(self, x):
        G = self.G
        return G[0][x & 255] ^ G[1][(x >> 8) & 255] ^ G[2][(x >> 16) & 255] ^ G[3][x >> 24]

    def encrypt(self, blk):
        K = self.K
        r0, r1, r2, r3 = [w ^ K[i] for i, w in enumerate(struct.unpack("<4I", blk))]
        for r in range(16):
            t0 = self.g(r0)
            t1 = self.g(rol(r1, 8))
            f0 = (t0 + t1 + K[2 * r + 8]) & M32
            f1 = (t0 + 2 * t1 + K[2 * r + 9]) & M32
            r2 = ror(r2 ^ f0, 1)
            r3 = rol(r3, 1) ^ f1
            r0, r1, r2, r3 = r2, r3, r0, r1
        out = [r2 ^ K[4], r3 ^ K[5], r0 ^ K[6], r1 ^ K[7]]
        return struct.pack("<4I", *out)


def _xor(a, b):
    return bytes(x ^ y for x, y in zip(a, b))


def _dbl(b):
    n = int.from_bytes(b, "big") << 1
    if n >> 128:
        n = (n ^ 0x87) & ((1 << 128) - 1)
    return n.to_bytes(16, "big")


class EAX:
    def __init__(self, key):
        self.c = Twofish(key)
        L = self.c.encrypt(bytes(16))
        self.k1 = _dbl(L)
        self.k2 = _dbl(self.k1)

    def omac(self, t, msg):
        data = bytes(15) + bytes([t]) + msg
        blocks = [data[i:i + 16] for i in range(0, len(data), 16)]
        last = blocks[-1]
        if len(last) == 16:
            last = _xor(last, self.k1)
        else:
            last = _xor(last + b"\x80" + bytes(15 - len(last)), self.k2)
        blocks[-1] = last
        x = bytes(16)
        for b in blocks:
            x = self.c.encrypt(_xor(x, b))
        return x

    def ctr(self, n, data):
        ctr = int.from_bytes(n, "big")
        out = bytearray()
        for i in range(0, len(data), 16):
            ks = self.c.encrypt(ctr.to_bytes(16, "big"))
            ctr = (ctr + 1) & ((1 << 128) - 1)
            out += _xor(data[i:i + 16], ks)
        return bytes(out)

    def encrypt(self, nonce, pt, header=b""):
        n = self.omac(0, nonce)
        h = self.omac(1, header)
        c = self.ctr(n, pt)
        tag = _xor(_xor(n, h), self.omac(2, c))
        return c + tag

    def decrypt(self, nonce, data, header=b""):
        c, tag = data[:-16], data[-16:]
        n = self.omac(0, nonce)
        h = self.omac(1, header)
        ok = _xor(_xor(n, h), self.omac(2, c)) == tag
        return self.ctr(n, c), ok


KEY = bytes([137] * 16)
IV = bytes([16] * 16)


def pkt_decrypt(raw):
    L = len(raw)
    p = bytes(raw[L - 1 - i] ^ ((L - i * L) & 0xFF) for i in range(L))
    out, ok = EAX(KEY).decrypt(IV, p)
    n = len(out)
    out = bytes(out[i] ^ ((n - i) & 0xFF) for i in range(n))
    size = struct.unpack(">I", out[:4])[0]
    xml = zlib.decompress(out[4:])
    assert len(xml) == size, (len(xml), size)
    return xml, ok


def pkt_encrypt(xml):
    comp = struct.pack(">I", len(xml)) + zlib.compress(xml, 9)
    n = len(comp)
    comp = bytes(comp[i] ^ ((n - i) & 0xFF) for i in range(n))
    p = EAX(KEY).encrypt(IV, comp)
    L = len(p)
    raw = bytearray(L)
    for i in range(L):
        raw[L - 1 - i] = p[i] ^ ((L - i * L) & 0xFF)
    return bytes(raw)


if __name__ == "__main__":
    import sys
    t = Twofish(bytes(16)).encrypt(bytes(16)).hex().upper()
    print("twofish test:", t, t == "9F589F5CF6122C32B6BFEC2F2AE8C35A")
    if len(sys.argv) > 2:
        xml, ok = pkt_decrypt(open(sys.argv[1], "rb").read())
        open(sys.argv[2], "wb").write(xml)
        print("decrypted", len(xml), "bytes, tag ok:", ok)

