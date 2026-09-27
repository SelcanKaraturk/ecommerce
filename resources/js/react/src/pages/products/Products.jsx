// import { get } from 'jquery';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// rc-slider track rengini değiştirmek için özel stil
const sliderCustomStyle = `
.rc-slider-track {
  background-color: #595959 !important;
}
.rc-slider-handle {
  border-color: #595959 !important;
}
.MuiCheckbox-root {
  color: #B8924A !important;
}
.MuiCheckbox-root.Mui-checked {
  color: #B8924A !important;
}
.MuiCheckbox-root:hover {
  background-color: rgba(184, 146, 74, 0.08) !important;
}
.MuiSelect-icon {
  color: #B8924A !important;
}

.MuiOutlinedInput-notchedOutline {
  border-color: #eee8df !important;
}

.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
  border-color: #a88442 !important;
  border-width: 1px !important;
}
`;
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSingleProduct } from '../../services/WebService';
import { useAuth } from '../../services/AuthContex';
import { ChevronRightRounded } from '@mui/icons-material';
import { ShoppingBagOutlined, ShoppingBag, DiamondOutlined, GppGoodOutlined, AutoAwesomeOutlined } from '@mui/icons-material';
import Loading from '../../layouts/GeneralComponents/Loading';
import WishlistButton from '../../layouts/GeneralComponents/WishlistButton';
import { FormControl, InputLabel, MenuItem, Select, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import CartButton from '../../layouts/GeneralComponents/CartButton';
import { getSizeOptions, groupVariantsByColor, mainCategories, toTurkishTitleCase } from '../../services/Helper';

function Products() {
  const { lang, category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [categoriesSub, setCategoriesSub] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [isCollectionCategory, setIsCollectionCategory] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [priceLimits, setPriceLimits] = useState([0, 0]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('1');
  const [size, setSize] = useState('');
  const [modalSize, setModalSize] = useState('');
  const [hoveredProductSlug, setHoveredProductSlug] = useState(null);
  const [selectedShoppingProduct, setSelectedShoppingProduct] = useState(null);
  const modalSizeOptions = selectedShoppingProduct?.variants ? getSizeOptions(selectedShoppingProduct.variants) : [];
  const [err, setErr] = useState(null);
  const [modalColor, setModalColor] = useState(null);
  const [color, setColor] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const freeShippingThreshold = 5000;

  const materialLabelMap = {
    'Beyaz Altın': 'Beyaz Altın',
    Rose: 'Rose Altın',
    Gold: 'Sarı Altın',
  };

  const materialOptions = Array.from(
    new Set(
      (products || []).flatMap((product) =>
        (product?.variants || []).map((variant) => variant?.color).filter(Boolean)
      )
    )
  );

  const sortSizes = (sizes) => sizes.sort((a, b) => {
    const aNum = Number(a);
    const bNum = Number(b);
    const aIsNum = !Number.isNaN(aNum);
    const bIsNum = !Number.isNaN(bNum);

    if (aIsNum && bIsNum) {
      return aNum - bNum;
    }

    if (aIsNum) return -1;
    if (bIsNum) return 1;

    return a.localeCompare(b, 'tr-TR');
  });

  const incomingSizes = Array.from(
    new Set(
      (products || []).flatMap((product) =>
        (product?.variants || [])
          .map((variant) => variant?.size)
          .filter((variantSize) => variantSize !== null && variantSize !== undefined && String(variantSize).trim() !== '')
          .map((variantSize) => String(variantSize))
      )
    )
  );

  const matchedCategorySizes = mainCategories
    .filter((cat) => Array.isArray(cat?.sizes) && cat.sizes.some((presetSize) => incomingSizes.includes(String(presetSize))))
    .flatMap((cat) => cat.sizes.map((presetSize) => String(presetSize)));

  const sizeOptions = sortSizes(Array.from(new Set(matchedCategorySizes.length > 0 ? matchedCategorySizes : incomingSizes)));

  useEffect(() => {
    if (materialOptions.length !== 1) {
      return;
    }

    const onlyMaterial = materialOptions[0];
    setSelectedMaterials((prev) => {
      if (prev.length === 0 || !prev.includes(onlyMaterial)) {
        return [onlyMaterial];
      }
      return prev;
    });
  }, [materialOptions]);

  useEffect(() => {
    if (sizeOptions.length !== 1) {
      return;
    }

    const onlySize = sizeOptions[0];
    setSize((prev) => {
      if (!prev || String(prev) !== onlySize) {
        return onlySize;
      }
      return prev;
    });
  }, [sizeOptions]);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams(location.search);
      const urlPriceMin = params.get('price_min');
      const urlPriceMax = params.get('price_max');
      const urlSize = params.get('size');
      const urlMaterials = params.get('materials');

      let priceMin = null;
      let priceMax = null;
      if (urlPriceMin && urlPriceMax) {
        priceMin = Number(urlPriceMin);
        priceMax = Number(urlPriceMax);
      }
      try {
        const { data } = await getSingleProduct(
          category,
          null,
          accessToken,
          priceMin,
          priceMax,
          undefined,
          urlSize || undefined,
          urlMaterials ? urlMaterials.split(',').filter(Boolean) : undefined
        );
        console.log("Fetched products data:", data);
        setProducts(data.products);
        setCategoriesSub(data.sub_categories);
        setParentCategories(data.parent_categories);
        setMainCategory(data.ana_kategori);
        setIsCollectionCategory(Boolean(data.is_collection_category));
        setCategories(data.categories);
        setSize(urlSize || '');
        setSelectedMaterials(urlMaterials ? urlMaterials.split(',').filter(Boolean) : []);
        // Backend'den gelen min/max fiyatı slider'a uygula
        if (typeof data.min_price === 'number' && typeof data.max_price === 'number') {
          setPriceLimits([data.min_price, data.max_price]);
          setPriceRange([data.min_price, data.max_price]);
        } else {
          setPriceLimits([0, 0]);
          setPriceRange([0, 0]);
        }
        console.log("parents", data.parent_categories);

        // setPriceRange([data.min_price, data.max_price]);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
    console.log("Current lang:", lang);
  }, [lang, category, accessToken, location.search]);

  const handleFilter = () => {
    setLoading(true);
    console.log("Applying price filter with range:", priceRange);
    const fetchProductsWithPrice = async ([price_min, price_max]) => {
      try {
        const { data } = await getSingleProduct(
          category,
          null,
          accessToken,
          price_min,
          price_max,
          sortOption,
          size || undefined,
          selectedMaterials
        );
        console.log("Fetched filtered products data:", data);
        setProducts(data.products);
        // URL parametrelerini oluştur
        const params = new URLSearchParams(location.search);
        params.set('price_min', priceRange[0]);
        params.set('price_max', priceRange[1]);
        if (size) {
          params.set('size', size);
        } else {
          params.delete('size');
        }
        if (selectedMaterials.length > 0) {
          params.set('materials', selectedMaterials.join(','));
        } else {
          params.delete('materials');
        }
        navigate(`${location.pathname}?${params.toString()}`, { replace: false });

      } catch (error) {
        console.error('Error fetching filtered products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsWithPrice(priceRange);
  };

  const handleSortChange = (value) => {
    // Burada API'ye sıralama parametresiyle tekrar istek atabilirsin
    // Örnek:
    console.log("Selected sort option:", value);
    fetchProductsWithSort(value);
  };

  const handleClearFilters = async () => {
    setLoading(true);
    try {
      const { data } = await getSingleProduct(
        category,
        null,
        accessToken,
        null,
        null,
        '1',
        undefined
      );

      setProducts(data.products);
      setCategoriesSub(data.sub_categories);
      setParentCategories(data.parent_categories);
      setMainCategory(data.ana_kategori);
      setCategories(data.categories || []);
      setSortOption('1');
      setSize('');
      setSelectedMaterials([]);

      if (typeof data.min_price === 'number' && typeof data.max_price === 'number') {
        setPriceLimits([data.min_price, data.max_price]);
        setPriceRange([data.min_price, data.max_price]);
      } else {
        setPriceLimits([0, 0]);
        setPriceRange([0, 0]);
      }

      const params = new URLSearchParams(location.search);
      params.delete('price_min');
      params.delete('price_max');
      params.delete('sort');
      params.delete('size');
      params.delete('materials');
      const query = params.toString();
      navigate(query ? `${location.pathname}?${query}` : location.pathname, { replace: false });
    } catch (error) {
      console.error('Error clearing filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsWithSort = async (sortValue) => {

    try {
      // sortValue'yu API'ye parametre olarak gönder
      const { data } = await getSingleProduct(
        category,
        null,
        accessToken,
        priceRange[0],
        priceRange[1],
        sortValue,
        size || undefined,
        selectedMaterials
      );
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching sorted products:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeWishStatue = (e) => {
    setProducts((prev) => ({
      ...prev, products: prev.products.map((product) =>
        product.product_slug === e.product_slug
          ? { ...product, in_wishlist: e.in_wishlist }
          : product
      ),
    }));
  };

  // useEffect(() => { console.log("err message", err); }, [err]);

  useEffect(() => {
    const grouped = groupVariantsByColor(selectedShoppingProduct?.variants || []);
    const availableColors = Object.keys(grouped).filter(color => Array.isArray(grouped[color]) && grouped[color].length > 0);
    console.log("Grouped variants by color:", grouped, "Available colors:", availableColors);
    setColor(availableColors.length > 0 ? availableColors : null);
    const firstVariant = selectedShoppingProduct?.variants?.[0];
    setModalSize(firstVariant?.size != null ? String(firstVariant.size) : '');
    setModalColor(firstVariant?.color ?? '');
  }, [selectedShoppingProduct?.product_slug]);

  const setError = (msg) => {
    setErr(msg);
  };

  const selectedProductPrice = Number(selectedShoppingProduct?.calculated_price ?? selectedShoppingProduct?.product_price) || 0;
  const freeShippingProgress = Math.min((selectedProductPrice / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - selectedProductPrice, 0);

  return (
    <>
      <div className="hiraola-slider_area-2 collection-area" style={{ height: '300px' }}>
        <div className="main-slider h-100">
          <div className="single-slide animation-style-01 bg-aboutus h-100" style={{ backgroundImage: `url(/storage/${mainCategory.images})` }}>
            <div className="container-fluid">
              <div className="about-content">

                <h3>
                  <span style={{ color: isCollectionCategory ? '#f1f1f1' : 'inherit' }}>
                    {toTurkishTitleCase(mainCategory.name)}
                  </span>
                </h3>

                {isCollectionCategory && parentCategories.length > 0 && (
                  <h6 className="title-6">
                    KOLEKSİYONU
                  </h6>
                )}
                {/* <h2>Zarafet</h2> */}
                <p className="m-0" style={{ color: isCollectionCategory ? '#e3e3e3' : 'inherit' }}>
                  {mainCategory.description} Kalbinize dokunan en parlak ışıltı. <br /> Her pırlanta, eşsiz bir hikâye anlatır.
                </p>
                <div className="hiraola-btn-ps_center slide-btn">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{sliderCustomStyle}</style>


      <div className="container-fluid category-list-container">
        <div className={`row justify-content-${categoriesSub.length === 0 ? 'start' : 'center'}`} style={{ padding: '23px 0px' }}>


          <div className="col-12">
            <ul className={`category-list justify-content-start `} style={{ display: 'flex', gap: '20px', listStyle: 'none', padding: 0, margin: 0 }}>
              {parentCategories.length !== 0 &&
                <>
                  {parentCategories.map((pcat, i) => (
                    <li key={pcat.id ?? pcat.slug ?? `parent-${i}`}>
                      <Link to={`/${lang}/${pcat.slug}`} style={{ color: '#595959', display: 'inline-block', textDecoration: 'none' }}>
                        {`${toTurkishTitleCase(pcat.name)} `} {categoriesSub.length - 1 !== i && <ChevronRightRounded style={{ fontSize: '16px', verticalAlign: 'middle' }} />}
                      </Link>
                    </li>
                  ))}
                  <li key={parentCategories.length}>
                    <Link to={`/${lang}/${category}`} style={{ color: '#1f1f1f', display: 'inline-block', textDecoration: 'none' }}>
                      {toTurkishTitleCase(mainCategory.name)}
                    </Link>
                  </li>

                </>}

            </ul>
          </div>

        </div>
      </div>


      <div className="hiraola-content_wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 col-lg-3 order-2 order-lg-1">

              <div className="shop-toolbar">
                <div className="product-view-mode">FİLTRELE</div>
                <div
                  className="product-item-selection_area"
                  style={{ color: '#B8924A', cursor: 'pointer' }}
                  onClick={handleClearFilters}
                >
                  Temizle
                </div>
              </div>

              <div className="hiraola-sidebar-catagories_area">
                <div className="hiraola-sidebar_categories">
                  <div>
                    <div className="hiraola-categories_title">
                      <h5>KATEGORİ</h5>
                    </div>
                    <ul className="sidebar-checkbox_list">
                      {categoriesSub.map((cat, i) => (
                        <li key={cat.id ?? cat.slug ?? `category-${i}`}>

                          <Link to={`/${lang}/${cat.slug}`}>{cat.name}</Link>

                        </li>
                      ))}
                      {categoriesSub.length === 0 && categories.map((cat, i) => (
                        <li key={cat.id ?? cat.slug ?? `category-${i}`}>
                          <Link to={`/${lang}/${cat.slug}`} style={{ textTransform: 'none' }}>{toTurkishTitleCase(cat.name)}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-1 categories-wrap">
                    <div className="hiraola-categories_title">
                      <h5>MATERYAL</h5>
                    </div>
                    <div className="mt-2">
                      <div style={{ padding: '10px 0 20px 0' }}>
                        <FormGroup>
                          {materialOptions.length > 0 ? materialOptions.map((material) => (
                            <FormControlLabel
                              key={material}
                              control={(
                                <Checkbox
                                  checked={selectedMaterials.includes(material)}
                                  onChange={(e) => {
                                    setSelectedMaterials((prev) => {
                                      if (e.target.checked) {
                                        return [...prev, material];
                                      }
                                      return prev.filter((item) => item !== material);
                                    });
                                  }}
                                />
                              )}
                              label={materialLabelMap[material] || material}
                            />
                          )) : (
                            <span style={{ fontSize: '13px', color: '#777' }}>Materyal bulunamadı</span>
                          )}
                        </FormGroup>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 categories-wrap">
                    <div className="hiraola-categories_title">
                      <h5>FİYAT</h5>
                    </div>
                    <div className="price-filter">
                      <div style={{ padding: '10px 0 20px 0' }}>
                        <Slider
                          range
                          min={priceLimits[0]}
                          max={priceLimits[1]}
                          value={priceRange}
                          onChange={setPriceRange}
                          allowCross={false}
                          disabled={priceLimits[0] === priceLimits[1]}
                        />
                        <div className="price-slider-amount" style={{ marginTop: 10 }}>
                          <div className="label-input">
                            {/* <label>Fiyat: </label> */}
                            <span>{(priceRange[0] ?? 0).toLocaleString("tr-TR", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })} ₺ - {(priceRange[1] ?? 0).toLocaleString("tr-TR", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })} ₺</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 categories-wrap">
                    <div className="hiraola-categories_title">
                      <h5>BEDEN</h5>
                    </div>
                    <div className="mt-4">
                      <div style={{ padding: '10px 0 20px 0' }}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="size-select-label">Tüm Bedenler</InputLabel>
                          <Select
                            labelId="size-select-label"
                            value={size || ''}
                            label="Tüm Bedenler"
                            onChange={(e) => setSize(e.target.value)}
                          >
                            {sizeOptions.map((sizeOption) => (
                              <MenuItem key={`size-${sizeOption}`} value={sizeOption}>
                                {sizeOption === 'other' ? 'Diğer' : sizeOption}
                              </MenuItem>
                            ))}

                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 categories-wrap">
                    <div className="hiraola-categories_title">
                      <h5>KOLEKSİYON</h5>
                    </div>
                    <div className="mt-2">
                      <div style={{ padding: '10px 0 20px 0' }}>
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked />} label="Özel Tasarım" size="small" />
                          <FormControlLabel control={<Checkbox />} label="Sınırlı Üretim" size="small" />
                          <FormControlLabel control={<Checkbox />} label="Pırlanta Serisi" size="small" />
                          <FormControlLabel control={<Checkbox />} label="Lale Koleksiyonu" size="small" />
                          <FormControlLabel control={<Checkbox />} label="Minimal Koleksiyonu" size="small" />
                        </FormGroup>
                      </div>
                    </div>
                  </div>


                  <div>
                    <div className="cart-page-total pt-0 text-center">
                      <a href="#"
                        onClick={e => {
                          e.preventDefault();
                          handleFilter();
                        }}> {loading ? <Loading style={'m-height'} inline_style={{ height: '30px', width: '30px', marginTop: 0 }} /> : 'Uygula'}</a>
                    </div>
                  </div>
                </div>


              </div>

            </div>
            <div className="col-xl-10 col-lg-9 order-1 order-lg-2">
              <div className="shop-toolbar">
                <div className="product-view-mode"></div>
                <div className="product-item-selection_area">
                  <div className="product-short" style={{ width: '280px' }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="sort-select-label">Sırala</InputLabel>
                      <Select onChange={e => {
                        setSortOption(e.target.value);
                        handleSortChange(e.target.value);
                      }}
                        labelId="sort-select-label"
                        value={sortOption}
                        label="Sırala"

                      >
                        <MenuItem value={1}>En çok tercih edilen</MenuItem>
                        <MenuItem value={2}>Fiyata Göre, Düşükten Yükseğe</MenuItem>
                        <MenuItem value={3}>Fiyata Göre, Yüksekten Düşüğe</MenuItem>
                        {(category === 'pirlanta' || category === 'pirlanta-yuzukler' || parentCategories.some(pc => pc.slug === 'pirlanta-yuzukler')) && <MenuItem value="4">Karatına göre, büyükten küçüğe</MenuItem>}
                        {(category === 'pirlanta' || category === 'pirlanta-yuzukler' || parentCategories.some(pc => pc.slug === 'pirlanta-yuzukler')) && <MenuItem value="5">Karatına göre, küçükten büyüğe</MenuItem>}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>

              <div className="shop-product-wrap grid gridview-4 row justify-content-center">

                {products.map((product, i) => (
                  <div className="col-lg-3 mb-4" key={product.product_slug ?? product.id ?? `product-${i}`}>
                    <div className="slide-item">
                      <div className="single_product">
                        <span className="wishlist-btn">
                          <WishlistButton
                            productObj={{
                              product_slug: product?.product_slug,
                              price: product?.product_price,
                              in_wishlist: product?.in_wishlist,
                            }}
                            changeWishStatue={changeWishStatue} />
                        </span>
                        <div className="product-img">
                          <Link to={`/${lang}/${product.categories[0].slug}/${product.product_slug}`}>
                            <img className="primary-img" src={`/storage/${product.product_images[0]}`} alt={product.product_name} />
                            <img className="secondary-img" src={`/storage/${product.product_images[1]}`} alt={product.product_name} />
                          </Link>
                          {/* <span className="sticker-2">Sale</span> */}

                        </div>
                        <div className="hiraola-product_content ps-4">
                          <div className="product-desc_info">
                            <h6>
                              <Link className="product-name" to={`/${lang}/${product.categories[0].slug}/${product.product_slug}`}>
                                {product.product_name}
                              </Link>
                            </h6>
                            <div className="price-box">
                              {product.calculated_price_without_discount ? (
                                <span className="old-price ms-0">
                                  {`${product.calculated_price_without_discount.toLocaleString("tr-TR", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  })} ₺`}
                                </span>
                              ) : null}
                              {product.calculated_price != null ? (
                                <span className="new-price">{product.calculated_price.toLocaleString("tr-TR", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })} ₺</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <span
                          className="product-cart-corner"
                          aria-label="Sepete ekle"
                          onMouseEnter={() => setHoveredProductSlug(product.product_slug)}
                          onMouseLeave={() => setHoveredProductSlug(null)}
                          onClick={() => setSelectedShoppingProduct(product)}
                        >
                          {hoveredProductSlug === product.product_slug ?
                            (<ShoppingBag data-bs-toggle="modal" data-bs-target="#exampleModalCenter" style={{ fontSize: '22px' }} />)
                            :
                            (<ShoppingBagOutlined data-bs-toggle="modal" data-bs-target="#exampleModalCenter" style={{ fontSize: '22px' }} />)}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}





              </div>
              {/* <div className="row">
                <div className="col-lg-12">
                  <div className="hiraola-paginatoin-area">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <ul className="hiraola-pagination-box">
                          <li className="active"><a href="javascript:void(0)">1</a></li>
                          <li><a href="javascript:void(0)">2</a></li>
                          <li><a href="javascript:void(0)">3</a></li>
                          <li><a className="Next" href="javascript:void(0)"><i
                            className="ion-ios-arrow-right"></i></a></li>
                          <li><a className="Next" href="javascript:void(0)"> <i
                            className="ion-ios-arrow-right"></i>| </a></li>
                        </ul>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="product-select-box">
                          <div className="product-short">
                            <p>Showing 1 to 12 of 18 (2 Pages)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade modal-wrapper " id="exampleModalCenter" data-bs-focus="false">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="row mx-0 modal-area">
                <div className="col-xl-6 col-lg-6 col-md-12 ps-0">
                  <div className="sp-img_area h-100 modal-left-media">
                    <div className="slick-img-slider hiraola-slick-slider arrow-type-two h-100 modal-image-fill">
                      <div className="single-slide">
                        <img className="modal-product-image" src={selectedShoppingProduct?.product_images?.[0] ? `/storage/${selectedShoppingProduct.product_images[0]}` : null} alt="" />
                        <div className="row mx-0 py-4 modal-wrapper-icons">
                          <div className="col-4">
                            <div className="d-flex justify-content-center align-items-center" style={{ gap: '7px' }}>
                              <div className="icon-holder"> <DiamondOutlined /> </div>
                              <div className="text-holder">
                                <p>0.20 ct</p>
                                <p>Pırlanta</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="d-flex justify-content-center align-items-center" style={{ gap: '7px' }}>
                              <div className="icon-holder"> <AutoAwesomeOutlined /> </div>
                              <div className="text-holder">
                                <p>14 Ayar</p>
                                <p>Beyaz Altın</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="d-flex justify-content-center align-items-center" style={{ gap: '7px' }}>
                              <div className="icon-holder"> <GppGoodOutlined /> </div>
                              <div className="text-holder">
                                <p>Garanti</p>
                                <p>Sertifikalı</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 py-4">
                  <div className="sp-content">
                    <div className="sp-heading mb-3">
                      <h5>
                        <Link to={`/${lang}/${selectedShoppingProduct?.categories[0]?.slug}/${selectedShoppingProduct?.product_slug}`}>
                          {selectedShoppingProduct?.product_name}</Link>
                      </h5>
                    </div>

                    <div className="price-box">
                      {selectedShoppingProduct?.calculated_price_without_discount ? (
                        <span className="old-price me-3">
                          {selectedShoppingProduct.calculated_price_without_discount.toLocaleString("tr-TR", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })} ₺
                        </span>
                      ) : null}
                      {selectedShoppingProduct?.calculated_price != null ? (
                        <span>
                          {selectedShoppingProduct.calculated_price.toLocaleString("tr-TR", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })} ₺
                        </span>
                      ) : null}
                    </div>

                    <div className="product-short mt-2">
                      <span className='card-size mb-1'>Ölçü Seçin</span>
                      <FormControl fullWidth size="small">
                        <Select
                          native
                          labelId="modal-size-select-label"
                          value={modalSize}
                          onChange={(e) => {
                            setModalSize(e.target.value);
                          }}
                        >
                          {modalSizeOptions.map((option, index) => (
                            <option key={`modal-size-${option}-${index}`} value={option}>{option}</option>
                          ))}

                        </Select>
                      </FormControl>
                      <div className="my-3 d-flex align-items-center" style={{ gap: '10px' }}>
                        <p className='card-size fs-16 m-0'>Renk: </p>
                        {color && (color.length > 1 ? (
                          <FormControl size="small">
                            <Select
                              native
                              labelId="modal-color-select-label"
                              value={modalColor}
                              onChange={(e) => {
                                setModalColor(e.target.value);
                              }}
                            >
                              {color.map((option, index) => (
                                <option key={`modal-color-${option}-${index}`} value={option}>{option}</option>
                              ))}

                            </Select>
                          </FormControl>
                        ) : <p className="card-size fs-16 m-0">{color}</p>)}
                      </div>
                    </div>

                    {err && (
                      <div className="text-danger mb-3" style={{ fontSize: '13px', marginTop: '-8px' }}>
                        <span dangerouslySetInnerHTML={{ __html: err }} />
                      </div>
                    )}

                    <div className='myaccount-orders'>
                      <div className="table-responsive">
                        <div className="alert-list-wrap">
                          <div className="alert-list">
                            <div className="alert-icon me-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1f1f1f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>
                            </div>
                            <div className="alert-content">
                              <div className="alert-content-title">
                                <div className="title">Ücretsiz Kargo</div>
                              </div>
                              <div className="alert-content-body m-0">

                                <div>
                                  <div className="product-name">5000 ₺ ve üzeri siparişlerde kargo ücretsizdir.</div>
                                  <div className="order-progress-bar-bg">
                                    <div className="order-progress-bar-fill" style={{ width: `${freeShippingProgress}%` }} />
                                  </div>
                                  <div className="product-price">

                                    {selectedProductPrice < freeShippingThreshold ? (<>
                                      <span>{remainingForFreeShipping} ₺</span>daha alışveriş yap, ücretsiz kargodan yararlan.
                                    </>) : (<>
                                      <span className='text-decoration-underline'>Ücretsiz kargo</span> ile siparişini hemen tamamla.
                                    </>)}

                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="hiraola-group_btn">
                      <div className="qty-btn_area mt-4">
                        <ul>
                          <li>
                            <CartButton
                              product={
                                selectedShoppingProduct ?? {}
                              }
                              variant={
                                { size: modalSize, color: modalColor }
                              }
                              setError={setError}
                              slug={selectedShoppingProduct?.product_slug}
                            // variant={
                            //   selectedVariant
                            // }

                            />
                          </li>
                        </ul>
                      </div>

                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>

  )
}

export default Products;
