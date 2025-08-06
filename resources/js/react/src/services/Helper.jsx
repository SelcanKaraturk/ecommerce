
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
