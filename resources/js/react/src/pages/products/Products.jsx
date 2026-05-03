import { get } from 'jquery';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleProduct } from '../../services/WebService';
import { useAuth } from '../../services/AuthContex';

function Products() {

  const { category } = useParams();
  const { accessToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getSingleProduct(
          category,
          null,
          accessToken
        );
        console.log("Fetched products data:", data);
        setProducts(data.products);
        setCategories(data.sub_categories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();

  }, [category, accessToken]);


  return (
    <>


      <div className="container-fluid category-list-container" style={{ backgroundColor: '#f7f7f7', borderBottom: '1px solid rgba(0, 0, 0, 0.07)' }}>
        <div className="row justify-content-center" style={{ padding: '15px 0px' }}>
          <div className="col-2"></div>
          <div className="col-7">
            <ul className="category-list justify-content-center" style={{ display: 'flex', gap: '20px', listStyle: 'none', padding: 0, margin: 0, padding: '0px 20px' }}>
              {categories.map((cat) => (
                <li key={cat}>
                  <a href="index.html" style={{ display: 'inline-block', textDecoration: 'none', color: '#333' }}>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-3"></div>
        </div>
      </div>


      <div className="mt-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="shop-toolbar mb-4">
                <div className="product-view-mode"></div>
                <div className="product-item-selection_area">
                  <div className="product-short">
                    <label className="select-label">Sıralama:</label>
                    <select className="nice-select">
                      <option value="1">En çok tercih edilen</option>
                      <option value="4">Fiyata Göre, Düşükten Yükseğe</option>
                      <option value="5">Fiyata Göre, Yüksekten Düşüğe</option>
                      <option value="5">Karatına göre, büyükten küçüğe</option>
                      <option value="5">Karatına göre, küçükten büyüğe</option>
                      <option value="5">Taş saflığına göre, yüksekten düşüğe</option>
                      <option value="5">Taş saflığına göre, düşükten yükseğe</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="shop-product-wrap grid gridview-4 row justify-content-center">

                {products.map((product) => (
                  <div className="col-lg-3" key={product.product_slug}>
                    <div className="slide-item">
                      <div className="single_product">
                        <div className="product-img">
                          <a href="single-product.html">
                            <img className="primary-img" src={`/storage/${product.product_images[0]}`} alt={product.product_name}/>
                            <img className="secondary-img" src={`/storage/${product.product_images[1]}`} alt={product.product_name} />
                          </a>
                          {/* <span className="sticker-2">Sale</span> */}

                        </div>
                        <div className="hiraola-product_content">
                          <div className="product-desc_info text-center">
                            <h6><a className="product-name" href="single-product.html">
                              {product.product_name}
                            </a></h6>
                            <div className="price-box">
                              <span className="new-price">{product.product_price}₺</span>
                            </div>
                          </div>
                        </div>
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

    </>

  )
}

export default Products;
