# Panduan Membuat File .PKT – Tugas 09 (Cisco Packet Tracer 9.0.1)

Kira-kira 15–20 menit. Ikuti urutannya, lalu simpan 2 file: `KasusA_Static.pkt` dan `KasusB_OSPF.pkt`.

## 0. Ringkasan Pengalamatan (VLSM dari 192.168.10.0/24)

| Subnet | Network | Mask | Gateway | Range Host | Broadcast |
|---|---|---|---|---|---|
| LAN Nirkabel (100 host) | 192.168.10.0/25 | 255.255.255.128 | 192.168.10.1 (R2 G0/0) | .1 – .126 | .127 |
| LAN Kabel (50 host) | 192.168.10.128/26 | 255.255.255.192 | 192.168.10.129 (R1 G0/0) | .129 – .190 | .191 |
| P2P R1–R2 | 192.168.10.192/30 | 255.255.255.252 | – | .193 (R1) – .194 (R2) | .195 |

Server DHCP: **192.168.10.130/26** (static), gateway 192.168.10.129.

## 1. Letakkan Perangkat

| Perangkat | Model PT | Nama (Display Name) |
|---|---|---|
| Router x2 | **2911** | R1, R2 |
| Switch x2 | **2960-24TT** | SW1, SW2 |
| Access Point | **AccessPoint-PT** (Network Devices > Wireless Devices) | AP1 |
| Server | **Server-PT** | DHCP-Server |
| PC x2 | PC-PT | PC1, PC2 |
| Laptop x2 | Laptop-PT | Laptop1, Laptop2 |
| Smartphone x1 | Smartphone-PT | HP1 |

## 2. Kabel (Copper Straight-Through, kecuali disebut lain)

| Dari | Port | Ke | Port |
|---|---|---|---|
| R1 | Gig0/1 | R2 | Gig0/1 (**Copper Cross-Over**) |
| R1 | Gig0/0 | SW1 | Gig0/1 |
| SW1 | Fa0/1 | DHCP-Server | Fa0 |
| SW1 | Fa0/2 | PC1 | Fa0 |
| SW1 | Fa0/3 | PC2 | Fa0 |
| R2 | Gig0/0 | SW2 | Gig0/1 |
| SW2 | Fa0/1 | AP1 | Port 0 |

## 3. Server DHCP
1. **Config > Settings**: Gateway `192.168.10.129`, DNS `192.168.10.130`.
2. **Config > FastEthernet0**: Static, IP `192.168.10.130`, Mask `255.255.255.192`.
3. **Services > DHCP** → Service **On**. Buat 2 pool:
   - Klik `serverPool` di tabel, ubah lalu klik **Save**:
     Pool Name `LAN_KABEL`, Default Gateway `192.168.10.129`, DNS `192.168.10.130`,
     Start IP `192.168.10.140`, Subnet Mask `255.255.255.192`, Max Users `50`.
     (Jika PT tidak mengizinkan rename serverPool, biarkan nama `serverPool` – isinya yang penting.)
   - Isi lagi lalu klik **Add**:
     Pool Name `LAN_WIFI`, Default Gateway `192.168.10.1`, DNS `192.168.10.130`,
     Start IP `192.168.10.10`, Subnet Mask `255.255.255.128`, Max Users `100`.

## 4. Router – Kasus A
Buka R1 > CLI, jawab `no` pada initial dialog, lalu paste isi `configs/R1_KasusA_Static.txt`.
Buka R2 > CLI, paste isi `configs/R2_KasusA_Static.txt`.
> `ip helper-address 192.168.10.130` di R2 G0/0 wajib, karena DHCP broadcast dari LAN Nirkabel tidak bisa menyeberang router tanpa relay.

## 5. Access Point
AP1 > **Config > Port 1**: SSID `T09_WIFI`, Authentication **WPA2-PSK**, PSK Pass Phrase `itera2026`, Encryption AES.

## 6. Client
- **PC1, PC2**: Desktop > IP Configuration > **DHCP** → harus dapat 192.168.10.14x.
- **Laptop1, Laptop2**: tab Physical → matikan power (tombol di laptop) → drag modul `PT-LAPTOP-NM-1CFE` keluar → masukkan **WPC300N** → nyalakan. Lalu Config > **Wireless0**: SSID `T09_WIFI`, WPA2-PSK, key `itera2026`, IP Configuration **DHCP**.
- **HP1 (Smartphone)**: Config > **Wireless0**: SSID `T09_WIFI`, WPA2-PSK, key `itera2026`, **DHCP**.
- Pastikan semua client wireless mendapatkan IP 192.168.10.1x. Jika masih 169.254.x.x, klik DHCP lagi / tekan *Fast Forward Time*.

## 7. Uji Kasus A (ambil screenshot!)
Di Laptop1 > Desktop > Command Prompt:
```
ipconfig
ping <IP PC1>        (ulangi sekali lagi jika paket pertama timeout karena ARP → harus 0% loss)
tracert <IP PC1>
```
Di R1 & R2: `show ip route`.
**File > Save As → `KasusA_Static.pkt`.**

## 8. Kasus B (OSPF)
Paste `configs/R1_KasusB_OSPF.txt` ke R1 dan `configs/R2_KasusB_OSPF.txt` ke R2.
Tunggu ±40 detik (atau Fast Forward Time) sampai muncul log `%OSPF-5-ADJCHG ... FULL`.
Uji lagi: `show ip ospf neighbor`, `show ip route` (R1 & R2), lalu ping + tracert dari Laptop1 ke PC1.
**File > Save As → `KasusB_OSPF.pkt`.**

## 9. Screenshot untuk Laporan
Simpan screenshot (PNG) dengan nama persis berikut ke folder `screenshots/`:

| File | Isi |
|---|---|
| `topologi.png` | Workspace topologi lengkap |
| `dhcp_server.png` | Server > Services > DHCP (2 pool) |
| `ipconfig_client.png` | `ipconfig` Laptop / HP / PC (hasil DHCP) |
| `A_route_R1.png`, `A_route_R2.png` | `show ip route` Kasus A |
| `A_ping.png`, `A_tracert.png` | Ping & tracert Laptop1 → PC1, Kasus A |
| `B_ospf_neighbor.png` | `show ip ospf neighbor` |
| `B_route_R1.png`, `B_route_R2.png` | `show ip route` Kasus B |
| `B_ping.png`, `B_tracert.png` | Ping & tracert Laptop1 → PC1, Kasus B |

## 10. Build PDF + ZIP
Letakkan `KasusA_Static.pkt` dan `KasusB_OSPF.pkt` di folder ini (`T09_Jarkom/`), lalu jalankan:
```
python build.py
```
Hasil: `T09_124140204_Muhammad Faza Prasetyo.zip` (berisi 2 file .pkt + Laporan PDF). Upload ke E-Learning ITERA.
