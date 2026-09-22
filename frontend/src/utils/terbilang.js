const satuan = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
  "sebelas",
];

function terbilangAngka(n) {
  n = Math.floor(Math.abs(n));
  if (n < 12) return satuan[n];
  if (n < 20) return `${terbilangAngka(n - 10)} belas`;
  if (n < 100)
    return `${terbilangAngka(Math.floor(n / 10))} puluh${
      n % 10 ? ` ${terbilangAngka(n % 10)}` : ""
    }`;
  if (n < 200) return `seratus${n % 100 ? ` ${terbilangAngka(n % 100)}` : ""}`;
  if (n < 1000)
    return `${terbilangAngka(Math.floor(n / 100))} ratus${
      n % 100 ? ` ${terbilangAngka(n % 100)}` : ""
    }`;
  if (n < 2000)
    return `seribu${n % 1000 ? ` ${terbilangAngka(n % 1000)}` : ""}`;
  if (n < 1000000)
    return `${terbilangAngka(Math.floor(n / 1000))} ribu${
      n % 1000 ? ` ${terbilangAngka(n % 1000)}` : ""
    }`;
  if (n < 1000000000)
    return `${terbilangAngka(Math.floor(n / 1000000))} juta${
      n % 1000000 ? ` ${terbilangAngka(n % 1000000)}` : ""
    }`;
  if (n < 1000000000000)
    return `${terbilangAngka(Math.floor(n / 1000000000))} miliar${
      n % 1000000000 ? ` ${terbilangAngka(n % 1000000000)}` : ""
    }`;
  return `${terbilangAngka(Math.floor(n / 1000000000000))} triliun${
    n % 1000000000000 ? ` ${terbilangAngka(n % 1000000000000)}` : ""
  }`;
}

/**
 * Convert angka ke terbilang formal (Title Case)
 * Contoh: 1000000 → "Satu Juta Rupiah"
 *         1500    → "Seribu Lima Ratus Rupiah"
 *         0       → "Nol Rupiah"
 */
export default function terbilang(nominal) {
  const num = Number(nominal) || 0;

  if (num <= 0) return "Nol Rupiah";

  const kata = terbilangAngka(num).trim();

  // ⚡ Title Case — setiap kata diawali huruf kapital
  const titleCase = kata
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return `${titleCase} Rupiah`;
}
