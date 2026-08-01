import { APOTEK_INFO } from "@/config/apotek";

APOTEK_INFO.nama
APOTEK_INFO.alamat
APOTEK_INFO.telepon

export function buildReceiptHtml(data) {
  const items = (data.items || [])
.map(
(item) => `
<tr>
<td colspan="4">

<div style="font-weight:bold">
${item.nama_produk || item.nama || "-"}
</div>

<div class="small">
Batch : ${item.batch || "-"}
</div>

<div class="small">
Exp : ${item.expired || "-"}
</div>

<div class="small">
Barcode : ${item.barcode || "-"}
</div>


<table style="width:100%;margin-top:2px">
<tr>
<td>
${item.qty} x ${format(item.harga)}
</td>

<td align="right">
${format(item.subtotal)}
</td>

</tr>
</table>


</td>
</tr>
`
)
.join("");

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8"/>

<title>Receipt</title>

<style>

*{
box-sizing:border-box;
}

body{

width:80mm;

margin:0;

padding:10px;

font-family:monospace;

font-size:12px;

color:#000;

}

.center{

text-align:center;

}

.title{

font-size:18px;

font-weight:bold;

}

.small{

font-size:11px;

}

hr{

border:none;

border-top:1px dashed #000;

margin:8px 0;

}

table{

width:100%;

border-collapse:collapse;

}

th{

text-align:left;

padding-bottom:4px;

}

td{

padding:2px 0;

vertical-align:top;

}

.total{

font-size:15px;

font-weight:bold;

}

.footer{

margin-top:12px;

text-align:center;

font-size:11px;

}

@media print{

body{

width:80mm;

}

}

</style>

</head>

<body>

<div class="center">

<div class="title">
${APOTEK_INFO.nama}
</div>

<div class="small">
${APOTEK_INFO.alamat}
</div>

<div class="small">
Telp. ${APOTEK_INFO.telepon}
</div>

</div>

<hr>

<table>

<tr>
<td>No Transaksi</td>
<td align="right">${data.kode || "-"}</td>
</tr>

<tr>
<td>Tanggal</td>
<td align="right">
${new Date(data.tanggal).toLocaleString("id-ID")}
</td>
</tr>

<tr>
<td>Kasir</td>
<td align="right">${data.kasir || "-"}</td>
</tr>

<tr>
<td>Pembayaran</td>
<td align="right">${data.metode || "-"}</td>
</tr>

</table>

<hr>

${items}

<hr>

<table>

<tr>

<td>Subtotal</td>

<td align="right">
${format(data.subtotal)}
</td>

</tr>

<tr>

<td>Diskon</td>

<td align="right">
${format(data.diskon)}
</td>

</tr>

<tr class="total">

<td>Total</td>

<td align="right">
${format(data.total)}
</td>

</tr>

<tr>

<td>Tunai</td>

<td align="right">
${format(data.bayar)}
</td>

</tr>

<tr>

<td>Kembalian</td>

<td align="right">
${format(data.kembalian)}
</td>

</tr>

</table>

<hr>

<div class="footer">

Terima Kasih Atas Kunjungan Anda

<br>

Semoga Lekas Sembuh

<br><br>

**************

</div>

</body>

</html>
`;
}

function format(value) {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
}
