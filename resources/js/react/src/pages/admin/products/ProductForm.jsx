// Backend'den gelen product resource'u formun beklediği key'lere mapler
function mapProductResourceToForm(product) {
  if (!product) return {};
  return {
    name: product.product_name || product.name || "",
    content: product.product_content || product.content || "",
    price: product.product_price || product.price || "",
    discount: product.product_discount || product.discount || "",
    parent_slug: product.categories ? product.categories.map(c => c.slug) : [],
    images: product.product_images || product.images || [],
    variants: product.variants || [],
    selected_category: product.selected_category || product.category || "",

  };
}
import { Add, Remove, Delete, Close, WorkspacesOutlined } from "@mui/icons-material";
import { NumericFormat } from "react-number-format";
import {
  Box, Button, Card, CardContent, DialogContent, DialogTitle, FormControl, Grid,
  IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField, Chip
} from "@mui/material";
import React, { useEffect, useState, useRef, useCallback, use } from "react";
import ValidateError from "../../auth/ValidateError";
import Loading from "../../../layouts/GeneralComponents/Loading";
import { getImagePath } from "../../../services/hooks/utils/image";

const VariantRow = React.memo(function VariantRow({
  uid, row, hasSizes, sizes = [], onVariantChange, addVariantRow, removeVariantRow
}) {
  const r = row || { uid, color: "", quantity: "", ...(hasSizes ? { size: "" } : {}) };
  console.log("VariantRow render:", sizes);
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={1} sx={{ display: "flex" }}>
        {uid === 0 ? (
          <IconButton size="small" onClick={addVariantRow}><Add /></IconButton>
        ) : (
          <IconButton size="small" onClick={() => removeVariantRow(uid)}><Remove /></IconButton>
        )}
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth>
          <InputLabel id={`color-label-${uid}`}>Renk</InputLabel>
          <Select
            name={`color_${uid}`}
            labelId={`color-label-${uid}`}
            id={`color_${uid}`}
            value={r.color}
            onChange={e => onVariantChange(uid, "color", e.target.value)}
            input={<OutlinedInput />}
          >
            <MenuItem value={"Beyaz Altın"}>Beyaz Altın</MenuItem>
            <MenuItem value={"Gold"}>Gold</MenuItem>
            <MenuItem value={"Rose"}>Rose Gold</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {hasSizes && (
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel id={`size-label-${uid}`}>Ölçü</InputLabel>
            <Select
              name={`size_${uid}`}
              labelId={`size-label-${uid}`}
              id={`size_${uid}`}
              value={r.size || ""}
              onChange={e => onVariantChange(uid, "size", e.target.value)}
              input={<OutlinedInput />}
            >
              {sizes.map((i, index) => (
                <MenuItem key={index} value={i}>{i}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid size={3}>
        <TextField
          label="Adet"
          name={`quantity_${uid}`}
          id={`quantity_${uid}`}
          value={r.quantity ?? ""}
          onChange={e => onVariantChange(uid, "quantity", e.target.value)}
          type="number"
          inputProps={{ min: 1 }}
          autoComplete="off"
          fullWidth
        />
      </Grid>
    </Grid>
  );
});

function ProductForm({
  open, onClose, onSubmit, categories, initialValues = {}, isEdit = false, loading = false }) {
  const [form, setForm] = useState({
    name: "",
    content: "",
    parent_slug: [],
    price: "",
    discount: "",
    images: [],
    ...initialValues,
  });
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [step, setStep] = useState(isEdit ? 2 : 1);

  // Edit modunda modal açıldığında step'i 2'ye zorla
  useEffect(() => {
    if (isEdit && open && step !== 2) {
      setStep(2);
    }
  }, [isEdit, open, step]);

  const [extraVariants, setExtraVariants] = useState(
    initialValues.variants?.map((v, i) => ({ uid: i, ...v })) ||
    [{ uid: 0, color: "", quantity: "", ...(initialValues.sizes ? { size: "" } : {}) }]
  );

  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  const mainCategories = [
    { title: "Yüzük", icon: <img src="/assets/images/categoryIcons/Ring.png" width={"45px"} />, sizes: ["9", "10", "11", "12", "13", "14", "15", "16", "17", "other"] },
    { title: "Kolye", icon: <img src="/assets/images/categoryIcons/necklace.png" width={"45px"} /> },
    { title: "Bileklik", icon: <img src="/assets/images/categoryIcons/Bracelet.png" width={"45px"} /> },
    { title: "Bilezik", icon: <img src="/assets/images/categoryIcons/bılezık.png" width={"45px"} />, sizes: ["5.8", "6.0", "6.2", "6.4", "6.6", "other"] },
    { title: "Kelepçe", icon: <img src="/assets/images/categoryIcons/kelepce.png" width={"45px"} />, sizes: ["5.8", "6.0", "6.2", "6.4", "6.6", "other"] },
    { title: "Küpe", icon: <img src="/assets/images/categoryIcons/earrings.png" width={"45px"} /> },
    { title: "Hiçbiri", icon: <WorkspacesOutlined className="ms-2" /> },
  ];

  useEffect(() => {
    if (isEdit && initialValues) {
      const mapped = mapProductResourceToForm(initialValues);
      setForm(mapped);
      setExtraVariants(
        mapped.variants?.map((v, i) => ({ uid: i, ...v })) ||
        [{ uid: 0, color: "", quantity: "", ...(mapped.sizes ? { size: "" } : {}) }]
      );
      setSelectedCategory(mainCategories.find(c => c.title === mapped.selected_category) || {});
      setPreview(mapped.images?.map(img => img) || []);
    }
  }, [initialValues, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setForm(prev => ({ ...prev, images: [...(prev.images || []), ...files] }));
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreview(prev => [...(prev || []), ...newPreviews]);
    }
  };

  const handleImageDelete = index => {
    const newPreview = [...preview];
    newPreview.splice(index, 1);
    setPreview(newPreview);
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const cleanNumber = value => {
    if (value === null || value === undefined) return null;
    const str = typeof value === 'string' ? value : String(value);
    const cleaned = str ? Number(str.replace(/[₺,%\s]/g, "")) : null;
    return cleaned;
  };

  const hasSizes = !!selectedCategory?.sizes?.length || (isEdit && extraVariants.some(v => v.size !== undefined && v.size !== null));

  const addVariantRow = useCallback(() => {
    let uid = Date.now();
    setExtraVariants(prev => {
      while (prev.some(r => r.uid === uid)) uid += 1;
      const newRow = { uid, color: "", quantity: "" };
      return [...prev, { ...newRow, ...(hasSizes ? { size: "" } : {}) }];
    });
  }, [hasSizes]);

  const removeVariantRow = useCallback(uid => {
    setExtraVariants(prev => prev.filter(row => row.uid !== uid));
  }, []);

  const handleVariantChange = useCallback((uid, field, value) => {
    if (field === "size" && !hasSizes) return;
    setExtraVariants(prev => {
      const idx = prev.findIndex(r => r.uid === uid);
      if (idx === -1) {
        const newRow = { uid, color: "", quantity: "", ...(hasSizes ? { size: "" } : {}), [field]: value };
        return [...prev, newRow];
      }
      const current = prev[idx];
      if (current[field] === value) return prev;
      const next = prev.slice();
      next[idx] = { ...current, [field]: value };
      return next;
    });
  }, [hasSizes]);

  useEffect(() => {
    if (!open || step !== 2) return;
    if (!textareaRef.current) return;
    const initEditor = () => {
      if (!window?.CKEDITOR) return;
      if (editorRef.current) return;
      try {
        const inst = window.CKEDITOR.replace('product_description', {});
        editorRef.current = inst;
        inst.setData(form.content || "");
        inst.on("change", () => {
          const data = inst.getData();
          setForm(prev => ({ ...prev, content: data }));
        });
      } catch (err) { }
    };
    if (window?.CKEDITOR) {
      initEditor();
    } else {
      const onLoaded = () => initEditor();
      document.addEventListener("ckeditor-loaded", onLoaded);
      return () => {
        document.removeEventListener("ckeditor-loaded", onLoaded);
        if (editorRef.current) {
          try { editorRef.current.destroy(true); } catch (e) { }
          editorRef.current = null;
        }
      };
    }
    return () => {
      if (editorRef.current) {
        try { editorRef.current.destroy(true); } catch (e) { }
        editorRef.current = null;
      }
    };
  }, [open, step]);

  useEffect(() => {
    if (editorRef.current) {
      const inst = editorRef.current;
      const current = inst.getData();
      if (form.content !== current) inst.setData(form.content || "");
    }
  }, [form.content]);

  const getSizeOptions = () => {
    // 2. Edit modunda, varyantlardaki ilk size ile mainCategories'den eşleşen diziyi bul
    if (isEdit && extraVariants.length > 0) {
      console.log("extraVariants getsizemethod");
      const firstSize = extraVariants.find(v => v.size)?.size;
      console.log("firstSize:", firstSize);
      if (firstSize) {
        const matchedCat = mainCategories.find(cat =>
          Array.isArray(cat.sizes) && cat.sizes.includes(String(firstSize))
        );
        console.log("matchedCat:", matchedCat);
        if (matchedCat && matchedCat.sizes) return matchedCat.sizes;
      }
    }
    return [];
  };

  const handleFormSubmit = async () => {
    //console.log("Submitting form", form, extraVariants, selectedCategory);
    try {
      const formData = new FormData();
      formData.append("name", form.name ?? "");
      formData.append("content", form.content ?? "");
      (form.parent_slug || []).forEach(slug => formData.append("parent_slug[]", slug));
      formData.append("price", cleanNumber(form.price ?? ""));
      formData.append("selected_category", form.selected_category ?? "");
      const discountValue = cleanNumber(form.discount ?? "");
      if (discountValue !== null) formData.append("discount", discountValue);
      const cleanedVariants = extraVariants
        .map(({ uid, ...rest }) => rest)
        .filter(v => {
          const hasColor = v.color && v.color.toString().trim() !== "";
          const hasQuantity = v.quantity !== "" && v.quantity != null && Number(v.quantity) > 0;
          const hasSize = !hasSizes || (v.size && v.size.toString().trim() !== "");
          return hasColor && hasQuantity && hasSize;
        });
      if (cleanedVariants.length === 0) {
        setErrors(prev => ({ ...prev, variants: ["En az bir varyant eklemelisiniz."] }));
        return;
      }
      formData.append("variants", JSON.stringify(cleanedVariants));
      if (form.images) {
        form.images.forEach(file => {
          if (file instanceof File) {
            formData.append("images[]", file);
          } else if (typeof file === "string") {
            formData.append("existing_images[]", getImagePath(file));
          }
        });
      }

      await onSubmit(formData, setErrors);

      if (editorRef.current) { try { editorRef.current.destroy(true); } catch (e) { } editorRef.current = null; }
    } catch (error) { console.error(error); }
  };

  return (
    <>
      {step === 1 && !isEdit && (
        <>
          <DialogTitle sx={{ margin: '10px 0', textAlign: 'center' }}>Ürün Kategorisi Seç</DialogTitle>
          <DialogContent sx={{ maxWidth: '600px', margin: '0  auto' }}>
            <div className="row justify-content-center">
              {mainCategories.map((cat, idx) => (
                <div className={`col-sm-3 mb-4 `} key={idx}>
                  <Card
                    onClick={() => {
                      setStep(2);
                      setSelectedCategory(cat);
                      setExtraVariants([
                        { uid: 0, color: "", quantity: "", ...(cat.sizes ? { size: "" } : {}) },
                      ]);
                    }}
                    sx={{
                      width: "100px", height: "100px", cursor: "pointer", border: "1px", backgroundColor: "#f7f7f7",
                    }}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <CardContent className="d-flex align-items-center justify-content-center flex-column">
                      <div className="text-4xl">{cat.icon}</div>
                      <span className="text-sm font-medium text-center">{cat.title}</span>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </DialogContent>
        </>
      )}
      {step === 2 && (
        <>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {isEdit ? "Ürün Düzenle" : `Ürün Ekle ${selectedCategory.title}`}
            <IconButton aria-label="close" onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, mb: 2 }}>
            <TextField
              error={!!errors?.name}
              label="Ürün Adı"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth sx={{ mt: 1 }}
            />
            {ValidateError(errors, "name", "-15px")}
            <div className="position-relative">
              <label style={{ marginBottom: "8px", display: "block" }}>Ürün Açıklaması</label>
              <textarea
                id="product_description"
                ref={textareaRef}
                style={{ width: "100%", height: "200px", marginTop: "10px", fontFamily: "monospace" }}
              />
            </div>
            {ValidateError(errors, "content", "-15px")}
            <Grid container spacing={2}>
              <Grid size={6}>
                <NumericFormat
                  error={!!errors?.price}
                  value={form.price}
                  name="price"
                  onChange={handleChange}
                  fullWidth
                  customInput={TextField}
                  thousandSeparator
                  valueIsNumericString
                  allowNegative={false}
                  decimalScale={2}
                  prefix="₺"
                  label="Fiyat"
                  isAllowed={vals => vals.floatValue !== undefined || vals.value === ""}
                />
                {ValidateError(errors, "price")}
              </Grid>
              <Grid size={6}>
                <NumericFormat
                  error={!!errors?.discount}
                  value={form.discount}
                  name="discount"
                  onChange={handleChange}
                  fullWidth
                  customInput={TextField}
                  valueIsNumericString
                  allowNegative={false}
                  prefix="%"
                  label="İndirim"
                  isAllowed={vals => vals.floatValue !== undefined || vals.value === ""}
                />
                {ValidateError(errors, "discount")}
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-chip-label">Kategori</InputLabel>
              <Select
                name="parent_slug"
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={form.parent_slug}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={selected => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map(slug => {
                      const category = categories.find(c => c.slug === slug);
                      return <Chip key={slug} label={category?.name || slug} />;
                    })}
                  </Box>
                )}
              >
                {categories.map(c => (
                  <MenuItem key={c.slug} value={c.slug}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {ValidateError(errors, "parent_slug", "-15px")}
            {extraVariants.map(r => (
              <VariantRow
                key={r.uid}
                uid={r.uid}
                row={r}
                hasSizes={hasSizes}
                sizes={selectedCategory?.sizes ?? getSizeOptions()}
                onVariantChange={handleVariantChange}
                addVariantRow={addVariantRow}
                removeVariantRow={removeVariantRow}
              />
            ))}
            {errors && Object.keys(errors)
              .filter(key => key === "variants" || key.startsWith("variants."))
              .map(key =>
                Array.isArray(errors[key])
                  ? errors[key].map((msg, i) => (
                    <div key={key + i} style={{ color: "#d32f2f", marginTop: "-13px", fontSize: "0.85em" }}>
                      {msg}
                    </div>
                  ))
                  : (
                    <div key={key} style={{ color: "#d32f2f", marginTop: "-13px", fontSize: "0.85em" }}>
                      {errors[key]}
                    </div>
                  )
              )
            }
            <Button variant="outlined" component="label">
              Resim Yükle
              <input type="file" hidden accept="image/*" onChange={handleFileChange} multiple />
            </Button>
            {ValidateError(errors, "files")}
            {preview && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {preview.map((i, index) => (
                  <Grid size={4} key={index}>
                    <Box sx={{
                      position: "relative", width: "120px", height: "120px", borderRadius: 2, overflow: "hidden",
                      "&:hover .overlay": { opacity: 1 },
                    }}>
                      <img src={i && i.startsWith('blob:') ? i : `/storage/${i}`} alt="" style={{
                        width: "100%", height: "100%", objectFit: "cover", display: "block",
                      }} />

                      <Box className="overlay" sx={{
                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                        bgcolor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        opacity: 0, transition: "opacity 0.3s",
                      }}>
                        <IconButton sx={{ color: "white" }} onClick={() => handleImageDelete(index)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
            <Button onClick={onClose}>Vazgeç</Button>
            {loading ? <Loading style={"m-height"} /> :
              <Button onClick={handleFormSubmit} variant="contained" color="primary">
                {isEdit ? "Güncelle" : "Kaydet"}
              </Button>
            }
          </Box>
        </>
      )}
    </>
  );
}

export default ProductForm;