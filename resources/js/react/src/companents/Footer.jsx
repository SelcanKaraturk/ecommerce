import React from 'react'
import './css/Footer.css'

function Footer() {
  return (
    <>
        {/* <!-- Begin Hiraola's Footer Area --> */}
        <div className="hiraola-footer_area">
            <div className="footer-top_area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="footer-widgets_info">

                                <div className="footer-widgets_logo">
                                    <a href="#">
                                        <img src="/src/assets/images/footer/logo/1.png" alt="Hiraola's Footer Logo"/>
                                    </a>
                                </div>

                                <div className="widget-short_desc">
                                    <p>We are a team of designers and developers that create high quality HTML Template &
                                        Woocommerce, Shopify Theme.
                                    </p>
                                </div>
                                <div className="hiraola-social_link">
                                    <ul>
                                        <li className="facebook">
                                            <a href="https://www.facebook.com" data-bs-toggle="tooltip" target="_blank" title="Facebook">
                                                <i className="fab fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li className="twitter">
                                            <a href="https://twitter.com" data-bs-toggle="tooltip" target="_blank" title="Twitter">
                                                <i className="fab fa-twitter-square"></i>
                                            </a>
                                        </li>
                                        <li className="google-plus">
                                            <a href="https://www.plus.google.com/discover" data-bs-toggle="tooltip" target="_blank" title="Google Plus">
                                                <i className="fab fa-google-plus"></i>
                                            </a>
                                        </li>
                                        <li className="instagram">
                                            <a href="https://rss.com" data-bs-toggle="tooltip" target="_blank" title="Instagram">
                                                <i className="fab fa-instagram"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="footer-widgets_area">
                                <div className="row">
                                    <div className="col-lg-3">
                                        <div className="footer-widgets_title">
                                            <h6>Product</h6>
                                        </div>
                                        <div className="footer-widgets">
                                            <ul>
                                                <li><a href="#">Prices drop</a></li>
                                                <li><a href="#">New products</a></li>
                                                <li><a href="#">Best sales</a></li>
                                                <li><a href="#">Contact us</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="footer-widgets_info">
                                            <div className="footer-widgets_title">
                                                <h6>About Us</h6>
                                            </div>
                                            <div className="widgets-essential_stuff">
                                                <ul>
                                                    <li className="hiraola-address"><i
                                                    className="ion-ios-location"></i><span>Address:</span> The Barn,
                                                        Ullenhall, Henley
                                                        in
                                                        Arden B578 5CC, England</li>
                                                    <li className="hiraola-phone"><i className="ion-ios-telephone"></i><span>Call
                                                    Us:</span> <a href="tel://+123123321345">+123 321 345</a>
                                                    </li>
                                                    <li className="hiraola-email"><i
                                                    className="ion-android-mail"></i><span>Email:</span> <a href="mailto://info@yourdomain.com">info@yourdomain.com</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="instagram-container footer-widgets_area">
                                            <div className="footer-widgets_title">
                                                <h6>Sign Up For Newslatter</h6>
                                            </div>
                                            <div className="widget-short_desc">
                                                <p>Subscribe to our newsletters now and stay up-to-date with new collections</p>
                                            </div>
                                            <div className="newsletter-form_wrap">
                                                <form className="subscribe-form" id="mc-form" action="#">
                                                    <input className="newsletter-input" id="mc-email" type="email"
                                                    autoComplete="off" name="Enter Your Email" placeholder="Enter Your Email"
                                                    onBlur={(e)=>e.target.value == '' ? e.target.value ='Enter Your Email' : ''}
                                                    onFocus={(e)=> e.target.value == 'Enter Your Email' ? e.target.value='':'' }/>
                                                    <button className="newsletter-btn" id="mc-submit">
                                                        <i className="ion-android-mail"></i>
                                                    </button>
                                                </form>
                                                {/* <!-- Mailchimp Alerts --> */}
                                                <div className="mailchimp-alerts mt-3">
                                                    <div className="mailchimp-submitting"></div>
                                                    <div className="mailchimp-success"></div>
                                                    <div className="mailchimp-error"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom_area">
                <div className="container">
                    <div className="footer-bottom_nav">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="footer-links">
                                    <ul>
                                        <li><a href="#">Online Shopping</a></li>
                                        <li><a href="#">Promotions</a></li>
                                        <li><a href="#">My Orders</a></li>
                                        <li><a href="#">Help</a></li>
                                        <li><a href="#">Customer Service</a></li>
                                        <li><a href="#">Support</a></li>
                                        <li><a href="#">Most Populars</a></li>
                                        <li><a href="#">New Arrivals</a></li>
                                        <li><a href="#">Special Products</a></li>
                                        <li><a href="#">Manufacturers</a></li>
                                        <li><a href="#">Our Stores</a></li>
                                        <li><a href="#">Shipping</a></li>
                                        <li><a href="#">Payments</a></li>
                                        <li><a href="#">Warantee</a></li>
                                        <li><a href="#">Refunds</a></li>
                                        <li><a href="#">Checkout</a></li>
                                        <li><a href="#">Discount</a></li>
                                        <li><a href="#">Refunds</a></li>
                                        <li><a href="#">Policy Shipping</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="payment">
                                    <a href="#">
                                        <img src="/src/assets/images/footer/payment/1.png" alt="Hiraola's Payment Method"/>
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="copyright">
                                    <span>Copyright &copy; 2022 <a href="index.html">Hiraola.</a> All rights reserved.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Hiraola's Footer Area End Here --> */}
    </>
  )
}

export default Footer
