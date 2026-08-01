export async function printThermal(receipt) {
  const text = buildReceipt(receipt);

  const printWindow = window.open("", "", "width=320,height=700");

  printWindow.document.write(`
<html>
<head>
<style>

@media print{

@page{
size:80mm auto;
margin:0;
}

body{
width:72mm;
font-family:monospace;
font-size:12px;
margin:0;
padding:6px;
}

}

body{
font-family:monospace;
font-size:12px;
white-space:pre-wrap;
}

</style>
</head>

<body>

${text}

<script>

window.onload=function(){

window.print();

setTimeout(()=>window.close(),300);

}

</script>

</body>
</html>
`);

  printWindow.document.close();
}

function rupiah(v){
    return Number(v || 0).toLocaleString("id-ID");
}

function center(text){
    return `<div style="text-align:center">${text}</div>`;
}

function line(){
    return "--------------------------------";
}

function buildReceipt(data){

let html="";

html += center("<b>APOTEK SEHAT</b>");
html += center("Jl. Raya Kudus");
html += center("08123456789");

html += "<br>";
html += line()+"<br>";

html += `No : ${data.noTransaksi}<br>`;
html += `Kasir : ${data.kasir}<br>`;
html += `Tanggal : ${new Date().toLocaleString("id-ID")}<br>`;

html += line()+"<br>";

data.items.forEach(item=>{

html += `
${item.nama_produk}<br>
${item.qty} x ${rupiah(item.harga)}
<span style="float:right">
${rupiah(item.subtotal)}
</span><br>
`;

});

html += line()+"<br>";

html += `
Subtotal
<span style="float:right">${rupiah(data.subtotal)}</span><br>

Diskon
<span style="float:right">${rupiah(data.diskon)}</span><br>

<b>Total
<span style="float:right">${rupiah(data.total)}</span></b><br>

Tunai
<span style="float:right">${rupiah(data.bayar)}</span><br>

Kembali
<span style="float:right">${rupiah(data.kembalian)}</span><br>
`;

html += line()+"<br>";

html += center("Terima Kasih");
html += center("Semoga Lekas Sembuh");

return html;

}