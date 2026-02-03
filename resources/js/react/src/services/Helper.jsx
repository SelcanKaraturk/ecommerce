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

const mainCategories = [
  { title: "Yüzük", icon: <img src="/assets/images/categoryIcons/Ring.png" width={"45px"} />, sizes: ["9", "10", "11", "12", "13", "14", "15", "16", "17", "other"] },
  { title: "Kolye", icon: <img src="/assets/images/categoryIcons/necklace.png" width={"45px"} /> },
  { title: "Bileklik", icon: <img src="/assets/images/categoryIcons/Bracelet.png" width={"45px"} /> },
  { title: "Bilezik", icon: <img src="/assets/images/categoryIcons/bılezık.png" width={"45px"} />, sizes: ["5.8", "6.0", "6.2", "6.4", "6.6", "other"] },
  { title: "Kelepçe", icon: <img src="/assets/images/categoryIcons/kelepce.png" width={"45px"} />, sizes: ["5.8", "6.0", "6.2", "6.4", "6.6", "other"] },
  { title: "Küpe", icon: <img src="/assets/images/categoryIcons/earrings.png" width={"45px"} /> },
  { title: "Hiçbiri", icon: <WorkspacesOutlined className="ms-2" /> },
];

export const getSizeOptions = (product) => {
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
