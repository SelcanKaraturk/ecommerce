import WorkspacesOutlined from '@mui/icons-material/WorkspacesOutlined';
export const orderedOptions = (newOptions) => newOptions.sort((a, b) => {
  const aNum = parseFloat(a.value);
  const bNum = parseFloat(b.value);

  const aIsNumber = !isNaN(aNum);
  const bIsNumber = !isNaN(bNum);

  if (aIsNumber && bIsNumber) {
    return aNum - bNum;
  } else if (aIsNumber) {
    return -1; // sayılar yazılardan önce gelsin
  } else if (bIsNumber) {
    return 1; // yazılar en sona gitsin
  } else {
    // ikisi de yazıysa alfabetik sırala
    return a.value.localeCompare(b.value);
  }

});

export const toTurkishTitleCase = (value) => {
  if (!value) return '';

  return value
    .toLocaleUpperCase('tr-TR')
    .replace(/(^|\s|\/|-)([a-zcçgğiıoösşuü])/g, (match, separator, character) => `${separator}${character.toLocaleUpperCase('tr-TR')}`);
};

export const mainCategories = [
  { id: 1, title: "Yüzük", icon: <img src="/assets/images/categoryIcons/Ring.png" width={"45px"} />, sizes: ["9", "10", "11", "12", "13", "14", "15", "16", "17", "other"]},
  { id: 2, title: "Kolye", icon: <img src="/assets/images/categoryIcons/necklace.png" width={"45px"} />, sizes: ["42","45","50","60","65", "other"] },
  { id: 3, title: "Bileklik", icon: <img src="/assets/images/categoryIcons/Bracelet.png" width={"45px"} />, sizes: ["15", "16", "17", "18", "19", "20", "other"]  },
  { id: 4, title: "Bilezik", icon: <img src="/assets/images/categoryIcons/bılezık.png" width={"45px"} />, sizes: ["5.8", "6.0", "6.2", "6.4", "6.6", "other"] },
  { id: 5, title: "Kelepçe", icon: <img src="/assets/images/categoryIcons/kelepce.png" width={"45px"} />, sizes: ["5.8", "6.0", "6.2", "6.4", "6.6", "other"] },
  { id: 6, title: "Küpe", icon: <img src="/assets/images/categoryIcons/earrings.png" width={"45px"} /> },
  { id: 7, title: "Hiçbiri", icon: <WorkspacesOutlined className="ms-2" /> },
];

export const diamondProperties = [{
  carat: [".05", ".10", ".15", ".20", ".25", ".50", ".75", "1.00", "1.25", "1.50", "1.75", "2.00"],
  clarity: ["LC","VVS1","VVS2","VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"],
  color_of_diamond: ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"],
  cut: ["Yuvarlak", "Prenses", "Zümrüt", "Yastık", "Oval", "Markiz", "Damla", "Kalp", "Asscher", "Radyan", "Baget"],
  }
];

export const getSizeOptions = (product, allowOutOfStock = true) => {
  if (!allowOutOfStock) {
    // allow_out_of_stock_cart false ise sadece var olan size'ları döner
    const uniqueSizes = [...new Set(product.map(v => v.size))].filter(Boolean);
    return uniqueSizes;
  }

  // allow_out_of_stock_cart true ise kategori size'larını döner
  const firstSize = product.find(v => v.size)?.size;
  //console.log("firstSize:", firstSize);
  if (firstSize) {
    const matchedCat = mainCategories.find(cat =>
      Array.isArray(cat.sizes) && cat.sizes.includes(String(firstSize))
    );
    //console.log("matchedCat:", matchedCat);
    if (matchedCat && matchedCat.sizes) return matchedCat.sizes;
  }

  return [];
};

export function groupVariantsByColor(variants) {
  const colorMap = {
    "Beyaz Altın": [],
    "Gold": [],
    "Rose": []
  };
  variants.forEach(variant => {
    if (colorMap[variant.color]) {
      colorMap[variant.color].push(variant);
    }
  });
  return colorMap;
}
